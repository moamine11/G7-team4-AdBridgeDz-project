'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import {
  CalendarClock,
  MapPin,
  Building2,
  ArrowRight,
  Filter,
  Search,
  Sparkles
} from 'lucide-react'

type TabType = 'in-progress' | 'completed' | 'canceled'

type Booking = {
  id: number
  company: string
  email: string
  spaceTitle: string
  dates: string
  status: 'Awaiting approval' | 'Confirmed' | 'Canceled'
  offer: string
  agency: string
  channel: string
  location: string
}

const bookingData: Record<TabType, Booking[]> = {
  'in-progress': [
    {
      id: 1,
      company: 'Atlas Beverages',
      email: 'marketing@atlasbev.dz',
      spaceTitle: 'City Center Digital MegaScreen',
      dates: 'Mar 10 – Apr 15, 2025',
      status: 'Awaiting approval',
      offer: 'DZD 2.5M',
      agency: 'Digital Media Solutions',
      channel: 'Digital Outdoor Screens',
      location: 'Algiers, Downtown'
    },
    {
      id: 2,
      company: 'Tassili Airways',
      email: 'brand@tassiliair.com',
      spaceTitle: 'Highway Premium Billboard Cluster',
      dates: 'May 01 – Jun 30, 2025',
      status: 'Awaiting approval',
      offer: 'DZD 3.8M',
      agency: 'Alpha Communications',
      channel: 'Billboards & Roadside',
      location: 'Autoroute Est-Ouest'
    }
  ],
  completed: [
    {
      id: 3,
      company: 'NOVA Retail Group',
      email: 'agency@novaretail.com',
      spaceTitle: 'Mall Atrium LED Cube',
      dates: 'Jan 05 – Feb 29, 2025',
      status: 'Confirmed',
      offer: 'DZD 1.4M',
      agency: 'Mall Media Network',
      channel: 'Indoor Commercial',
      location: 'Bab Ezzouar Mall'
    }
  ],
  canceled: [
    {
      id: 4,
      company: 'Horizon Motors',
      email: 'media@horizonmotors.dz',
      spaceTitle: 'Tram Exterior Takeover',
      dates: 'Feb 01 – Mar 01, 2025',
      status: 'Canceled',
      offer: 'DZD 900K',
      agency: 'Transit Ads Algeria',
      channel: 'Transit Media',
      location: 'Constantine'
    }
  ]
}

const stats = [
  { label: 'Active Briefs', value: '03', detail: 'Requests awaiting action' },
  { label: 'Confirmed Campaigns', value: '07', detail: 'Delivering this quarter' },
  { label: 'Avg. Approval Time', value: '36h', detail: 'Across verified agencies' }
]

const tabs = [
  { id: 'in-progress', label: 'In Progress' },
  { id: 'completed', label: 'Completed' },
  { id: 'canceled', label: 'Canceled' }
]

