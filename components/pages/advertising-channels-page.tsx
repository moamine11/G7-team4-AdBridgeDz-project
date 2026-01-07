'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Search,
  Bell,
  Settings,
  ArrowRight,
  Sparkles,
  Filter,
  MapPin,
  Building2,
  Megaphone,
  Layers,
  Globe2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface Channel {
  id: string
  title: string
  description: string
  image: string
  agenciesCount: number
  category: string
}

const channels: Channel[] = [
  {
    id: '1',
    title: 'Billboard & Roadside Advertising',
    description: 'Highway Billboards, City Center Billboards, Illuminated Billboards, Bridge Panels',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOlvQ84WI02qwqswgawg5_hpfHjMB8wisQ8GG1KEN9TY2dalUf46Fx-Z9-03yiyqaUeKqKuCvCPNcmT_U11TZTyaCMisX6phoh-ZjxyBK3nWgdvmDXOC-DQHx7ye8GAX8CQ7NIvORJ3sRTrlO_KsIxtXeYzGvKCkWZkQg1Bf_2QjTk6a7cvqqr121JR167PcMM0DgVmmq64tuiK6HauH0GJIPb8SMqge8PM70gBCjW6Rb29_cHqv804wq7jw-3tUMV1b2E6UiHWPo',
    agenciesCount: 28,
    category: 'outdoor'
  },
  {
    id: '2',
    title: 'Digital Outdoor Screens (DOOH)',
    description: 'LED Screens, Digital Totems, Smart Displays',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrO2yX1Y9q1-LiDKfNDZpGYD4cVasECTXqos5Tv32Mgh2tcOgJjkg0kL6MFaIS24-l7fgHhTZFyvMJu9dLY4YH9Ptm7BxXfoc9Ax3-9v5fHh4mHtND6MzPXH-KvrGLAoh4egmSpbAmmi5HxURaswBsujY3ap5dk8_oBTcnDSqAgifPodqee19VfcSKLbLcgexhlPvNBaDqJ7dpW8kGcJG_3_ba6_JuHv9m8hZid0rOaAwHTT1uj58xIgzEzeKys2kbcMPCjvNO6Q4',
    agenciesCount: 19,
    category: 'digital'
  },
  {
    id: '3',
    title: 'Transit Advertising',
    description: 'Bus Ads, Taxi Branding, Tram & Metro Ads',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDd1QiYeh9QoEavvZLOogc7AaTy1T3-ZP0zCdyuv7SvxUyphcd-Kb-4a9rAcb0PFz3MUEkaWQvYnZNYm8M62XKFJTucokVFMuyPJxm_qm0EiSK9ep_Luezt-sHyECoyizRmE7d58uu-tnXx95ioySGSHF8MKUjVtNTFfwLJBIPsTw2xP8P7OTzcOnn0fAvWujyi_l08RmU-ZZr5fkIRB6yrZ2g-uLVJ8Vv5MAYQs_j9KTIsUhzPGTmrJox1-uc-WcHDsKV1wJpiLco',
    agenciesCount: 15,
    category: 'transit'
  },
  {
    id: '4',
    title: 'Street Furniture Advertising',
    description: 'Bus Shelters, Benches, Kiosks',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-aK0FP6SF0ZZa7jrKiMtvpSAN93RwMmlwnw4sYNBNdzAT-Eq6RX86wZOOiTSwMKgZV6AYMbYVgel8VntHUiKMtOHpl9jpuRoAYIH8iwPmzWqLAXJnJrXimFZKffeHAKKik83vQHETAee0_3FS90FRzHXTeyENNf1coP2qrXZ_nwT2kYa86vmkzAUCfv3ydImuHIy1owga2qMikzkK4danran3xmbEV8__tJOD8tRiySnEcWjDVtJlwAI_uLKWxSv9vfWLdKzduqA',
    agenciesCount: 12,
    category: 'outdoor'
  },
  {
    id: '5',
    title: 'Indoor Commercial Advertising',
    description: 'Mall Displays, Cinema Ads, Retail Screens',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4IpbNHFsvEi0u31dCyf5Q2jQgxubiMjLUKW_kV1mOf2D1ITn0JuOSMoGYs_oyve82XXI2W1VLYO3AzpwMbJiyQ9eKQQO2Qx5Fobk7V0PNTsOibSatSjorDTJXxrgCDGOCPpiW28q51SDnlHprKULrvhQUVpgVJjB8BGz3SI6Q2MZPSNykfQVkwsCt0JgqiOtPamZwusUyFoVcjQ1npXvPOY8S2Sqm7v-tmMifx9sdHKVp6Dn2Iyk06hVOapT-HGLA-N4Stl1b4lA',
    agenciesCount: 14,
    category: 'indoor'
  },
  {
    id: '6',
    title: 'Event & Temporary Advertising',
    description: 'Booths, Pop-ups, Festivals',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4hLOaEd8AjfYQ-_aQrd8BEGZ-YdxeX1HdWR4w7irQF0bpy2j9MTdhdk8apPQq7cfMxxyylKgBIefJftIent1xwgJAQeD93B3kBHhwuxqZI7AkGaU-xdyAnyZllYPTCd1lEI4Jvncz56K_fwpOyUqd6TjputS8jXMjdu0I-Y5OmoaE_7q50Fgn9q0grzi3-Sop0UBi8KyM-STY_2x4P-qCREdIUKSe5bWcqMK6i2X3fA0bncJ8B5gHGsDfjqkUzPf-Dq7FGYF0cWc',
    agenciesCount: 9,
    category: 'event'
  },
  {
    id: '7',
    title: 'Creative & Production Services',
    description: 'Design, Printing, Installation',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFEiG2UrPBvj0Ou3em7-70RfybGGrE0W9GxjPRcaGyZLeXcU5P9vCDLxJ7B78rWh6Wpml8xMuG5qrWGZhBSSRCqdQEXGB1os7Xs9lNHdswmAIUF6yPubIzDoxRCnIwbYTFr3riu9sP5XYg94Mo-prSgmqIqNpH5XgWqWXEvDcWRtkziqrm7t0SnS3VKqtRm02Z8MAWfiv48Y9KUKBHpVR0P_d9p169gyLqMIJs7zLMHMpNuhNdXUnTH2ohIZdBJKDKzfCl8YCZem8',
    agenciesCount: 22,
    category: 'premium'
  },
  {
    id: '8',
    title: 'Premium Ad Locations',
    description: 'Airports, Stadiums, Landmark Displays',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6PE4nTWGyP7v1OidxpqYthq1c-AOr4ECPLd4dPlQsYGxPkkJcbHOuxYXe_cS2q4MnZ-O9x1DqkR-3_5BRYF2r5C7xY-w8UrTJI72vrR7VNyYKWsfvRDkwmz0NHRSIJ9_x4JNDDauyd5M3oTKE0ItpaukMM5iZ-mnEvVoSHSJwMLfv_yG_oUYNDVsJz2filueB11uVCLv6shw68DrOyEoBUu9tlK70JaErOg5f1BjIml18MEvfvmC-t0yvGMpqBh-UHhG4h9nTN8Y',
    agenciesCount: 7,
    category: 'premium'
  },
  {
    id: '9',
    title: 'Digital Advertising (Online)',
    description: 'Social Media Ads, Google Ads, Video Ads',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9XGASdTS22TzqW2s5A07x8IvhylX0XEHIdzuBmE8o009GfCpWShkwFRVxBUDL-wYn-t89pEMc72ZSg54jYCMyoBOaEKTypKk2rYvXOpqZoXdeQVCtLVKGbN8GyMWs6xTd4iP6eIoMPFFfkcjE16E-RZonN8JhHe03RB_jPZ6h_eqtA5k7rGTrvtDnesB9l1IvHsaY_GFzyB6j3thV685RudD5k4n77A9GfRcU8GdBpBlWHlCBza-qkyxQNAJHmpDjZJ_wivUJUYc',
    agenciesCount: 30,
    category: 'digital'
  }
]

