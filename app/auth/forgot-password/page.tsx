"use client";

import React, { useState } from "react";
import Link from "next/link";
import Spinner from "@/components/ui/Spinner";
import FormContainer from "@/components/auth/FormContainer";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { recoverAccount } from "@/lib/crypto/clientAuth";
import { ShieldAlert } from "lucide-react";

// Zero-knowledge recovery (docs/ENCRYPTION_DESIGN.md §4.3). There is no email
// OTP: the user proves ownership of the vault by supplying the Recovery Key they
// saved at signup. The browser uses it to unwrap the Vault Key and re-wrap it
// under a new master password; the server only ever sees opaque key material.
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [recoveryKey, setRecoveryKey] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    recoveryKey?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const validate = () => {
    const next: typeof errors = {};
    if (!email) next.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) next.email = "Enter a valid email address";
    if (!recoveryKey.trim()) next.recoveryKey = "Recovery key is required";
    if (!newPassword) next.newPassword = "New password is required";
    else if (newPassword.length < 6) next.newPassword = "Password must be at least 6 characters";
    if (confirmPassword !== newPassword) next.confirmPassword = "Passwords do not match";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      await recoverAccount(email, recoveryKey, newPassword);
      toast.success("Vault recovered. You can log in with your new password.");
      setIsSuccess(true);
    } catch (error) {
      console.error("Recovery error:", error);
      toast.error(error instanceof Error ? error.message : "Recovery failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = (hasError?: boolean) =>
    `mt-1 appearance-none relative block w-full px-3 py-2 border ${
      hasError ? "border-red-300 dark:border-red-400" : "border-gray-300 dark:border-gray-500"
    } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors`;

  if (isSuccess) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center pt-15">
        <FormContainer>
          <div className="max-w-md w-full space-y-6 bg-transparent text-center">
            <h3 className="text-lg font-medium text-green-800 dark:text-green-200">
              Vault recovered
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your master password has been reset and your vault is intact. Log in
              with your new password to continue.
            </p>
            <button
              onClick={() => router.push("/auth/login")}
              className="w-full py-2 px-4 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              Go to login
            </button>
          </div>
        </FormContainer>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center pt-15">
      <FormContainer>
        <div className="max-w-md w-full space-y-6 bg-transparent">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-blue-800 dark:text-blue-300">
              Recover your vault
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Enter the recovery key you saved when you signed up to set a new
              master password.
            </p>
          </div>

          <div className="flex gap-2 rounded-md bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-3 text-sm text-amber-800 dark:text-amber-300">
            <ShieldAlert className="h-5 w-5 shrink-0" />
            <span>
              Without your recovery key we cannot restore access — this is what
              keeps your vault zero-knowledge.
            </span>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass(!!errors.email)}
                placeholder="Enter your email"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="recoveryKey" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Recovery key
              </label>
              <textarea
                id="recoveryKey"
                rows={2}
                value={recoveryKey}
                onChange={(e) => setRecoveryKey(e.target.value)}
                className={`${inputClass(!!errors.recoveryKey)} font-mono`}
                placeholder="XXXXX-XXXXX-XXXXX-..."
              />
              {errors.recoveryKey && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.recoveryKey}</p>
              )}
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                New master password
              </label>
              <input
                id="newPassword"
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={inputClass(!!errors.newPassword)}
                placeholder="Enter new master password"
              />
              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.newPassword}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Confirm new password
              </label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputClass(!!errors.confirmPassword)}
                placeholder="Confirm new master password"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Spinner />
                  Recovering...
                </span>
              ) : (
                "Recover vault"
              )}
            </button>

            <div className="text-center">
              <Link
                href="/auth/login"
                className="text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                ← Back to login
              </Link>
            </div>
          </form>
        </div>
      </FormContainer>
    </div>
  );
};

export default ForgotPassword;
