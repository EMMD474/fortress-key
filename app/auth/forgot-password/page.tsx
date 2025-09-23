"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Spinner from "@/components/ui/Spinner";
import FormContainer from "@/components/auth/FormContainer";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import OTPInput from "@/components/auth/OTPInput";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    pin?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPinForm, setShowPinForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [emailSent, setEmailSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const router = useRouter();

  // Countdown effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && emailSent) {
      setShowPinForm(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, emailSent]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: undefined }));
    }
  };

  const handleOTPComplete = async (otp: string) => {
    setPin(otp);
    if (errors.pin) {
      setErrors((prev) => ({ ...prev, pin: undefined }));
    }

    // Auto-verify OTP when complete
    if (otp.length === 6) {
      setIsLoading(true);
      try {
        await api.post("/api/auth/verify-otp", { 
          email, 
          otp 
        });
        toast.success("PIN verified successfully!");
        setOtpVerified(true);
        setShowPinForm(false);
        setShowPasswordForm(true);
      } catch (error) {
        console.error("OTP verification error:", error);
        toast.error("Invalid PIN. Please try again.");
        setErrors((prev) => ({ ...prev, pin: "Invalid PIN" }));
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "newPassword") {
      setNewPassword(value);
      if (errors.newPassword) {
        setErrors((prev) => ({ ...prev, newPassword: undefined }));
      }
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
      if (errors.confirmPassword) {
        setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
      }
    }
  };

  const validateEmail = () => {
    if (!email) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email address",
      }));
      return false;
    }
    return true;
  };

  const validatePassword = () => {
    const newErrors: {
      newPassword?: string;
      confirmPassword?: string;
    } = {};

    if (!newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters long";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (confirmPassword !== newPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail()) {
      return;
    }

    setIsLoading(true);

    try {
      await api.post("/api/auth/forgot-password", { email });
      toast.success("PIN sent to your email!");
      setEmailSent(true);
      setCountdown(3); // Start 3-second countdown
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error("Failed to send reset PIN. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword()) {
      return;
    }

    setIsLoading(true);

    try {
      await api.post("/api/auth/reset-password", {
        email,
        newPassword,
      });
      toast.success("Password reset successfully!");
      setIsSuccess(true);
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error("Password reset failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.push("/auth/login");
  };

  const resetToEmailForm = () => {
    setEmailSent(false);
    setShowPinForm(false);
    setShowPasswordForm(false);
    setCountdown(0);
    setPin("");
    setNewPassword("");
    setConfirmPassword("");
    setOtpVerified(false);
    setErrors({});
  };

  const goBackToPinForm = () => {
    setShowPasswordForm(false);
    setShowPinForm(true);
    setOtpVerified(false);
    setNewPassword("");
    setConfirmPassword("");
    setErrors((prev) => ({ 
      ...prev, 
      newPassword: undefined, 
      confirmPassword: undefined 
    }));
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center pt-15">
      {isSuccess ? (
        <FormContainer>
          <div className="max-w-md w-full space-y-8 bg-transparent text-center">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-6">
              <div className="flex justify-center mb-4">
                <svg
                  className="h-12 w-12 text-green-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-green-800 dark:text-green-200 mb-2">
                Password Reset Successful!
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300 mb-4">
                Your password has been successfully reset. You can now login
                with your new password.
              </p>
              <button
                onClick={handleBackToLogin}
                className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:focus:ring-offset-gray-800 transition-colors cursor-pointer"
              >
                Go to Login
              </button>
            </div>
          </div>
        </FormContainer>
      ) : emailSent && countdown > 0 ? (
        <FormContainer>
          <div className="max-w-md w-full space-y-8 bg-transparent text-center">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-6">
              <div className="flex justify-center mb-4">
                <Spinner />
              </div>
              <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-2">
                PIN Sent Successfully!
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
                We've sent a 6-digit PIN to your email address. The PIN form
                will appear in {countdown} second{countdown !== 1 ? "s" : ""}.
              </p>
              <div className="text-xs text-blue-600 dark:text-blue-400">
                Check your inbox and spam folder
              </div>
            </div>
          </div>
        </FormContainer>
      ) : showPinForm ? (
        <FormContainer>
          <div className="max-w-md w-full space-y-8 bg-transparent text-center">
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-blue-800 dark:text-blue-300">
                Enter Verification PIN
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                Enter the 6-digit PIN sent to{" "}
                <span className="font-medium">{email}</span>
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label
                  htmlFor="pin"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-4"
                >
                  6-Digit PIN
                </label>
                <div className="flex justify-center">
                  <OTPInput
                    length={6}
                    onComplete={handleOTPComplete}
                    hasError={!!errors.pin}
                    disabled={isLoading}
                  />
                </div>
                {errors.pin && (
                  <p className="mt-3 text-sm text-red-600 dark:text-red-400 text-center">
                    {errors.pin}
                  </p>
                )}
                {isLoading && (
                  <div className="mt-4 flex justify-center items-center gap-2">
                    <Spinner />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Verifying PIN...
                    </span>
                  </div>
                )}
              </div>

              <div className="flex justify-between text-sm">
                <button
                  type="button"
                  onClick={resetToEmailForm}
                  className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  ← Use different email
                </button>
                <Link
                  href="/auth/login"
                  className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  Back to login
                </Link>
              </div>
            </div>
          </div>
        </FormContainer>
      ) : showPasswordForm ? (
        <FormContainer>
          <div className="max-w-md w-full space-y-8 bg-transparent">
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-blue-800 dark:text-blue-300">
                Set New Password
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                Enter your new password for{" "}
                <span className="font-medium">{email}</span>
              </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handlePasswordSubmit}>
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  New Password
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={handlePasswordChange}
                  className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                    errors.newPassword
                      ? "border-red-300 dark:border-red-400"
                      : "border-gray-300 dark:border-gray-500"
                  } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 focus:z-10 sm:text-sm transition-colors`}
                  placeholder="Enter new password"
                />
                {errors.newPassword && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.newPassword}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={handlePasswordChange}
                  className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                    errors.confirmPassword
                      ? "border-red-300 dark:border-red-400"
                      : "border-gray-300 dark:border-gray-500"
                  } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 focus:z-10 sm:text-sm transition-colors`}
                  placeholder="Confirm new password"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.confirmPassword}
                  </p>
                )}
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
                      Updating password...
                    </div>
                  ) : (
                    "Update Password"
                  )}
                </button>
              </div>

              <div className="flex justify-between text-sm">
                <button
                  type="button"
                  onClick={goBackToPinForm}
                  className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  ← Back to PIN
                </button>
                <Link
                  href="/auth/login"
                  className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  Back to login
                </Link>
              </div>
            </form>
          </div>
        </FormContainer>
      ) : (
        <FormContainer>
          <div className="max-w-md w-full space-y-8 bg-transparent">
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-blue-800 dark:text-blue-300">
                Reset your password
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                Enter your email address and we'll send you a PIN to reset your
                password.
              </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleEmailSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={handleEmailChange}
                  className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                    errors.email
                      ? "border-red-300 dark:border-red-400"
                      : "border-gray-300 dark:border-gray-500"
                  } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 focus:z-10 sm:text-sm transition-colors hover:border-indigo-400 dark:hover:border-indigo-500`}
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.email}
                  </p>
                )}
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
                      Sending PIN...
                    </div>
                  ) : (
                    "Send PIN"
                  )}
                </button>
              </div>

              <div className="text-center">
                <Link
                  href="/auth/login"
                  className="text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors cursor-pointer"
                >
                  ← Back to login
                </Link>
              </div>
            </form>
          </div>
        </FormContainer>
      )}
    </div>
  );
};

export default ForgotPassword;