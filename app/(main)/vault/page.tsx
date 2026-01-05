"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Eye, EyeOff, Copy, Edit, Trash2, Globe, User, Lock, Calendar, Tag, Plus, Grid, List, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

interface Credential {
  id: string;
  label: string;
  username: string;
  password: string;
  website: string;
  notes?: string;
  category: { name: string; id: number } | null;
  createdAt: Date;
  updatedAt: Date;
}

interface Category {
  id: number;
  name: string;
}

// Static data for demonstration - replace with actual API calls
const mockCredentials: Credential[] = [
  {
    id: '1',
    label: 'Gmail Account',
    username: 'john.doe@gmail.com',
    password: 'SecurePass123!',
    website: 'https://gmail.com',
    category: { name: 'Email', id: 1 },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    label: 'GitHub',
    username: 'johndoe',
    password: 'GitHubSecure456#',
    website: 'https://github.com',
    category: { name: 'Work', id: 2 },
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10'),
  },
  {
    id: '3',
    label: 'Netflix',
    username: 'john.doe@email.com',
    password: 'NetflixPass789$',
    website: 'https://netflix.com',
    category: { name: 'Entertainment', id: 3 },
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date('2024-03-05'),
  },
  {
    id: '4',
    label: 'Bank of America',
    username: 'johndoe123',
    password: 'BankSecure999&',
    website: 'https://bankofamerica.com',
    category: { name: 'Banking', id: 4 },
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '5',
    label: 'Amazon',
    username: 'john.doe@gmail.com',
    password: 'AmazonPass111*',
    website: 'https://amazon.com',
    category: { name: 'Shopping', id: 5 },
    createdAt: new Date('2024-02-28'),
    updatedAt: new Date('2024-02-28'),
  },
];

const categories: Category[] = [
  { id: 1, name: 'Email' },
  { id: 2, name: 'Work' },
  { id: 3, name: 'Entertainment' },
  { id: 4, name: 'Banking' },
  { id: 5, name: 'Shopping' },
  { id: 6, name: 'Social Media' },
];

