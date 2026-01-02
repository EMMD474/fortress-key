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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import Button from "../ui/Button";
import { useSideNav } from "@/context/SideNavContext";
import { motion, AnimatePresence } from "framer-motion";

interface SideNavProps {
  className?: string;
  onNavigate?: () => void;
}

const SideNav: React.FC<SideNavProps> = ({ className = "", onNavigate }) => {
  const pathname = usePathname();
  const { isCollapsed, toggleCollapsed } = useSideNav();

  const isActiveLink = (href: string) => {
    return pathname === href;
  };

  const navLinks = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <Dashboard className="w-5 h-5 flex-shrink-0" />,
    },
    {
      href: "/vault",
      label: "Vault",
      icon: <Lock className="w-5 h-5 flex-shrink-0" />
    },
    {
      href: "/security-audit",
      label: "Security Audit",
      icon: <Shield className="w-5 h-5 flex-shrink-0" />,
    },
    {
      href: "/settings",
      label: "Settings",
      icon: <Settings className="w-5 h-5 flex-shrink-0" />,
    },
  ];

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
    toast.success("Logged out successfully");
    onNavigate?.();
  };

  return (
    <div
      className={`fixed top-0 left-0 h-screen ${isCollapsed ? "w-20" : "w-60"
        } bg-gray-950/90 backdrop-blur-xl text-gray-200 flex flex-col justify-between transition-all duration-300 lg:shadow-none shadow-2xl border-r border-white/5 ${className} z-40 overflow-hidden`}
    >
      {/* Top Section */}
      <div className="flex flex-col flex-1">
        {/* Logo */}
        <div className={`flex items-center ${isCollapsed ? "justify-center" : "px-6"} py-6 transition-all duration-300`}>
          <Link href="/" className="flex items-center gap-3">
            <div className="p-1.5 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/30">
              <Shield size={20} className="text-white" />
            </div>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-white font-bold text-lg tracking-tight"
              >
                Fortress Key
              </motion.span>
            )}
          </Link>
        </div>

        {/* Nav Links */}
        <nav className="mt-4 px-3 flex flex-col space-y-2">
          {navLinks.map(({ href, label, icon }) => {
            const active = isActiveLink(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={onNavigate}
                className={`group relative flex items-center gap-4 px-4 py-2.5 rounded-xl transition-all duration-200 overflow-hidden ${active
                  ? "bg-blue-600/15 text-blue-400"
                  : "hover:bg-white/5 text-gray-400 hover:text-white"
                  }`}
              >
                {/* Active Indicator */}
                {active && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r-full"
                  />
                )}

                <div className={`${active ? "text-blue-400" : "group-hover:text-white transition-colors"}`}>
                  {icon}
                </div>

                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="font-medium whitespace-nowrap"
                  >
                    {label}
                  </motion.span>
                )}

                {/* Tooltip for collapsed mode */}
                {isCollapsed && (
                  <div className="absolute left-20 bg-gray-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10 whitespace-nowrap z-50">
                    {label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-3 bg-white/5 border-t border-white/5">
        {!isCollapsed && (
          <Button
            className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all duration-200 mb-2 group"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 flex-shrink-0 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Logout</span>
          </Button>
        )}

        <button
          onClick={toggleCollapsed}
          className={`hidden lg:flex w-full items-center ${isCollapsed ? "justify-center" : "px-4"} py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition-all duration-200 group`}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Collapse</span>
            </>
          )}
        </button>

        {isCollapsed && (
          <button
            onClick={handleLogout}
            className="lg:hidden flex w-full items-center justify-center py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SideNav;
