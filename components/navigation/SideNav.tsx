"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard as Dashboard,
  PlusCircle,
  KeyRound,
  Shield,
  Settings,
  LogOut,
  Lock,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import Button from "../ui/Button";

interface SideNavProps {
  className?: string;
  onNavigate?: () => void; // useful on mobile to close after navigation
}

const SideNav: React.FC<SideNavProps> = ({ className = "", onNavigate }) => {
  const pathname = usePathname();

  const isActiveLink = (href: string) => {
    return pathname === href;
  };

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: <Dashboard className="w-5 h-5" /> },
    { href: "/vault", label: "Vault", icon: <Lock className="w-5 h-5" /> },
    { href: "/password-generator", label: "Password Generator", icon: <KeyRound className="w-5 h-5" /> },
    { href: "/security-audit", label: "Security Audit", icon: <Shield className="w-5 h-5" /> },
    { href: "/settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
  ];

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
    toast.success("Logged out successfully");
    onNavigate?.();
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full w-60 bg-gray-900 text-gray-200 flex flex-col justify-between shadow-xl  transform transition-transform ${className}`}
    >
      {/* Top Section */}
      <div className="mt-20 border-t border-gray-700 pb-4">
        {/* Logo */} 
        {/* <div className="flex items-center gap-2 px-6 py-4 text-xl font-bold border-b border-gray-700">
          <KeyRound className="w-5 h-5 text-blue-500" />
          Fortress Key
        </div>

        {/* Nav Links */}
        <nav className="mt-10 flex flex-col space-y-4">
          {navLinks.map(({ href, label, icon }) => (
            <Link
              key={href}  
              href={href}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-6 py-2 rounded-md transition ${
                isActiveLink(href)
                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                  : "hover:bg-gray-800"
              }`}
            >
              {icon}
              {label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Logout */}
      <div className="w-full flex flex-col items-center mb-6 px-6 border-t border-gray-700 pt-4">
        <Button
          className="w-[70%] flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-gray-800 rounded-md transition cursor-pointer"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default SideNav;

           
