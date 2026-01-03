"use client";

import NavBar from "@/components/navigation/NavBar";
import Card from "@/components/ui/Card";
import Footer from "@/components/ui/Footer";
import {
  Shield,
  Lock,
  RefreshCw,
  Zap,
  Fingerprint,
  Globe,
  UserPlus,
  PlusCircle,
  Sparkles,
  ShieldCheck,
  KeyRound
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const HomePage = () => {
  const [darkMode, setDarkMode] = useState(true); // Default to dark for premium feel

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const whyCards = [
    {
      icon: <Shield className="w-6 h-6" />,
      heading: "Military-Grade Encryption",
      description: "Advanced AES-256 encryption protects your data at all times. We use the same standards as leading security firms.",
    },
    {
      icon: <RefreshCw className="w-6 h-6" />,
      heading: "Dynamic Password Generation",
      description: "Instantly create high-entropy passwords that are impossible to guess, and manage them effortlessly.",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      heading: "Instant Cross-Device Sync",
      description: "Your vault is synchronized in real-time across your desktop, laptop, and mobile devices.",
    },
    {
      icon: <Fingerprint className="w-6 h-6" />,
      heading: "Biometric Integration",
      description: "Access your vault securely using Face ID, Touch ID, or native OS biometric authentication.",
    },
    {
      icon: <Lock className="w-6 h-6" />,
      heading: "Zero-Knowledge Security",
      description: "We never see your passwords. Only you hold the master key to your encrypted vault.",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      heading: "Global Accessibility",
      description: "Access your critical information securely from any location, anytime, with our resilient infrastructure.",
    },
  ];

  const howItWorks = [
    {
      icon: <UserPlus className="w-8 h-8" />,
      heading: "Create Your Identity",
      description: "Sign up and set your master password — the only key that can unlock your vault.",
    },
    {
      icon: <PlusCircle className="w-8 h-8" />,
      heading: "Secure Your Assets",
      description: "Add passwords, notes, and payment info. Let us handle the complexity of security.",
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      heading: "Seamless Access",
      description: "Autofill and login to any service with a single click. Security has never been this simple.",
    },
  ];

  return (
    <div className="dark:bg-gray-950 dark:text-gray-100 selection:bg-blue-500/30 font-sans overflow-x-hidden">
      <NavBar />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-24 px-6 overflow-hidden bg-mesh">
        {/* Background Glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] -z-10" />

        <div className="max-w-7xl w-full mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Security Guaranteed
            </div>

            <h1 className="text-5xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-6 bg-gradient-to-r from-white via-blue-100 to-gray-400 bg-clip-text text-transparent">
              Shield Your <br />
              <span className="text-blue-500 text-glow">Digital Future</span>
            </h1>

            <p className="text-lg lg:text-xl text-gray-400 font-medium leading-relaxed max-w-xl mb-10">
              The ultimate vault for your digital life. Experience military-grade encryption without sacrificing simplicity.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/auth/register" className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-500/25 transition-all hover:scale-105">
                Start for Free
              </Link>
              <Link href="/try" className="px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white border border-gray-800 rounded-xl font-bold transition-all hover:scale-105">
                Live Demo
              </Link>
            </div>

            <div className="mt-12 flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-gray-950 bg-gray-900 flex items-center justify-center overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <p className="font-bold text-white">100k+ Users</p>
                <p className="text-gray-500">Protecting their vault today</p>
              </div>
            </div>
          </motion.div>

          {/* Futuristic Image Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-blue-500/20 blur-[80px] -z-10 rounded-full animate-float" />
            <div className="glass rounded-[3rem] p-4 lg:p-8 animate-float">
              <img
                src="/hero-bg.png"
                alt="Cyber Safety"
                className="rounded-[2rem] shadow-2xl w-full h-auto object-cover border border-white/5"
              />
            </div>

            {/* Floating Accents */}
            <div className="absolute -top-10 -right-10 glass p-6 rounded-2xl animate-float" style={{ animationDelay: '1s' }}>
              <ShieldCheck size={48} className="text-green-400" />
            </div>
            <div className="absolute -bottom-10 -left-10 glass p-6 rounded-2xl animate-float" style={{ animationDelay: '2s' }}>
              <KeyRound size={48} className="text-blue-400" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 border-y border-white/5 bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-8">Endorsed by Security Professionals</p>
          <div className="flex flex-wrap justify-center gap-12 lg:gap-24 opacity-30 grayscale contrast-125">
            <span className="text-2xl font-black italic">TECHRADAR</span>
            <span className="text-2xl font-black italic">WIRED</span>
            <span className="text-2xl font-black italic">VERGE</span>
            <span className="text-2xl font-black italic">FORBES</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
              Why Choose <span className="text-blue-500">Fortress Key?</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Our advanced technology ensures that your data is protected from unauthorized access at every level.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
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
        </div>
      </section>

      {/* How it works */}
      <section className="py-32 bg-gray-900/40 relative">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-white mb-6">Experience Simplicity</h2>
            <p className="text-gray-400 text-lg">Three steps to complete digital peace of mind.</p>
          </div>

          <div className="relative">
            {/* Line connecting steps */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-blue-500/10 -translate-y-1/2 hidden md:block" />

            <div className="grid md:grid-cols-3 gap-16">
              {howItWorks.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="relative flex flex-col items-center text-center group"
                >
                  <div className="w-20 h-20 rounded-3xl bg-blue-600 text-white flex items-center justify-center mb-8 shadow-2xl shadow-blue-500/40 group-hover:scale-110 transition-transform duration-300">
                    {step.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{step.heading}</h3>
                  <p className="text-gray-400 leading-relaxed">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto glass rounded-[3rem] p-12 lg:p-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-600/10 -z-10" />
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-8 leading-tight"> Ready to secure your digital world?</h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">Join thousands of users who trust Fortress Key to protect their most sensitive information.</p>
          <Link href="/auth/register" className="px-12 py-5 bg-white text-gray-950 rounded-2xl font-black text-xl hover:bg-gray-200 transition-all inline-block shadow-2xl">
            Get Started Now
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
