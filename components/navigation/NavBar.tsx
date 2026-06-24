"use client";

import { KeyRound, Moon, Sun, Search, Menu } from "lucide-react";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useSideNav } from "@/context/SideNavContext";

const NavBar: React.FC = () => {
  const { data: session, status } = useSession();
  const [darkMode, setDarkMode] = useState(false);
  const pathname = usePathname();
  const { isOpen, isCollapsed, toggle } = useSideNav();

  const firstName = session?.user?.firstName || session?.user?.name;
  const initial = firstName ? firstName.charAt(0).toUpperCase() : "";

  useEffect(() => {
    const saved = localStorage.getItem("darkMode") === "true";
    setDarkMode(saved);
    if (saved) document.documentElement.classList.add("dark");
  }, []);

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
    <header
      className={`fixed top-0 ${hasSidebar
          ? isCollapsed ? "left-0 lg:left-20" : "left-0 lg:left-60"
          : "left-0"
        } right-0 h-16 sm:h-20 
      backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-b border-gray-200/60 dark:border-gray-800/60 
      z-40 transition-all duration-300`}
    >
      <nav className="w-full h-full flex items-center justify-between px-4 sm:px-8">
        {/* Left Section: Logo + Menu */}
        <div className="flex items-center gap-3">
          {hasSidebar && (
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => {
                toggle()
                // console.log("CLicked")
              }}
              className="lg:hidden p-2 rounded-md bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
            >
              <Menu height={24} width={24} color="white" />
            </button>
          )}

          {!hasSidebar && (
            <Link
              href="/"
              className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-semibold text-lg sm:text-xl"
            >
              <KeyRound size={22} />
              <span className="hidden sm:inline-block">Fortress Key</span>
            </Link>
          )}
        </div>

       

        {/* Right Section: Dark Mode + User */}
        <div className="flex items-center gap-3 sm:gap-4">
         

          {initial ? (
            <Link
              href="/profile"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-500 dark:to-blue-700 hover:opacity-90 transition"
              title="Profile"
            >
              {initial}
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-500 dark:to-blue-700 text-white px-4 py-2 rounded-full font-medium hover:opacity-90 transition"
            >
              Log In
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
