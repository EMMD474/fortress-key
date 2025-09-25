'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Spinner from '@/components/ui/Spinner'
import FormContainer from '@/components/auth/FormContainer'
import { toast } from 'sonner'
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation"

const LoginPage = () => {
  const { status } = useSession();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // If a user is already authenticated, redirect to the dashboard
  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/dashboard')
    }
  }, [status, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    
    try {

      await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      }).then((res) => {
        if (res?.error) {
          toast.error("Invalid email or password"); 
        } else {
          toast.success("Login successful!");
          router.push("/dashboard");
        }
      })
    } catch (error) {
      console.error('Login error:', error)
      toast.success('Login failed. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center pt-15">
      <FormContainer>
        <div className="max-w-md w-full space-y-8 bg-transparent">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-blue-800 dark:text-blue-300">
              Sign in to your account
            </h2>
            
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit} >
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  // required
                  value={formData.email}
                  onChange={handleChange}
                  className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                    errors.email ? 'border-red-300 dark:border-red-400' : 'border-gray-300 dark:border-gray-500'
                  } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 focus:z-10 sm:text-sm transition-colors hover:border-indigo-400 dark:hover:border-indigo-500`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  // required
                  value={formData.password}
                  onChange={handleChange}
                  className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                    errors.password ? 'border-red-300 dark:border-red-400' : 'border-gray-300 dark:border-gray-500'
                  } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 focus:z-10 sm:text-sm transition-colors hover:border-indigo-400 dark:hover:border-indigo-500`}
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-500 dark:bg-gray-800 dark:text-indigo-400 dark:focus:ring-indigo-400 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-200">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  href="/auth/forgot-password"
                  className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group cursor-pointer relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Spinner />
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>
              <div className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <Link
                  href="/auth/register"
                  className="font-medium text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300 hover:text-indigo-500 transition-colors"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </form>
        </div>
      </FormContainer>
      {/* <Footer /> */}

    </div>
  )
}

export default LoginPage