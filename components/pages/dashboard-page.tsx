'use client'

import { Sidebar } from '@/components/ui/sidebar'
import Navbar from '@/components/ui/navbar'
import { Building2, Calendar, Clock, CheckCircle2 } from 'lucide-react'

export default function DashboardPage() {
  const stats = [
    {
      icon: Building2,
      label: 'Total Advertising Spaces',
      value: '48',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      icon: Calendar,
      label: 'Total Booking Requests',
      value: '256',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      icon: Clock,
      label: 'Requests In Progress',
      value: '12',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600'
    },
    {
      icon: CheckCircle2,
      label: 'Completed Bookings',
      value: '198',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
  ]

  const recentBookings = [
    { advertiser: 'Innovate Corp', space: 'Downtown Billboard', status: 'Completed', date: 'Oct 12, 2024', statusColor: 'bg-green-100 text-green-700' },
    { advertiser: 'Market Pro', space: 'City Center Display', status: 'In Progress', date: 'Oct 15, 2024', statusColor: 'bg-yellow-100 text-yellow-700' },
    { advertiser: 'Brandify', space: 'Central Station Ad', status: 'Completed', date: 'Oct 08, 2024', statusColor: 'bg-green-100 text-green-700' },
    { advertiser: 'Future Ads', space: 'Mall Entrance Screen', status: 'Canceled', date: 'Oct 05, 2024', statusColor: 'bg-red-100 text-red-700' },
    { advertiser: 'Tech Solutions', space: 'Airport Digital Board', status: 'In Progress', date: 'Oct 18, 2024', statusColor: 'bg-yellow-100 text-yellow-700' },
  ]

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Navbar />
        
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                      <div className={`${stat.bgColor} p-3 rounded-lg`}>
                        <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Booking Requests */}
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Recent Booking Requests</h2>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Advertiser Name</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Space Title</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBookings.map((booking, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4 text-sm text-gray-900">{booking.advertiser}</td>
                          <td className="py-4 px-4 text-sm text-gray-600">{booking.space}</td>
                          <td className="py-4 px-4">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${booking.statusColor}`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-600">{booking.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Booking Trends & Request Status */}
              <div className="space-y-6">
                {/* Booking Trends */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Booking Trends</h2>
                  <div className="h-48 flex items-end justify-between gap-2">
                    {[65, 75, 60, 80, 70, 85, 90, 95].map((height, index) => (
                      <div key={index} className="flex-1 bg-gradient-to-t from-teal-500 to-teal-400 rounded-t-lg transition-all hover:from-teal-600 hover:to-teal-500" 
                           style={{ height: `${height}%` }}>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Request Status */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Request Status</h2>
                  <div className="flex items-center justify-center mb-6">
                    <div className="relative w-40 h-40">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="12"/>
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="12" 
                                strokeDasharray="163" strokeDashoffset="0" 
                                transform="rotate(-90 50 50)"/>
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#eab308" strokeWidth="12" 
                                strokeDasharray="63" strokeDashoffset="-163" 
                                transform="rotate(-90 50 50)"/>
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#ef4444" strokeWidth="12" 
                                strokeDasharray="25" strokeDashoffset="-226" 
                                transform="rotate(-90 50 50)"/>
                      </svg>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Completed</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">65%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">In Progress</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">25%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Canceled</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">10%</span>
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