'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  Search,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Building2,
  Phone,
  Mail,
  Globe,
  Users,
  Calendar,
  Sparkles,
  Filter,
  ShieldCheck,
  Star
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface Agency {
  id: string
  name: string
  location: string
  rating: number
  reviewCount: number
  verified: boolean
  email: string
  phone: string
  website: string
  description: string
  services: string[]
  industry: string
  companySize: string
  yearEstablished: string
  logo: string | null
  category?: string
  featured?: boolean
  serviceImage?: string
}

const mockAgencies: Agency[] = [
  {
    id: '1',
    name: 'Alpha Communications',
    location: 'Algiers, Algeria',
    rating: 4.8,
    reviewCount: 24,
    verified: true,
    email: 'contact@alphacomm.dz',
    phone: '+213 555 123 456',
    website: 'https://www.alphacomm.dz',
    description: 'Alpha Communications is a leading advertising agency in Algeria, specializing in outdoor advertising and digital billboards. We provide strategic placement and creative solutions for maximum brand visibility across major highways and urban centers.',
    services: ['Billboard Advertising', 'Digital Billboards', 'Transit Advertising', 'Street Furniture Advertising'],
    industry: 'Outdoor Advertising',
    companySize: '21-50 employees',
    yearEstablished: '2014',
    logo: 'https://ui-avatars.com/api/?name=Alpha+Communications&background=0ea5e9&color=fff&size=128&bold=true',
    category: 'outdoor',
    featured: true,
    serviceImage: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&h=400&fit=crop'
  },
  {
    id: '2',
    name: 'Digital Media Solutions',
    location: 'Oran, Algeria',
    rating: 4.9,
    reviewCount: 31,
    verified: true,
    email: 'info@digitalmedia.dz',
    phone: '+213 555 234 567',
    website: 'https://www.digitalmedia.dz',
    description: 'Premium digital advertising solutions with cutting-edge LED displays and smart advertising technology. Our dynamic content delivery system ensures your message reaches the right audience at the perfect time.',
    services: ['Digital Outdoor Screens', 'LED Displays', 'Smart Displays', 'Digital Totems'],
    industry: 'Digital Advertising',
    companySize: '11-20 employees',
    yearEstablished: '2018',
    logo: 'https://ui-avatars.com/api/?name=Digital+Media&background=14b8a6&color=fff&size=128&bold=true',
    category: 'digital',
    featured: true,
    serviceImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=400&fit=crop'
  },
  {
    id: '3',
    name: 'Transit Ads Algeria',
    location: 'Constantine, Algeria',
    rating: 4.6,
    reviewCount: 18,
    verified: true,
    email: 'hello@transitads.dz',
    phone: '+213 555 345 678',
    website: 'https://www.transitads.dz',
    description: 'Specialized in transit advertising with extensive coverage across Algeria\'s public transportation network. We connect your brand with millions of daily commuters through strategic placement on buses, taxis, trams, and metro systems.',
    services: ['Bus Advertising', 'Taxi Branding', 'Tram Ads', 'Metro Advertising'],
    industry: 'Transit Advertising',
    companySize: '5-10 employees',
    yearEstablished: '2016',
    logo: 'https://ui-avatars.com/api/?name=Transit+Ads&background=3b82f6&color=fff&size=128&bold=true',
    category: 'transit',
    serviceImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=400&fit=crop'
  },
  {
    id: '4',
    name: 'Urban Display Co.',
    location: 'Algiers, Algeria',
    rating: 4.7,
    reviewCount: 22,
    verified: true,
    email: 'contact@urbandisplay.dz',
    phone: '+213 555 456 789',
    website: 'https://www.urbandisplay.dz',
    description: 'Leading provider of street furniture advertising including bus shelters, benches, and kiosks. Our strategically located displays capture attention in high-traffic pedestrian areas, maximizing your brand\'s local presence.',
    services: ['Bus Shelters', 'Street Benches', 'Kiosks', 'Public Furniture'],
    industry: 'Street Furniture',
    companySize: '21-50 employees',
    yearEstablished: '2012',
    logo: 'https://ui-avatars.com/api/?name=Urban+Display&background=0ea5e9&color=fff&size=128&bold=true',
    category: 'outdoor',
    serviceImage: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=400&fit=crop'
  },
  {
    id: '5',
    name: 'Mall Media Network',
    location: 'Algiers, Algeria',
    rating: 4.5,
    reviewCount: 15,
    verified: true,
    email: 'info@mallmedia.dz',
    phone: '+213 555 567 890',
    website: 'https://www.mallmedia.dz',
    description: 'Indoor commercial advertising specialists with premium locations in shopping malls and retail spaces. We help brands engage with shoppers at the point of purchase through strategically placed digital and static displays.',
    services: ['Mall Displays', 'Cinema Advertising', 'Retail Screens', 'Indoor Digital'],
    industry: 'Indoor Advertising',
    companySize: '11-20 employees',
    yearEstablished: '2019',
    logo: 'https://ui-avatars.com/api/?name=Mall+Media&background=14b8a6&color=fff&size=128&bold=true',
    category: 'indoor',
    serviceImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop'
  },
  {
    id: '6',
    name: 'Event Marketing Pro',
    location: 'Oran, Algeria',
    rating: 4.4,
    reviewCount: 12,
    verified: false,
    email: 'events@eventmarketing.dz',
    phone: '+213 555 678 901',
    website: 'https://www.eventmarketing.dz',
    description: 'Creative event and temporary advertising solutions for festivals, exhibitions, and pop-up campaigns. We create memorable brand experiences that connect with audiences during special events and gatherings.',
    services: ['Event Booths', 'Pop-up Displays', 'Festival Advertising', 'Temporary Installations'],
    industry: 'Event Advertising',
    companySize: '5-10 employees',
    yearEstablished: '2020',
    logo: 'https://ui-avatars.com/api/?name=Event+Marketing&background=3b82f6&color=fff&size=128&bold=true',
    category: 'event',
    serviceImage: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=400&fit=crop'
  },
  {
    id: '7',
    name: 'Creative Studio Algeria',
    location: 'Algiers, Algeria',
    rating: 4.9,
    reviewCount: 28,
    verified: true,
    email: 'studio@creativestudio.dz',
    phone: '+213 555 789 012',
    website: 'https://www.creativestudio.dz',
    description: 'Full-service creative agency offering design, printing, and installation services for all advertising formats. From concept to completion, we handle every aspect of your advertising campaign with professional expertise.',
    services: ['Creative Design', 'Printing Services', 'Installation', 'Production'],
    industry: 'Creative Services',
    companySize: '21-50 employees',
    yearEstablished: '2011',
    logo: 'https://ui-avatars.com/api/?name=Creative+Studio&background=0ea5e9&color=fff&size=128&bold=true',
    category: 'premium',
    featured: true,
    serviceImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=400&fit=crop'
  },
  {
    id: '8',
    name: 'Premium Locations',
    location: 'Algiers, Algeria',
    rating: 5.0,
    reviewCount: 19,
    verified: true,
    email: 'premium@premiumlocations.dz',
    phone: '+213 555 890 123',
    website: 'https://www.premiumlocations.dz',
    description: 'Exclusive access to premium advertising locations including airports, stadiums, and landmark displays. We offer high-visibility placements that ensure maximum brand exposure to affluent and engaged audiences.',
    services: ['Airport Advertising', 'Stadium Displays', 'Landmark Locations', 'Premium Billboards'],
    industry: 'Premium Advertising',
    companySize: '11-20 employees',
    yearEstablished: '2015',
    logo: 'https://ui-avatars.com/api/?name=Premium+Locations&background=14b8a6&color=fff&size=128&bold=true',
    category: 'premium',
    featured: true,
    serviceImage: 'https://images.unsplash.com/photo-1529107386315-e3a4237a248b?w=800&h=400&fit=crop'
  },
  {
    id: '9',
    name: 'Online Ad Network',
    location: 'Algiers, Algeria',
    rating: 4.6,
    reviewCount: 35,
    verified: true,
    email: 'contact@onlineadnetwork.dz',
    phone: '+213 555 901 234',
    website: 'https://www.onlineadnetwork.dz',
    description: 'Comprehensive digital advertising solutions including social media, Google Ads, and video advertising. We leverage data-driven strategies to maximize your ROI and reach your target audience effectively across all digital platforms.',
    services: ['Social Media Ads', 'Google Ads', 'Video Advertising', 'Display Ads'],
    industry: 'Digital Advertising',
    companySize: '21-50 employees',
    yearEstablished: '2017',
    logo: 'https://ui-avatars.com/api/?name=Online+Ad+Network&background=3b82f6&color=fff&size=128&bold=true',
    category: 'digital',
    serviceImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop'
  },
  {
    id: '10',
    name: 'Highway Billboard Co.',
    location: 'Constantine, Algeria',
    rating: 4.7,
    reviewCount: 20,
    verified: true,
    email: 'info@highwaybillboard.dz',
    phone: '+213 555 012 345',
    website: 'https://www.highwaybillboard.dz',
    description: 'Strategic highway billboard locations with high visibility and traffic coverage across major routes. Our prime positions ensure your message reaches thousands of motorists daily, making us the ideal choice for regional campaigns.',
    services: ['Highway Billboards', 'Roadside Advertising', 'Illuminated Billboards', 'Bridge Panels'],
    industry: 'Outdoor Advertising',
    companySize: '11-20 employees',
    yearEstablished: '2013',
    logo: 'https://ui-avatars.com/api/?name=Highway+Billboard&background=0ea5e9&color=fff&size=128&bold=true',
    category: 'outdoor',
    serviceImage: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&h=400&fit=crop'
  },
  {
    id: '11',
    name: 'City Center Media',
    location: 'Oran, Algeria',
    rating: 4.5,
    reviewCount: 16,
    verified: true,
    email: 'contact@citycentermedia.dz',
    phone: '+213 555 123 456',
    website: 'https://www.citycentermedia.dz',
    description: 'Prime city center billboard locations with maximum foot traffic and visibility. We specialize in urban advertising that captures the attention of pedestrians and shoppers in the heart of Algeria\'s busiest commercial districts.',
    services: ['City Center Billboards', 'Urban Displays', 'Pedestrian Zone Ads'],
    industry: 'Outdoor Advertising',
    companySize: '5-10 employees',
    yearEstablished: '2016',
    logo: 'https://ui-avatars.com/api/?name=City+Center+Media&background=14b8a6&color=fff&size=128&bold=true',
    category: 'outdoor',
    serviceImage: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=400&fit=crop'
  },
  {
    id: '12',
    name: 'Metro Advertising Solutions',
    location: 'Algiers, Algeria',
    rating: 4.8,
    reviewCount: 14,
    verified: true,
    email: 'metro@metroads.dz',
    phone: '+213 555 234 567',
    website: 'https://www.metroads.dz',
    description: 'Exclusive metro and tram advertising rights with high daily passenger reach. Our network covers major transit hubs, ensuring your brand message reaches commuters during their daily journeys.',
    services: ['Metro Advertising', 'Tram Displays', 'Station Advertising'],
    industry: 'Transit Advertising',
    companySize: '11-20 employees',
    yearEstablished: '2017',
    logo: 'https://ui-avatars.com/api/?name=Metro+Advertising&background=3b82f6&color=fff&size=128&bold=true',
    category: 'transit',
    serviceImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=400&fit=crop'
  }
]

