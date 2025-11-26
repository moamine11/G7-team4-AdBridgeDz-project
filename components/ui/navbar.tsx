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
    { href: '/#how-it-works', label: 'How it Works' },
    { href: '/#contact', label: 'Contact' },
  ]

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    // Handle anchor links - check if we're on home page
    if (href.startsWith('/#')) {
      return pathname === '/' || pathname === ''
    }
    return pathname?.startsWith(href)
  }

  // Hide navbar on channels and agencies pages (they have their own headers)
  if (pathname === '/channels' || pathname === '/agencies') {
    return null
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-gradient-to-r from-blue-50 via-teal-50 to-white backdrop-blur-md shadow-lg border-b border-blue-100"
          : "bg-gradient-to-r from-blue-50 via-teal-50 to-white backdrop-blur-sm border-b border-blue-100"
      )}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group -ml-2">
            <div className="relative">
              <img
                src="/Adbridgelogo.png"
                alt="AdBridgeDZ"
                className="h-8 md:h-10 w-auto transition-transform duration-300 group-hover:scale-105"
                style={{ transform: 'scale(2)', transformOrigin: 'left center' }}
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg group",
                  isActive(link.href)
                    ? "text-teal-600 font-semibold"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full" />
                )}
                <span className="absolute inset-0 bg-gray-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10" />
              </Link>
            ))}
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/account-type">
              <Button
                variant="ghost"
                className="relative px-5 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 group overflow-hidden rounded-full transition-all duration-300"
              >
                <span className="relative z-10">Get Started</span>
                <span className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                className="relative px-6 py-2 text-sm font-semibold text-white rounded-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30 transition-all duration-300 transform hover:scale-105"
              >
                Login
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            className={cn(
              "lg:hidden relative p-2 rounded-lg transition-all duration-200",
              open
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            )}
          >
            <svg
              className="w-6 h-6 transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              {open ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
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
        <div className="px-4 pb-6 pt-2 space-y-2 bg-gradient-to-b from-blue-50 via-teal-50 to-white backdrop-blur-md border-t border-blue-100">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={cn(
                "block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200",
                isActive(link.href)
                  ? "text-teal-600 bg-teal-50 font-semibold"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 space-y-2 border-t border-gray-200 mt-2">
            <Link href="/account-type" onClick={() => setOpen(false)}>
              <Button
                variant="outline"
                className="w-full justify-center rounded-full border-2 border-gray-300 hover:border-teal-500 hover:text-teal-600 font-medium transition-all duration-200"
              >
                Get Started
              </Button>
            </Link>
            <Link href="/login" onClick={() => setOpen(false)}>
              <Button
                className="w-full justify-center rounded-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-semibold shadow-lg shadow-teal-500/25 transition-all duration-200"
              >
                Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
