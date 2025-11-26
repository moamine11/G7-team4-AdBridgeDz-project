'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Search, 
  Calendar, 
  CheckCircle2, 
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Shield,
  TrendingUp,
  Users,
  Zap
} from 'lucide-react'

export default function HomePage() {
  const router = useRouter()
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Contact form:', contactForm)
    // Handle form submission
    setContactForm({ name: '', email: '', message: '' })
    alert('Thank you for your message! We will get back to you soon.')
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar provided by RootLayout */}

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Section */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Transform Your Outdoor Advertising Experience in Algeria
            </h1>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                The premier digital platform connecting advertisers with premium outdoor advertising spaces. 
                Browse, compare, and book billboard locations across Algeria effortlessly.
            </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button
                size="lg"
                  className="bg-teal-500 hover:bg-teal-600 text-white rounded-full px-8 py-6 text-base"
                onClick={() => router.push('/account-type')}
              >
                Get Started
              </Button>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                    className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-full px-8 py-6 text-base"
                >
                  Login
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Section - Illustration */}
            <div className="flex justify-center items-center">
            <img
              src="/hero_illustration.png"
              alt="Outdoor advertising illustration"
                className="w-full max-w-md lg:max-w-lg object-contain"
            />
            </div>
          </div>
        </div>
      </section>

      {/* Purpose/Description Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              About AdBridgeDZ
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              AdBridgeDZ is revolutionizing the outdoor advertising industry in Algeria by providing 
              a seamless digital marketplace where businesses and advertising agencies can connect, 
              discover, and book premium billboard spaces with unprecedented ease.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-teal-50 border border-blue-100">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Discover Spaces</h3>
              <p className="text-gray-600">
                Browse through hundreds of verified outdoor advertising locations across Algeria 
                with detailed information and real-time availability.
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-teal-50 to-blue-50 border border-teal-100">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-500 rounded-full mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Verified Partners</h3>
              <p className="text-gray-600">
                All advertising agencies and billboard providers are thoroughly verified, 
                ensuring reliability and quality service for your campaigns.
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500 rounded-full mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Maximize Impact</h3>
              <p className="text-gray-600">
                Compare pricing, locations, and features to make data-driven decisions 
                that maximize the impact of your advertising campaigns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8" id="how-it-works">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Getting started with AdBridgeDZ is simple. Follow these easy steps to 
              begin your outdoor advertising journey.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="relative">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full text-white font-bold text-xl mb-4">
                  1
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-6 h-6 text-teal-600" />
                  <h3 className="text-xl font-bold text-gray-900">Create Account</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Sign up as either an advertiser looking for billboard spaces or as an 
                  agency managing advertising locations. The registration process takes just minutes.
                </p>
              </div>
              <div className="hidden md:block absolute top-16 left-full w-16 h-0.5 bg-gradient-to-r from-teal-500 to-blue-500 transform translate-x-4"></div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full text-white font-bold text-xl mb-4">
                  2
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <Search className="w-6 h-6 text-teal-600" />
                  <h3 className="text-xl font-bold text-gray-900">Explore Options</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Browse through our extensive catalog of available billboard spaces. 
                  Filter by location, size, price, and traffic data to find the perfect match.
                </p>
              </div>
              <div className="hidden md:block absolute top-16 left-full w-16 h-0.5 bg-gradient-to-r from-teal-500 to-blue-500 transform translate-x-4"></div>
            </div>

            {/* Step 3 */}
            <div>
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full text-white font-bold text-xl mb-4">
                  3
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="w-6 h-6 text-teal-600" />
                  <h3 className="text-xl font-bold text-gray-900">Book & Advertise</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Reserve your preferred billboard space, upload your creative content, 
                  and launch your campaign. Track performance and manage bookings all in one place.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-teal-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose AdBridgeDZ?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <Zap className="w-10 h-10 text-teal-500 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Instant Booking</h3>
              <p className="text-gray-600 text-sm">
                Book advertising spaces instantly with real-time availability updates.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <MapPin className="w-10 h-10 text-blue-500 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Nationwide Coverage</h3>
              <p className="text-gray-600 text-sm">
                Access billboard locations across all major cities in Algeria.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <CheckCircle2 className="w-10 h-10 text-green-500 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Verified Agencies</h3>
              <p className="text-gray-600 text-sm">
                All partners are verified for quality and reliability.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <TrendingUp className="w-10 h-10 text-purple-500 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Analytics & Insights</h3>
              <p className="text-gray-600 text-sm">
                Track campaign performance with detailed analytics and reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8" id="contact">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Get In Touch
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                      <Mail className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                      <a href="mailto:support@adbridgedz.dz" className="text-blue-600 hover:text-blue-700">
                        support@adbridgedz.dz
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-teal-100 rounded-lg">
                      <Phone className="w-6 h-6 text-teal-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Phone</h4>
                      <a href="tel:+213555123456" className="text-blue-600 hover:text-blue-700">
                        +213 555 123 456
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg">
                      <MapPin className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Address</h4>
                      <p className="text-gray-600">
                        Algiers, Algeria
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4">Follow Us</h4>
                  <div className="flex gap-4">
                    <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                      <Facebook className="w-6 h-6" />
                    </a>
                    <a href="#" className="text-gray-600 hover:text-blue-400 transition-colors">
                      <Twitter className="w-6 h-6" />
                    </a>
                    <a href="#" className="text-gray-600 hover:text-blue-700 transition-colors">
                      <Linkedin className="w-6 h-6" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="Your name"
                    className="w-full"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="your.email@example.com"
                    className="w-full"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Tell us how we can help..."
                    className="w-full min-h-[120px]"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white rounded-full py-6 text-base font-semibold flex items-center justify-center gap-2"
                >
                  Send Message
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/80 border-t border-gray-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-gray-900 mb-4">AdBridgeDZ</h4>
              <p className="text-gray-600 text-sm">
                The premier digital marketplace for outdoor advertising in Algeria.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#how-it-works" className="text-gray-600 hover:text-blue-600">How It Works</a>
                </li>
                <li>
                  <a href="#contact" className="text-gray-600 hover:text-blue-600">Contact</a>
                </li>
                <li>
                  <Link href="/login" className="text-gray-600 hover:text-blue-600">Login</Link>
                </li>
                <li>
                  <Link href="/account-type" className="text-gray-600 hover:text-blue-600">Get Started</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600">Terms of Service</a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600">Privacy Policy</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between text-sm text-gray-600">
            <p>&copy; 2024 AdBridgeDZ. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-blue-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-blue-700 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
