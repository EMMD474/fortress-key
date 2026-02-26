"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Lock,
} from "lucide-react";

const SecurityAudit = () => {
  const securityScore = 72;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Good";
    if (score >= 60) return "Fair";
    return "Poor";
  };

  const passwordHealth = [
    {
      label: "Weak Passwords",
      count: 12,
      icon: AlertCircle,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/30",
      description: "Passwords that don't meet security standards",
    },
    {
      label: "Reused Passwords",
      count: 8,
      icon: RefreshCw,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
      description: "Same password used across multiple accounts",
    },
    {
      label: "Breached Passwords",
      count: 3,
      icon: ShieldAlert,
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/30",
      description: "Passwords found in known data breaches",
    },
  ];

  const recommendations = [
    {
      title: "Update breached passwords immediately",
      description: "3 of your passwords were found in data breaches. Change them now to protect your accounts.",
      priority: "high",
      icon: XCircle,
    },
    {
      title: "Strengthen weak passwords",
      description: "12 passwords don't meet the recommended length and complexity requirements.",
      priority: "medium",
      icon: AlertTriangle,
    },
    {
      title: "Eliminate password reuse",
      description: "8 accounts share the same password. Use unique passwords for each account.",
      priority: "medium",
      icon: RefreshCw,
    },
    {
      title: "Enable two-factor authentication",
      description: "Add an extra layer of security to your most important accounts.",
      priority: "low",
      icon: Lock,
    },
  ];

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case "high":
        return { bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-400" };
      case "medium":
        return { bg: "bg-yellow-500/10", border: "border-yellow-500/30", text: "text-yellow-400" };
      default:
        return { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-400" };
    }
  };

  return (
    <div className="text-white min-h-full px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold text-blue-400">Security Audit</h1>
        <p className="mt-2 text-gray-400 text-sm sm:text-base">
          Analyze your vault security and identify vulnerabilities.
        </p>
      </header>

      {/* Security Score Overview */}
      <section className="bg-gray-900/60 rounded-xl p-6 border border-gray-800 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Score Circle */}
          <div className="relative w-32 h-32 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                stroke="#1f2937"
                strokeWidth="12"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                stroke={securityScore >= 80 ? "#4ade80" : securityScore >= 60 ? "#facc15" : "#f87171"}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${(securityScore / 100) * 352} 352`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-bold ${getScoreColor(securityScore)}`}>
                {securityScore}
              </span>
              <span className="text-gray-400 text-sm">/ 100</span>
            </div>
          </div>

          {/* Score Details */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <ShieldCheck className={`w-6 h-6 ${getScoreColor(securityScore)}`} />
              <h2 className="text-xl font-semibold text-slate-100">
                Security Score: <span className={getScoreColor(securityScore)}>{getScoreLabel(securityScore)}</span>
              </h2>
            </div>
            <p className="text-gray-400 mt-2 text-sm">
              Your vault security can be improved. Address the issues below to increase your score.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition flex items-center gap-2 mx-auto sm:mx-0"
            >
              <RefreshCw className="w-4 h-4" />
              Run Full Audit
            </motion.button>
          </div>
        </div>
      </section>

      {/* Password Health Analysis */}
      <section>
        <h2 className="text-xl font-semibold text-slate-100 mb-4">
          Password Health Analysis
        </h2>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-5"
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
          {passwordHealth.map(({ label, count, icon: Icon, color, bgColor, borderColor, description }, i) => (
            <motion.div
              key={i}
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              className={`rounded-xl border ${borderColor} ${bgColor} p-5 hover:border-gray-600 transition cursor-pointer`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${bgColor}`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <span className={`text-2xl font-bold ${color}`}>{count}</span>
              </div>
              <h3 className="font-medium text-slate-100">{label}</h3>
              <p className="text-gray-500 text-sm mt-1">{description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Recommendations */}
      <section>
        <h2 className="text-xl font-semibold text-slate-100 mb-4">
          Recommendations
        </h2>
        <div className="space-y-3">
          {recommendations.map(({ title, description, priority, icon: Icon }, i) => {
            const styles = getPriorityStyles(priority);
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-xl border ${styles.border} ${styles.bg} p-4 hover:border-gray-600 transition cursor-pointer group`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${styles.bg} flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${styles.text}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-slate-100">{title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${styles.bg} ${styles.text} border ${styles.border} capitalize`}>
                        {priority}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">{description}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-gray-400 transition flex-shrink-0 mt-1" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Audit History */}
      <section className="bg-gray-900/60 rounded-xl p-5 border border-gray-800 shadow-sm">
        <h2 className="text-lg font-semibold text-green-300 mb-3">
          Audit History
        </h2>
        <div className="text-gray-500 text-sm space-y-3">
          <div className="flex items-center gap-3 py-2 border-b border-gray-800">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <span>Last audit completed: Today at 10:30 AM</span>
          </div>
          <p className="text-gray-600 italic">
            Regular audits help you maintain strong security. Run an audit weekly for best results.
          </p>
        </div>
      </section>
    </div>
  );
};

export default SecurityAudit;
