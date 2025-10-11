"use client"

import React, { useState } from 'react';
import { Shield, Lock, Key, CreditCard, FileText, Trash2, Settings, User, Search, Plus, AlertTriangle, AlertCircle, Info, Database } from 'lucide-react';

const Dashboard = () => {
  const [activeNav, setActiveNav] = useState('dashboard');

  const navItems = [
    { id: 'dashboard', icon: Database, label: 'Dashboard' },
    { id: 'passwords', icon: Lock, label: 'Passwords' },
    { id: 'notes', icon: FileText, label: 'Secure Notes' },
    { id: 'cards', icon: CreditCard, label: 'Credit Cards' },
    { id: 'trash', icon: Trash2, label: 'Trash' }
  ];

  const securityMetrics = [
    { 
      title: 'Vulnerable Passwords', 
      count: 3, 
      icon: AlertTriangle, 
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30'
    },
    { 
      title: 'Weak Passwords', 
      count: 12, 
      icon: AlertCircle, 
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30'
    },
    { 
      title: 'Reused Passwords', 
      count: 8, 
      icon: Info, 
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30'
    },
    { 
      title: 'Total Items', 
      count: 147, 
      icon: Database, 
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30'
    }
  ];

  const recentItems = [
    { name: 'Gmail', category: 'Email', lastUsed: '2 hours ago' },
    { name: 'GitHub', category: 'Development', lastUsed: '5 hours ago' },
    { name: 'AWS Console', category: 'Cloud', lastUsed: '1 day ago' },
    { name: 'Dropbox', category: 'Storage', lastUsed: '2 days ago' },
    { name: 'LinkedIn', category: 'Social', lastUsed: '3 days ago' }
  ];

  const categories = [
    { name: 'Social Media', count: 23 },
    { name: 'Banking', count: 8 },
    { name: 'Work', count: 45 },
    { name: 'Shopping', count: 31 },
    { name: 'Entertainment', count: 19 },
    { name: 'Development', count: 21 }
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Left Sidebar */}
      <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-400" />
            <span className="text-xl font-semibold">Fortress Key</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeNav === item.id 
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-slate-800 space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-all duration-200">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-all duration-200">
            <User className="w-5 h-5" />
            <span className="font-medium">Profile</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        {/* Top Action Bar */}
        <div className="bg-slate-900 border-b border-slate-800 p-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
            {/* Search Bar */}
            <div className="flex-1 max-w-2xl relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search passwords, notes, cards..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-12 pr-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Quick Actions */}
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg shadow-blue-500/20">
              <Plus className="w-5 h-5" />
              New Item
            </button>

            {/* Security Score */}
            <div className="flex items-center gap-3 bg-slate-800 border border-slate-700 rounded-lg px-6 py-3">
              <div className="relative w-12 h-12">
                <svg className="w-12 h-12 transform -rotate-90">
                  <circle cx="24" cy="24" r="20" stroke="#334155" strokeWidth="4" fill="none" />
                  <circle 
                    cx="24" 
                    cy="24" 
                    r="20" 
                    stroke="#3b82f6" 
                    strokeWidth="4" 
                    fill="none"
                    strokeDasharray={`${85 * 1.256} ${125.6}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-blue-400">
                  85
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Security Score</div>
                <div className="text-sm font-semibold text-slate-200">Good</div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="max-w-7xl mx-auto p-6 space-y-8">
          {/* Welcome Section */}
          <div>
            <h1 className="text-3xl font-bold text-slate-100 mb-2">Dashboard</h1>
            <p className="text-slate-400">Overview of your vault and recent activity</p>
          </div>

          {/* Security Overview */}
          <div>
            <h2 className="text-xl font-semibold text-slate-100 mb-4">Security Health Check</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {securityMetrics.map((metric, index) => {
                const Icon = metric.icon;
                return (
                  <div
                    key={index}
                    className={`${metric.bgColor} border ${metric.borderColor} rounded-xl p-6 transition-all duration-200 hover:scale-105 cursor-pointer`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <Icon className={`w-8 h-8 ${metric.color}`} />
                      <span className={`text-3xl font-bold ${metric.color}`}>{metric.count}</span>
                    </div>
                    <h3 className="text-sm font-medium text-slate-300">{metric.title}</h3>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity & Categories */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recently Used */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-slate-100 mb-4">Recently Used</h2>
              <div className="space-y-3">
                {recentItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-800 transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center group-hover:bg-slate-700 transition-all">
                        <Key className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-200">{item.name}</div>
                        <div className="text-xs text-slate-500">{item.category}</div>
                      </div>
                    </div>
                    <div className="text-xs text-slate-500">{item.lastUsed}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-slate-100 mb-4">Categories</h2>
              <div className="space-y-3">
                {categories.map((category, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-800 transition-all duration-200 cursor-pointer"
                  >
                    <span className="font-medium text-slate-200">{category.name}</span>
                    <span className="text-sm bg-slate-800 text-slate-300 px-3 py-1 rounded-full">
                      {category.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;