'use client'

import { useState } from 'react'
import Link from 'next/link'
import Sidebar from '@/components/layout/sidebar'
import Navbar from '@/components/layout/navbar'
import { MoreVertical } from 'lucide-react'

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
        statusColor: 'bg-yellow-100 text-yellow-700'
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
        statusColor: 'bg-green-100 text-green-700'
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
        statusColor: 'bg-red-100 text-red-700'
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
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Navbar />
        
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb */}
            <nav className="text-sm text-gray-500 mb-2">
              <Link href="/dashboard" className="hover:text-gray-700">Dashboard</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900 font-medium">Booking Requests</span>
            </nav>

            {/* Page Header */}
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Booking Requests</h1>

            {/* Tabs */}
            <div className="flex gap-6 border-b border-gray-200 mb-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`pb-4 px-2 font-medium text-sm transition-colors relative ${
                    activeTab === tab.id
                      ? 'text-teal-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                      activeTab === tab.id
                        ? 'bg-teal-100 text-teal-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Booking Cards */}
            <div className="space-y-4">
              {currentBookings.map((booking) => (
                <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    {/* Company Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-6">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-1">{booking.company}</h3>
                          <p className="text-sm text-gray-500 mb-4">{booking.email}</p>
                        </div>

                        {/* Space Details */}
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-gray-500 mb-1 font-medium">Space Title</p>
                          <p className="text-sm text-gray-900 font-semibold mb-4">{booking.spaceTitle}</p>
                        </div>

                        {/* Dates */}
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-gray-500 mb-1 font-medium">Dates</p>
                          <p className="text-sm text-gray-900 font-semibold mb-4">{booking.dates}</p>
                        </div>

                        {/* Price/Offer */}
                        <div className="min-w-0">
                          <p className="text-xs text-gray-500 mb-1 font-medium">
                            {activeTab === 'in-progress' ? 'Proposed Offer' : 'Price'}
                          </p>
                          <p className="text-sm text-gray-900 font-semibold mb-4">
                            {booking.offer || booking.price}
                          </p>
                        </div>

                        {/* Status */}
                        <div className="flex items-center gap-3">
                          <span className={`inline-block px-4 py-2 rounded-lg text-sm font-medium ${booking.statusColor}`}>
                            {booking.status}
                          </span>
                          
                          <div className="relative">
                            <button
                              onClick={() => setShowMenu(showMenu === booking.id ? null : booking.id)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <MoreVertical className="w-5 h-5 text-gray-400" />
                            </button>
                            
                            {showMenu === booking.id && (
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                  View Details
                                </button>
                                {activeTab === 'in-progress' && (
                                  <>
                                    <button className="w-full text-left px-4 py-2 text-sm text-teal-600 hover:bg-teal-50">
                                      Accept Request
                                    </button>
                                    <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                      Decline Request
                                    </button>
                                  </>
                                )}
                                {activeTab === 'completed' && (
                                  <button className="w-full text-left px-4 py-2 text-sm text-teal-600 hover:bg-teal-50">
                                    View
                                  </button>
                                )}
                                {activeTab === 'canceled' && (
                                  <button className="w-full text-left px-4 py-2 text-sm text-teal-600 hover:bg-teal-50">
                                    View
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {currentBookings.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No {activeTab.replace('-', ' ')} bookings found.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}