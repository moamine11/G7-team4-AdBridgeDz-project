'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  BadgeDollarSign,
  CalendarRange,
  CheckCircle2,
  Mail,
  MapPin,
  PhoneCall,
  Star,
  Users2,
  Globe
} from 'lucide-react'
import { agenciesService } from '@/lib/services/agencies-service'
import { postsService } from '@/lib/services/posts-service'

interface ShowcaseSpace {
  id: string
  name: string
  type: string
  reach: string
  occupancy: string
  image: string
  price: string
}

interface AgencyProfile {
  _id: string
  name: string
  location: string
  tagline: string
  heroImage: string
  summary: string
  specialties: string[]
  stats: { label: string; value: string; detail: string }[]
  contact: { phone: string; email: string; response: string; website: string }
  spaces: ShowcaseSpace[]
  testimonials: any[]
  packages: any[]
  verified: boolean
  logo: string
}

interface AgencyProfilePageProps {
  agencyId?: string
}

export default function AgencyProfilePage({ agencyId }: AgencyProfilePageProps) {
  const [agency, setAgency] = useState<AgencyProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!agencyId) return

      try {
        setIsLoading(true)
        // Fetch agency details
        const agencyData = await agenciesService.getAgencyById(agencyId)
        
        // Fetch agency spaces
        const allPosts = await postsService.getAllPosts()
        const agencySpaces = allPosts.filter((post: any) => 
          post.agency === agencyId || post.agency?._id === agencyId
        )

        // Map data to component structure
        const mappedAgency: AgencyProfile = {
          _id: agencyData._id,
          name: agencyData.name,
          location: agencyData.location || agencyData.address || 'Algiers, Algeria',
          tagline: agencyData.tagline || 'Premium Advertising Partner',
          heroImage: agencyData.serviceImage || '/downtown.jpg',
          summary: agencyData.profileDescription || 'No description available.',
          specialties: agencyData.services || [],
          stats: [
            { label: 'Verified spaces', value: `${agencySpaces.length}+`, detail: 'Active listings' },
            { label: 'Avg. approval', value: '24h', detail: 'Service-level commitment' },
            { label: 'Rating', value: `${(agencyData.rating || 5).toFixed(1)}`, detail: `From ${agencyData.reviewCount || 0} reviews` }
          ],
          contact: {
            phone: agencyData.phone || '',
            email: agencyData.email || '',
            response: 'Replies in under 24 hours',
            website: agencyData.website || ''
          },
          spaces: agencySpaces.map((space: any) => ({
            id: space._id,
            name: space.title,
            type: space.type || 'Billboard',
            reach: 'High Traffic', // Placeholder as backend might not have this yet
            occupancy: 'Available',
            image: space.images && space.images.length > 0 ? space.images[0] : '/placeholder-space.jpg',
            price: space.price
          })),
          testimonials: [], // Placeholder
          packages: [], // Placeholder
          verified: agencyData.verified,
          logo: agencyData.logo
        }

        setAgency(mappedAgency)
      } catch (error) {
        console.error('Failed to fetch agency profile:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [agencyId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-blue-500"></span>
      </div>
    )
  }

  if (!agency) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        Agency not found.
      </div>
    )
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

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-24 space-y-12">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-blue-900/70">
          <div className="absolute inset-0">
            <img 
              src={agency.heroImage} 
              alt={agency.name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/downtown.jpg'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/85 to-blue-900/80" />
          </div>
          <div className="relative z-10 grid gap-10 lg:grid-cols-[3fr,2fr] p-8 sm:p-12">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-3 text-sm text-blue-200">
                <MapPin className="w-4 h-4" />
                {agency.location}
                {agency.verified && (
                  <span className="flex items-center gap-1 text-teal-300 ml-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Verified Partner
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">{agency.name}</h1>
              <p className="text-lg text-slate-200 max-w-2xl">{agency.tagline}</p>
              <p className="text-sm text-slate-400 max-w-3xl">{agency.summary}</p>
              <div className="flex flex-wrap gap-3">
                {agency.specialties.map((item) => (
                  <span key={item} className="rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-200">
                    {item}
                  </span>
                ))}
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href={`/contact?agency=${agency._id}`}>
                  <Button className="h-12 rounded-2xl bg-gradient-to-r from-blue-500 via-teal-500 to-blue-400 flex items-center gap-2">
                    Request booking
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Button
                  variant="secondary"
                  className="h-12 rounded-2xl border border-white/20 bg-white/10 text-white"
                >
                  Download credentials
                </Button>
              </div>
            </div>

            <div className="space-y-4 rounded-[28px] border border-white/10 bg-slate-900/60 p-6 backdrop-blur">
              {agency.stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{stat.label}</p>
                  <p className="mt-2 text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-slate-400">{stat.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="grid gap-6 lg:grid-cols-[2fr,3fr]">
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 space-y-6">
            <p className="text-xs uppercase tracking-[0.4em] text-blue-200">Agency desk</p>
            <h2 className="text-2xl font-semibold text-white">Concierge contact</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-200">
                <PhoneCall className="w-5 h-5 text-blue-300" />
                <span>{agency.contact.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-200">
                <Mail className="w-5 h-5 text-blue-300" />
                <span>{agency.contact.email}</span>
              </div>
              {agency.contact.website && (
                <div className="flex items-center gap-3 text-slate-200">
                  <Globe className="w-5 h-5 text-blue-300" />
                  <a href={agency.contact.website} target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition-colors">
                    Visit Website
                  </a>
                </div>
              )}
              <p className="text-sm text-slate-400">{agency.contact.response}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-5 space-y-3">
              <div className="flex items-center gap-3 text-slate-200">
                <CalendarRange className="w-5 h-5 text-blue-300" />
                <div>
                  <p className="text-sm font-semibold text-white">Production lead times</p>
                  <p className="text-xs text-slate-400">Standard 10 business days · Rush 72h</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-200">
                <Users2 className="w-5 h-5 text-blue-300" />
                <div>
                  <p className="text-sm font-semibold text-white">Dedicated pod</p>
                  <p className="text-xs text-slate-400">Account lead, ops manager, creative QC</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 space-y-6">
            <p className="text-xs uppercase tracking-[0.4em] text-blue-200">Verified inventory</p>
            <h2 className="text-2xl font-semibold text-white">Highlighted networks</h2>
            {agency.spaces.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                No advertising spaces listed yet.
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {agency.spaces.map((space) => (
                  <div key={space.id} className="rounded-3xl border border-white/10 bg-slate-900/40 overflow-hidden group hover:border-blue-500/30 transition-colors">
                    <div className="h-32 w-full overflow-hidden relative">
                      <img 
                        src={space.image} 
                        alt={space.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/placeholder-space.jpg'
                        }}
                      />
                      <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-semibold text-white">
                        {space.price} DZD
                      </div>
                    </div>
                    <div className="p-5 space-y-2">
                      <p className="text-sm font-semibold text-white line-clamp-1">{space.name}</p>
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{space.type}</p>
                      <p className="text-xs text-slate-400">Reach: {space.reach}</p>
                      <p className="text-xs text-slate-400">Status: {space.occupancy}</p>
                      <Link href={`/book/${space.id}`}>
                        <Button className="w-full rounded-2xl bg-white/10 text-white hover:bg-white/20 mt-2">
                          Book Now
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Packages & testimonials */}
        <section className="grid gap-6 lg:grid-cols-[3fr,2fr]">
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 space-y-6">
            <p className="text-xs uppercase tracking-[0.4em] text-blue-200">Service menu</p>
            <h2 className="text-2xl font-semibold text-white">Studio packages</h2>
            <div className="text-center py-12 text-slate-400 border border-dashed border-white/10 rounded-3xl">
              Custom packages available upon request.
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 space-y-6">
            <p className="text-xs uppercase tracking-[0.4em] text-blue-200">Client voice</p>
            <h2 className="text-2xl font-semibold text-white">Testimonials</h2>
            <div className="text-center py-12 text-slate-400 border border-dashed border-white/10 rounded-3xl">
              No testimonials yet.
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-[32px] border border-white/10 bg-gradient-to-r from-blue-500/20 via-teal-500/20 to-blue-500/20 p-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-blue-200">Next step</p>
              <h3 className="mt-3 text-3xl font-bold text-white">Deploy this agency across your upcoming brief.</h3>
              <p className="mt-2 text-slate-200">Sync with AdBridgeDZ operations to align deliverables, KPIs, and reporting cadence.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href={`/contact?agency=${agency._id}`}>
                <Button className="h-12 rounded-2xl bg-white text-slate-900 font-semibold hover:bg-white/90 flex items-center gap-2">
                  Open booking request
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Button
                variant="secondary"
                className="h-12 rounded-2xl border border-white/40 text-white hover:text-white hover:bg-white/20"
              >
                Share with team
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
