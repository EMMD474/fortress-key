"use client";

import { ChevronDown, User, Settings, LogOut, KeyRound } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { toast } from "sonner";
import Button from "../ui/Button";

const NavBar: React.FC = () => {
  const { data: session, status } = useSession();
  const [drop, setDrop] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
    setDrop(false);
    toast.success("Logged out successfully")
  };

  const dropDown = () => {
    setDrop((prev) => !prev);
  };

  const name = session?.user.name;
  const initial = name ? name.charAt(0).toUpperCase() : "";


  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDrop(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-white  shadow-md z-[60]">
      <nav className="w-full h-full flex items-center justify-between px-4 sm:px-6">
        {/* Logo/Title */}
        <h3 className="flex items-center gap-2 text-blue-700 font-medium text-xl sm:text-3xl  cursor-pointer">
          <KeyRound size={26} />
          <Link href="/">Fortress Key</Link>
        </h3>

        {/* Account Button with Dropdown Arrow */}
        {name ? (
          
          
        <div className="relative" ref={dropdownRef}>
          {status === "loading" ? "": (
           <button
                type="button"
                title="drop down activate"
                onClick={dropDown}
                className="border-gray-600 border px-4 py-2 rounded-full bg-blue-800 cursor-pointer flex items-center gap-2 hover:border-gray-400 transition duration-300 text-white text-sm sm:text-base"
              >
                {initial}
                
            </button>
          )}
              {drop && (
                <ul className="absolute top-10 right-0 w-32 bg-gray-900 border border-gray-600 rounded-md shadow-lg">
                  <li className="px-4 py-2 text-green-500 hover:bg-gray-800 rounded-t-md cursor-pointer flex items-center gap-2 border-b border-gray-700">
                    <Link href="/profile" className="flex items-center gap-2 w-full">
                      <User size={16} />
                      Profile
                    </Link>
                  </li>
                  <li className="px-4 py-2 text-green-500 hover:bg-gray-800 cursor-pointer flex items-center gap-2 border-b border-gray-700">
                    <Link href="/settings" className="flex items-center gap-2 w-full">
                      <Settings size={16} />
                      Settings
                    </Link>
                  </li>
                  <li
                    onClick={handleLogout}
                    className="px-4 py-2 text-green-500 hover:bg-gray-800 rounded-b-md cursor-pointer flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    Logout
                  </li>
                  
                </ul>
              )}
        </div>
        ): (
          <Button >
            <Link href="/login">
            Log In
            </Link>
          </Button>
        )}
      </nav>
    </header>
  );
};

export default NavBar;