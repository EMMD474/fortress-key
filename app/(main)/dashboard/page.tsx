"use client";

import React, { useState } from "react";
import BannerCard from "@/components/ui/BannerCard";
import AddCredentials from "@/components/AddCredentials";
import { api } from "@/lib/api";
import {
  AlertTriangle,
  AlertCircle,
  Info,
  Database,
  ShieldCheck,
  Upload,
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
import ImportExportModal from "@/components/modals/ImportExportModal";


const Dashboard = () => {
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [addCredentialsOpen, setAddCredentialsOpen] = useState(false);
  const [importExportModalOpen, setImportExportModalOpen] = useState(false);

  const runsecurityAudite = () => {
    console.log("Run Security Audit on all passwords")
  }

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
      label: "Backup & Import",
      icon: Upload,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      onClick: () => setImportExportModalOpen(true),
    },
    {
      label: "Run Security Audit",
      icon: ShieldCheck,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      onClick: runsecurityAudite,
    },
    {
      label: "Generate Password",
      icon: KeyRound,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
      onClick: () => setPasswordModalOpen(true),
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
    <div className="padding-section space-y-4 sm:space-y-6 lg:space-y-8 xl:space-y-10 2xl:space-y-12">
      {/* Header */}
      <header>
        <h1 className="text-responsive-lg font-bold text-blue-400">Dashboard</h1>
        <p className="mt-1 sm:mt-2 xl:mt-3 text-gray-400 text-responsive-sm">
          Overview of your vault health, insights, and recent actions.
        </p>
      </header>

      {/* Security Metrics */}
      <section>
        <h2 className="text-responsive-md font-semibold text-slate-100 mb-3 sm:mb-4 xl:mb-5 2xl:mb-6">
          Security Health Check
        </h2>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 xl:gap-6 2xl:gap-8"
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
        <h2 className="text-responsive-md font-semibold text-slate-100 mb-3 sm:mb-4 xl:mb-5 2xl:mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 xl:gap-5 2xl:gap-6">
          {quickActions.map(({ label, icon: Icon, color, bgColor, onClick }, i) => (
            <motion.a
              key={i}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClick}
              className={`flex items-center justify-between rounded-xl border ${bgColor} ${color} border-gray-800 hover:border-blue-600 transition padding-responsive cursor-pointer`}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <Icon className="icon-md" />
                <span className="font-medium text-sm sm:text-base">{label}</span>
              </div>
              <Lock className="opacity-30 w-4 h-4 sm:w-5 sm:h-5" />
            </motion.a>
          ))}
        </div>
      </section>

      {/* Recent Activity */}
      <section className="bg-gray-900/60 rounded-xl padding-card border border-gray-800 shadow-sm">
        <h2 className="text-responsive-md font-semibold text-blue-300 mb-3 sm:mb-4 xl:mb-5">
          Recent Activity
        </h2>

        <div className="text-gray-500 text-responsive-sm space-y-2 sm:space-y-3 xl:space-y-4">
          <p>No activity yet. Once you add or modify passwords, they'll appear here.</p>
          <p className="text-gray-600 italic">
            Example: "You updated your Gmail password 3 days ago."
          </p>
        </div>
      </section>

      {/* Vault Insights Chart */}
      <section className="bg-gray-900/60 rounded-xl padding-card border border-gray-800 shadow-sm">
        <h2 className="text-responsive-md font-semibold text-green-300 mb-3 sm:mb-4 xl:mb-5">
          Vault Insights
        </h2>
        <p className="text-gray-500 text-responsive-sm mb-3 sm:mb-4 xl:mb-5">
          Track your password security health over the past months.
        </p>

        <div className="w-full h-64 sm:h-72 md:h-80 lg:h-96 xl:h-[28rem] 2xl:h-[32rem]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: -10 }} className="xl:mr-8">
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

      <ImportExportModal
        isOpen={importExportModalOpen}
        onClose={() => setImportExportModalOpen(false)}
      />

      {/* Add Credentials Modal */}
      {addCredentialsOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-3 sm:p-4 lg:p-6">
          <div className="w-full max-w-xs sm:max-w-lg lg:max-w-2xl max-h-[85vh] sm:max-h-[90vh] overflow-y-auto">
            <AddCredentials onClose={() => setAddCredentialsOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
