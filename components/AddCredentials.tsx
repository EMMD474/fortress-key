"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { CheckCircle, XCircle, Shield, Eye, EyeOff, Copy, Check, RefreshCw } from "lucide-react";
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
    <div className="shadow-lg p-6 bg-gray-900 rounded-xl border border-gray-800">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-6 h-6 text-blue-400" />
        <h2 className="text-blue-400 text-xl font-bold">Add New Password</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Gmail Account"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Username/Email</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username or email"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Website</label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://example.com"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Password *</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter or generate password"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 pr-20 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={copyToClipboard}
                className="p-1 text-gray-400 hover:text-white transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
          {password && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 bg-gray-700 rounded-full h-2">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    strength.score >= 80 ? 'bg-green-500' :
                    strength.score >= 60 ? 'bg-blue-500' :
                    strength.score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${strength.score}%` }}
                />
              </div>
              <span className={`text-xs font-medium ${strength.color}`}>{strength.label}</span>
            </div>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional notes (optional)"
            rows={3}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none resize-none"
          />
        </div>

        {/* Password Generator */}
        <div className="border-t border-gray-700 pt-6">
          <h3 className="text-lg font-semibold text-white mb-4">Password Generator</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-300">Length</label>
              <span className="text-blue-400 font-bold">{length}</span>
            </div>
            <input
              type="range"
              min={8}
              max={32}
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Uppercase', value: useUppercase, setter: setUseUppercase },
                { label: 'Lowercase', value: useLowercase, setter: setUseLowercase },
                { label: 'Numbers', value: useNumbers, setter: setUseNumbers },
                { label: 'Symbols', value: useSymbols, setter: setUseSymbols }
              ].map((option, index) => (
                <label
                  key={index}
                  className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all ${
                    option.value
                      ? 'bg-blue-500/10 border-blue-500/30 text-gray-200'
                      : 'bg-gray-800 border-gray-700 text-gray-400'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={option.value}
                    onChange={(e) => option.setter(e.target.checked)}
                    className="w-4 h-4 accent-blue-500"
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </div>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={length < 8 || (!useUppercase && !useLowercase && !useNumbers && !useSymbols)}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white py-2 rounded-lg font-medium transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Generate Password
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !title || !password}
          className="w-full bg-green-600 hover:bg-green-500 disabled:bg-gray-700 disabled:text-gray-500 text-white py-3 rounded-lg font-medium transition-all"
        >
          {loading ? "Adding Credential..." : "Add Credential"}
        </button>
      </form>
    </div>
  );
};

export default AddCredentials;
