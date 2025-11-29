'use client'

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
  Users2
} from 'lucide-react'

interface ShowcaseSpace {
  name: string
  type: string
  reach: string
  occupancy: string
  image: string
}

interface Testimonial {
  author: string
  role: string
  quote: string
  rating: number
}

interface ServicePackage {
  title: string
  price: string
  features: string[]
}

interface AgencyProfile {
  id: string
  slug: string
  name: string
  location: string
  tagline: string
  heroImage: string
  summary: string
  specialties: string[]
  stats: { label: string; value: string; detail: string }[]
  contact: { phone: string; email: string; response: string }
  spaces: ShowcaseSpace[]
  testimonials: Testimonial[]
  packages: ServicePackage[]
}

const agencies: Record<string, AgencyProfile> = {
  '1': {
    id: '1',
    slug: 'digital-media-solutions',
    name: 'Digital Media Solutions',
    location: 'Algiers · Algeria',
    tagline: 'Premium urban digital experiences across DOOH and experiential activations.',
    heroImage: '/downtown.jpg',
    summary:
      'Partnering with nationwide brands to orchestrate data-driven outdoor storytelling across transit, lifestyle, and retail destinations.',
    specialties: ['Digital OOH Strategy', 'Experiential Production', 'Transit Wraps', 'Real-time Analytics'],
    stats: [
      { label: 'Verified spaces', value: '120+', detail: 'Screens & large-format surfaces' },
      { label: 'Avg. approval', value: '24h', detail: 'Service-level commitment' },
      { label: 'Audience reach', value: '14M', detail: 'Monthly urban impressions' }
    ],
    contact: {
      phone: '+213 770 123 456',
      email: 'hello@digitalmedia.dz',
      response: 'Replies in under 2 hours'
    },
    spaces: [
      {
        name: 'City Center Digital MegaScreen',
        type: 'Large-format LED',
        reach: '1.8M monthly',
        occupancy: 'Booked 76% of Q1',
        image: '/times_square.jpg'
      },
      {
        name: 'Skybridge Panorama Network',
        type: 'Transit wrap bundle',
        reach: '850K commuters',
        occupancy: 'Available for Q2',
        image: '/skyline.jpg'
      },
      {
        name: 'Mall Atrium Halo Cube',
        type: 'Indoor experiential',
        reach: '640K shoppers',
        occupancy: 'Premium weeks left',
        image: '/office.jpg'
      }
    ],
    testimonials: [
      {
        author: 'Salima H.',
        role: 'VP Brand · Atlas Beverages',
        quote: 'Their live ops dashboard removed so much friction. We green-lit a 6-week takeover in 36 hours.',
        rating: 5
      },
      {
        author: 'Yacine M.',
        role: 'Head of Media · Horizon Motors',
        quote: 'DMS delivered coverage across 4 cities with unified creative QC and weekly reporting.',
        rating: 5
      }
    ],
    packages: [
      {
        title: 'Launch Sprint',
        price: 'DZD 900K',
        features: ['2 hero placements', 'Creative QC + trafficking', 'Flight monitoring', 'Post-flight recap']
      },
      {
        title: 'National Impact',
        price: 'DZD 3.6M',
        features: ['City cluster strategy', 'Live dashboards', 'Production management', 'Weekly optimization']
      }
    ]
  }
}

interface AgencyProfilePageProps {
  agencyId?: string
}

export default function AgencyProfilePage({ agencyId }: AgencyProfilePageProps) {
  const agency = agencies[agencyId ?? '1'] ?? agencies['1']

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
            <img src={agency.heroImage} alt={agency.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/85 to-blue-900/80" />
          </div>
          <div className="relative z-10 grid gap-10 lg:grid-cols-[3fr,2fr] p-8 sm:p-12">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-3 text-sm text-blue-200">
                <MapPin className="w-4 h-4" />
                {agency.location}
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
                <Link href={`/dashboard/bookings?agency=${agency.slug}`}>
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
            <div className="grid gap-4 md:grid-cols-2">
              {agency.spaces.map((space) => (
                <div key={space.name} className="rounded-3xl border border-white/10 bg-slate-900/40 overflow-hidden">
                  <div className="h-32 w-full overflow-hidden">
                    <img src={space.image} alt={space.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-5 space-y-2">
                    <p className="text-sm font-semibold text-white">{space.name}</p>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{space.type}</p>
                    <p className="text-xs text-slate-400">Reach: {space.reach}</p>
                    <p className="text-xs text-slate-400">Status: {space.occupancy}</p>
                    <Button className="w-full rounded-2xl bg-white/10 text-white hover:bg-white/20 mt-2">
                      Add to brief
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Packages & testimonials */}
        <section className="grid gap-6 lg:grid-cols-[3fr,2fr]">
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 space-y-6">
            <p className="text-xs uppercase tracking-[0.4em] text-blue-200">Service menu</p>
            <h2 className="text-2xl font-semibold text-white">Studio packages</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {agency.packages.map((pkg) => (
                <div key={pkg.title} className="rounded-3xl border border-white/10 bg-slate-900/50 p-5 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-blue-200">
                    <BadgeDollarSign className="w-4 h-4" />
                    {pkg.title}
                  </div>
                  <p className="text-3xl font-bold text-white">{pkg.price}</p>
                  <ul className="space-y-2 text-sm text-slate-300">
                    {pkg.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-1 w-4 h-4 text-teal-300" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full rounded-2xl bg-gradient-to-r from-blue-500 to-teal-500">
                    Discuss package
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 space-y-6">
            <p className="text-xs uppercase tracking-[0.4em] text-blue-200">Client voice</p>
            <h2 className="text-2xl font-semibold text-white">Testimonials</h2>
            <div className="space-y-4">
              {agency.testimonials.map((review) => (
                <div key={review.author} className="rounded-3xl border border-white/10 bg-slate-900/40 p-5 space-y-3">
                  <div className="flex items-center gap-1 text-amber-300">
                    {Array.from({ length: review.rating }).map((_, index) => (
                      <Star key={`${review.author}-star-${index}`} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-200">“{review.quote}”</p>
                  <div>
                    <p className="text-sm font-semibold text-white">{review.author}</p>
                    <p className="text-xs text-slate-400">{review.role}</p>
                  </div>
                </div>
              ))}
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
              <Link href={`/dashboard/bookings?agency=${agency.slug}`}>
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