export default function BookingRequestsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('in-progress')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredBookings = useMemo(() => {
    const list = bookingData[activeTab]
    if (!searchTerm.trim()) return list
    return list.filter((booking) =>
      [booking.company, booking.agency, booking.spaceTitle, booking.channel, booking.location]
        .join(' ')
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
  }, [activeTab, searchTerm])

  const statusColor = (status: Booking['status']) => {
    if (status === 'Confirmed') return 'text-emerald-300'
    if (status === 'Canceled') return 'text-rose-300'
    return 'text-amber-300'
  }

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-50">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(59,130,246,0.25), transparent 45%), radial-gradient(circle at 80% 0%, rgba(45,212,191,0.2), transparent 40%), radial-gradient(circle at 50% 100%, rgba(147,51,234,0.15), transparent 35%)'
        }}
      />

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-24 space-y-10">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-r from-slate-900/80 via-slate-900/60 to-blue-900/70 backdrop-blur-xl">
          <div className="absolute inset-0 opacity-60">
            <img src="/times_square.jpg" alt="Bookings" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/80 to-slate-900/70" />
          </div>

          <div className="relative z-10 grid gap-8 lg:grid-cols-2 p-8 sm:p-10 lg:p-16">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">
                <Sparkles className="w-4 h-4 text-blue-300" />
                Bookings hub
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white">Manage your requests end-to-end</h1>
                <p className="mt-3 text-slate-300 text-lg">
                  Track every proposal, collaborate with agencies, and confirm placements without leaving AdBridgeDZ.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/channels">
                  <Button className="h-12 rounded-2xl bg-gradient-to-r from-blue-500 via-teal-500 to-blue-400">
                    Browse new channels
                  </Button>
                </Link>
                <Link href="/agencies">
                  <Button
                    variant="secondary"
                    className="h-12 rounded-2xl border border-white/20 bg-white/10 text-white"
                  >
                    Contact agencies
                  </Button>
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 space-y-5">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Snapshot</p>
                <span className="text-xs text-blue-300 bg-blue-500/10 px-3 py-1 rounded-full">Live sync</span>
              </div>
              <div className="space-y-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{stat.label}</p>
                    <p className="mt-2 text-3xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-slate-400">{stat.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="rounded-[32px] border border-white/10 bg-white/5 p-6 md:p-8 space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="flex gap-3">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={cn(
                    'rounded-2xl border px-4 py-2 text-sm font-semibold transition-all',
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white border-transparent shadow-lg shadow-blue-500/20'
                      : 'border-white/10 text-slate-300 hover:text-white'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by brand, agency, channel, or city"
                className="w-full bg-slate-900/40 border-white/10 text-slate-100 placeholder:text-slate-400 pl-12"
              />
            </div>

            <button className="flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-2 text-sm text-slate-300">
              <Filter className="w-4 h-4" />
              Advanced filters
            </button>
          </div>
        </section>

        {/* Bookings list */}
        <section className="space-y-4">
          {filteredBookings.length === 0 && (
            <div className="rounded-[32px] border border-dashed border-white/20 bg-white/5 py-16 text-center">
              <p className="text-slate-400 text-lg">No {activeTab.replace('-', ' ')} bookings yet.</p>
              <p className="text-sm text-slate-500 mt-2">Launch a brief from the channels page to get started.</p>
            </div>
          )}

          {filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="rounded-[32px] border border-white/10 bg-white/5 p-6 md:p-8 hover:border-blue-400/60 transition-all"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/30 to-teal-500/30 flex items-center justify-center text-lg font-bold text-white">
                        {booking.company.slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Brand</p>
                        <h3 className="text-xl font-semibold text-white">{booking.company}</h3>
                        <p className="text-xs text-slate-400">{booking.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Space</p>
                      <p className="mt-2 text-sm font-semibold text-white">{booking.spaceTitle}</p>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" /> {booking.location}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Dates</p>
                      <p className="mt-2 text-sm font-semibold text-white flex items-center gap-2">
                        <CalendarClock className="w-4 h-4 text-blue-300" />
                        {booking.dates}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Offer</p>
                      <p className="mt-2 text-2xl font-bold text-white">{booking.offer}</p>
                      <p className="text-xs text-slate-400">Channel: {booking.channel}</p>
                    </div>
                  </div>
                </div>

                <div className="w-full lg:max-w-sm space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-5">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Agency</p>
                    <div className="mt-2 flex items-center gap-3">
                      <Building2 className="w-5 h-5 text-blue-300" />
                      <div>
                        <p className="text-sm font-semibold text-white">{booking.agency}</p>
                        <p className="text-xs text-slate-400">{booking.channel}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-sm">
                      <span className={cn('font-semibold', statusColor(booking.status))}>{booking.status}</span>
                      <Link
                        href={`/agencies/${booking.id}`}
                        className="text-teal-200 hover:text-teal-100 flex items-center gap-1"
                      >
                        View agency
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {activeTab === 'in-progress' && (
                      <>
                        <Button className="flex-1 rounded-2xl bg-gradient-to-r from-blue-500 to-teal-500">
                          Approve proposal
                        </Button>
                        <Button
                          variant="secondary"
                          className="rounded-2xl border border-white/20 text-white"
                        >
                          Request edit
                        </Button>
                      </>
                    )}
                    {activeTab === 'completed' && (
                      <Button className="flex-1 rounded-2xl bg-gradient-to-r from-blue-500 to-teal-500">
                        View performance
                      </Button>
                    )}
                    {activeTab === 'canceled' && (
                      <Button className="flex-1 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-400">
                        Reopen brief
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* CTA */}
        <section className="rounded-[32px] border border-white/10 bg-gradient-to-r from-blue-500/20 to-teal-500/20 p-10" role="region" aria-label="cta">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-blue-200">Need help?</p>
              <h3 className="mt-3 text-3xl font-bold text-white">Connect with AdBridgeDZ operations for concierge booking.</h3>
              <p className="mt-2 text-slate-200">We will coordinate approvals, asset delivery, and go-live tracking with all selected agencies.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="h-12 rounded-2xl bg-white text-slate-900 font-semibold hover:bg-white/90">
                Talk to operations
              </Button>
              <Button
                variant="secondary"
                className="h-12 rounded-2xl border border-white/40 text-white hover:text-white hover:bg-white/20"
              >
                Review SLAs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}