"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { User, Mail, Lock, Eye, EyeOff, Save, Moon, Sun } from "lucide-react";

const Settings = () => {
  const { data: session } = useSession();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [darkMode, setDarkMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Initialize from session
    if (session?.user) {
      setForm((prev) => ({
        ...prev,
        firstName: session.user.firstName || "",
        lastName: session.user.lastName || "",
        userName: session.user.userName || "",
        email: session.user.email || "",
      }));
    }
    // Initialize dark mode from localStorage
    const savedDark = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDark);
    document.documentElement.classList.toggle("dark", savedDark);
  }, [session]);

  const passwordStrength = useMemo(() => {
    const pwd = form.newPassword || "";
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[a-z]/.test(pwd)) score += 1;
    if (/\d/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    return score; // 0..5
  }, [form.newPassword]);

  const strengthLabel = useMemo(() => {
    if (!form.newPassword) return "";
    return passwordStrength >= 4 ? "Strong" : passwordStrength >= 2 ? "Fair" : "Weak";
  }, [passwordStrength, form.newPassword]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    if (!form.firstName.trim()) {
      toast.error("First name is required");
      return false;
    }
    if (!form.userName.trim()) {
      toast.error("Username is required");
      return false;
    }
    if (!form.email.includes("@")) {
      toast.error("Enter a valid email address");
      return false;
    }
    if (form.newPassword || form.confirmPassword || form.currentPassword) {
      if (!form.currentPassword) {
        toast.error("Enter your current password to set a new one");
        return false;
      }
      if (form.newPassword.length < 8) {
        toast.error("New password must be at least 8 characters");
        return false;
      }
      if (form.newPassword !== form.confirmPassword) {
        toast.error("New passwords do not match");
        return false;
      }
    }
    return true;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await api.put("/api/auth/update-profile", {
        firstName: form.firstName,
        lastName: form.lastName || null,
        userName: form.userName,
        email: form.email,
        currentPassword: form.currentPassword || undefined,
        newPassword: form.newPassword || undefined,
      });
      toast.success("Settings saved");
      setForm((f) => ({ ...f, currentPassword: "", newPassword: "", confirmPassword: "" }));
    } catch (err: any) {
      toast.error(err?.message || "Failed to save settings");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("darkMode", String(next));
    document.documentElement.classList.toggle("dark", next);
  };

  return (
    <div className="px-4 py-6">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Settings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your account, security, and preferences</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-8">
          {/* Account */}
          <section className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Account</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Your personal details</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <LabeledInput
                label="First name"
                name="firstName"
                icon={<User className="w-4 h-4" />}
                value={form.firstName}
                onChange={onChange}
                placeholder="John"
                required
              />
              <LabeledInput
                label="Last name"
                name="lastName"
                icon={<User className="w-4 h-4" />}
                value={form.lastName}
                onChange={onChange}
                placeholder="Doe"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <LabeledInput
                label="Username"
                name="userName"
                icon={<User className="w-4 h-4" />}
                value={form.userName}
                onChange={onChange}
                placeholder="johndoe"
                required
              />
              <LabeledInput
                label="Email"
                type="email"
                name="email"
                icon={<Mail className="w-4 h-4" />}
                value={form.email}
                onChange={onChange}
                placeholder="john@example.com"
                required
              />
            </div>
          </section>

          {/* Security */}
          <section className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Security</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Change your password</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <PasswordInput
                label="Current password"
                name="currentPassword"
                value={form.currentPassword}
                onChange={onChange}
                revealed={show.current}
                onToggle={() => setShow((s) => ({ ...s, current: !s.current }))}
              />
              <PasswordInput
                label="New password"
                name="newPassword"
                value={form.newPassword}
                onChange={onChange}
                revealed={show.new}
                onToggle={() => setShow((s) => ({ ...s, new: !s.new }))}
              />
              <PasswordInput
                label="Confirm new password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={onChange}
                revealed={show.confirm}
                onToggle={() => setShow((s) => ({ ...s, confirm: !s.confirm }))}
              />
            </div>

            {form.newPassword && (
              <div className="mt-3">
                <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded">
                  <div
                    className={`h-2 rounded ${
                      passwordStrength >= 4
                        ? "bg-green-500 w-5/6"
                        : passwordStrength >= 2
                        ? "bg-yellow-500 w-1/2"
                        : "bg-red-500 w-1/3"
                    }`}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Strength: {strengthLabel}</p>
              </div>
            )}
          </section>

          {/* Preferences */}
          <section className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Appearance</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Toggle dark mode</p>
            </div>
            <button
              type="button"
              onClick={toggleDark}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-gray-900 text-white dark:bg-gray-800 border border-gray-700 hover:bg-gray-800"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              <span>{darkMode ? "Light mode" : "Dark mode"}</span>
            </button>
          </section>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              {submitting ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

function LabeledInput({
  label,
  icon,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; icon?: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">{label}</label>
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>}
        <input
          {...props}
          className={`w-full ${icon ? "pl-10" : "pl-3"} pr-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
      </div>
    </div>
  );
}

function PasswordInput({
  label,
  revealed,
  onToggle,
  ...props
}: {
  label: string;
  revealed: boolean;
  onToggle: () => void;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">{label}</label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          {...props}
          type={revealed ? "text" : "password"}
          className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={label}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
        >
          {revealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

export default Settings;
