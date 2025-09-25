"use client";

import NavBar from "@/components/navigation/NavBar";
import SlideShow from "@/components/ui/SlideShow";
import Card from "@/components/ui/Card";
import Footer from "@/components/ui/Footer";
import { Lock, Moon, Sun } from "lucide-react";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const HomePage = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Sync dark mode preference
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const whyCards = [
    {
      icon: <Lock className="w-6 h-6" />,
      heading: "Military-Grade Encryption",
      description:
        "Your data is protected with AES-256 encryption, the same standard used by governments and security experts worldwide.",
    },
    {
      icon: <Lock className="w-6 h-6" />,
      heading: "Instant Password Generation",
      description:
        "Create strong, unique passwords for every account with our built-in password generator.",
    },
    {
      icon: <Lock className="w-6 h-6" />,
      heading: "Cross-Device Sync",
      description:
        "Access your passwords from anywhere - your phone, tablet, or computer - with seamless synchronization.",
    },
    {
      icon: <Lock className="w-6 h-6" />,
      heading: "Multi-Factor Authentication",
      description:
        "Protect your passwords with a second layer of security with multi-factor authentication.",
    },
    {
      icon: <Lock className="w-6 h-6" />,
      heading: "Biometric Authentication",
      description:
        "Unlock your vault with Face ID, Touch ID, or other biometric methods for maximum convenience.",
    },
    {
      icon: <Lock className="w-6 h-6" />,
      heading: "Zero-Knowledge Architecture",
      description:
        "We never have access to your master password or encrypted data. Your privacy is guaranteed.",
    },
  ];

  const howItWorks = [
    {
      heading: "Create an Account",
      description: "Sign up with your email and create a strong master password",
    },
    {
      heading: "Add Your Passwords",
      description: "Import existing passwords or add them as you browse",
    },
    {
      heading: "Enjoy",
      description: "Autofill passwords across all your devices securely",
    },
  ];

  return (
    <div className="dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* <NavBar /> */}

      {/* Dark Mode Toggle */}
      <div className="flex justify-end w-full px-6 pt-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 p-2 rounded-full transition"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      {/* Main Content Container */}
      <div className="mx-auto max-w-[120rem] p-4 sm:p-16">
        {/* Hero Section */}
        <div className="pt-16 sm:pt-20 flex flex-col items-center min-h-screen w-full">
          <motion.div
            className="w-full text-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h1 className="mt-6 sm:mt-10 text-2xl sm:text-4xl lg:text-6xl font-extrabold text-blue-800 dark:text-blue-400 leading-tight">
              Secure your digital life with{" "}
              <span className="text-blue-600 dark:text-blue-300">Fortress Key</span>
            </h1>
            <p className="mt-4 text-sm sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
              The world's most trusted password manager. Store, generate, and
              autofill passwords with military-grade encryption.
            </p>
          </motion.div>

          {/* Slide Show */}
          <motion.div
            className="w-full mt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <SlideShow />
          </motion.div>

          {/* Why Choose Us Section */}
          <div className="w-full mt-16 text-center mb-10">
            <motion.h2
              className="text-2xl sm:text-4xl lg:text-5xl font-bold text-blue-800 dark:text-blue-400"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              Why Choose Fortress Key
            </motion.h2>
            <motion.p
              className="mt-4 text-sm sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Fortress Key is the most secure password manager on the market. Our
              advanced encryption ensures that your data is protected from
              unauthorized access.
            </motion.p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-10 w-full">
              {whyCards.map((card, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <Card
                    icon={card.icon}
                    heading={card.heading}
                    description={card.description}
                  />
                </motion.div>
              ))}
            </div>

            {/* How Fortress Key Works */}
            <div className="mt-16 w-full text-center">
              <motion.h2
                className="text-2xl sm:text-4xl lg:text-5xl font-bold text-blue-800 dark:text-blue-400"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                How Fortress Key Works
              </motion.h2>
              <motion.p
                className="mt-4 text-sm sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 leading-relaxed"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Getting started with Fortress Key is simple. Create an account,
                add your passwords, and enjoy secure access to your digital life.
              </motion.p>

              <div className="mt-10 flex flex-col md:flex-row items-center justify-center w-full relative">
                {howItWorks.map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex flex-col items-center relative md:flex-1"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.3 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white font-bold text-lg z-10 dark:bg-blue-500">
                      {index + 1}
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
                      {item.heading}
                    </h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-xs">
                      {item.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;
