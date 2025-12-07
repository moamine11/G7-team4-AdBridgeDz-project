'use client'

import Sidebar from '@/components/layout/sidebar'
import Navbar from '@/components/ui/navbar'
import { Building2, Calendar, Clock, CheckCircle2 } from 'lucide-react'

export default function DashboardPage() {
  const stats = [
    {
      icon: Building2,
      label: 'Total Advertising Spaces',
      value: '48',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Calendar,
      label: 'Total Booking Requests',
      value: '256',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Clock,
      label: 'Requests In Progress',
      value: '12',
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      icon: CheckCircle2,
      label: 'Completed Bookings',
      value: '198',
      gradient: 'from-green-500 to-emerald-500'
    },
  ]

  const recentBookings = [
    { advertiser: 'Innovate Corp', space: 'Downtown Billboard', status: 'Completed', date: 'Oct 12, 2024', statusColor: 'bg-green-500/10 text-green-400 border-green-500/20' },
    { advertiser: 'Market Pro', space: 'City Center Display', status: 'In Progress', date: 'Oct 15, 2024', statusColor: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
    { advertiser: 'Brandify', space: 'Central Station Ad', status: 'Completed', date: 'Oct 08, 2024', statusColor: 'bg-green-500/10 text-green-400 border-green-500/20' },
    { advertiser: 'Future Ads', space: 'Mall Entrance Screen', status: 'Canceled', date: 'Oct 05, 2024', statusColor: 'bg-red-500/10 text-red-400 border-red-500/20' },
    { advertiser: 'Tech Solutions', space: 'Airport Digital Board', status: 'In Progress', date: 'Oct 18, 2024', statusColor: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  ]

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
              <p className="text-slate-400">Welcome back! Here's your agency overview.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={index} className="relative group">
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500 rounded-2xl`} />
                    <div className="relative bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient}`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <p className="text-sm text-slate-400 mb-1">{stat.label}</p>
                      <p className="text-4xl font-bold text-white">{stat.value}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Booking Requests */}
              <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Recent Booking Requests</h2>
                  <button className="text-sm text-blue-400 hover:text-blue-300">View All</button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Advertiser</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Space</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Status</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBookings.map((booking, index) => (
                        <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-4 px-4 text-sm text-white font-medium">{booking.advertiser}</td>
                          <td className="py-4 px-4 text-sm text-slate-400">{booking.space}</td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${booking.statusColor}`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-sm text-slate-400">{booking.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Sidebar Stats */}
              <div className="space-y-6">
                {/* Booking Trends */}
                <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <h2 className="text-lg font-bold text-white mb-4">Booking Trends</h2>
                  <div className="h-48 flex items-end justify-between gap-2">
                    {[65, 75, 60, 80, 70, 85, 90, 95].map((height, index) => (
                      <div key={index} className="flex-1 bg-gradient-to-t from-teal-500 to-blue-500 rounded-t-lg transition-all hover:from-teal-400 hover:to-blue-400" 
                           style={{ height: `${height}%` }}>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Request Status */}
                <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <h2 className="text-lg font-bold text-white mb-4">Request Status</h2>
                  <div className="flex items-center justify-center mb-6">
                    <div className="relative w-40 h-40">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="80" cy="80" r="70" fill="none" stroke="rgb(30 41 59)" strokeWidth="12"/>
                        <circle cx="80" cy="80" r="70" fill="none" stroke="rgb(34 197 94)" strokeWidth="12" 
                                strokeDasharray="440" strokeDashoffset="154" className="transition-all"/>
                        <circle cx="80" cy="80" r="70" fill="none" stroke="rgb(234 179 8)" strokeWidth="12" 
                                strokeDasharray="440" strokeDashoffset="330" className="transition-all"/>
                        <circle cx="80" cy="80" r="70" fill="none" stroke="rgb(239 68 68)" strokeWidth="12" 
                                strokeDasharray="440" strokeDashoffset="396" className="transition-all"/>
                      </svg>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-slate-300">Completed</span>
                      </div>
                      <span className="text-sm font-semibold text-white">65%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm text-slate-300">In Progress</span>
                      </div>
                      <span className="text-sm font-semibold text-white">25%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm text-slate-300">Canceled</span>
                      </div>
                      <span className="text-sm font-semibold text-white">10%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}