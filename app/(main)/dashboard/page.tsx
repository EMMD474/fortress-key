import React from "react";
import BannerCard from "@/components/ui/BannerCard";
import { AlertTriangle, AlertCircle, Info, Database } from "lucide-react";

const Dashboard = () => {
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

  return (
    <div className="text-white min-h-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold text-blue-400">Dashboard</h1>
        <p className="mt-2 text-gray-400 text-sm sm:text-base">
          Overview of your vault and recent activity.
        </p>
      </header>

      {/* Security Overview */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-100">
            Security Health Check
          </h2>
        </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 xl:gap-10">
          {securityMetrics.map(({ title, count, icon: Icon, color, bgColor, borderColor }, i) => (
            <BannerCard
              key={i}
              title={title}
              count={count}
              icon={Icon}
              color={color}
              bgColor={bgColor}
              borderColor={borderColor}
            />
          ))}
        </div>
      </section>

      {/* Recent Activity */}
      <section className="bg-gray-900/60 rounded-xl p-5 border border-gray-800 shadow-sm">
        <h2 className="text-lg font-semibold text-blue-300 mb-2">
          Recent Activity
        </h2>
        <p className="text-gray-500 text-sm">No activity yet.</p>
      </section>
    </div>
  );
};

export default Dashboard;
