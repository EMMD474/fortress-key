"use client";
import React, { useState, useEffect } from "react";
import { Camera, Save, Eye, EyeOff, User, Mail, Lock } from "lucide-react";
import { useSession } from "next-auth/react";
import { api } from "@/lib/api";

const Profile = () => {
  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Doe",
    userName: "johndoe",
    email: "john.doe@example.com",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        firstName: session.user.firstName || prev.firstName,
        lastName: session.user.lastName || prev.lastName,
        userName: session.user.userName || prev.userName,
        email: session.user.email || prev.email,
      }));
    }
  }, [session]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage("Image size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setMessage("First name is required");
      return false;
    }
    if (!formData.userName.trim()) {
      setMessage("Username is required");
      return false;
    }
    if (!formData.email.includes("@")) {
      setMessage("Please enter a valid email address");
      return false;
    }
    if (formData.newPassword && formData.newPassword.length < 8) {
      setMessage("New password must be at least 8 characters long");
      return false;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage("New passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setMessage("");

    try {
      const response = await api.put("/api/auth/update-profile", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        userName: formData.userName,
        email: formData.email,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      setMessage("Profile updated successfully!");
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error: any) {
      console.error("Profile update error:", error);
      setMessage(
        error.message || "Failed to update profile. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-transparent py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-200 dark:border-gray-700 bg-sky-800 dark:bg-sky-800">
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              Profile Settings
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage your account information and preferences
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <User className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <label className="absolute -bottom-2 -right-2 bg-sky-500 hover:bg-sky-700 dark:bg-sky-600 dark:hover:bg-sky-500 text-white p-3 rounded-full cursor-pointer shadow transition">
                  <Camera className="w-5 h-5" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Click the camera icon to upload a new profile picture
              </p>
            </div>

            {/* Personal Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">
                Personal Information
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {["firstName", "lastName"].map((field) => (
                  <div key={field} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      {field === "firstName" ? "First Name *" : "Last Name *"}
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-5 h-5 text-gray-400 dark:text-gray-500" />
                      <input
                        type="text"
                        name={field}
                        value={formData[field as keyof typeof formData]}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-teal-500 dark:focus:border-teal-400 transition"
                        placeholder={`Enter your ${
                          field === "firstName" ? "first" : "last"
                        } name`}
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Username *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    name="userName"
                    value={formData.userName}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-teal-500 dark:focus:border-teal-400 transition"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-teal-500 dark:focus:border-teal-400 transition"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Password Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">
                Change Password
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Leave blank if you don’t want to change your password
              </p>
              {[
                {
                  label: "Current Password",
                  name: "currentPassword",
                  show: showCurrentPassword,
                  setShow: setShowCurrentPassword,
                },
                {
                  label: "New Password",
                  name: "newPassword",
                  show: showNewPassword,
                  setShow: setShowNewPassword,
                },
                {
                  label: "Confirm New Password",
                  name: "confirmPassword",
                  show: showConfirmPassword,
                  setShow: setShowConfirmPassword,
                },
              ].map(({ label, name, show, setShow }) => (
                <div key={name} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    {label}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400 dark:text-gray-500" />
                    <input
                      type={show ? "text" : "password"}
                      name={name}
                      value={formData[name as keyof typeof formData]}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-teal-500 dark:focus:border-teal-400 transition"
                      placeholder={`Enter your ${label.toLowerCase()}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShow(!show)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                    >
                      {show ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
              {formData.newPassword && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Password strength:{" "}
                  {formData.newPassword.length >= 8 ? (
                    <span className="text-green-600 dark:text-green-400">
                      Strong
                    </span>
                  ) : (
                    <span className="text-orange-600 dark:text-orange-400">
                      Weak (min 8 characters)
                    </span>
                  )}
                </p>
              )}
            </div>

            {/* Message */}
            {message && (
              <div
                className={`p-3 rounded-lg text-sm ${
                  message.includes("successfully")
                    ? "bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800"
                    : "bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800"
                }`}
              >
                {message}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center space-x-2 bg-blue-500 hover:bg-sky-700 dark:bg-blue-600 dark:hover:bg-blue-500 disabled:bg-gray-400 disabled:dark:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
