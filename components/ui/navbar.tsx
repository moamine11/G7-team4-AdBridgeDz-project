"use client"

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
      
      // Only detect sections if we're on the homepage
      if (pathname === '/') {
        const sections = ['explore-spaces', 'how-it-works', 'contact']
        const currentSection = sections.find(section => {
          const element = document.getElementById(section)
          if (element) {
            const rect = element.getBoundingClientRect()
            return rect.top <= 100 && rect.bottom >= 100
          }
          return false
        })
        
        if (currentSection) {
          setActiveSection(currentSection)
        } else {
          setActiveSection('')
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    // Reset active section when pathname changes
    setActiveSection('')
    return () => window.removeEventListener('scroll', handleScroll)
  }, [pathname])

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/#explore-spaces', label: 'Explore Spaces' },
    { href: '/#how-it-works', label: 'How It Works' },
    { href: '/about-us', label: 'About' },
    { href: '/#contact', label: 'Contact' },
  ]

  const isActive = (href: string) => {
    // For regular pages (About)
    if (href === '/about-us') {
      return pathname === '/about-us'
    }
    
    // For homepage and hash links (only active on homepage)
    if (pathname !== '/') return false
    
    if (href === '/') {
      return !activeSection // Home is active when no section is active
    }
    
    if (href.startsWith('/#')) {
      const section = href.replace('/#', '')
      return activeSection === section
    }
    
    return false
  }

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 backdrop-blur-md border-b",
        scrolled
          ? "bg-white/95 border-gray-200 shadow-lg"
          : "bg-white/90 border-gray-200"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Keeping your image logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative">
              <img
                src="/Adbridgelogo.png"
                alt="AdBridgeDZ"
                className="h-27 w-60 transition-transform duration-300 hover:scale-105"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 text-sm",
                  isActive(link.href) && "text-blue-600"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Link href="/login">
              <Button variant="ghost" className="text-gray-700 hover:text-blue-600 text-sm">
                Sign In
              </Button>
            </Link>
            <Link href="/account-type">
              <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white text-sm px-4">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            className={cn(
              "md:hidden relative p-2 rounded-lg transition-all duration-200",
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
          "md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white border-t border-gray-200",
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-4 pb-6 pt-2 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={cn(
                "block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200",
                isActive(link.href)
                  ? "text-blue-600 bg-blue-50 font-semibold"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 space-y-2 border-t border-gray-200 mt-2">
            <Link href="/login" onClick={() => setOpen(false)}>
              <Button
                variant="outline"
                className="w-full justify-center border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600 font-medium transition-all duration-200"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/account-type" onClick={() => setOpen(false)}>
              <Button
                className="w-full justify-center bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-semibold transition-all duration-200"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}