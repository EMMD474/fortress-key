"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Spinner from "@/components/ui/Spinner";
import FormContainer from "@/components/auth/FormContainer";
import { toast } from "sonner";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowLeft, Mail, Lock } from "lucide-react";
import Button from "@/components/ui/Button";
import { FaGoogle, FaGithub } from "react-icons/fa";

const LoginPage = () => {
  const { status } = useSession();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [signEmail, setSignEmail] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    setIsLoading(true);

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
      });
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center pt-15">
      <FormContainer>
        <div className="max-w-md w-full space-y-8 bg-transparent">
          <div className="flex flex-col items-center">
            <h2 className="text-3xl font-bold text-blue-800 dark:text-blue-300">
              Welcome Back
            </h2>
            <p className="mt-3 text-center text-md font-extrabold text-indigo-600 dark:text-indigo-400">
              Sign in to continue to your account
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
                    Signing in...
                  </>
                ) : (
                  <>
                    <FaGoogle size={24} />
                    <span className="">
                      Sign in with Google
                    </span>
                  </>
                )}
              </Button>
              <Button 
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full py-3 flex items-center justify-center gap-2 bg-indigo-700 hover:bg-indigo-800"
              >
                {isLoading ? (
                  <>
                    <Spinner />
                    Signing in...
                  </>
                ) : (
                  <>
                    <FaGithub size={24} />
                    Sign in with Github
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

              {/* Email Sign In Button */}
              <Button 
                onClick={() => setSignEmail(true)}
                className="w-full py-3 flex items-center justify-center gap-2"
              >
                <Mail size={18} />
                Sign in with Email
              </Button>

              {/* Sign Up Link */}
              <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{" "}
                <Link
                  href="/auth/register"
                  className="font-medium text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300 hover:text-indigo-500 transition-colors"
                >
                  Sign up
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

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {/* Email Input */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                    >
                      Email address
                    </label>
                    <div className="relative mt-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-100">
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
                        } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 focus:z-10 sm:text-sm transition-colors hover:border-indigo-400 dark:hover:border-indigo-500`}
                        placeholder="Enter your email"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Password Input with Toggle */}
                  <div className="relative">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                    >
                      Password
                    </label>
                    <div className="relative mt-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-100">
                        <Lock 
                          className={`h-5 w-5 text-gray-400 transition-all duration-200 ${
                            focusedField === 'password' ? 'animate-bounce text-indigo-500' : ''
                          }`}
                        />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        value={formData.password}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                        className={`appearance-none relative block w-full pl-10 pr-10 py-2 border ${
                          errors.password
                            ? "border-red-300 dark:border-red-400"
                            : "border-gray-300 dark:border-gray-500"
                        } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 focus:z-10 sm:text-sm transition-colors hover:border-indigo-400 dark:hover:border-indigo-500`}
                        placeholder="Enter your password"
                      />

                      {/* Toggle Icon */}
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition z-10"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>

                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.password}
                      </p>
                    )}
                  </div>
                </div>

                {/* Remember + Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-500 dark:bg-gray-800 dark:text-indigo-400 dark:focus:ring-indigo-400 rounded"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2 block text-sm text-gray-900 dark:text-gray-200"
                    >
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

                {/* Submit Button */}
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
                      "Sign in"
                    )}
                  </button>

                  <div className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                    Don't have an account?{" "}
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
          )}
        </div>
      </FormContainer>
    </div>
  );
};

export default LoginPage;