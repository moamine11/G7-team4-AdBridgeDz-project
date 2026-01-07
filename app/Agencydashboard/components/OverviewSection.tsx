'use client';

import { useState, useEffect } from 'react';
import {
    TrendingUp,
    DollarSign,
    Eye,
    Calendar,
    Loader2,
    List,
    ClipboardCheck,
    BarChart3,
    MapPin,
    Clock,
    ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OverviewSectionProps {
    agencyData: any;
}

const API_BASE_URL = 'https://backend-se-7rkj.onrender.com/api';

const OverviewSection = ({ agencyData }: OverviewSectionProps) => {
    const [stats, setStats] = useState({
        totalPosts: 0,
        activeListings: 0,
        pendingBookings: 0,
        totalBookings: 0,
        totalRevenue: 0,
        bookedPlacements: 0,
        topPlacement: null as any,
        recentBookings: [] as any[],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, [agencyData]);

    const fetchStats = async () => {
        if (!agencyData?._id) return;
        setLoading(true);
        const token = localStorage.getItem('token');

        try {
            // 1. Fetch posts
            const postsRes = await fetch(`${API_BASE_URL}/agencies/posts/agency/${agencyData._id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const postsData = await postsRes.json();
            const posts = postsData.posts || [];

            // 2. Fetch bookings
            const bookingsRes = await fetch(`${API_BASE_URL}/agencies/bookings`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const bookingsData = await bookingsRes.json();
            const bookings = bookingsData || [];

            // Compute derived stats
            const activePosts = posts.filter((p: any) => p.isActive);
            const confirmedBookings = bookings.filter((b: any) => b.status === 'Accepted' || b.status === 'Completed');
            
            // Revenue: calculate estimated price based on price range and duration
            const totalRevenue = confirmedBookings.reduce((sum: number, b: any) => {
                const priceStr = b.post?.priceRange || '0 - 0';
                
                // Extracting numbers from the range string
                const [minStr, maxStr] = priceStr.split('-').map((s: string) => s.trim().replace(/[^0-9.]/g, ''));
                const min = parseFloat(minStr) || 0;
                const max = parseFloat(maxStr) || 0;
                const avgPrice = (min + max) / 2;

                // Calculate duration (days)
                const durationDays = Math.max(1, Math.ceil((new Date(b.endDate).getTime() - new Date(b.startDate).getTime()) / (1000 * 60 * 60 * 24)));
                
                return sum + avgPrice * durationDays;
            }, 0);

            // Booked placements = unique posts with confirmed bookings
            const bookedPostIds = new Set(confirmedBookings.map((b: any) => b.post?._id).filter((id: any) => id));
            const bookedPlacements = bookedPostIds.size;

            // Top placement: most booked
            const postBookingCount = posts.map((post: any) => ({
                ...post,
                bookingCount: confirmedBookings.filter((b: any) => b.post?._id === post._id).length,
            }));
            const topPlacement = postBookingCount.sort((a: { bookingCount: number; }, b: { bookingCount: number; }) => b.bookingCount - a.bookingCount)[0] || null;

            // Recent bookings (last 3, includes pending for quick review)
            const recentBookings = [...bookings]
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 3);

            setStats({
                totalPosts: posts.length,
                activeListings: activePosts.length,
                pendingBookings: bookings.filter((b: any) => b.status === 'Pending').length,
                totalBookings: bookings.length,
                totalRevenue,
                bookedPlacements,
                topPlacement,
                recentBookings,
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    // Utilization rate: % of active placements that have at least 1 confirmed booking
    const utilizationRate = stats.activeListings
        ? Math.round((stats.bookedPlacements / stats.activeListings) * 100)
        : 0;

    const statCards = [
        {
            title: 'Total Placements',
            value: stats.totalPosts,
            icon: Eye,
            iconBg: 'bg-cyan-900/50',
            iconText: 'text-cyan-400',
        },
        {
            title: 'Active Listings',
            value: stats.activeListings,
            icon: TrendingUp,
            iconBg: 'bg-teal-900/50',
            iconText: 'text-teal-400',
        },
        {
            title: 'Pending Requests',
            value: stats.pendingBookings,
            icon: Calendar,
            iconBg: 'bg-yellow-900/50',
            iconText: 'text-yellow-400',
        },
        {
            title: 'Total Bookings',
            value: stats.totalBookings,
            icon: List,
            iconBg: 'bg-blue-900/50',
            iconText: 'text-blue-400',
        },
        {
            title: 'Est. Revenue (DA)',
            value: `د.ج ${Math.round(stats.totalRevenue).toLocaleString()}`,
            icon: DollarSign,
            iconBg: 'bg-green-900/50',
            iconText: 'text-green-400',
        },
        {
            title: 'Utilization Rate',
            value: `${utilizationRate}%`,
            icon: BarChart3,
            iconBg: 'bg-purple-900/50',
            iconText: 'text-purple-400',
        },
    ];

    return (
        <div className="p-0">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-white">Dashboard Overview</h1>
                <p className="text-gray-400 mt-2">
                    Manage your inventory, track bookings, and optimize performance.
                </p>
            </div>

            {/* Stats Grid */}
            {loading ? (
                <div className="text-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-cyan-400" />
                </div>
            ) : (
                <>
                    {/* STATS CARDS: Using smaller cards and more columns for density */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
                        {statCards.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <div
                                    key={index}
                                    className="bg-slate-900 rounded-xl p-4 shadow-xl border border-slate-700 hover:border-cyan-600 transition-all"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className={`${stat.iconBg} p-2 rounded-lg border border-slate-700`}>
                                            <Icon className={`w-5 h-5 ${stat.iconText}`} />
                                        </div>
                                    </div>
                                    <h3 className="text-gray-400 text-xs font-medium uppercase truncate">{stat.title}</h3>
                                    <p className="text-xl font-extrabold text-white mt-1">{stat.value}</p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Pending Actions, Top Placement, Inventory Status */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        
                        {/* Quick Access / Pending Actions */}
                        <div className="bg-slate-900 rounded-xl p-6 shadow-xl border border-slate-700 lg:col-span-1">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-white">Pending Actions</h2>
                            </div>
                            {stats.pendingBookings > 0 ? (
                                <div className="flex justify-between items-center p-4 bg-yellow-900/30 border border-yellow-700 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <ClipboardCheck className="w-5 h-5 text-yellow-400" />
                                        <p className="text-sm text-white font-medium">
                                            **{stats.pendingBookings}** requests pending review.
                                        </p>
                                    </div>
                                    <Button 
                                        variant="outline"
                                        className="bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-300 rounded-lg border-yellow-600"
                                        onClick={() => {}} // Should navigate to Bookings tab
                                    >
                                        Review
                                    </Button>
                                </div>
                            ) : (
                                <p className="text-gray-500 italic text-center py-4">
                                    <ClipboardCheck className="w-5 h-5 inline mr-1 text-teal-400" /> All clear!
                                </p>
                            )}
                        </div>
                        
                        {/* Top Performing Placement */}
                        <div className="bg-slate-900 rounded-xl p-6 shadow-xl border border-slate-700 lg:col-span-1">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-white">Top Performing Placement</h2>
                                <MapPin className="w-5 h-5 text-cyan-400" />
                            </div>
                            {stats.topPlacement ? (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-cyan-300">
                                        {stats.topPlacement.title}
                                    </h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Total Bookings</span>
                                            <span className="text-white font-medium">{stats.topPlacement.bookingCount}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Category</span>
                                            <span className="text-white">{stats.topPlacement.category?.name || '—'}</span>
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="mt-4 w-full border-cyan-700 text-cyan-400 hover:bg-cyan-900/20"
                                    >
                                        View Details
                                    </Button>
                                </div>
                            ) : (
                                <p className="text-gray-500 italic text-center py-6">
                                    <Eye className='w-5 h-5 inline mr-1 text-cyan-400' /> Create a placement to track performance.
                                </p>
                            )}
                        </div>
                        
                        {/* Placement Status Distribution */}
                        <div className="bg-slate-900 rounded-xl p-6 shadow-xl border border-slate-700 lg:col-span-1">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-white">Inventory Status</h2>
                                <BarChart3 className="w-5 h-5 text-purple-400" />
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-teal-400">Active Listings</span>
                                        <span className="text-white font-medium">{stats.activeListings}</span>
                                    </div>
                                    <div className="w-full bg-slate-800 rounded-full h-2">
                                        <div
                                            className="bg-teal-500 h-2 rounded-full"
                                            style={{
                                                width: `${stats.totalPosts ? (stats.activeListings / stats.totalPosts) * 100 : 0}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-400">Inactive/Drafts</span>
                                        <span className="text-white font-medium">{stats.totalPosts - stats.activeListings}</span>
                                    </div>
                                    <div className="w-full bg-slate-800 rounded-full h-2">
                                        <div
                                            className="bg-gray-500 h-2 rounded-full"
                                            style={{
                                                width: `${
                                                    stats.totalPosts
                                                        ? ((stats.totalPosts - stats.activeListings) / stats.totalPosts) * 100
                                                        : 0
                                                }%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity (Full Width) */}
                    <div className="bg-slate-900 rounded-xl p-6 shadow-xl border border-slate-700 lg:col-span-3">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white">Recent Bookings</h2>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-cyan-400 hover:bg-cyan-900/20"
                                onClick={() => {}} // Should navigate to Bookings tab
                            >
                                View All <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </div>

                        {stats.recentBookings.length > 0 ? (
                            <div className="space-y-4">
                                {stats.recentBookings.map((booking: any) => (
                                    <div
                                        key={booking._id}
                                        className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700 hover:border-cyan-700/50 transition-shadow"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="bg-cyan-900/50 w-10 h-10 rounded-full flex items-center justify-center border border-cyan-700">
                                                <List className="w-5 h-5 text-cyan-400" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-white">
                                                    {booking.post?.title || 'Untitled Placement'}
                                                </h4>
                                                <p className="text-sm text-gray-400">
                                                    {booking.advertiser?.name || 'Unknown Company'} •{' '}
                                                    {new Date(booking.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium border ${
                                                    booking.status === 'Pending'
                                                        ? 'bg-yellow-900/50 text-yellow-300 border-yellow-700'
                                                        : booking.status === 'Accepted' || booking.status === 'Completed'
                                                        ? 'bg-green-900/50 text-green-300 border-green-700'
                                                        : 'bg-red-900/50 text-red-300 border-red-700'
                                                }`}
                                            >
                                                {booking.status}
                                            </span>
                                            <p className="text-sm text-gray-400 mt-1">
                                                <Clock className="w-3 h-3 inline mr-1" />
                                                {new Date(booking.startDate).toLocaleDateString()} –{' '}
                                                {new Date(booking.endDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 italic text-center py-6">
                                No recent activity. Create your first placement to get started!
                            </p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default OverviewSection;