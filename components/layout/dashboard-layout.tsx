'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Search,
  Bookmark,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Building2,
  Briefcase,
  Calendar,
  Star,
  MessageSquare,
  FileText,
  Users,
  Shield,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DashboardLayoutProps {
  children: React.ReactNode
  userType: 'company' | 'agency' | 'admin'
}

const companyNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/agencies', label: 'Search Agencies', icon: Search },
  { href: '/dashboard/bookings', label: 'My Bookings', icon: Calendar },
  { href: '/dashboard/saved', label: 'Saved Agencies', icon: Bookmark },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

const agencyNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/services', label: 'Services', icon: Briefcase },
  { href: '/dashboard/projects', label: 'Projects', icon: FileText },
  { href: '/dashboard/inquiries', label: 'Inquiries', icon: MessageSquare },
  { href: '/dashboard/reviews', label: 'Reviews', icon: Star },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

const adminNavItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/verifications', label: 'Verifications', icon: Shield },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/reports', label: 'Reports', icon: AlertCircle },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function DashboardLayout({ children, userType }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const navItems =
    userType === 'company'
      ? companyNavItems
      : userType === 'agency'
      ? agencyNavItems
      : adminNavItems

  const isActive = (href: string) => {
    if (href === '/dashboard' || href === '/admin/dashboard') {
      return pathname === href
    }
    return pathname?.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                <Building2 className="w-8 h-8 text-teal-600" />
                <span className="text-xl font-bold text-gray-900">AdBridgeDZ</span>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    isActive(item.href)
                      ? "bg-gradient-to-r from-teal-500 to-blue-500 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => {
                // Handle logout
                console.log('Logout')
              }}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-600 hover:text-gray-900"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="flex-1 lg:flex-none" />
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">John Doe</p>
                  <p className="text-xs text-gray-500">
                    {userType === 'company'
                      ? 'Company Account'
                      : userType === 'agency'
                      ? 'Agency Account'
                      : 'Admin Account'}
                  </p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  JD
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}

