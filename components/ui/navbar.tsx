"use client"

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/channels', label: 'Explore' },
    { href: '/dashboard/bookings', label: 'Bookings' },
    { href: '/profile-company', label: 'Profile' },
  ]

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    if (href.startsWith('/#')) {
      return pathname === '/' || pathname === ''
    }
    return pathname?.startsWith(href)
  }

  return (
    <header className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
      <nav
        className={cn(
          "relative flex items-center justify-between w-full max-w-5xl h-16 px-4 rounded-full transition-all duration-300",
          scrolled || open
            ? "bg-gradient-to-br from-blue-900/70 via-slate-900/80 to-blue-800/70 backdrop-blur-2xl border border-blue-200/20 shadow-2xl"
            : "bg-gradient-to-br from-blue-900/60 via-slate-900/70 to-blue-800/60 backdrop-blur-xl border border-blue-200/10 shadow-xl"
        )}
      >
        {/* Left: Navigation Links (Desktop) */}
        <div className="hidden md:flex items-center gap-6 flex-1 justify-start">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative text-sm font-medium transition-colors duration-200",
                isActive(link.href)
                  ? "text-blue-400 font-semibold"
                  : "text-slate-300 hover:text-white"
              )}
            >
              {link.label}
              {isActive(link.href) && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full" />
              )}
            </Link>
          ))}
        </div>

        {/* Center: Spacer (no logo) */}
        <div className="flex-1 flex justify-center"></div>

        {/* Right: Actions (Desktop) */}
        <div className="hidden md:flex items-center gap-3 flex-1 justify-end">
          <Link href="/login">
            <Button variant="ghost" className="rounded-full text-blue-400 hover:text-white hover:bg-blue-700/20 font-semibold px-5 py-2 transition-all duration-200">
              Login
            </Button>
          </Link>
          <Link href="/account-type">
            <Button className="rounded-full bg-gradient-to-r from-blue-600 via-teal-500 to-blue-400 hover:from-blue-700 hover:to-teal-600 text-white font-bold shadow-md hover:shadow-lg px-5 py-2 transition-all duration-200">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle (Absolute Right) */}
        <div className="md:hidden absolute right-4">
          <button
            onClick={() => setOpen(!open)}
            className="p-2 text-slate-300 hover:text-white focus:outline-none"
          >
            {open ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {open && (
        <div className="absolute top-24 left-4 right-4 bg-slate-900/95 backdrop-blur-xl rounded-3xl p-4 shadow-xl border border-white/20 md:hidden flex flex-col gap-4 animate-in slide-in-from-top-4 fade-in duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={cn(
                "px-4 py-3 rounded-xl text-base font-medium transition-colors",
                isActive(link.href)
                  ? "bg-gradient-to-r from-blue-500 to-teal-400 text-white"
                  : "text-slate-200 hover:bg-slate-800/60"
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="h-px bg-slate-700 my-2" />
          <Link href="/login" onClick={() => setOpen(false)}>
            <Button variant="ghost" className="w-full justify-start rounded-xl text-slate-200 hover:text-white hover:bg-slate-800/60">
              Login
            </Button>
          </Link>
          <Link href="/account-type" onClick={() => setOpen(false)}>
            <Button className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-teal-400 text-white">
              Get Started
            </Button>
          </Link>
        </div>
      )}
    </header>
  )
}
