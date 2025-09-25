"use client"

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, PlusCircle, KeyRound, Shield, Settings, LogOut, Lock } from "lucide-react";
import { signOut } from "next-auth/react";
import { toast } from "sonner";

const SideNav = () => {
  const pathname = usePathname();
  
  const isActiveLink = (href: string) => {
    return pathname === href;
  };


const handleLogout = async () => {
  await signOut({ callbackUrl: "/login" });
  toast.success("Logged out successfully");
};

  return (
    <div className="fixed top-0 left-0 h-full w-60 bg-gray-900 text-gray-200 flex flex-col justify-between shadow-lg">
      {/* Top Section */}
      <div className="mt-20">
        {/* Logo */}
        {/* <div className="flex items-center gap-2 px-6 py-4 text-xl font-bold border-b border-gray-700">
          <KeyRound className="w-5 h-5 text-blue-500" />
          Fortress Key
        </div> */}

        {/* Nav Links */}
        <nav className="mt-10 flex flex-col space-y-4">
          <Link
            href="/dashboard"
            className={`flex items-center gap-3 px-6 py-2 rounded-md transition ${
              isActiveLink("/dashboard") 
                ? "bg-blue-600 text-white" 
                : "hover:bg-gray-800"
            }`}
          >
            <Home className="w-5 h-5" />
            Dashboard
          </Link>
          <Link
            href="/vault"
            className={`flex items-center gap-3 px-6 py-2 rounded-md transition ${
              isActiveLink("/vault") 
                ? "bg-blue-600 text-white" 
                : "hover:bg-gray-800"
            }`}
          >
            <Lock className="w-5 h-5" />
            Vault
          </Link>
          <Link
            href="/password-generator"
            className={`flex items-center gap-3 px-6 py-2 rounded-md transition ${
              isActiveLink("/password-generator") 
                ? "bg-blue-600 text-white" 
                : "hover:bg-gray-800"
            }`}
          >
            <KeyRound className="w-5 h-5" />
            Password Generator
          </Link>
          <Link
            href="/security-audit"
            className={`flex items-center gap-3 px-6 py-2 rounded-md transition ${
              isActiveLink("/security-audit") 
                ? "bg-blue-600 text-white" 
                : "hover:bg-gray-800"
            }`}
          >
            <Shield className="w-5 h-5" />
            Security Audit
          </Link>
          <Link
            href="/settings"
            className={`flex items-center gap-3 px-6 py-2 rounded-md transition ${
              isActiveLink("/settings") 
                ? "bg-blue-600 text-white" 
                : "hover:bg-gray-800"
            }`}
          >
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        </nav>
      </div>

      {/* Logout */}
      <div className="mb-6 px-6">
        <Link
          href="#"
          className="flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-gray-800 rounded-md transition"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          Logout
        </Link>
      </div>
    </div>
  );
};

export default SideNav;
