"use client";

import React, { useState } from "react";
import BannerCard from "@/components/ui/BannerCard";
import { api } from "@/lib/api";
import {
  AlertTriangle,
  AlertCircle,
  Info,
  Database,
  ShieldCheck,
  PlusCircle,
  KeyRound,
  Lock,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import PasswordModal from "@/components/modals/PasswordModal";

const Dashboard = () => {
  const [passwordModalOpen, setPasswordModalOpen] = useState(true);

  const securityMetrics = [
    {
      title: "Vulnerable Passwords",
      count: 3,
      icon: AlertTriangle,
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/30",
    },
    {
      title: "Weak Passwords",
      count: 12,
      icon: AlertCircle,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/30",
    },
    {
      title: "Reused Passwords",
      count: 8,
      icon: Info,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
    },
    {
      title: "Total Items",
      count: 147,
      icon: Database,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30",
    },
  ];

  const quickActions = [
    {
      label: "Add New Password",
      icon: PlusCircle,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      href: "/vault/add",
    },
    {
      label: "Run Security Audit",
      icon: ShieldCheck,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      href: "/security-audit",
    },
    {
      label: "Generate Password",
      icon: KeyRound,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
      href: "/password-generator",
    },
  ];

  // Sample data for chart
  const chartData = [
    { month: "May", weak: 20, reused: 10, vulnerable: 3 },
    { month: "Jun", weak: 17, reused: 9, vulnerable: 2 },
    { month: "Jul", weak: 15, reused: 8, vulnerable: 2 },
    { month: "Aug", weak: 13, reused: 8, vulnerable: 1 },
    { month: "Sep", weak: 12, reused: 7, vulnerable: 1 },
    { month: "Oct", weak: 10, reused: 6, vulnerable: 1 },
  ];

  return (
    <div className="text-white min-h-full px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold text-blue-400">Dashboard</h1>
        <p className="mt-2 text-gray-400 text-sm sm:text-base">
          Overview of your vault health, insights, and recent actions.
        </p>
      </header>

      {/* Security Metrics */}
      <section>
        <h2 className="text-xl font-semibold text-slate-100 mb-4">
          Security Health Check
        </h2>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 xl:gap-8"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { staggerChildren: 0.1 },
            },
          }}
        >
          {securityMetrics.map(
            ({ title, count, icon: Icon, color, bgColor, borderColor }, i) => (
              <motion.div
                key={i}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              >
                <BannerCard
                  title={title}
                  count={count}
                  icon={Icon}
                  color={color}
                  bgColor={bgColor}
                  borderColor={borderColor}
                />
              </motion.div>
            )
          )}
        </motion.div>
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="text-xl font-semibold text-slate-100 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickActions.map(({ label, icon: Icon, color, bgColor, href }, i) => (
            <motion.a
              key={i}
              href={href}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center justify-between rounded-xl border ${bgColor} ${color} border-gray-800 hover:border-blue-600 transition p-4 cursor-pointer`}
            >
              <div className="flex items-center gap-3">
                <Icon size={22} />
                <span className="font-medium">{label}</span>
              </div>
              <Lock className="opacity-30" size={18} />
            </motion.a>
          ))}
        </div>
      </section>

      {/* Recent Activity */}
      <section className="bg-gray-900/60 rounded-xl p-5 border border-gray-800 shadow-sm">
        <h2 className="text-lg font-semibold text-blue-300 mb-3">
          Recent Activity
        </h2>

        <div className="text-gray-500 text-sm space-y-3">
          <p>No activity yet. Once you add or modify passwords, they’ll appear here.</p>
          <p className="text-gray-600 italic">
            Example: “You updated your Gmail password 3 days ago.”
          </p>
        </div>
      </section>

      {/* Vault Insights Chart */}
      <section className="bg-gray-900/60 rounded-xl p-5 border border-gray-800 shadow-sm">
        <h2 className="text-lg font-semibold text-green-300 mb-3">
          Vault Insights
        </h2>
        <p className="text-gray-500 text-sm mb-4">
          Track your password security health over the past months.
        </p>

        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#e5e7eb" }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="weak"
                stroke="#facc15"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="Weak Passwords"
              />
              <Line
                type="monotone"
                dataKey="reused"
                stroke="#60a5fa"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="Reused Passwords"
              />
              <Line
                type="monotone"
                dataKey="vulnerable"
                stroke="#f87171"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="Vulnerable Passwords"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* modals*/}
      <PasswordModal
                isOpen={passwordModalOpen}
                onClose={() => setPasswordModalOpen(false)}
            />
    </div>
  );
};

export default Dashboard;
