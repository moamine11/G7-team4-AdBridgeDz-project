'use client'

import { useState } from 'react'
import Link from 'next/link'
import Sidebar from '@/components/layout/sidebar'
import Navbar from '@/components/ui/navbar'
import { Plus, Edit, Trash2, Building2 } from 'lucide-react'

export default function ManageSpacesPage() {
  const adSpaces = [
    {
      id: 1,
      image: '/billboard1.jpg',
      title: 'Downtown Billboard - Main St.',
      description: 'High-traffic location in the city center. Perfect for brand awareness campaigns.',
      status: 'Available',
      statusColor: 'bg-green-500/10 text-green-400 border-green-500/20',
      price: '$2,500',
      period: '/ mo',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      id: 2,
      image: '/digital-screen.jpg',
      title: 'City Center Digital Screen',
      description: 'Modern digital screen with high visibility, ideal for dynamic video ads.',
      status: 'Booked',
      statusColor: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      price: '$5,000',
      period: '/ mo',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      id: 3,
      image: '/bus-shelter.jpg',
      title: 'Bus Stop Shelter - 5th Ave',
      description: 'Targets commuters and pedestrians on a busy avenue. Cost-effective option.',
      status: 'Available',
      statusColor: 'bg-green-500/10 text-green-400 border-green-500/20',
      price: '$500',
      period: '/ mo',
      gradient: 'from-teal-500 to-emerald-500'
    },
  ]

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Manage Your Ad Spaces</h1>
                <p className="text-slate-400">View and manage all your advertising locations</p>
              </div>
              <Link
                href="/add-space"
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 text-white font-semibold hover:from-blue-600 hover:to-teal-600 shadow-lg hover:shadow-xl transition-all"
              >
                <Plus className="w-5 h-5" />
                Add New Space
              </Link>
            </div>

            {/* Ad Spaces Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {adSpaces.map((space) => (
                <div key={space.id} className="relative group">
                  {/* Glow effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${space.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 rounded-2xl`} />
                  
                  <div className="relative bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all">
                    {/* Image */}
                    <div className="relative h-48 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-blue-500/20 to-teal-500/20 rounded-full flex items-center justify-center">
                          <Building2 className="w-8 h-8 text-blue-400" />
                        </div>
                        <p className="text-slate-500 text-sm">Ad Space Image</p>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-white mb-2">{space.title}</h3>
                      <p className="text-sm text-slate-400 mb-4 line-clamp-2">{space.description}</p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${space.statusColor}`}>
                          {space.status}
                        </span>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-white">{space.price}</span>
                          <span className="text-sm text-slate-400">{space.period}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                        <Link
                          href={`/edit-space/${space.id}`}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </Link>
                        <button
                          onClick={() => console.log('Delete', space.id)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
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