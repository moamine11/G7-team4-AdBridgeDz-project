'use client'

import { ShieldAlert, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import AuthNavbar from '@/components/ui/auth-navbar'
import { Button } from '@/components/ui/button'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-teal-900 flex flex-col">
      <AuthNavbar variant="transparent" showGetStarted={false} />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5 text-red-300" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">401 — Unauthorized</h1>
                  <p className="text-sm text-slate-300">You don’t have access to this page.</p>
                </div>
              </div>
            </div>

            <div className="px-6 py-6 space-y-4">
              <p className="text-sm text-slate-200 leading-relaxed">
                Please log in with the correct account type (Company / Agency / Admin). If you were logged in,
                your session may have expired.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/login" className="sm:flex-1">
                  <Button className="w-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold shadow-lg shadow-teal-500/25 transition-all duration-200">
                    Go to Login
                  </Button>
                </Link>

                <Link href="/" className="sm:flex-1">
                  <Button
                    variant="outline"
                    className="w-full rounded-full border-2 border-white/15 bg-transparent text-slate-100 hover:bg-white/5 hover:text-slate-100"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back Home
                  </Button>
                </Link>
              </div>

              <div className="text-xs text-slate-400">
                Tip: if you just logged in as Admin, make sure <span className="text-slate-200">userType</span> is set to
                <span className="text-slate-200"> admin</span> in localStorage.
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
