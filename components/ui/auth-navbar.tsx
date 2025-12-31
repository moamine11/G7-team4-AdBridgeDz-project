"use client"

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Logo from '@/components/ui/logo'
import { Menu, X } from 'lucide-react'

interface AuthNavbarProps {
  variant?: 'default' | 'transparent'
  showGetStarted?: boolean
}

export default function AuthNavbar({ variant = 'default', showGetStarted = true }: AuthNavbarProps) {
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

  const isTransparent = variant === 'transparent'
  const shouldShowBackground = scrolled || !isTransparent

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        shouldShowBackground
          ? "bg-slate-950/95 backdrop-blur-md shadow-lg border-b border-teal-500/20"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Logo size="md" withHoverEffect={true} />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link
              href="/"
              className={cn(
                "relative px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg group",
                pathname === '/'
                  ? "text-teal-400 font-semibold"
                  : "text-slate-300 hover:text-teal-400"
              )}
            >
              Home
              {pathname === '/' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full" />
              )}
            </Link>
            <Link
              href="/#how-it-works"
              className="relative px-3 py-2 text-sm font-medium text-slate-300 hover:text-teal-400 transition-colors duration-200 rounded-lg group"
            >
              How it Works
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-500 to-cyan-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 rounded-full" />
            </Link>
            <Link
              href="/#contact"
              className="relative px-3 py-2 text-sm font-medium text-slate-300 hover:text-teal-400 transition-colors duration-200 rounded-lg group"
            >
              Contact
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-500 to-cyan-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 rounded-full" />
            </Link>
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {showGetStarted && (
              <Link href="/account-type">
                <Button
                  variant="ghost"
                  className="relative px-5 py-2 text-sm font-medium text-slate-300 hover:text-teal-400 group overflow-hidden rounded-full transition-all duration-300"
                >
                  <span className="relative z-10">Get Started</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
              </Link>
            )}
            {pathname !== '/login' && (
              <Link href="/login">
                <Button
                  className="relative px-6 py-2 text-sm font-semibold text-white rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30 transition-all duration-300 transform hover:scale-105"
                >
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            className={cn(
              "lg:hidden relative p-2 rounded-lg transition-all duration-200",
              open
                ? "bg-slate-800 text-teal-400"
                : "text-slate-300 hover:bg-slate-800 hover:text-teal-400"
            )}
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "lg:hidden overflow-hidden transition-all duration-300 ease-in-out",
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-4 pb-6 pt-2 space-y-2 bg-slate-950/95 backdrop-blur-md border-t border-teal-500/20">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className={cn(
              "block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200",
              pathname === '/'
                ? "text-teal-400 bg-teal-500/10 font-semibold"
                : "text-slate-300 hover:bg-slate-800 hover:text-teal-400"
            )}
          >
            Home
          </Link>
          <Link
            href="/#how-it-works"
            onClick={() => setOpen(false)}
            className="block px-4 py-3 rounded-lg text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-teal-400 transition-all duration-200"
          >
            How it Works
          </Link>
          <Link
            href="/#contact"
            onClick={() => setOpen(false)}
            className="block px-4 py-3 rounded-lg text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-teal-400 transition-all duration-200"
          >
            Contact
          </Link>
          <div className="pt-4 space-y-2 border-t border-slate-700 mt-2">
            {showGetStarted && (
              <Link href="/account-type" onClick={() => setOpen(false)}>
                <Button
                  variant="outline"
                  className="w-full justify-center rounded-full border-2 border-teal-500/30 hover:border-teal-500 hover:text-teal-400 text-slate-300 font-medium transition-all duration-200"
                >
                  Get Started
                </Button>
              </Link>
            )}
            {pathname !== '/login' && (
              <Link href="/login" onClick={() => setOpen(false)}>
                <Button
                  className="w-full justify-center rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold shadow-lg shadow-teal-500/25 transition-all duration-200"
                >
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