interface CredentialCardProps {
  credential: Credential;
  viewMode: 'grid' | 'list';
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const CredentialCard: React.FC<CredentialCardProps> = ({ credential, viewMode, onEdit, onDelete }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} copied to clipboard`);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${credential.label}"?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onDelete(credential.id);
      toast.success('Credential deleted successfully');
    } catch (error) {
      toast.error('Failed to delete credential');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const getInitials = (label: string) => {
    return label.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-blue-500/50 transition-all"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-semibold">{getInitials(credential.label)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-medium truncate">{credential.label}</h3>
              <p className="text-gray-400 text-sm truncate">{credential.username}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {credential.category && (
              <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">
                {credential.category.name}
              </span>
            )}
            <button
              onClick={() => copyToClipboard(credential.username, 'username')}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="Copy username"
            >
              <User className="w-4 h-4" />
            </button>
            <button
              onClick={() => copyToClipboard(credential.password, 'password')}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="Copy password"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit(credential.id)}
              className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50"
              title="Delete"
            >
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gray-800 border border-gray-700 rounded-lg p-5 hover:border-blue-500/50 transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-semibold">{getInitials(credential.label)}</span>
          </div>
          <div>
            <h3 className="text-white font-semibold">{credential.label}</h3>
            {credential.website && (
              <p className="text-gray-400 text-sm">{credential.website}</p>
            )}
          </div>
        </div>
        {credential.category && (
          <span className="px-3 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">
            {credential.category.name}
          </span>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-300">
            <User className="w-4 h-4" />
            <span className="text-sm truncate">{credential.username}</span>
          </div>
          <button
            onClick={() => copyToClipboard(credential.username, 'username')}
            className="p-1 text-gray-400 hover:text-white transition-colors"
            title="Copy username"
          >
            {copied === 'username' ? (
              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-300">
            <Lock className="w-4 h-4" />
            <span className="text-sm font-mono">
              {showPassword ? credential.password : '••••••••••••'}
            </span>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="p-1 text-gray-400 hover:text-white transition-colors"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button
              onClick={() => copyToClipboard(credential.password, 'password')}
              className="p-1 text-gray-400 hover:text-white transition-colors"
              title="Copy password"
            >
              {copied === 'password' ? (
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {credential.website && (
          <div className="flex items-center gap-2 text-gray-400 text-xs">
            <Globe className="w-3 h-3" />
            <a
              href={credential.website}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors truncate"
            >
              {credential.website}
            </a>
          </div>
        )}

        <div className="flex items-center gap-2 text-gray-400 text-xs">
          <Calendar className="w-3 h-3" />
          <span>Created {formatDate(credential.createdAt)}</span>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-700">
        <button
          onClick={() => onEdit(credential.id)}
          className="px-3 py-1 text-blue-400 hover:bg-blue-500/10 rounded transition-colors"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="px-3 py-1 text-red-400 hover:bg-red-500/10 rounded transition-colors disabled:opacity-50 flex items-center gap-1"
        >
          {isDeleting ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
          Delete
        </button>
      </div>
    </motion.div>
  );
};

const Vault: React.FC = () => {
  const { data: session } = useSession();
  const [credentials, setCredentials] = useState<Credential[]>(mockCredentials);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'category'>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Load credentials on component mount
  useEffect(() => {
    if (session) {
      loadCredentials();
    }
  }, [session]);

  const loadCredentials = async () => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/credentials');
      // const data = await response.json();
      // setCredentials(data.credentials);

      // For now, use mock data
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading
      setCredentials(mockCredentials);
    } catch (err) {
      setError('Failed to load credentials');
      console.error('Error loading credentials:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCredentials = useMemo(() => {
    let filtered = credentials.filter(credential => {
      const matchesSearch = credential.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        credential.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (credential.website && credential.website.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = !selectedCategory || credential.category?.name === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    // Sort credentials
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.label.localeCompare(b.label);
        case 'date':
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'category':
          const aCat = a.category?.name || '';
          const bCat = b.category?.name || '';
          return aCat.localeCompare(bCat);
        default:
          return 0;
      }
    });

    return filtered;
  }, [credentials, searchTerm, selectedCategory, sortBy]);

  const handleEdit = (id: string) => {
    console.log('Edit credential:', id);
    toast.info('Edit functionality coming soon!');
    // TODO: Implement edit functionality
  };

  const handleDelete = async (id: string) => {
    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/credentials/${id}`, { method: 'DELETE' });

      setCredentials(prev => prev.filter(cred => cred.id !== id));
    } catch (error) {
      console.error('Error deleting credential:', error);
      throw error;
    }
  };

  if (loading && credentials.length === 0) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-gray-400">Loading your credentials...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={loadCredentials}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Password Vault</h1>
          <p className="text-gray-400">
            {filteredCredentials.length} of {credentials.length} credentials
            {loading && <span className="ml-2 text-blue-400">(Loading...)</span>}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors"
            title={`Switch to ${viewMode === 'grid' ? 'list' : 'grid'} view`}
          >
            {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 border rounded-lg transition-colors ${showFilters
              ? 'bg-blue-600 border-blue-500 text-white'
              : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'
              }`}
          >
            <Filter className="w-5 h-5" />
          </button>
          <button
            onClick={loadCredentials}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Refresh
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4 mb-8">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search credentials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gray-800 border border-gray-700 rounded-lg p-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'name' | 'date' | 'category')}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="name">Name</option>
                    <option value="date">Date Created</option>
                    <option value="category">Category</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('');
                      setSortBy('name');
                    }}
                    className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Credentials Grid/List */}
      {filteredCredentials.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No credentials found</h3>
          <p className="text-gray-400 mb-6">
            {searchTerm || selectedCategory
              ? 'Try adjusting your search or filters'
              : 'Start by adding your first credential'
            }
          </p>
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors inline-flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Credential
          </button>
        </div>
      ) : (
        <div className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }>
          <AnimatePresence>
            {filteredCredentials.map((credential) => (
              <CredentialCard
                key={credential.id}
                credential={credential}
                viewMode={viewMode}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Vault;