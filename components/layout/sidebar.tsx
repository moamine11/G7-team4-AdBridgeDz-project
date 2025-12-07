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

  const handleLogout = () => {
    console.log('Logging out...')
    window.location.href = '/login'
  }

  const isActive = (href: string) => pathname === href

  return (
    <div className="w-64 bg-slate-900/50 backdrop-blur-sm border-r border-white/10 min-h-screen flex flex-col">
      {/* Agency Info */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center">
            <span className="text-white font-bold text-lg">CS</span>
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">Creative Solutions Inc.</h3>
            <p className="text-xs text-slate-400">Agency Panel</p>
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
                    ? 'bg-gradient-to-r from-blue-500/20 to-teal-500/20 border border-blue-500/30'
                    : 'text-slate-400 hover:bg-white/5'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                <div className="flex-1">
                  <div className={`font-medium text-sm ${active ? 'text-white' : 'text-slate-300'}`}>
                    {item.label}
                  </div>
                  {item.subLabel && (
                    <div className="text-xs text-slate-500">{item.subLabel}</div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-white/10 space-y-1">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-white/5 hover:text-slate-300 transition-all duration-200"
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium text-sm">Settings</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Log out</span>
        </button>
      </div>
    </div>
  )
}