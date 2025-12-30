'use client'

import { useState } from 'react'
import { 
  Facebook, 
  Twitter, 
  Linkedin,
  Instagram,
  Target,
  ChevronLeft,
  ChevronRight,
  ExternalLink
} from 'lucide-react'

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  })

  const partners = [
    { name: 'Ooredoo', logo: 'ooredoo' },
    { name: 'Cevital', logo: 'cevital' },
    { name: 'Air Algérie', logo: 'air-algerie' },
    { name: 'Ads europe', logo: 'ads-europe' },
    { name: 'Samsung', logo: 'samsung' }
  ]

  const billboards = [
    { id: 1, title: 'Adnew 1', subtitle: 'billboard in Algiers', status: 'New' },
    { id: 2, title: 'Billboard 2', subtitle: 'billboard in Annaba', status: 'New' },
    { id: 3, title: 'Digital arc 3', subtitle: 'Digital ads in Oran', status: 'New' },
    { id: 4, title: 'Billboard 4', subtitle: 'premium ads in Constantine', status: 'New' }
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.max(1, billboards.length - 2))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.max(1, billboards.length - 2)) % Math.max(1, billboards.length - 2))
  }

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Contact form:', contactForm)
    setContactForm({ name: '', email: '', message: '' })
    alert('Thank you for your message! We will get back to you soon.')
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Navbar */}
      <nav className="bg-slate-900/95 backdrop-blur-sm border-b border-teal-500/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-xl font-bold">
                <span className="text-white">AdBridge</span>{' '}
                <span className="text-teal-400">Algeria</span>
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#home" className="text-teal-400 hover:text-teal-300 transition-colors">Home</a>
              <a href="#about" className="text-gray-300 hover:text-white transition-colors">About</a>
              <a href="#services" className="text-gray-300 hover:text-white transition-colors">Services</a>
              <a href="#resources" className="text-gray-300 hover:text-white transition-colors">Resources</a>
              <a href="/login" className="text-gray-300 hover:text-white transition-colors">Log In</a>
              <a 
                href="/account-type" 
                className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-full transition-colors"
              >
                Sign up
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/70 z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1920&h=1080&fit=crop" 
            alt="Algiers cityscape"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="1920" height="1080" fill="%231e293b"/%3E%3C/svg%3E'
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
              Elevate Your Brand with AdBridge Algeria
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Browse high-impact ad spaces from trusted Algerian agencies and partners.
            </p>
            <div className="flex flex-wrap gap-4">
              <a 
                href="#services"
                className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-full font-semibold transition-colors"
              >
                Explore Services
              </a>
              <a 
                href="/account-type"
                className="border-2 border-teal-500 text-teal-400 hover:bg-teal-500/10 px-8 py-3 rounded-full font-semibold transition-colors"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-16 h-16 bg-teal-500/20 rounded-full flex items-center justify-center">
                  <Target className="w-8 h-8 text-teal-400" />
                </div>
                <h2 className="text-3xl font-bold text-white">Our Mission</h2>
              </div>
              <div>
                <p className="text-gray-300 leading-relaxed">
                  AdBridge Algeria is a functional connective prioritizing transparent 
                  contact swiftly, and manufacturer agreements. We deliver a branded 
                  solution, for the sources to deliver the nuanced nice skills to 
                  becoming to our wish multiroaded brand.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Partners Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8">Our Partners</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {partners.map((partner, index) => (
              <div 
                key={index}
                className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-8 flex items-center justify-center hover:border-teal-500/50 transition-colors aspect-square"
              >
                <span className="text-white text-lg font-semibold">{partner.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Most Famous Ads Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">Most Famous Ads</h2>
            <div className="flex gap-2">
              <button 
                onClick={prevSlide}
                className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={nextSlide}
                className="w-10 h-10 bg-teal-500 hover:bg-teal-600 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="relative overflow-hidden">
            <div 
              className="flex gap-4 transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * (100 / 3)}%)` }}
            >
              {billboards.map((billboard) => (
                <div 
                  key={billboard.id}
                  className="min-w-[calc(33.333%-0.67rem)] bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden hover:border-teal-500/50 transition-colors group"
                >
                  <div className="aspect-video bg-slate-700/50 flex items-center justify-center relative">
                    <ExternalLink className="w-8 h-8 text-slate-600 group-hover:text-teal-400 transition-colors" />
                  </div>
                  <div className="p-6 flex items-end justify-between">
                    <div>
                      <h3 className="text-white font-bold text-lg mb-1">{billboard.title}</h3>
                      <p className="text-gray-400 text-sm">{billboard.subtitle}</p>
                    </div>
                    <span className="bg-teal-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                      {billboard.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: Math.max(1, billboards.length - 2) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  currentSlide === index ? 'w-8 bg-teal-500' : 'w-2 bg-slate-600'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to launch your next campaign?
            </h2>
            <a 
              href="#contact"
              className="inline-block bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-full font-semibold transition-colors"
            >
              Contact Us Today
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900/50 border-t border-slate-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <span className="text-lg font-bold">
                  <span className="text-white">AdBridge</span>{' '}
                  <span className="text-teal-400">Algeria</span>
                </span>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#home" className="text-gray-400 hover:text-teal-400 text-sm transition-colors">Home</a></li>
                <li><a href="#about" className="text-gray-400 hover:text-teal-400 text-sm transition-colors">Terms</a></li>
                <li><a href="#about" className="text-gray-400 hover:text-teal-400 text-sm transition-colors">About Us</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-teal-400 text-sm transition-colors">Contact Us</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-teal-400 text-sm transition-colors">Privacy Policy</a></li>
              </ul>
            </div>

            <div>
              <p className="text-gray-400 text-sm mb-4">www.adbridgealgeria.com</p>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-teal-500 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-teal-500 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-teal-500 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-teal-500 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}