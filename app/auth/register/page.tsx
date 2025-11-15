"use client";

import React, { useState } from "react";
import Link from "next/link";
import Spinner from "@/components/ui/Spinner";
import FormContainer from "@/components/auth/FormContainer";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { ArrowLeft, Mail, User, Lock } from "lucide-react";
import Button from "@/components/ui/Button";
import { FaGoogle, FaGithub } from "react-icons/fa";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    userName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [signEmail, setSignEmail] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const router = useRouter();

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google", {
        callbackUrl: "/dashboard",
      });
    } catch (error) {
      console.error("Google sign in error:", error);
      toast.error("Google sign in failed. Please try again.");
      setIsLoading(false);
    }
  };

  // Handle GitHub Sign In
  const handleGithubSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("github", {
        callbackUrl: "/dashboard",
      });
    } catch (error) {
      console.error("GitHub sign in error:", error);
      toast.error("GitHub sign in failed. Please try again.");
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = () => {
    const newErrors: {
      firstName?: string;
      lastName?: string;
      userName?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    // Name validation
    if (!formData.firstName) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.userName) {
      newErrors.userName = "Username is required";
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    // confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await api.post("/api/auth/register", {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        userName: formData.userName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });
      toast.success("Account created Successfully!, Login to continue.");
      setFormData({
        firstName: "",
        lastName: "",
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      router.push("/auth/login");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center pt-15">
      <FormContainer>
        <div className="max-w-md w-full space-y-8 bg-transparent ">
          <div className="flex flex-col items-center">
            <h2 className="text-3xl font-bold text-blue-800 dark:text-blue-300">
              Create Account
            </h2>
            <p className="mt-3 text-center text-md font-extrabold text-indigo-600 dark:text-indigo-400">
              Sign up to get started
            </p>
          </div>

          {!signEmail ? (
            // Initial Choice Screen
            <div className="flex flex-col items-center w-full gap-4 mt-8">
              {/* Google Sign In Button */}
              <Button 
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full py-3 flex items-center justify-center gap-2 bg-indigo-700 hover:bg-indigo-800"
              >
                {isLoading ? (
                  <>
                    <Spinner />
                    Signing up...
                  </>
                ) : (
                  <>
                    <FaGoogle size={24} />
                    <span className="">
                      Sign up with Google
                    </span>
                  </>
                )}
              </Button>
              
              {/* GitHub Sign In Button */}
              <Button 
                onClick={handleGithubSignIn}
                disabled={isLoading}
                className="w-full py-3 flex items-center justify-center gap-2 bg-indigo-700 hover:bg-indigo-800"
              >
                {isLoading ? (
                  <>
                    <Spinner />
                    Signing up...
                  </>
                ) : (
                  <>
                    <FaGithub size={24} />
                    Sign up with Github
                  </>
                )}
              </Button>

              {/* Divider */}
              <div className="relative py-2 w-full">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                    or
                  </span>
                </div>
              </div>

              {/* Email Sign Up Button */}
              <Button 
                onClick={() => setSignEmail(true)}
                className="w-full py-3 flex items-center justify-center gap-2"
              >
                <Mail size={18} />
                Sign up with Email
              </Button>

              {/* Sign In Link */}
              <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="font-medium text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300 hover:text-indigo-500 transition-colors"
                >
                  Sign in
                </Link>
              </div>
            </div>
          ) : (
            // Email Form Screen
            <div>
              {/* Back Button */}
              <button
                onClick={() => setSignEmail(false)}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back</span>
              </button>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                  >
                    First Name *
                  </label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-[100]">
                      <User 
                        className={`h-5 w-5 text-gray-400 transition-all duration-200 ${
                          focusedField === 'firstName' ? 'animate-bounce text-indigo-500' : ''
                        }`}
                      />
                    </div>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('firstName')}
                      onBlur={() => setFocusedField(null)}
                      className={`appearance-none relative block w-full pl-10 pr-3 py-2 border ${
                        errors.firstName
                          ? "border-red-300 dark:border-red-400"
                          : "border-gray-300 dark:border-gray-500"
                      } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 focus:z-10 sm:text-sm transition-colors`}
                      placeholder="Enter your first name"
                    />
                  </div>
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                  >
                    Last Name
                  </label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-[100]">
                      <User 
                        className={`h-5 w-5 text-gray-400 transition-all duration-200 ${
                          focusedField === 'lastName' ? 'animate-bounce text-indigo-500' : ''
                        }`}
                      />
                    </div>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('lastName')}
                      onBlur={() => setFocusedField(null)}
                      className={`appearance-none relative block w-full pl-10 pr-3 py-2 border ${
                        errors.lastName
                          ? "border-red-300 dark:border-red-400"
                          : "border-gray-300 dark:border-gray-500"
                      } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 focus:z-10 sm:text-sm transition-colors`}
                      placeholder="Enter your last name"
                    />
                  </div>
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label
                  htmlFor="userName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Username *
                </label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-[100]">
                    <User 
                      className={`h-5 w-5 text-gray-400 transition-all duration-200 ${
                        focusedField === 'userName' ? 'animate-bounce text-indigo-500' : ''
                      }`}
                    />
                  </div>
                  <input
                    id="userName"
                    name="userName"
                    type="text"
                    value={formData.userName}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('userName')}
                    onBlur={() => setFocusedField(null)}
                    className={`appearance-none relative block w-full pl-10 pr-3 py-2 border ${
                      errors.userName
                        ? "border-red-300 dark:border-red-400"
                        : "border-gray-300 dark:border-gray-500"
                    } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 focus:z-10 sm:text-sm transition-colors`}
                    placeholder="Enter your username"
                  />
                </div>
                {errors.userName && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.userName}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Email address *
                </label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-[100]">
                    <Mail 
                      className={`h-5 w-5 text-gray-400 transition-all duration-200 ${
                        focusedField === 'email' ? 'animate-bounce text-indigo-500' : ''
                      }`}
                    />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className={`appearance-none relative block w-full pl-10 pr-3 py-2 border ${
                      errors.email
                        ? "border-red-300 dark:border-red-400"
                        : "border-gray-300 dark:border-gray-500"
                    } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 focus:z-10 sm:text-sm transition-colors`}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Password *
                </label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-[100]">
                    <Lock 
                      className={`h-5 w-5 text-gray-400 transition-all duration-200 ${
                        focusedField === 'password' ? 'animate-bounce text-indigo-500' : ''
                      }`}
                    />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    className={`appearance-none relative block w-full pl-10 pr-3 py-2 border ${
                      errors.password
                        ? "border-red-300 dark:border-red-400"
                        : "border-gray-300 dark:border-gray-500"
                    } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 focus:z-10 sm:text-sm transition-colors`}
                    placeholder="Enter your password"
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.password}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Confirm Password *
                </label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-[100]">
                    <Lock 
                      className={`h-5 w-5 text-gray-400 transition-all duration-200 ${
                        focusedField === 'confirmPassword' ? 'animate-bounce text-indigo-500' : ''
                      }`}
                    />
                  </div>
                  <input
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('confirmPassword')}
                    onBlur={() => setFocusedField(null)}
                    className={`appearance-none relative block w-full pl-10 pr-3 py-2 border ${
                      errors.confirmPassword
                        ? "border-red-300 dark:border-red-400"
                        : "border-gray-300 dark:border-gray-500"
                    } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 focus:z-10 sm:text-sm transition-colors`}
                    placeholder="Confirm your password"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Spinner />
                    Creating account...
                  </div>
                ) : (
                  "Create account"
                )}
              </button>
            </div>

            <div className="text-center">
              <Link
                href="/auth/login"
                className="text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors cursor-pointer"
              >
                Already have an Account?{" "}
                <span className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                  Login
                </span>
              </Link>
            </div>
          </form>
            </div>
          )}
        </div>
      </FormContainer>
    </div>
  );
};

export default RegisterPage;
