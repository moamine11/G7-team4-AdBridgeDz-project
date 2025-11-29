'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Eye, Calendar } from 'lucide-react';

interface DashboardOverviewProps {
  agencyData: any;
}

const DashboardOverview = ({ agencyData }: DashboardOverviewProps) => {
  const [stats, setStats] = useState({
    totalPosts: 0,
    activeListings: 0,
    totalBookings: 0,
    revenue: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch posts count
      const postsRes = await fetch(`http://localhost:5000/api/agencies/posts/agency/${agencyData._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const postsData = await postsRes.json();
      
      setStats({
        totalPosts: postsData.posts?.length || 0,
        activeListings: postsData.posts?.filter((p: any) => p.isActive).length || 0,
        totalBookings: 0,
        revenue: 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const statCards = [
    {
      title: 'Total Listings',
      value: stats.totalPosts,
      icon: Eye,
      color: 'emerald',
      bgColor: 'bg-emerald-100',
      textColor: 'text-emerald-600',
    },
    {
      title: 'Active Listings',
      value: stats.activeListings,
      icon: TrendingUp,
      color: 'teal',
      bgColor: 'bg-teal-100',
      textColor: 'text-teal-600',
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: Calendar,
      color: 'cyan',
      bgColor: 'bg-cyan-100',
      textColor: 'text-cyan-600',
    },
    {
      title: 'Revenue',
      value: `$${stats.revenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {agencyData?.agencyName}!</h1>
        <p className="text-gray-600 mt-2">Here's what's happening with your ad spaces today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bgColor} p-3 rounded-xl`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium">{stat.title}</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-6 border-2 border-dashed border-emerald-200 rounded-xl hover:border-emerald-400 hover:bg-emerald-50 transition-all text-left group">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition-colors">
              <span className="text-2xl">📝</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Create New Post</h3>
            <p className="text-sm text-gray-600">Add a new ad space listing</p>
          </button>

          <button className="p-6 border-2 border-dashed border-teal-200 rounded-xl hover:border-teal-400 hover:bg-teal-50 transition-all text-left group">
            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-teal-200 transition-colors">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">View Analytics</h3>
            <p className="text-sm text-gray-600">Check your performance</p>
          </button>

          <button className="p-6 border-2 border-dashed border-cyan-200 rounded-xl hover:border-cyan-400 hover:bg-cyan-50 transition-all text-left group">
            <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-cyan-200 transition-colors">
              <span className="text-2xl">⚙️</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Update Profile</h3>
            <p className="text-sm text-gray-600">Manage your account settings</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;