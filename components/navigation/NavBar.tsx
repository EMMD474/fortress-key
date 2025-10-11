"use client";

import {
  ChevronDown,
  User,
  Settings,
  LogOut,
  KeyRound,
  Moon,
  Sun,
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import Button from "../ui/Button";

const NavBar: React.FC = () => {
  const { data: session, status } = useSession();
  const [darkMode, setDarkMode] = useState(false);
  const pathname = usePathname();

  const firstName = session?.user?.firstName || session?.user?.name;
  const initial = firstName ? firstName.charAt(0).toUpperCase() : "";

  // Load dark mode preference
  useEffect(() => {
    const saved = localStorage.getItem("darkMode") === "true";
    setDarkMode(saved);
    if (saved) document.documentElement.classList.add("dark");
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", String(newMode));
    document.documentElement.classList.toggle("dark", newMode);
  };

  const sidebarRoutes = [
    "/dashboard",
    "/vault",
    "/password-generator",
    "/security-audit",
    "/settings",
  ];
  const hasSidebar = sidebarRoutes.some((route) => pathname?.startsWith(route));

  return (
    <header className={`fixed top-0 ${hasSidebar ? "left-0 lg:left-60" : "left-0"} right-0 h-16 sm:h-20 bg-white dark:bg-gray-900 shadow-md z-40 transition-colors duration-300`}>
      <nav className="w-full h-full flex items-center justify-between px-4 sm:px-6">
        {/* Left: Mobile menu button (only when sidebar exists) + Logo */}
        <div className="flex items-center gap-3">
          {hasSidebar && (
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new CustomEvent("toggle-sidenav", { detail: { open: true } }));
                }
              }}
              className="lg:hidden p-2 rounded-md bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
            >
              {/* Simple hamburger icon */}
              <span className="block w-5 h-0.5 bg-gray-800 dark:bg-gray-200 mb-1"></span>
              <span className="block w-5 h-0.5 bg-gray-800 dark:bg-gray-200 mb-1"></span>
              <span className="block w-5 h-0.5 bg-gray-800 dark:bg-gray-200"></span>
            </button>
          )}

          {/* Logo/Title */}
          <h3 className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-semibold text-xl sm:text-2xl cursor-pointer">
          <KeyRound size={26} />
          <Link href="/">Fortress Key</Link>
          </h3>
        </div>

        <div className="flex items-center gap-4">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            {darkMode ? (
              <Sun size={18} className="text-yellow-400" />
            ) : (
              <Moon size={18} className="text-blue-700" />
            )}
          </button>

          {/* Account / Login */}
          {initial ? (
            <div className="relative">
              {status !== "loading" && (
                <Link
                  title="profile"
                  href="/profile"
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-500 dark:to-blue-700 text-white font-medium cursor-pointer flex items-center gap-2 hover:opacity-90 transition duration-300"
                >
                  {initial}
                </Link>
              )}
            </div>
          ) : (
            <Link
              className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-500 dark:to-blue-700 text-white px-5 py-2 rounded-xl font-medium hover:opacity-90 transition"
              href="/auth/login"
            >
              Log In
            </Link>
            // <Button className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-500 dark:to-blue-700 text-white px-5 py-2 rounded-full font-medium hover:opacity-90 transition">
            // </Button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