const channelMap: Record<string, string> = {
  '1': 'outdoor',
  '2': 'digital',
  '3': 'transit',
  '4': 'outdoor',
  '5': 'indoor',
  '6': 'event',
  '7': 'premium',
  '8': 'premium',
  '9': 'digital'
}

export default function AgenciesListingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const channelId = searchParams.get('channel')
  const category = channelId ? channelMap[channelId] : null

  const [searchQuery, setSearchQuery] = useState('')
  const [locationFilter, setLocationFilter] = useState('all')
  const [verifiedFilter, setVerifiedFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const agenciesPerPage = 9

  // Get unique locations
  const locations = useMemo(() => {
    const locs = new Set(mockAgencies.map(agency => agency.location))
    return Array.from(locs).sort()
  }, [])

  // Filter and sort agencies
  const filteredAgencies = useMemo(() => {
    let filtered = [...mockAgencies]

    // Filter by category/channel
    if (category) {
      filtered = filtered.filter(agency => agency.category === category)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(agency =>
        agency.name.toLowerCase().includes(query) ||
        agency.description.toLowerCase().includes(query) ||
        agency.services.some(service => service.toLowerCase().includes(query)) ||
        agency.location.toLowerCase().includes(query)
      )
    }

    // Filter by location
    if (locationFilter !== 'all') {
      filtered = filtered.filter(agency => agency.location === locationFilter)
    }


    // Filter by verified status
    if (verifiedFilter !== 'all') {
      const isVerified = verifiedFilter === 'verified'
      filtered = filtered.filter(agency => agency.verified === isVerified)
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'newest':
          return parseInt(b.yearEstablished) - parseInt(a.yearEstablished)
        case 'oldest':
          return parseInt(a.yearEstablished) - parseInt(b.yearEstablished)
        case 'featured':
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

    return filtered
  }, [category, searchQuery, locationFilter, verifiedFilter, sortBy])

  const verifiedCount = useMemo(() => filteredAgencies.filter(agency => agency.verified).length, [filteredAgencies])
  const averageRating = useMemo(() => {
    if (!filteredAgencies.length) return '4.8'
    const total = filteredAgencies.reduce((sum, agency) => sum + agency.rating, 0)
    return (total / filteredAgencies.length).toFixed(1)
  }, [filteredAgencies])

  // Pagination
  const totalPages = Math.ceil(filteredAgencies.length / agenciesPerPage)
  const paginatedAgencies = filteredAgencies.slice(
    (currentPage - 1) * agenciesPerPage,
    currentPage * agenciesPerPage
  )

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, locationFilter, verifiedFilter, sortBy, category])

  const getChannelTitle = () => {
    if (!channelId) return 'All Agencies'
    const channelTitles: Record<string, string> = {
      '1': 'Billboard & Roadside Advertising',
      '2': 'Digital Outdoor Screens (DOOH)',
      '3': 'Transit Advertising',
      '4': 'Street Furniture Advertising',
      '5': 'Indoor Commercial Advertising',
      '6': 'Event & Temporary Advertising',
      '7': 'Creative & Production Services',
      '8': 'Premium Ad Locations',
      '9': 'Digital Advertising (Online)'
    }
    return channelTitles[channelId] || 'Agencies'
  }

  const stats = [
    { label: 'Active Agencies', value: filteredAgencies.length.toString(), detail: 'Matching your filters' },
    { label: 'Verified Partners', value: `${verifiedCount}+`, detail: 'Compliance-ready teams' },
    { label: 'Average Rating', value: `${averageRating}`, detail: 'Client satisfaction score' }
  ]

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-50">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(59,130,246,0.25), transparent 45%), radial-gradient(circle at 80% 0%, rgba(45,212,191,0.2), transparent 40%), radial-gradient(circle at 50% 100%, rgba(147,51,234,0.15), transparent 35%)'
        }}
      />

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-24 space-y-12">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-r from-slate-900/80 via-slate-900/60 to-blue-900/70 backdrop-blur-xl">
          <div className="absolute inset-0 opacity-70">
            <img
              src="/times_square.jpg"
              alt="Agency skyline"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/80 to-slate-900/70" />
          </div>

          <div className="relative z-10 grid gap-10 lg:grid-cols-2 p-8 sm:p-10 lg:p-16">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1.5 text-xs font-semibold text-blue-200 uppercase tracking-[0.3em]">
                <Sparkles className="w-4 h-4 text-blue-300" />
                Agencies
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                  {getChannelTitle()}
                </h1>
                <p className="mt-4 text-lg text-slate-300 max-w-2xl">
                  Browse vetted agencies, compare specialties, and connect instantly with the teams best suited for your campaign goals.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  size="lg"
                  className="h-14 rounded-2xl bg-gradient-to-r from-blue-500 via-teal-500 to-blue-400"
                  onClick={() => router.push('/contact')}
                >
                  Brief AdBridgeDZ
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  className="h-14 rounded-2xl bg-white/10 border border-white/20 text-slate-50"
                  onClick={() => router.push('/channels')}
                >
                  Back to Channels
                </Button>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-300" />
                  Verified partners highlighted
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-300" />
                  {locations.length}+ locations covered
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Live snapshot</p>
                <span className="text-xs text-blue-300 bg-blue-500/10 px-3 py-1 rounded-full">Auto-sync</span>
              </div>
              <div className="space-y-5">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search agencies, services, or locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border-white/10 text-slate-50 placeholder:text-slate-400 pl-12 pr-4 py-3 rounded-2xl focus-visible:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat) => (
                    <div key={stat.label} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>
                      <p className="mt-2 text-2xl font-bold text-white">{stat.value}</p>
                      <p className="text-xs text-slate-400">{stat.detail}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-slate-300">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Sort</p>
                    <p className="font-semibold">{sortBy === 'featured' ? 'Featured first' : sortBy === 'name' ? 'Alphabetical' : sortBy === 'newest' ? 'Newest agencies' : 'Longest established'}</p>
                  </div>
                  <Star className="w-5 h-5 text-amber-300" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-blue-500/5"
            >
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>
              <p className="mt-2 text-3xl font-bold text-white">{stat.value}</p>
              <p className="mt-1 text-sm text-slate-300">{stat.detail}</p>
            </div>
          ))}
        </section>

        {/* Filters */}
        <section className="rounded-[32px] border border-white/10 bg-white/5 p-6 md:p-8 space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search agencies, services, or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/40 border-white/10 text-slate-50 placeholder:text-slate-400 pl-12 pr-4 py-3 rounded-2xl focus-visible:ring-blue-500"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowFilters((prev) => !prev)}
                className={cn(
                  'flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-sm font-semibold transition-colors',
                  showFilters ? 'bg-white/10 text-white' : 'text-slate-300 hover:text-white'
                )}
              >
                <Filter className="w-4 h-4" />
                Advanced Filters
              </button>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setLocationFilter('all')
                  setVerifiedFilter('all')
                }}
                className="text-xs uppercase tracking-[0.3em] text-blue-300 hover:text-blue-200"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { value: 'featured', label: 'Featured First' },
              { value: 'name', label: 'Name (A-Z)' },
              { value: 'newest', label: 'Newest' },
              { value: 'oldest', label: 'Oldest' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setSortBy(option.value)}
                className={cn(
                  'px-5 py-2.5 text-sm font-medium rounded-full transition-all border',
                  sortBy === option.value
                    ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white border-transparent shadow-lg shadow-blue-500/25'
                    : 'border-white/10 text-slate-300 hover:text-white hover:border-blue-400/60'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block text-xs uppercase tracking-[0.3em] text-slate-400 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Location
                </label>
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full rounded-2xl bg-slate-900/50 border border-white/10 px-4 py-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="all">All Locations</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.3em] text-slate-400 mb-2">
                  <CheckCircle2 className="w-4 h-4 inline mr-2" />
                  Verification Status
                </label>
                <select
                  value={verifiedFilter}
                  onChange={(e) => setVerifiedFilter(e.target.value)}
                  className="w-full rounded-2xl bg-slate-900/50 border border-white/10 px-4 py-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="all">All Agencies</option>
                  <option value="verified">Verified Only</option>
                  <option value="unverified">Unverified Only</option>
                </select>
              </div>
            </div>
          )}
        </section>

        {/* Agencies */}
        {paginatedAgencies.length === 0 ? (
          <div className="text-center py-16 rounded-[32px] border border-dashed border-white/20 bg-white/5">
            <Building2 className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-white mb-2">No agencies found</h3>
            <p className="text-slate-400 mb-6">Try adjusting your filters or search query</p>
            <Button
              onClick={() => {
                setSearchQuery('')
                setLocationFilter('all')
                setVerifiedFilter('all')
              }}
              variant="secondary"
              className="rounded-2xl"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            <section className="space-y-6">
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-semibold text-white">Agencies matching your brief</h2>
                <p className="text-slate-400">Showing {paginatedAgencies.length} of {filteredAgencies.length} agencies</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {paginatedAgencies.map((agency) => (
                  <Link
                    key={agency.id}
                    href={`/agencies/${agency.id}`}
                    className="bg-white/5 border border-white/10 rounded-[28px] shadow-lg shadow-blue-500/5 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-blue-400/60 group"
                  >
                    {agency.serviceImage && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={agency.serviceImage}
                          alt={`${agency.name} service`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&h=400&fit=crop'
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        {agency.featured && (
                          <div className="absolute top-4 right-4">
                            <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-teal-500 text-white text-xs font-bold rounded-full shadow-lg">
                              Featured
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600/20 to-teal-500/30 p-1">
                            {agency.logo ? (
                              <img
                                src={agency.logo}
                                alt={agency.name}
                                className="w-full h-full rounded-xl object-cover"
                                onError={(e) => {
                                  const target = e.currentTarget as HTMLImageElement
                                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(agency.name)}&background=0ea5e9&color=fff&size=128&bold=true`
                                }}
                              />
                            ) : (
                              <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center text-white">
                                <Building2 className="w-8 h-8" />
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-1">
                              {agency.name}
                            </h3>
                            {agency.verified && (
                              <CheckCircle2 className="w-5 h-5 text-teal-300 flex-shrink-0 mt-0.5" />
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-slate-300 mb-2">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{agency.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 text-xs font-semibold bg-white/10 text-slate-100 rounded-full border border-white/10">
                              {agency.industry}
                            </span>
                            <span className="text-xs text-amber-300 flex items-center gap-1">
                              <Star className="w-3 h-3" />
                              {agency.rating.toFixed(1)} ({agency.reviewCount})
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-slate-300 leading-relaxed mb-4 line-clamp-3">
                        {agency.description}
                      </p>

                      <div className="mb-4">
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-[0.3em] mb-2">
                          Services
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {agency.services.slice(0, 4).map((service, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1.5 text-xs font-medium bg-white/10 text-slate-100 rounded-lg border border-white/10"
                            >
                              {service}
                            </span>
                          ))}
                          {agency.services.length > 4 && (
                            <span className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-white/5 rounded-lg border border-white/10">
                              +{agency.services.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 p-3 bg-white/5 rounded-2xl mb-4 border border-white/10">
                        <div className="flex items-center gap-2 text-xs text-slate-300">
                          <Users className="w-4 h-4 text-slate-400" />
                          {agency.companySize}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-300">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          Since {agency.yearEstablished}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            window.location.href = `tel:${agency.phone}`
                          }}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-200 rounded-lg hover:bg-blue-500/20 transition-colors text-sm font-medium"
                        >
                          <Phone className="w-4 h-4" />
                          Call
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            window.location.href = `mailto:${agency.email}`
                          }}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-teal-500/10 text-teal-200 rounded-lg hover:bg-teal-500/20 transition-colors text-sm font-medium"
                        >
                          <Mail className="w-4 h-4" />
                          Email
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            window.open(agency.website, '_blank')
                          }}
                          className="px-4 py-2 bg-white/5 text-slate-200 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <Globe className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="px-6 py-4 bg-gradient-to-r from-blue-500/10 to-teal-500/10 border-t border-white/10">
                      <div className="flex items-center justify-between text-sm text-slate-200">
                        <span className="font-semibold">View full profile</span>
                        <ArrowRight className="w-5 h-5 text-teal-300 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="secondary"
                  className="rounded-2xl border border-white/20"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={cn(
                        'w-10 h-10 rounded-lg font-medium transition-all duration-200',
                        currentPage === page
                          ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-lg'
                          : 'bg-white/5 border border-white/10 text-slate-300 hover:text-white'
                      )}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <Button
                  variant="secondary"
                  className="rounded-2xl border border-white/20"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}

        {/* CTA */}
        <section className="rounded-[32px] border border-white/10 bg-gradient-to-r from-blue-500/20 to-teal-500/20 p-10" role="region" aria-label="cta">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-blue-200">Need support?</p>
              <h3 className="mt-3 text-3xl font-bold text-white">Match with pre-vetted agencies in under 24 hours.</h3>
              <p className="mt-2 text-slate-200">Share your campaign specs and we will shortlist agencies that fit your KPIs, budget, and timeline.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                className="h-12 rounded-2xl bg-white text-slate-900 font-semibold hover:bg-white/90 hover:text-slate-900"
                onClick={() => router.push('/create-account')}
              >
                Create Advertiser Account
              </Button>
              <Button
                variant="secondary"
                className="h-12 rounded-2xl border border-white/40 text-slate-900 hover:text-slate-900 hover:bg-white/20"
                onClick={() => router.push('/create-agency-account')}
              >
                Join as Agency
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

