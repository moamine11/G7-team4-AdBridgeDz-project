'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import Logo from '@/components/ui/logo'
import { Button } from '@/components/ui/button'

const API_BASE_URL = 'https://backend-se-7rkj.onrender.com/api'

type AnalyticsOverview = {
  companiesTotal: number
  agenciesTotal: number
  companiesPending: number
  agenciesPending: number
  bookingsTotal: number
  bookingsLast7Days: number
  bookingsLast30Days: number
}

type BookingsDaily = {
  days: number
  start: string
  series: Array<{ date: string; count: number }>
}

type TopCities = {
  topAgencyCities: Array<{ city: string; count: number }>
  topCompanyLocations: Array<{ location: string; count: number }>
  topBookingCitiesByAgency: Array<{ city: string; count: number }>
}

type PendingAgency = {
  _id: string
  agencyName: string
  email: string
  isVerified: boolean
  businessRegistrationNumber?: string
  rcDocument?: string
  nifNisDocument?: string
  daysLeftInSubscription?: number
}

type PendingCompany = {
  _id: string
  name: string
  email: string
  isVerified: boolean
  industrySector?: string
  daysLeftInSubscription?: number
}

type TopAgency = {
  _id: string
  agencyName: string
  email: string
  bookingCount: number
}

type TopCompany = {
  _id: string
  name: string
  email: string
  bookingCount: number
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [signupTab, setSignupTab] = useState<'companies' | 'agencies'>('companies')
  const [accountsTab, setAccountsTab] = useState<'companies' | 'agencies'>('companies')

  const [analyticsOverview, setAnalyticsOverview] = useState<AnalyticsOverview | null>(null)
  const [bookingsDaily, setBookingsDaily] = useState<BookingsDaily | null>(null)
  const [topCities, setTopCities] = useState<TopCities | null>(null)

  const [pendingCompanies, setPendingCompanies] = useState<PendingCompany[]>([])
  const [pendingAgencies, setPendingAgencies] = useState<PendingAgency[]>([])
  const [accountsCompanies, setAccountsCompanies] = useState<PendingCompany[]>([])
  const [accountsAgencies, setAccountsAgencies] = useState<PendingAgency[]>([])

  const [topCompanies, setTopCompanies] = useState<TopCompany[]>([])
  const [topAgencies, setTopAgencies] = useState<TopAgency[]>([])

  const [loading, setLoading] = useState({
    analytics: true,
    pendingCompanies: true,
    pendingAgencies: true,
    accountsCompanies: true,
    accountsAgencies: true,
    topCompanies: true,
    topAgencies: true,
  })

  const token = useMemo(() => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('token')
  }, [])

  const userType = useMemo(() => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('userType')
  }, [])

  const authHeaders = useMemo(() => {
    // Admin API requires Admin JWT
    const headers: Record<string, string> = {}
    if (token) headers.Authorization = `Bearer ${token}`
    return headers
  }, [token])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userType')
    router.push('/login')
  }

  useEffect(() => {
    if (!token || userType !== 'admin') {
      router.replace('/login')
      return
    }

    const run = async () => {
      const handleAuthFailure = (status: number) => {
        if (status === 401 || status === 403) {
          localStorage.removeItem('token')
          localStorage.removeItem('userType')
          router.replace('/login')
          return true
        }
        return false
      }

      try {
        setLoading((p) => ({ ...p, analytics: true }))
        const [overviewRes, dailyRes, citiesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/admin/analytics/overview`, { headers: authHeaders }),
          fetch(`${API_BASE_URL}/admin/analytics/bookings-daily?days=14`, { headers: authHeaders }),
          fetch(`${API_BASE_URL}/admin/analytics/top-cities?limit=5`, { headers: authHeaders }),
        ])

        if (handleAuthFailure(overviewRes.status) || handleAuthFailure(dailyRes.status) || handleAuthFailure(citiesRes.status)) {
          return
        }

        setAnalyticsOverview(overviewRes.ok ? await overviewRes.json() : null)
        setBookingsDaily(dailyRes.ok ? await dailyRes.json() : null)
        setTopCities(citiesRes.ok ? await citiesRes.json() : null)
      } finally {
        setLoading((p) => ({ ...p, analytics: false }))
      }

      try {
        setLoading((p) => ({ ...p, pendingCompanies: true }))
        const res = await fetch(`${API_BASE_URL}/admin/companies/pending`, { headers: authHeaders })
        if (handleAuthFailure(res.status)) return
        const data = await res.json()
        setPendingCompanies(res.ok ? data : [])
      } finally {
        setLoading((p) => ({ ...p, pendingCompanies: false }))
      }

      try {
        setLoading((p) => ({ ...p, pendingAgencies: true }))
        const res = await fetch(`${API_BASE_URL}/admin/agencies/pending`, { headers: authHeaders })
        if (handleAuthFailure(res.status)) return
        const data = await res.json()
        setPendingAgencies(res.ok ? data : [])
      } finally {
        setLoading((p) => ({ ...p, pendingAgencies: false }))
      }

      try {
        setLoading((p) => ({ ...p, accountsCompanies: true }))
        const res = await fetch(`${API_BASE_URL}/admin/companies/verified`, { headers: authHeaders })
        if (handleAuthFailure(res.status)) return
        const data = await res.json()
        setAccountsCompanies(res.ok ? data : [])
      } finally {
        setLoading((p) => ({ ...p, accountsCompanies: false }))
      }

      try {
        setLoading((p) => ({ ...p, accountsAgencies: true }))
        const res = await fetch(`${API_BASE_URL}/admin/agencies/verified`, { headers: authHeaders })
        if (handleAuthFailure(res.status)) return
        const data = await res.json()
        setAccountsAgencies(res.ok ? data : [])
      } finally {
        setLoading((p) => ({ ...p, accountsAgencies: false }))
      }

      try {
        setLoading((p) => ({ ...p, topCompanies: true }))
        const res = await fetch(`${API_BASE_URL}/admin/companies/top-by-bookings?limit=5`, { headers: authHeaders })
        if (handleAuthFailure(res.status)) return
        const data = await res.json()
        setTopCompanies(res.ok ? data : [])
      } finally {
        setLoading((p) => ({ ...p, topCompanies: false }))
      }

      try {
        setLoading((p) => ({ ...p, topAgencies: true }))
        const res = await fetch(`${API_BASE_URL}/admin/agencies/top-by-bookings?limit=5`, { headers: authHeaders })
        if (handleAuthFailure(res.status)) return
        const data = await res.json()
        setTopAgencies(res.ok ? data : [])
      } finally {
        setLoading((p) => ({ ...p, topAgencies: false }))
      }
    }

    run().catch(() => {
      setLoading({
        analytics: false,
        pendingCompanies: false,
        pendingAgencies: false,
        accountsCompanies: false,
        accountsAgencies: false,
        topCompanies: false,
        topAgencies: false,
      })
    })
  }, [authHeaders, router, token, userType])

  const acceptCompany = async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/admin/companies/${id}/verify`, { method: 'PATCH', headers: authHeaders })
    if (!res.ok) return
    setPendingCompanies((p) => p.filter((c) => c._id !== id))
    // refresh accounts list quickly
    const refreshed = await fetch(`${API_BASE_URL}/admin/companies/verified`, { headers: authHeaders })
    if (refreshed.ok) setAccountsCompanies(await refreshed.json())
  }

  const rejectCompany = async (id: string) => {
    const confirmed = window.confirm('Reject this company signup?')
    if (!confirmed) return
    const res = await fetch(`${API_BASE_URL}/admin/companies/${id}`, { method: 'DELETE', headers: authHeaders })
    if (!res.ok) return
    setPendingCompanies((p) => p.filter((c) => c._id !== id))
  }

  const acceptAgency = async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/admin/agencies/${id}/verify`, { method: 'PATCH', headers: authHeaders })
    if (!res.ok) return
    setPendingAgencies((p) => p.filter((a) => a._id !== id))
    const refreshed = await fetch(`${API_BASE_URL}/admin/agencies/verified`, { headers: authHeaders })
    if (refreshed.ok) setAccountsAgencies(await refreshed.json())
  }

  const rejectAgency = async (id: string) => {
    const confirmed = window.confirm('Reject this agency signup?')
    if (!confirmed) return
    const res = await fetch(`${API_BASE_URL}/admin/agencies/${id}`, { method: 'DELETE', headers: authHeaders })
    if (!res.ok) return
    setPendingAgencies((p) => p.filter((a) => a._id !== id))
  }

  const sectionCardClass = 'bg-slate-900/60 border border-slate-800 rounded-2xl'
  const sectionHeaderClass = 'px-6 py-5 flex items-center justify-between border-b border-slate-800'
  const sectionBodyClass = 'p-6 space-y-3'

  const tabButtonClass = (active: boolean) =>
    active
      ? 'text-white bg-cyan-500/20 shadow-lg shadow-cyan-500/10 border border-cyan-500/30'
      : 'text-gray-400 hover:text-white hover:bg-cyan-500/10 border border-slate-800'

  const acceptBtnClass = 'bg-cyan-600 hover:bg-cyan-700 text-white'
  const rejectBtnClass = 'bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-500/50'

  const listRowClass = 'flex items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-950/40 p-4'

  const statCardClass = 'rounded-2xl border border-slate-800 bg-slate-950/40 p-4'
  const statLabelClass = 'text-xs text-gray-400'
  const statValueClass = 'text-2xl font-bold text-white'

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Navbar */}
      <header className="bg-slate-950/80 backdrop-blur sticky top-0 z-[1100] border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="bg-slate-950 px-4 py-2 rounded-xl border border-cyan-500/20">
                <Logo href="/" size="sm" showHoverEffects={false} />
              </div>
              <div className="ml-4">
                <div className="text-sm font-semibold">Admin Dashboard</div>
                <div className="text-xs text-gray-400">Review signups, manage accounts</div>
              </div>
            </div>

            <Button onClick={handleLogout} className={rejectBtnClass}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Analytics */}
        <section className={sectionCardClass}>
          <div className={sectionHeaderClass}>
            <h2 className="text-lg font-bold">Analytics</h2>
            <div className="text-xs text-gray-400">Bookings and account health</div>
          </div>
          <div className={sectionBodyClass}>
            {loading.analytics ? (
              <div className="text-sm text-gray-400">Loading…</div>
            ) : !analyticsOverview ? (
              <div className="text-sm text-gray-400">Analytics unavailable</div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className={statCardClass}>
                    <div className={statLabelClass}>Verified companies</div>
                    <div className={statValueClass}>
                      {analyticsOverview.companiesTotal - analyticsOverview.companiesPending}
                    </div>
                    <div className="text-xs text-gray-500">Pending: {analyticsOverview.companiesPending}</div>
                  </div>
                  <div className={statCardClass}>
                    <div className={statLabelClass}>Verified agencies</div>
                    <div className={statValueClass}>
                      {analyticsOverview.agenciesTotal - analyticsOverview.agenciesPending}
                    </div>
                    <div className="text-xs text-gray-500">Pending: {analyticsOverview.agenciesPending}</div>
                  </div>
                  <div className={statCardClass}>
                    <div className={statLabelClass}>Bookings (7 days)</div>
                    <div className={statValueClass}>{analyticsOverview.bookingsLast7Days}</div>
                    <div className="text-xs text-gray-500">Total: {analyticsOverview.bookingsTotal}</div>
                  </div>
                  <div className={statCardClass}>
                    <div className={statLabelClass}>Bookings (30 days)</div>
                    <div className={statValueClass}>{analyticsOverview.bookingsLast30Days}</div>
                    <div className="text-xs text-gray-500">Momentum snapshot</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  <div className={statCardClass}>
                    <div className="text-sm font-semibold text-white mb-2">Bookings trend (last 14 days)</div>
                    {!bookingsDaily?.series?.length ? (
                      <div className="text-sm text-gray-400">No data</div>
                    ) : (
                      <div className="space-y-2">
                        {(() => {
                          const max = Math.max(1, ...bookingsDaily.series.map((s) => s.count))
                          return bookingsDaily.series.map((s) => (
                            <div key={s.date} className="flex items-center gap-3">
                              <div className="w-24 text-xs text-gray-400 shrink-0">{s.date}</div>
                              <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                                <div
                                  className="h-full bg-cyan-500/70"
                                  style={{ width: `${Math.round((s.count / max) * 100)}%` }}
                                />
                              </div>
                              <div className="w-10 text-right text-xs text-gray-300 shrink-0">{s.count}</div>
                            </div>
                          ))
                        })()}
                      </div>
                    )}
                  </div>

                  <div className={statCardClass}>
                    <div className="text-sm font-semibold text-white mb-2">Top locations</div>
                    {!topCities ? (
                      <div className="text-sm text-gray-400">No data</div>
                    ) : (
                      <div className="space-y-3">
                        <div>
                          <div className="text-xs text-gray-400 mb-1">Agencies (verified) by city</div>
                          {topCities.topAgencyCities?.length ? (
                            <div className="space-y-1">
                              {topCities.topAgencyCities.map((r) => (
                                <div key={r.city} className="flex items-center justify-between text-sm">
                                  <div className="text-gray-200 truncate pr-2">{r.city || 'Unknown'}</div>
                                  <div className="text-cyan-400 font-semibold">{r.count}</div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-sm text-gray-400">No cities</div>
                          )}
                        </div>

                        <div>
                          <div className="text-xs text-gray-400 mb-1">Bookings by agency city</div>
                          {topCities.topBookingCitiesByAgency?.length ? (
                            <div className="space-y-1">
                              {topCities.topBookingCitiesByAgency.map((r) => (
                                <div key={r.city} className="flex items-center justify-between text-sm">
                                  <div className="text-gray-200 truncate pr-2">{r.city || 'Unknown'}</div>
                                  <div className="text-cyan-400 font-semibold">{r.count}</div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-sm text-gray-400">No bookings</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </section>

        {/* New signup requests */}
        <section className={sectionCardClass}>
          <div className={sectionHeaderClass}>
            <h2 className="text-lg font-bold">New signup requests</h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSignupTab('companies')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tabButtonClass(
                  signupTab === 'companies'
                )}`}
              >
                Companies ({pendingCompanies.length})
              </button>
              <button
                type="button"
                onClick={() => setSignupTab('agencies')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tabButtonClass(
                  signupTab === 'agencies'
                )}`}
              >
                Agencies ({pendingAgencies.length})
              </button>
            </div>
          </div>
          <div className={sectionBodyClass}>
            {signupTab === 'companies' ? (
              loading.pendingCompanies ? (
                <div className="text-sm text-gray-400">Loading…</div>
              ) : pendingCompanies.length === 0 ? (
                <div className="text-sm text-gray-400">No company signup requests</div>
              ) : (
                pendingCompanies.map((c) => (
                  <div key={c._id} className={listRowClass}>
                    <div className="min-w-0">
                      <div className="font-semibold truncate">{c.name}</div>
                      <div className="text-sm text-gray-400 truncate">{c.email}</div>
                      {c.industrySector && <div className="text-xs text-gray-500">{c.industrySector}</div>}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button className={acceptBtnClass} onClick={() => acceptCompany(c._id)}>
                        Accept
                      </Button>
                      <Button className={rejectBtnClass} onClick={() => rejectCompany(c._id)}>
                        Reject
                      </Button>
                    </div>
                  </div>
                ))
              )
            ) : loading.pendingAgencies ? (
              <div className="text-sm text-gray-400">Loading…</div>
            ) : pendingAgencies.length === 0 ? (
              <div className="text-sm text-gray-400">No agency signup requests</div>
            ) : (
              pendingAgencies.map((a) => (
                <div key={a._id} className={listRowClass}>
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{a.agencyName}</div>
                    <div className="text-sm text-gray-400 truncate">{a.email}</div>
                    <div className="text-xs text-gray-500 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                      {a.businessRegistrationNumber ? (
                        <span className="truncate">RC: {a.businessRegistrationNumber}</span>
                      ) : null}
                      {a.rcDocument ? (
                        <a
                          href={a.rcDocument}
                          target="_blank"
                          rel="noreferrer"
                          className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4"
                        >
                          View RC
                        </a>
                      ) : (
                        <span>RC doc missing</span>
                      )}
                      {a.nifNisDocument ? (
                        <a
                          href={a.nifNisDocument}
                          target="_blank"
                          rel="noreferrer"
                          className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4"
                        >
                          View NIF/NIS
                        </a>
                      ) : (
                        <span>NIF/NIS doc missing</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button className={acceptBtnClass} onClick={() => acceptAgency(a._id)}>
                      Accept
                    </Button>
                    <Button className={rejectBtnClass} onClick={() => rejectAgency(a._id)}>
                      Reject
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* All accounts */}
        <section className={sectionCardClass}>
          <div className={sectionHeaderClass}>
            <h2 className="text-lg font-bold">All accounts</h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAccountsTab('companies')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tabButtonClass(
                  accountsTab === 'companies'
                )}`}
              >
                Companies ({accountsCompanies.length})
              </button>
              <button
                type="button"
                onClick={() => setAccountsTab('agencies')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tabButtonClass(
                  accountsTab === 'agencies'
                )}`}
              >
                Agencies ({accountsAgencies.length})
              </button>
            </div>
          </div>
          <div className={sectionBodyClass}>
            {accountsTab === 'companies' ? (
              loading.accountsCompanies ? (
                <div className="text-sm text-gray-400">Loading…</div>
              ) : accountsCompanies.length === 0 ? (
                <div className="text-sm text-gray-400">No companies found</div>
              ) : (
                accountsCompanies.map((c) => (
                  <div key={c._id} className={listRowClass}>
                    <div className="min-w-0">
                      <div className="font-semibold truncate">{c.name}</div>
                      <div className="text-sm text-gray-400 truncate">{c.email}</div>
                      <div className="text-xs text-gray-500">
                        Days left in subscription: {c.daysLeftInSubscription ?? 'N/A'}
                      </div>
                    </div>
                  </div>
                ))
              )
            ) : loading.accountsAgencies ? (
              <div className="text-sm text-gray-400">Loading…</div>
            ) : accountsAgencies.length === 0 ? (
              <div className="text-sm text-gray-400">No agencies found</div>
            ) : (
              accountsAgencies.map((a) => (
                <div key={a._id} className={listRowClass}>
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{a.agencyName}</div>
                    <div className="text-sm text-gray-400 truncate">{a.email}</div>
                    <div className="text-xs text-gray-500">
                      Days left in subscription: {a.daysLeftInSubscription ?? 'N/A'}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top 5 Companies */}
          <section className={sectionCardClass}>
            <div className={sectionHeaderClass}>
              <h2 className="text-lg font-bold">Top 5 Companies</h2>
            </div>
            <div className={sectionBodyClass}>
              {loading.topCompanies ? (
                <div className="text-sm text-gray-400">Loading…</div>
              ) : topCompanies.length === 0 ? (
                <div className="text-sm text-gray-400">No top companies found</div>
              ) : (
                topCompanies.map((c, idx) => (
                  <div key={c._id} className={listRowClass}>
                    <div className="min-w-0">
                      <div className="font-semibold truncate">#{idx + 1} {c.name}</div>
                      <div className="text-sm text-gray-400 truncate">{c.email}</div>
                    </div>
                    <div className="shrink-0 text-cyan-400 font-bold">{c.bookingCount}</div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Top 5 Agencies */}
          <section className={sectionCardClass}>
            <div className={sectionHeaderClass}>
              <h2 className="text-lg font-bold">Top 5 Agencies</h2>
            </div>
            <div className={sectionBodyClass}>
              {loading.topAgencies ? (
                <div className="text-sm text-gray-400">Loading…</div>
              ) : topAgencies.length === 0 ? (
                <div className="text-sm text-gray-400">No top agencies found</div>
              ) : (
                topAgencies.map((a, idx) => (
                  <div key={a._id} className={listRowClass}>
                    <div className="min-w-0">
                      <div className="font-semibold truncate">#{idx + 1} {a.agencyName}</div>
                      <div className="text-sm text-gray-400 truncate">{a.email}</div>
                    </div>
                    <div className="shrink-0 text-cyan-400 font-bold">{a.bookingCount}</div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
