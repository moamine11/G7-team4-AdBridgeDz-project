'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import Logo from '@/components/ui/logo'
import { Button } from '@/components/ui/button'

const API_BASE_URL = 'http://localhost:5000/api'

type PendingAgency = {
  _id: string
  agencyName: string
  email: string
  isVerified: boolean
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

  const [pendingCompanies, setPendingCompanies] = useState<PendingCompany[]>([])
  const [pendingAgencies, setPendingAgencies] = useState<PendingAgency[]>([])
  const [accountsCompanies, setAccountsCompanies] = useState<PendingCompany[]>([])
  const [accountsAgencies, setAccountsAgencies] = useState<PendingAgency[]>([])

  const [topCompanies, setTopCompanies] = useState<TopCompany[]>([])
  const [topAgencies, setTopAgencies] = useState<TopAgency[]>([])

  const [loading, setLoading] = useState({
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

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Navbar */}
      <header className="bg-slate-950/80 backdrop-blur sticky top-0 z-40 border-b border-cyan-500/20">
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
