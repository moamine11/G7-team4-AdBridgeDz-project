'use client'

import { useState } from 'react'
import {
  Sparkles,
  Building2,
  MapPin,
  ArrowRight,
  Upload,
  CalendarCheck,
  Phone,
  Mail,
  FileText,
  CheckCircle2,
  Star
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

const upcomingCampaigns = [
  {
    title: 'Ramadan Awareness Push',
    period: 'Mar 10 – Apr 15',
    status: 'Creative in review',
    budget: 'DZD 18M'
  },
  {
    title: 'Summer Beverage Launch',
    period: 'Jun 01 – Jul 30',
    status: 'Awaiting agency shortlist',
    budget: 'DZD 24M'
  },
  {
    title: 'Back-to-School Pulse',
    period: 'Aug 20 – Sep 15',
    status: 'Brief drafting',
    budget: 'DZD 11M'
  }
]

const savedAgencies = [
  {
    name: 'Digital Media Solutions',
    specialty: 'DOOH Screens',
    status: 'Awaiting deck',
    score: 92
  },
  {
    name: 'Alpha Communications',
    specialty: 'Highway Billboards',
    status: 'Budget approved',
    score: 88
  },
  {
    name: 'Creative Studio Algeria',
    specialty: 'Production + Installation',
    status: 'Kick-off scheduled',
    score: 95
  }
]

const goalOptions = [
  'Brand Awareness',
  'Product Launch',
  'Lead Generation',
  'Store Footfall',
  'Sponsorship Amplification',
  'Seasonal Campaign'
]

const communicationOptions = [
  { id: 'email', label: 'Email updates' },
  { id: 'phone', label: 'Phone syncs' },
  { id: 'slack', label: 'Slack / Teams channel' },
  { id: 'whatsapp', label: 'WhatsApp status alerts' }
]

type ProfileState = {
  companyName: string
  brandTagline: string
  email: string
  phone: string
  website: string
  location: string
  industry: string
  teamSize: string
  budgetRange: string
  decisionWindow: string
  brandGuidelinesUrl: string
  notes: string
}

const initialProfile: ProfileState = {
  companyName: 'Atlas Beverages',
  brandTagline: 'Hydration for the new generation.',
  email: 'marketing@atlasbev.dz',
  phone: '+213 555 789 001',
  website: 'https://atlasbev.dz',
  location: 'Algiers, Algeria',
  industry: 'FMCG / Beverage',
  teamSize: '51-200 employees',
  budgetRange: 'DZD 15M - DZD 25M per quarter',
  decisionWindow: '2-3 weeks',
  brandGuidelinesUrl: 'https://brandhub.atlasbev.dz/style-guide',
  notes: 'Priority on DOOH + premium city center wraps. Require bilingual messaging (AR/FR).'
}

export default function ProfileCompanyPage() {
  const [profile, setProfile] = useState<ProfileState>(initialProfile)
  const [selectedGoals, setSelectedGoals] = useState<string[]>(['Brand Awareness', 'Product Launch'])
  const [communicationPrefs, setCommunicationPrefs] = useState<Record<string, boolean>>({
    email: true,
    phone: false,
    slack: true,
    whatsapp: true
  })

  const handleProfileChange = (field: keyof ProfileState, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log('Profile saved', profile, selectedGoals, communicationPrefs)
  }

  const toggleGoal = (goal: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((item) => item !== goal) : [...prev, goal]
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

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-24 space-y-10">
        <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-r from-slate-900/80 via-slate-900/60 to-blue-900/70 backdrop-blur-xl">
          <div className="absolute inset-0 opacity-60">
            <img
              src="/times_square.jpg"
              alt="City skyline"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/80 to-slate-900/60" />
          </div>

          <div className="relative z-10 grid gap-8 lg:grid-cols-3 p-8 sm:p-10 lg:p-14">
            <div className="lg:col-span-2 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">
                <Sparkles className="w-4 h-4 text-blue-300" />
                Company Profile
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-2xl font-bold">
                  AB
                </div>
                <div className="min-w-[220px]">
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Primary brand</p>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white">{profile.companyName}</h1>
                  <p className="text-slate-300 mt-1">{profile.brandTagline}</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Quarterly budget</p>
                  <p className="mt-2 text-2xl font-semibold text-white">DZD 22M</p>
                  <p className="text-xs text-slate-400">45% reserved for DOOH</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Status</p>
                  <p className="mt-2 text-2xl font-semibold text-white flex items-center gap-1">
                    Ready <CheckCircle2 className="w-4 h-4 text-teal-300" />
                  </p>
                  <p className="text-xs text-slate-400">Assets synced 2 days ago</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Next decision window</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{profile.decisionWindow}</p>
                  <p className="text-xs text-slate-400">Fast-track available</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button className="rounded-2xl bg-gradient-to-r from-blue-500 via-teal-500 to-blue-400">
                  Upload Brand Deck
                </Button>
                <Button
                  variant="secondary"
                  className="rounded-2xl border border-white/20 bg-white/10 text-white"
                >
                  Preview Latest Brief
                </Button>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 space-y-5">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Key contacts</p>
                <div className="mt-3 space-y-2 text-sm text-slate-200">
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-300" /> {profile.email}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-teal-300" /> {profile.phone}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" /> {profile.location}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Latest note</p>
                <p className="mt-2">{profile.notes}</p>
              </div>
              <div className="text-xs text-slate-400">
                Last synced: 2 hours ago • Owner: Brand Partnerships Squad
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            { label: 'Active briefs', value: '03', detail: 'With delivery timelines' },
            { label: 'Agencies engaged', value: '08', detail: '4 verified partners shortlisted' },
            { label: 'Creative assets', value: '12', detail: 'Logos, videos, guidelines' }
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-blue-500/5">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{stat.label}</p>
              <p className="mt-2 text-3xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-slate-300">{stat.detail}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 md:p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-white">Brand & Account Details</h2>
                  <span className="text-xs uppercase tracking-[0.3em] text-slate-400">Core info</span>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-semibold text-slate-200 mb-2 block">Company name</label>
                    <Input
                      value={profile.companyName}
                      onChange={(e) => handleProfileChange('companyName', e.target.value)}
                      className="bg-slate-900/40 border-white/10 text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-200 mb-2 block">Brand tagline</label>
                    <Input
                      value={profile.brandTagline}
                      onChange={(e) => handleProfileChange('brandTagline', e.target.value)}
                      className="bg-slate-900/40 border-white/10 text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-200 mb-2 block">Industry</label>
                    <Input
                      value={profile.industry}
                      onChange={(e) => handleProfileChange('industry', e.target.value)}
                      className="bg-slate-900/40 border-white/10 text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-200 mb-2 block">Team size</label>
                    <Input
                      value={profile.teamSize}
                      onChange={(e) => handleProfileChange('teamSize', e.target.value)}
                      className="bg-slate-900/40 border-white/10 text-slate-100"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-semibold text-slate-200 mb-2 block">Email</label>
                    <Input
                      type="email"
                      value={profile.email}
                      onChange={(e) => handleProfileChange('email', e.target.value)}
                      className="bg-slate-900/40 border-white/10 text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-200 mb-2 block">Phone</label>
                    <Input
                      value={profile.phone}
                      onChange={(e) => handleProfileChange('phone', e.target.value)}
                      className="bg-slate-900/40 border-white/10 text-slate-100"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-semibold text-slate-200 mb-2 block">Website</label>
                    <Input
                      value={profile.website}
                      onChange={(e) => handleProfileChange('website', e.target.value)}
                      className="bg-slate-900/40 border-white/10 text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-200 mb-2 block">Location</label>
                    <Input
                      value={profile.location}
                      onChange={(e) => handleProfileChange('location', e.target.value)}
                      className="bg-slate-900/40 border-white/10 text-slate-100"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 md:p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-white">Campaign Preferences</h2>
                  <span className="text-xs uppercase tracking-[0.3em] text-slate-400">Strategy</span>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-semibold text-slate-200 mb-2 block">Budget range</label>
                    <Input
                      value={profile.budgetRange}
                      onChange={(e) => handleProfileChange('budgetRange', e.target.value)}
                      className="bg-slate-900/40 border-white/10 text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-200 mb-2 block">Decision window</label>
                    <Input
                      value={profile.decisionWindow}
                      onChange={(e) => handleProfileChange('decisionWindow', e.target.value)}
                      className="bg-slate-900/40 border-white/10 text-slate-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-200 mb-3 block">Primary goals</label>
                  <div className="flex flex-wrap gap-3">
                    {goalOptions.map((goal) => (
                      <button
                        type="button"
                        key={goal}
                        onClick={() => toggleGoal(goal)}
                        className={cn(
                          'rounded-full border px-5 py-2 text-sm font-medium transition-all',
                          selectedGoals.includes(goal)
                            ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white border-transparent shadow-lg shadow-blue-500/20'
                            : 'border-white/10 text-slate-300 hover:text-white'
                        )}
                      >
                        {goal}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-200 mb-3 block">Context & notes</label>
                  <Textarea
                    value={profile.notes}
                    onChange={(e) => handleProfileChange('notes', e.target.value)}
                    className="bg-slate-900/40 border-white/10 text-slate-100 min-h-[120px]"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-semibold text-slate-200 mb-2 block">Brand guidelines link</label>
                    <Input
                      value={profile.brandGuidelinesUrl}
                      onChange={(e) => handleProfileChange('brandGuidelinesUrl', e.target.value)}
                      className="bg-slate-900/40 border-white/10 text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-200 mb-3 block">Asset uploads</label>
                    <div className="rounded-2xl border-2 border-dashed border-white/20 p-4 text-center text-sm text-slate-300">
                      <Upload className="w-6 h-6 mx-auto mb-2 text-blue-300" />
                      Drop logo packs, videos, or PDF briefs (max 200MB)
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 md:p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-white">Communication preferences</h2>
                    <p className="text-sm text-slate-400">Choose how AdBridgeDZ and agencies keep you updated.</p>
                  </div>
                  <span className="text-xs uppercase tracking-[0.3em] text-slate-400">Collaboration</span>
                </div>

                <div className="mt-6 space-y-4">
                  {communicationOptions.map((option) => (
                    <label
                      key={option.id}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                    >
                      <span className="text-sm font-medium text-slate-200">{option.label}</span>
                      <Switch
                        checked={communicationPrefs[option.id]}
                        onCheckedChange={(checked) =>
                          setCommunicationPrefs((prev) => ({ ...prev, [option.id]: checked }))
                        }
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-400">Changes auto-save to drafts. Share brief when you are ready.</p>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    className="rounded-2xl border border-white/20 text-white"
                  >
                    Save draft
                  </Button>
                  <Button type="submit" className="rounded-2xl bg-gradient-to-r from-blue-500 via-teal-500 to-blue-400">
                    Share with agencies
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </form>
          </div>

          <div className="space-y-6">
            <div className="rounded-[32px] border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">Saved agencies</h3>
                <span className="text-xs uppercase tracking-[0.3em] text-slate-400">Shortlist</span>
              </div>
              <div className="mt-5 space-y-4">
                {savedAgencies.map((agency) => (
                  <div key={agency.name} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-white">{agency.name}</p>
                        <p className="text-xs text-slate-400">{agency.specialty}</p>
                      </div>
                      <span className="text-xs font-semibold text-teal-200">Score {agency.score}</span>
                    </div>
                    <p className="mt-3 text-xs text-slate-400">{agency.status}</p>
                  </div>
                ))}
              </div>
              <Button
                variant="secondary"
                className="mt-4 w-full rounded-2xl border border-white/20 text-white"
              >
                Manage shortlist
              </Button>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">Upcoming campaigns</h3>
                <span className="text-xs uppercase tracking-[0.3em] text-slate-400">Timeline</span>
              </div>
              <div className="mt-5 space-y-4">
                {upcomingCampaigns.map((campaign) => (
                  <div key={campaign.title} className="rounded-2xl border border-white/10 bg-slate-900/40 p-4">
                    <p className="text-sm font-semibold text-white">{campaign.title}</p>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                      <CalendarCheck className="w-3 h-3" /> {campaign.period}
                    </p>
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-300">
                      <span>{campaign.status}</span>
                      <span className="text-teal-200 font-semibold">{campaign.budget}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-blue-300" />
                <h3 className="text-xl font-semibold text-white">Quick actions</h3>
              </div>
              <div className="space-y-3 text-sm text-slate-200">
                <button className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left hover:border-blue-400/60">
                  <div className="font-semibold text-white">Book strategy session</div>
                  <p className="text-xs text-slate-400">Align with AdBridgeDZ planners next week.</p>
                </button>
                <button className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left hover:border-blue-400/60">
                  <div className="font-semibold text-white">Request performance report</div>
                  <p className="text-xs text-slate-400">Compile last quarter impressions & CPVs.</p>
                </button>
                <button className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left hover:border-blue-400/60">
                  <div className="font-semibold text-white">Invite teammate</div>
                  <p className="text-xs text-slate-400">Add procurement or finance approvers.</p>
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-white/10 bg-gradient-to-r from-blue-500/20 to-teal-500/20 p-10" role="region" aria-label="cta">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-blue-200">Need strategic support?</p>
              <h3 className="mt-3 text-3xl font-bold text-white">Partner with an AdBridgeDZ strategist for full-funnel planning.</h3>
              <p className="mt-2 text-slate-200">Share KPIs and we will co-build your channel mix, delivery calendar, and verification workflow.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="h-12 rounded-2xl bg-white text-slate-900 font-semibold hover:bg-white/90 hover:text-slate-900">
                Talk to Strategy Team
              </Button>
              <Button
                variant="secondary"
                className="h-12 rounded-2xl border border-white/40 text-white hover:text-white hover:bg-white/20"
              >
                View Collaboration Guide
                <FileText className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