const categories = [
  { id: 'all', label: 'All' },
  { id: 'outdoor', label: 'Outdoor' },
  { id: 'digital', label: 'Digital' },
  { id: 'transit', label: 'Transit' },
  { id: 'indoor', label: 'Indoor' },
  { id: 'event', label: 'Event' },
  { id: 'premium', label: 'Premium' }
]

export default function AdvertisingChannelsPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOption, setSortOption] = useState<'featured' | 'agencies' | 'alpha'>('featured')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filteredChannels = channels.filter((channel) => {
    const matchesCategory = selectedCategory === 'all' || channel.category === selectedCategory
    const matchesSearch = 
      channel.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      channel.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const sortedChannels = [...filteredChannels].sort((a, b) => {
    if (sortOption === 'agencies') {
      return b.agenciesCount - a.agenciesCount
    }
    if (sortOption === 'alpha') {
      return a.title.localeCompare(b.title)
    }

    const channelOrder = new Map(channels.map((channel, index) => [channel.id, index]))
    return (channelOrder.get(a.id) ?? 0) - (channelOrder.get(b.id) ?? 0)
  })

  const handleChannelClick = (channelId: string) => {
    router.push(`/agencies?channel=${channelId}`)
  }

  const stats = [
    { label: 'Verified Agencies', value: '90+', detail: 'Across 12 major cities' },
    { label: 'Premium Spaces', value: '450+', detail: 'Billboards, DOOH & more' },
    { label: 'Avg. Approval Time', value: '24h', detail: 'Fast campaign kick-off' }
  ]

  const experienceHighlights = [
    {
      icon: Building2,
      title: 'Outdoor Inventory',
      description: 'Access highway, city-center, and high-footfall assets with verified occupancy data.'
    },
    {
      icon: Megaphone,
      title: 'Campaign Services',
      description: 'From creative to maintenance, collaborate with agencies that cover the full lifecycle.'
    },
    {
      icon: Globe2,
      title: 'National Coverage',
      description: 'Activate impactful campaigns across the Algerian territory with localized support.'
    }
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
              alt="City skyline"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/80 to-slate-900/70" />
          </div>

          <div className="relative z-10 grid gap-10 lg:grid-cols-2 p-8 sm:p-10 lg:p-16">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1.5 text-sm font-medium text-blue-200">
                <Sparkles className="w-4 h-4 text-blue-400" />
                Curated Channels • 2025 Edition
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white">
                  Choose the Perfect Advertising Channel
                </h1>
                <p className="mt-4 text-lg text-slate-300 max-w-xl">
                  Filter by objective, inventory type, and availability to craft campaigns that truly dominate Algeria&apos;s most strategic locations.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  className="h-14 rounded-2xl bg-gradient-to-r from-blue-500 via-teal-500 to-blue-400 text-white text-base"
                  onClick={() => router.push('/agencies')}
                >
                  Explore Agencies
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  className="h-14 rounded-2xl bg-white/10 text-slate-50 border border-white/20 hover:bg-white/20"
                  onClick={() => router.push('/create-agency-account')}
                >
                  Become a Partner
                </Button>
              </div>

              <div className="flex items-center gap-4 text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-teal-300" />
                  Nationwide placements
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-blue-300" />
                  Real-time availability
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Live Search</p>
                <span className="text-xs text-blue-300 bg-blue-500/10 px-3 py-1 rounded-full">Synced</span>
              </div>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search spaces or verticals"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border-white/10 text-slate-50 placeholder:text-slate-400 pl-12 pr-4 py-3 rounded-2xl focus-visible:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left hover:border-blue-400/60 transition-colors">
                    <p className="text-xs uppercase text-slate-400">Quick Pick</p>
                    <p className="text-lg font-semibold text-white">DOOH Screens</p>
                  </button>
                  <button className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left hover:border-teal-400/60 transition-colors">
                    <p className="text-xs uppercase text-slate-400">Location</p>
                    <p className="text-lg font-semibold text-white">Grand Algiers</p>
                  </button>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
                  <div>
                    <p className="text-xs uppercase text-slate-400">Next Campaign Start</p>
                    <p className="text-base font-semibold text-white">Within 5 days</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-teal-300" />
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
                placeholder="Search advertising spaces or agencies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/40 border-white/10 text-slate-50 placeholder:text-slate-400 pl-12 pr-4 py-3 rounded-2xl focus-visible:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-3">
              <select
                value={sortOption}
                onChange={(event) => setSortOption(event.target.value as typeof sortOption)}
                className="rounded-2xl bg-slate-900/40 border border-white/10 px-4 py-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="featured">Featured Order</option>
                <option value="agencies">Agencies Count</option>
                <option value="alpha">Alphabetical</option>
              </select>
              <div className="flex rounded-2xl border border-white/10 overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'px-4 py-2 text-sm font-medium transition-colors',
                    viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-slate-400'
                  )}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'px-4 py-2 text-sm font-medium transition-colors',
                    viewMode === 'list' ? 'bg-white/10 text-white' : 'text-slate-400'
                  )}
                >
                  List
                </button>
              </div>
              <button className="relative p-3 rounded-2xl bg-slate-900/40 border border-white/10 text-slate-300 hover:text-white">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-teal-400"></span>
              </button>
              <button className="p-3 rounded-2xl bg-slate-900/40 border border-white/10 text-slate-300 hover:text-white">
                <Settings className="w-5 h-5" />
              </button>
              <Link href="/dashboard/profile" className="rounded-2xl border border-white/10 overflow-hidden">
                <img
                  alt="User profile avatar"
                  className="w-12 h-12 object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVp1IbSrlohcNvo4Z_znB1Dl1Nf84t93pIIkn8B-CsCQW4jdWABgiEjFgOLlF-C36AXH5FH52ZP46dRSeEnkX_6DjFhnjI0pkXTVqbtiWkgB0VCCreCj4jtwRen5pl0035J2glUMZ2Vy0pRgzseHtdyn2oThUnIcDwp5V7C-zToF-JlJcBwrGcPanXgO6V92lRcuvB_W8dOTciQ9_RS3t4dE79y1IRDmYQ2ru_0hR25GTYjK-W_kezQMOuoVZCWk8d8YrZtCvZDOA"
                />
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  'px-5 py-2.5 text-sm font-medium rounded-full transition-all border',
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white border-transparent shadow-lg shadow-blue-500/25'
                    : 'border-white/10 text-slate-300 hover:text-white hover:border-blue-400/60'
                )}
              >
                {category.label}
              </button>
            ))}
          </div>
        </section>

        {/* Experience Highlights */}
        <section className="grid gap-6 md:grid-cols-3">
          {experienceHighlights.map((highlight) => (
            <div
              key={highlight.title}
              className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6 flex flex-col gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-white/10 p-3 text-blue-300">
                  <highlight.icon className="w-6 h-6" />
                </div>
                <p className="text-lg font-semibold text-white">{highlight.title}</p>
              </div>
              <p className="text-sm text-slate-300">{highlight.description}</p>
            </div>
          ))}
        </section>

        {/* Channels */}
        <section className="space-y-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold text-white">Discover Channels</h2>
            <p className="text-slate-400">Select a category to reveal agencies specialized in that medium.</p>
          </div>

          {sortedChannels.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/20 bg-white/5 py-16 text-center">
              <p className="text-slate-300 text-lg">No channels found matching your criteria.</p>
            </div>
          ) : (
            <div
              className={cn(
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
              )}
            >
              {sortedChannels.map((channel) => (
                <div
                  key={channel.id}
                  onClick={() => handleChannelClick(channel.id)}
                  className={cn(
                    'group cursor-pointer rounded-3xl border border-white/10 bg-white/5 overflow-hidden backdrop-blur-sm transition-all duration-300 hover:border-blue-400/60 hover:-translate-y-1',
                    viewMode === 'list' && 'md:flex md:items-stretch'
                  )}
                >
                  <div className={cn('relative overflow-hidden', viewMode === 'list' ? 'md:w-1/2' : 'h-48')}> 
                    <img
                      alt={channel.title}
                      src={channel.image}
                      className={cn(
                        'object-cover transition-transform duration-500 group-hover:scale-105',
                        viewMode === 'list' ? 'h-full w-full' : 'w-full h-full'
                      )}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/Adbridgelogo.png'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/10 to-transparent" />
                    <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white">
                      <Layers className="w-4 h-4" />
                      {channel.category}
                    </div>
                  </div>

                  <div className="p-6 flex flex-col gap-4 md:flex-1">
                    <div>
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-xl font-semibold text-white group-hover:text-blue-300">{channel.title}</h3>
                        <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-200">
                          {channel.agenciesCount} {channel.agenciesCount === 1 ? 'Agency' : 'Agencies'}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-300 line-clamp-2">{channel.description}</p>
                    </div>

                    <div className="flex items-center justify-between text-sm text-slate-400">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-teal-300" />
                        Featured placements available
                      </div>
                      <span className="flex items-center gap-2 font-semibold text-teal-300">
                        Explore
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* CTA */}
        <section className="rounded-[32px] border border-white/10 bg-gradient-to-r from-blue-500/20 to-teal-500/20 p-10" role="region" aria-label="cta">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-blue-200">Need a custom mix?</p>
              <h3 className="mt-3 text-3xl font-bold text-white">Brief us, and get a tailored channel plan in 24h.</h3>
              <p className="mt-2 text-slate-200">
                Share your objectives and we&apos;ll match you with the right blend of inventory, pricing, and agencies.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                className="h-12 rounded-2xl bg-white text-slate-900 font-semibold hover:bg-white/90 hover:text-slate-900"
                onClick={() => router.push('/contact')}
              >
                Talk to AdBridgeDZ
              </Button>
              <Button
                variant="secondary"
                className="h-12 rounded-2xl border border-white/40 text-slate-900 hover:text-slate-900 hover:bg-white/20"
                onClick={() => router.push('/create-account')}
              >
                Create Advertiser Account
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

