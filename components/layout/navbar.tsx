'use client'

import Link from 'next/link'
import { Bell } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-2">
        <span className="text-2xl font-bold">
          <span className="text-gray-900">Ad</span>
          <span className="text-teal-500">Bridge</span>
          <span className="text-gray-900">Dz</span>
        </span>
      </Link>

      {/* Right Side */}
      <div className="flex items-center gap-6">
        <Link href="/how-it-works" className="text-gray-600 hover:text-gray-900 font-medium text-sm">
          How it works
        </Link>
        <Link href="/contact" className="text-gray-600 hover:text-gray-900 font-medium text-sm">
          Contact
        </Link>
        
        {/* Notification Bell */}
        <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Avatar - Links to Profile */}
        <Link href="/profile-agency" className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-100 to-blue-100 flex items-center justify-center cursor-pointer hover:shadow-md transition-shadow">
          <span className="text-teal-600 font-semibold text-sm">CS</span>
        </Link>
      </div>
    </nav>
  )
}