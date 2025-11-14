'use client'

import { useState, useEffect } from 'react'
import { Sidebar, SidebarProvider } from '@/components/ui/sidebar'
import Navbar from '@/components/ui/navbar'
import { Building2, Calendar, Clock, CheckCircle2, DollarSign, Plus, User, ArrowUpRight, TrendingUp } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { bookingsService } from '@/lib/services/bookings-service'
import { postsService } from '@/lib/services/posts-service'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts'

// Mock data for charts if real data is scarce
const MOCK_REVENUE_DATA = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 2000 },
  { name: 'Apr', revenue: 2780 },
  { name: 'May', revenue: 1890 },
  { name: 'Jun', revenue: 2390 },
  { name: 'Jul', revenue: 3490 },
]

const COLORS = ['#10b981', '#eab308', '#ef4444', '#3b82f6']

export default function DashboardPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<any[]>([])
  const [recentBookings, setRecentBookings] = useState<any[]>([])
  const [statusData, setStatusData] = useState<any[]>([])
  const [topSpaces, setTopSpaces] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return

      try {
        let bookings = []
        let posts = []

        if (user.role === 'agency') {
          bookings = await bookingsService.getAgencyBookings()
          const postsResponse = await postsService.getAllPosts({ agencyId: user.id })
          posts = postsResponse.posts || []
        } else {
          bookings = await bookingsService.getCompanyBookings()
        }

        // Calculate stats
        const totalBookings = bookings.length
        const inProgress = bookings.filter((b: any) => b.status === 'pending' || b.status === 'in-progress').length
        const completed = bookings.filter((b: any) => b.status === 'completed' || b.status === 'approved').length
        const totalSpaces = posts.length
        
        // Mock revenue calculation (random price between 1000-5000 for completed bookings)
        const estimatedRevenue = completed * 2500 

        setStats([
          {
            icon: DollarSign,
            label: 'Total Revenue',
            value: `$${estimatedRevenue.toLocaleString()}`,
            bgColor: 'bg-emerald-500/10',
            iconColor: 'text-emerald-500',
            trend: '+12.5%',
            trendUp: true
          },
          {
            icon: Building2,
            label: 'Total Spaces',
            value: totalSpaces.toString(),
            bgColor: 'bg-blue-500/10',
            iconColor: 'text-blue-500',
            trend: '+4',
            trendUp: true
          },
          {
            icon: Calendar,
            label: 'Active Requests',
            value: inProgress.toString(),
            bgColor: 'bg-purple-500/10',
            iconColor: 'text-purple-500',
            trend: '-2',
            trendUp: false
          },
          {
            icon: CheckCircle2,
            label: 'Completed Jobs',
            value: completed.toString(),
            bgColor: 'bg-orange-500/10',
            iconColor: 'text-orange-500',
            trend: '+8%',
            trendUp: true
          },
        ])

        // Format recent bookings
        const formattedBookings = bookings.slice(0, 5).map((booking: any) => ({
          id: booking.id,
          advertiser: booking.company?.name || 'Unknown Company',
          space: booking.post?.title || 'Unknown Space',
          status: booking.status,
          date: new Date(booking.createdAt).toLocaleDateString(),
          amount: `$${(Math.floor(Math.random() * 40) + 10) * 100}` // Mock amount
        }))
        setRecentBookings(formattedBookings)

        // Prepare Chart Data
        const statusCounts = {
          completed: bookings.filter((b: any) => b.status === 'completed' || b.status === 'approved').length,
          pending: bookings.filter((b: any) => b.status === 'pending' || b.status === 'in-progress').length,
          cancelled: bookings.filter((b: any) => b.status === 'cancelled' || b.status === 'rejected').length,
        }
        
        setStatusData([
          { name: 'Completed', value: statusCounts.completed },
          { name: 'Pending', value: statusCounts.pending },
          { name: 'Cancelled', value: statusCounts.cancelled },
        ])

        // Mock Top Spaces
        setTopSpaces(posts.slice(0, 3).map((post: any) => ({
          name: post.title,
          views: Math.floor(Math.random() * 5000) + 1000,
          bookings: Math.floor(Math.random() * 20) + 1
        })))

      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
        toast({
          title: "Error",
          description: "Failed to load dashboard data.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user, toast])

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen bg-slate-950">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Navbar />
            <main className="flex-1 p-8 flex justify-center items-center">
              <span className="loading loading-spinner loading-lg text-blue-500"></span>
            </main>
          </div>
        </div>
      </SidebarProvider>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-slate-950 text-slate-50">
        <Sidebar />
        
        <div className="flex-1 flex flex-col">
          <Navbar />
          
          <main className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto space-y-8">
              {/* Page Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                  <p className="text-slate-400 mt-1">Welcome back, here&apos;s what&apos;s happening with your agency.</p>
                </div>
                <div className="flex items-center gap-3">
                  <Link href="/dashboard/services/add">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                      <Plus className="w-4 h-4" />
                      Add New Space
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                  const Icon = stat.icon
                  return (
                    <div key={index} className="bg-white/5 rounded-xl border border-white/10 p-6 hover:border-blue-500/50 transition-all duration-300 group">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                          <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                        </div>
                        {stat.trend && (
                          <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                            stat.trendUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                          }`}>
                            {stat.trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingUp className="w-3 h-3 rotate-180" />}
                            {stat.trend}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-slate-400 mb-1">{stat.label}</p>
                        <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">{stat.value}</h3>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Revenue Chart */}
                  <div className="bg-white/5 rounded-xl border border-white/10 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-lg font-bold text-white">Revenue Overview</h2>
                        <p className="text-sm text-slate-400">Monthly revenue performance</p>
                      </div>
                      <select className="bg-slate-900 border border-white/10 text-slate-300 text-sm rounded-lg px-3 py-2 outline-none focus:border-blue-500">
                        <option>Last 6 Months</option>
                        <option>Last Year</option>
                      </select>
                    </div>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={MOCK_REVENUE_DATA}>
                          <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                          <XAxis 
                            dataKey="name" 
                            stroke="#64748b" 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false}
                          />
                          <YAxis 
                            stroke="#64748b" 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false}
                            tickFormatter={(value) => `$${value}`}
                          />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                            itemStyle={{ color: '#f8fafc' }}
                            formatter={(value) => [`$${value}`, 'Revenue']}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="revenue" 
                            stroke="#3b82f6" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorRevenue)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Recent Bookings Table */}
                  <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                    <div className="p-6 border-b border-white/10 flex items-center justify-between">
                      <h2 className="text-lg font-bold text-white">Recent Bookings</h2>
                      <Link href="/dashboard/bookings" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
                        View All <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-white/5">
                            <th className="text-left py-3 px-6 text-xs font-semibold text-slate-400 uppercase">Advertiser</th>
                            <th className="text-left py-3 px-6 text-xs font-semibold text-slate-400 uppercase">Space</th>
                            <th className="text-left py-3 px-6 text-xs font-semibold text-slate-400 uppercase">Amount</th>
                            <th className="text-left py-3 px-6 text-xs font-semibold text-slate-400 uppercase">Status</th>
                            <th className="text-left py-3 px-6 text-xs font-semibold text-slate-400 uppercase">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentBookings.length > 0 ? (
                            recentBookings.map((booking, index) => (
                              <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                <td className="py-4 px-6 text-sm font-medium text-white">{booking.advertiser}</td>
                                <td className="py-4 px-6 text-sm text-slate-400">{booking.space}</td>
                                <td className="py-4 px-6 text-sm text-white font-medium">{booking.amount}</td>
                                <td className="py-4 px-6">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                    booking.status === 'approved' || booking.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                    booking.status === 'pending' || booking.status === 'in-progress' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                    'bg-red-500/10 text-red-400 border-red-500/20'
                                  }`}>
                                    {booking.status}
                                  </span>
                                </td>
                                <td className="py-4 px-6 text-sm text-slate-400">{booking.date}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={5} className="py-8 text-center text-slate-500">
                                No recent bookings found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  
                  {/* Quick Actions */}
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg shadow-blue-900/20">
                    <h2 className="text-lg font-bold mb-2">Quick Actions</h2>
                    <p className="text-blue-100 text-sm mb-6">Manage your agency efficiently with these shortcuts.</p>
                    <div className="space-y-3">
                      <Link href="/dashboard/services/add" className="block">
                        <button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors">
                          <div className="bg-white/20 p-2 rounded-md">
                            <Plus className="w-4 h-4" />
                          </div>
                          <span className="font-medium">Add New Space</span>
                        </button>
                      </Link>
                      <Link href="/dashboard/profile" className="block">
                        <button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors">
                          <div className="bg-white/20 p-2 rounded-md">
                            <User className="w-4 h-4" />
                          </div>
                          <span className="font-medium">Edit Profile</span>
                        </button>
                      </Link>
                      <Link href="/dashboard/bookings" className="block">
                        <button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors">
                          <div className="bg-white/20 p-2 rounded-md">
                            <Calendar className="w-4 h-4" />
                          </div>
                          <span className="font-medium">View Calendar</span>
                        </button>
                      </Link>
                    </div>
                  </div>

                  {/* Request Status Chart */}
                  <div className="bg-white/5 rounded-xl border border-white/10 p-6">
                    <h2 className="text-lg font-bold text-white mb-4">Request Status</h2>
                    <div className="h-[200px] w-full relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={statusData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {statusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                            itemStyle={{ color: '#f8fafc' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      {/* Center Text */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center">
                          <span className="block text-2xl font-bold text-white">
                            {statusData.reduce((acc, curr) => acc + curr.value, 0)}
                          </span>
                          <span className="text-xs text-slate-400">Total</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      {statusData.map((entry, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                            <span className="text-slate-300">{entry.name}</span>
                          </div>
                          <span className="font-medium text-white">{entry.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Performing Spaces */}
                  <div className="bg-white/5 rounded-xl border border-white/10 p-6">
                    <h2 className="text-lg font-bold text-white mb-4">Top Spaces</h2>
                    <div className="space-y-4">
                      {topSpaces.length > 0 ? (
                        topSpaces.map((space, index) => (
                          <div key={index} className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 font-bold border border-white/10">
                              {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-white truncate">{space.name}</h4>
                              <p className="text-xs text-slate-400">{space.bookings} bookings • {space.views} views</p>
                            </div>
                            <div className="text-emerald-400 text-xs font-medium bg-emerald-500/10 px-2 py-1 rounded">
                              Top
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-slate-500 text-center py-4">No spaces data available</p>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
