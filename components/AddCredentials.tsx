"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { CheckCircle, XCircle, Shield, Eye, EyeOff, Copy, Check, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { useSession } from "next-auth/react";
import { api } from "@/lib/api";

interface AddCredentialsProps {
  onClose: () => void;
}

const generateSecurePassword = (
  length: number,
  useUppercase: boolean,
  useLowercase: boolean,
  useNumbers: boolean,
  useSymbols: boolean
): string => {
  let chars = '';
  if (useUppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (useLowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
  if (useNumbers) chars += '0123456789';
  if (useSymbols) chars += '!@#$%^&*()_+[]{}|;:,.<>?';

  if (chars.length === 0) return '';

  let password = '';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    password += chars[array[i] % chars.length];
  }
  return password;
};

const calculatePasswordStrength = (password: string): { score: number; label: string; color: string } => {
  let score = 0;
  if (password.length >= 12) score += 25;
  else if (password.length >= 8) score += 15;
  
  if (/[A-Z]/.test(password)) score += 20;
  if (/[a-z]/.test(password)) score += 20;
  if (/[0-9]/.test(password)) score += 20;
  if (/[^A-Za-z0-9]/.test(password)) score += 15;

  if (score >= 80) return { score, label: 'Very Strong', color: 'text-green-400' };
  if (score >= 60) return { score, label: 'Strong', color: 'text-blue-400' };
  if (score >= 40) return { score, label: 'Moderate', color: 'text-yellow-400' };
  return { score, label: 'Weak', color: 'text-red-400' };
};

const AddCredentials: React.FC<AddCredentialsProps> = ({ onClose }) => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);

  // Form fields
  const [title, setTitle] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [website, setWebsite] = useState('');
  const [category, setCategory] = useState('');
  const [notes, setNotes] = useState('');

  // Password generator
  const [length, setLength] = useState(16);
  const [useUppercase, setUseUppercase] = useState(true);
  const [useLowercase, setUseLowercase] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);

  const categories = ['Social Media', 'Banking', 'Email', 'Work', 'Shopping', 'Entertainment', 'Other'];

  const handleGenerate = () => {
    if (length < 8 || (!useUppercase && !useLowercase && !useNumbers && !useSymbols)) return;
    const newPassword = generateSecurePassword(length, useUppercase, useLowercase, useNumbers, useSymbols);
    setPassword(newPassword);
    setCopied(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy password');
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!title || !password) {
      toast.error("Title and password are required", {
        icon: <XCircle className="text-red-500" />,
      });
      return;
    }

    setLoading(true);

    const credentialData = {
      title,
      username,
      password,
      website,
      category,
      notes,
    };

    try {
      // TODO: Replace with actual API endpoint
      console.log('Saving credential:', credentialData);
      
      toast.success(`Credential "${title}" added!`, {
        icon: <CheckCircle className="text-green-500" />,
      });

      // Reset form
      setTitle('');
      setUsername('');
      setPassword('');
      setWebsite('');
      setCategory('');
      setNotes('');
      onClose();
    } catch (err: any) {
      console.error("Error creating credential:", err);
      toast.error(err?.message || "Failed to add credential", {
        icon: <XCircle className="text-red-500" />,
      });
    } finally {
      setLoading(false);
    }
  };

  const strength = password ? calculatePasswordStrength(password) : { score: 0, label: '', color: '' };

  return (
    <div className="shadow-lg bg-gray-900 rounded-xl border border-gray-800 flex flex-col max-h-[85vh]">
      {/* Fixed Header */}
      <div className="flex items-center gap-3 p-6 border-b border-gray-800">
        <Shield className="w-6 h-6 text-blue-400" />
        <h2 className="text-white text-xl font-bold">Add New Credential</h2>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Basic Info Section */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Gmail Account"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Username/Email</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="username or email"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Website</label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Password <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter or generate password"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 pr-20 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                {password && (
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                )}
              </div>
            </div>
            {password && (
              <div className="mt-2 flex items-center gap-3">
                <div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      strength.score >= 80 ? 'bg-green-500' :
                      strength.score >= 60 ? 'bg-blue-500' :
                      strength.score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${strength.score}%` }}
                  />
                </div>
                <span className={`text-xs font-semibold ${strength.color} min-w-[80px] text-right`}>
                  {strength.label}
                </span>
              </div>
            )}
          </div>

          {/* Collapsible Password Generator */}
          <div className="border border-gray-700 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setShowGenerator(!showGenerator)}
              className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-750 transition-colors"
            >
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-white">Password Generator</span>
              </div>
              {showGenerator ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>

            {showGenerator && (
              <div className="p-4 bg-gray-800/50 space-y-4 border-t border-gray-700">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-300">Length</label>
                  <span className="text-blue-400 font-bold text-sm">{length}</span>
                </div>
                <input
                  type="range"
                  min={8}
                  max={32}
                  value={length}
                  onChange={(e) => setLength(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Uppercase', value: useUppercase, setter: setUseUppercase },
                    { label: 'Lowercase', value: useLowercase, setter: setUseLowercase },
                    { label: 'Numbers', value: useNumbers, setter: setUseNumbers },
                    { label: 'Symbols', value: useSymbols, setter: setUseSymbols }
                  ].map((option, index) => (
                    <label
                      key={index}
                      className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-all ${
                        option.value
                          ? 'bg-blue-500/10 border-blue-500/30 text-gray-200'
                          : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={option.value}
                        onChange={(e) => option.setter(e.target.checked)}
                        className="w-4 h-4 accent-blue-500"
                      />
                      <span className="text-sm font-medium">{option.label}</span>
                    </label>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={length < 8 || (!useUppercase && !useLowercase && !useNumbers && !useSymbols)}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white py-2.5 rounded-lg font-medium transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  Generate Password
                </button>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes (optional)"
              rows={3}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none resize-none transition-all"
            />
          </div>
        </form>
      </div>

      {/* Fixed Footer */}
      <div className="p-6 border-t border-gray-800 bg-gray-900">
        <div className="flex gap-3">
          <button
            onClick={onClose}
            type="button"
            className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg font-medium transition-all border border-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !title || !password}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:from-gray-700 disabled:to-gray-700 disabled:text-gray-500 text-white py-3 rounded-lg font-medium transition-all shadow-lg shadow-blue-500/20 disabled:shadow-none"
          >
            {loading ? "Adding..." : "Add Credential"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCredentials;
