'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Sidebar } from '@/components/ui/sidebar'
import Navbar from '@/components/ui/navbar'
import { Plus, MoreVertical } from 'lucide-react'

export default function ManageSpacesPage() {
  const [showMenu, setShowMenu] = useState<number | null>(null)

  const adSpaces = [
    {
      id: 1,
      image: '/billboard1.jpg',
      title: 'Downtown Billboard - Main St.',
      description: 'High-traffic location in the city center. Perfect for brand awareness campaigns.',
      status: 'Available',
      statusColor: 'bg-green-100 text-green-700',
      price: '$2,500',
      period: '/ mo'
    },
    {
      id: 2,
      image: '/digital-screen.jpg',
      title: 'City Center Digital Screen',
      description: 'Modern digital screen with high visibility, ideal for dynamic video ads.',
      status: 'Booked',
      statusColor: 'bg-yellow-100 text-yellow-700',
      price: '$5,000',
      period: '/ mo'
    },
    {
      id: 3,
      image: '/bus-shelter.jpg',
      title: 'Bus Stop Shelter - 5th Ave',
      description: 'Targets commuters and pedestrians on a busy avenue. Cost-effective option.',
      status: 'Available',
      statusColor: 'bg-green-100 text-green-700',
      price: '$500',
      period: '/ mo'
    },
  ]

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Navbar />
        
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <nav className="text-sm text-gray-500 mb-2">
                  <Link href="/dashboard" className="hover:text-gray-700">Dashboard</Link>
                  <span className="mx-2">/</span>
                  <span className="text-gray-900 font-medium">Manage Ad Spaces</span>
                </nav>
                <h1 className="text-3xl font-bold text-gray-900">Manage Your Ad Spaces</h1>
              </div>
              <Link
                href="/add-space"
                className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30 transition-all duration-200"
              >
                <Plus className="w-5 h-5" />
                Add New Space
              </Link>
            </div>

            {/* Ad Spaces Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {adSpaces.map((space) => (
                <div key={space.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Image */}
                  <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                    <img
                      src={space.image}
                      alt={space.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23e5e7eb" width="400" height="300"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="18" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EAd Space%3C/text%3E%3C/svg%3E'
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{space.title}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{space.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${space.statusColor}`}>
                        {space.status}
                      </span>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-gray-900">{space.price}</span>
                        <span className="text-sm text-gray-500"> {space.period}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                      <Link
                        href={`/edit-space/${space.id}`}
                        className="flex-1 text-center px-4 py-2 text-sm font-medium text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => console.log('Delete', space.id)}
                        className="flex-1 text-center px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}