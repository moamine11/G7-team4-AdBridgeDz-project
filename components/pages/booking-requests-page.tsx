'use client'

import { useState } from 'react'
import Link from 'next/link'
import Sidebar from '@/components/layout/sidebar'
import Navbar from '@/components/ui/navbar'
import { MoreVertical, Check, X, Eye } from 'lucide-react'

type TabType = 'in-progress' | 'completed' | 'canceled'

export default function BookingRequestsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('in-progress')
  const [showMenu, setShowMenu] = useState<number | null>(null)

  const bookings = {
    'in-progress': [
      {
        id: 1,
        company: 'Company XYZ',
        email: 'contact@companyxyz.com',
        spaceTitle: 'Downtown Billboard - Main St.',
        dates: 'Oct 15 - Nov 15, 2024',
        offer: '$2,500 / mo',
        status: 'In Progress',
        statusColor: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
      }
    ],
    'completed': [
      {
        id: 2,
        company: 'Retail Giant',
        email: 'ads@retailgiant.com',
        spaceTitle: 'City Center Digital Screen',
        dates: 'Sep 01 - Sep 30, 2024',
        price: '$5,000 / mo',
        status: 'Completed',
        statusColor: 'bg-green-500/10 text-green-400 border-green-500/20'
      }
    ],
    'canceled': [
      {
        id: 3,
        company: 'Local Cafe',
        email: 'info@localcafe.net',
        spaceTitle: 'Bus Stop Shelter - 5th Ave',
        dates: 'Oct 20 - Nov 20, 2024',
        price: '$500 / mo',
        status: 'Canceled',
        statusColor: 'bg-red-500/10 text-red-400 border-red-500/20'
      }
    ]
  }

  const tabs = [
    { id: 'in-progress', label: 'In Progress', count: bookings['in-progress'].length },
    { id: 'completed', label: 'Completed', count: bookings['completed'].length },
    { id: 'canceled', label: 'Canceled', count: bookings['canceled'].length },
  ]

  const currentBookings = bookings[activeTab]

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Navbar />
        
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Booking Requests</h1>
              <p className="text-slate-400">Manage incoming requests for your advertising spaces</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-6 border-b border-white/10 mb-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`pb-4 px-2 font-medium text-sm transition-colors relative ${
                    activeTab === tab.id
                      ? 'text-blue-400'
                      : 'text-slate-400 hover:text-slate-300'
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                      activeTab === tab.id
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-teal-500"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Booking Cards */}
            <div className="space-y-4">
              {currentBookings.map((booking) => (
                <div key={booking.id} className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all">
                  <div className="flex items-start justify-between">
                    {/* Content Grid */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-6">
                      {/* Company Info */}
                      <div className="md:col-span-2">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg">
                            {booking.company.charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-white">{booking.company}</h3>
                            <p className="text-xs text-slate-400">{booking.email}</p>
                          </div>
                        </div>
                      </div>

                      {/* Space Details */}
                      <div className="md:col-span-1">
                        <p className="text-xs text-slate-500 mb-1 font-medium uppercase tracking-wide">Space Title</p>
                        <p className="text-sm text-white font-semibold">{booking.spaceTitle}</p>
                      </div>

                      {/* Dates */}
                      <div>
                        <p className="text-xs text-slate-500 mb-1 font-medium uppercase tracking-wide">Dates</p>
                        <p className="text-sm text-white font-semibold">{booking.dates}</p>
                      </div>

                      {/* Price/Offer */}
                      <div>
                        <p className="text-xs text-slate-500 mb-1 font-medium uppercase tracking-wide">
                          {activeTab === 'in-progress' ? 'Proposed Offer' : 'Price'}
                        </p>
                        <p className="text-sm text-white font-semibold">
                          {booking.offer || booking.price}
                        </p>
                      </div>
                    </div>

                    {/* Status & Actions */}
                    <div className="flex items-center gap-3 ml-6">
                      <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${booking.statusColor}`}>
                        {booking.status}
                      </span>
                      
                      <div className="relative">
                        <button
                          onClick={() => setShowMenu(showMenu === booking.id ? null : booking.id)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-5 h-5 text-slate-400" />
                        </button>
                        
                        {showMenu === booking.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-white/10 rounded-xl shadow-xl py-2 z-10">
                            <button className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-white/10 flex items-center gap-2">
                              <Eye className="w-4 h-4" />
                              View Details
                            </button>
                            {activeTab === 'in-progress' && (
                              <>
                                <button className="w-full text-left px-4 py-2 text-sm text-green-400 hover:bg-green-500/10 flex items-center gap-2">
                                  <Check className="w-4 h-4" />
                                  Accept Request
                                </button>
                                <button className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2">
                                  <X className="w-4 h-4" />
                                  Decline Request
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions for In Progress */}
                  {activeTab === 'in-progress' && (
                    <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/10">
                      <button className="flex-1 px-4 py-2.5 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 font-medium text-sm transition-colors flex items-center justify-center gap-2">
                        <Check className="w-4 h-4" />
                        Accept
                      </button>
                      <button className="flex-1 px-4 py-2.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-medium text-sm transition-colors flex items-center justify-center gap-2">
                        <X className="w-4 h-4" />
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {currentBookings.length === 0 && (
                <div className="text-center py-16 bg-slate-900/30 rounded-2xl border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-2">No {activeTab.replace('-', ' ')} bookings</h3>
                  <p className="text-slate-400">You don't have any {activeTab.replace('-', ' ')} booking requests at the moment.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}