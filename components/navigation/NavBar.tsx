"use client";

import { ChevronDown, User, Settings, LogOut, KeyRound, Moon, Sun } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { toast } from "sonner";
import Button from "../ui/Button";

const NavBar: React.FC = () => {
  const { data: session, status } = useSession();
  const [drop, setDrop] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);



  const dropDown = () => {
    setDrop((prev) => !prev);
  };

  const name = session?.user?.name;
  const initial = name ? name.charAt(0).toUpperCase() : "";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDrop(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  return (
    <header className="fixed top-0 left-0 w-full h-16 sm:h-20 bg-white dark:bg-gray-900 shadow-md z-[60] transition-colors duration-300">
      <nav className="w-full h-full flex items-center justify-between px-4 sm:px-6">
        {/* Logo/Title */}
        <h3 className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-semibold text-xl sm:text-2xl cursor-pointer">
          <KeyRound size={26} />
          <Link href="/">Fortress Key</Link>
        </h3>

        <div className="flex items-center gap-4">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            {darkMode ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-blue-700" />}
          </button>

          {/* Account / Login */}
          {name ? (
            <div className="relative" ref={dropdownRef}>
              {status !== "loading" && (
                <button
                  type="button"
                  title="drop down activate"
                  onClick={dropDown}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-500 dark:to-blue-700 text-white font-medium cursor-pointer flex items-center gap-2 hover:opacity-90 transition duration-300"
                >
                  {initial}
                  <ChevronDown size={16} />
                </button>
              )}

              {drop && (
                <ul className="absolute top-12 right-0 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                  <li className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-md cursor-pointer flex items-center gap-2">
                    <Link href="/profile" className="flex items-center gap-2 w-full">
                      <User size={16} />
                      Profile
                    </Link>
                  </li>
                </ul>
              )}
            </div>
          ) : (
            <Button className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-500 dark:to-blue-700 text-white px-5 py-2 rounded-full font-medium hover:opacity-90 transition">
              <Link href="/login">Log In</Link>
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
