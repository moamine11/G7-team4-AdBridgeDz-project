'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Building2, Calendar, User, Settings, LogOut } from 'lucide-react'

export default function Sidebar() {
  const pathname = usePathname()

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      href: '/dashboard',
    },
    {
      icon: Building2,
      label: 'Manage Spaces',
      href: '/manage-spaces',
      subLabel: 'List, Add & Edit Ad Spaces'
    },
    {
      icon: Calendar,
      label: 'Booking Requests',
      href: '/booking-requests',
    },
    {
      icon: User,
      label: 'Agency Profile',
      href: '/profile-agency',
    },
  ]

  // Also update logout to redirect to login
  const handleLogout = () => {
    console.log('Logging out...')
    window.location.href = '/login'
  }

  const isActive = (href: string) => pathname === href

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      {/* Agency Info */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-100 to-blue-100 flex items-center justify-center">
            <span className="text-teal-600 font-bold text-lg">CS</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">Creative Solutions Inc.</h3>
            <p className="text-xs text-gray-500">Agency Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  active
                    ? 'bg-teal-50 text-teal-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-teal-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                <div className="flex-1">
                  <div className={`font-medium text-sm ${active ? 'text-teal-600' : 'text-gray-700'}`}>
                    {item.label}
                  </div>
                  {item.subLabel && (
                    <div className="text-xs text-gray-400">{item.subLabel}</div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-200 space-y-1">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-all duration-200"
        >
          <Settings className="w-5 h-5 text-gray-400" />
          <span className="font-medium text-sm">Settings</span>
        </Link>
        <button
          onClick={() => console.log('Logout')}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Log out</span>
        </button>
      </div>
    </div>
  )
}