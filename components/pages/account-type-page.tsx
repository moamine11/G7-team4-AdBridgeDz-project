'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Building2, Megaphone, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import AuthNavbar from '@/components/ui/auth-navbar'
import { motion } from 'framer-motion'

export default function AccountTypePage() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<'company' | 'agency' | null>(null)

  const handleNext = () => {
    if (selectedType === 'company') {
      router.push('/create-account')
    } else if (selectedType === 'agency') {
      router.push('/create-agency-account')
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      <AuthNavbar variant="transparent" showGetStarted={false} />
      <div className="flex flex-col items-center justify-center p-4 flex-1 min-h-0 relative">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 w-full max-w-5xl">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-6"
          >
            <h1 className="text-3xl md:text-4xl font-extrabold mb-3 bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-500 bg-clip-text text-transparent drop-shadow-lg">
              Create Your Account
            </h1>
            <p className="text-sm md:text-base text-slate-300 max-w-xl mx-auto">
              Choose the account type that best fits your needs and start your journey with us
            </p>
          </motion.div>

          {/* Account Type Cards */}
          <div className="grid md:grid-cols-2 gap-4 w-full mb-4">
            {/* Company/Advertiser Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              onClick={() => setSelectedType('company')}
              className={cn(
                "relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] group overflow-hidden backdrop-blur-xl shadow-2xl flex flex-col",
                selectedType === 'company'
                  ? 'border-cyan-500 bg-gradient-to-br from-cyan-900/90 via-cyan-800/80 to-teal-900/80 shadow-cyan-500/40 scale-[1.02] ring-2 ring-cyan-500/50'
                  : 'border-slate-700/50 bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80 hover:border-cyan-400/60 hover:shadow-xl hover:shadow-cyan-500/20'
              )}
            >
              {/* Decorative Layered Gradients */}
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-br from-cyan-500/30 to-teal-400/20 rounded-full blur-2xl opacity-60 z-0" />
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-tr from-cyan-400/20 to-teal-500/30 rounded-full blur-2xl opacity-50 z-0" />
              
              {/* Selected Indicator */}
              {selectedType === 'company' && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 right-4 w-7 h-7 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/50 z-20"
                >
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </motion.div>
              )}

              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity">
                <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
              </div>

              <div className="relative z-10 flex flex-col h-full">
                {/* Icon Container */}
                <div className={cn(
                  "flex justify-center mb-4 transition-transform duration-300",
                  selectedType === 'company' ? 'scale-110' : 'group-hover:scale-110'
                )}>
                  <div className={cn(
                    "p-3 rounded-xl transition-all duration-300",
                    selectedType === 'company'
                      ? 'bg-gradient-to-br from-cyan-500 to-teal-500 shadow-lg shadow-cyan-500/50'
                      : 'bg-gradient-to-br from-cyan-900/50 to-teal-900/50 group-hover:from-cyan-800/50 group-hover:to-teal-800/50'
                  )}>
                    <Building2 className={cn(
                      "w-8 h-8 transition-colors duration-300",
                      selectedType === 'company' ? 'text-white' : 'text-cyan-400'
                    )} />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg md:text-xl font-bold text-slate-100 text-center mb-2">
                  Company / Advertiser
                </h3>

                {/* Description */}
                <p className="text-slate-300 text-center mb-4 text-sm">
                  Find & book premium ad spaces for your campaigns
                </p>

                {/* Features List */}
                <ul className="space-y-2 flex-1 mb-4">
                  <li className="flex items-center gap-2 text-xs text-slate-300">
                    <div className={cn(
                      "w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-colors",
                      selectedType === 'company' ? 'bg-cyan-500' : 'bg-slate-600'
                    )}>
                      {selectedType === 'company' && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                    </div>
                    <span>Browse thousands of available billboard locations</span>
                  </li>
                  <li className="flex items-center gap-2 text-xs text-slate-300">
                    <div className={cn(
                      "w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-colors",
                      selectedType === 'company' ? 'bg-cyan-500' : 'bg-slate-600'
                    )}>
                      {selectedType === 'company' && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                    </div>
                    <span>Compare pricing and locations in real-time</span>
                  </li>
                  <li className="flex items-center gap-2 text-xs text-slate-300">
                    <div className={cn(
                      "w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-colors",
                      selectedType === 'company' ? 'bg-cyan-500' : 'bg-slate-600'
                    )}>
                      {selectedType === 'company' && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                    </div>
                    <span>Book and manage your advertising campaigns</span>
                  </li>
                </ul>

                {/* Hover Arrow */}
                <div className="mt-auto flex justify-center pt-2">
                  <ArrowRight className={cn(
                    "w-5 h-5 transition-all duration-300",
                    selectedType === 'company' 
                      ? 'text-cyan-400 translate-x-1' 
                      : 'text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1'
                  )} />
                </div>
              </div>
            </motion.div>

            {/* Agency/Billboard Provider Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onClick={() => setSelectedType('agency')}
              className={cn(
                "relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] group overflow-hidden backdrop-blur-xl shadow-2xl flex flex-col",
                selectedType === 'agency'
                  ? 'border-teal-500 bg-gradient-to-br from-teal-900/90 via-cyan-900/80 to-slate-900/80 shadow-teal-500/40 scale-[1.02] ring-2 ring-teal-500/50'
                  : 'border-slate-700/50 bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80 hover:border-teal-400/60 hover:shadow-xl hover:shadow-teal-500/20'
              )}
            >
              {/* Decorative Layered Gradients */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-teal-500/30 to-cyan-400/20 rounded-full blur-2xl opacity-60 z-0" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-tr from-teal-400/20 to-cyan-500/30 rounded-full blur-2xl opacity-50 z-0" />
              
              {/* Selected Indicator */}
              {selectedType === 'agency' && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 right-4 w-7 h-7 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center shadow-lg shadow-teal-500/50 z-20"
                >
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </motion.div>
              )}

              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity">
                <div className="absolute top-0 left-0 w-48 h-48 bg-teal-500 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
              </div>

              <div className="relative z-10 flex flex-col h-full">
                {/* Icon Container */}
                <div className={cn(
                  "flex justify-center mb-4 transition-transform duration-300",
                  selectedType === 'agency' ? 'scale-110' : 'group-hover:scale-110'
                )}>
                  <div className={cn(
                    "p-3 rounded-xl transition-all duration-300",
                    selectedType === 'agency'
                      ? 'bg-gradient-to-br from-teal-500 to-cyan-500 shadow-lg shadow-teal-500/50'
                      : 'bg-gradient-to-br from-teal-900/50 to-cyan-900/50 group-hover:from-teal-800/50 group-hover:to-cyan-800/50'
                  )}>
                    <Megaphone className={cn(
                      "w-8 h-8 transition-colors duration-300",
                      selectedType === 'agency' ? 'text-white' : 'text-teal-400'
                    )} />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg md:text-xl font-bold text-slate-100 text-center mb-2">
                  Agency / Billboard Provider
                </h3>

                {/* Description */}
                <p className="text-slate-300 text-center mb-4 text-sm">
                  List & manage your advertising spaces efficiently
                </p>

                {/* Features List */}
                <ul className="space-y-2 flex-1 mb-4">
                  <li className="flex items-center gap-2 text-xs text-slate-300">
                    <div className={cn(
                      "w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-colors",
                      selectedType === 'agency' ? 'bg-teal-500' : 'bg-slate-600'
                    )}>
                      {selectedType === 'agency' && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                    </div>
                    <span>List your billboard spaces and reach more advertisers</span>
                  </li>
                  <li className="flex items-center gap-2 text-xs text-slate-300">
                    <div className={cn(
                      "w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-colors",
                      selectedType === 'agency' ? 'bg-teal-500' : 'bg-slate-600'
                    )}>
                      {selectedType === 'agency' && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                    </div>
                    <span>Manage bookings and availability in real-time</span>
                  </li>
                  <li className="flex items-center gap-2 text-xs text-slate-300">
                    <div className={cn(
                      "w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-colors",
                      selectedType === 'agency' ? 'bg-teal-500' : 'bg-slate-600'
                    )}>
                      {selectedType === 'agency' && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                    </div>
                    <span>Track performance and analytics</span>
                  </li>
                </ul>

                {/* Hover Arrow */}
                <div className="mt-auto flex justify-center pt-2">
                  <ArrowRight className={cn(
                    "w-5 h-5 transition-all duration-300",
                    selectedType === 'agency' 
                      ? 'text-teal-400 translate-x-1' 
                      : 'text-slate-500 group-hover:text-teal-400 group-hover:translate-x-1'
                  )} />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Next Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex justify-center"
          >
            <Button
              onClick={handleNext}
              disabled={!selectedType}
              className={cn(
                "relative px-8 py-3 text-base font-semibold rounded-full transition-all duration-300 transform flex items-center gap-2",
                selectedType
                  ? "bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-600 hover:from-teal-600 hover:to-cyan-600 text-white shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40 hover:scale-105"
                  : "bg-slate-800/50 text-slate-500 cursor-not-allowed border border-slate-700/50"
              )}
            >
              {selectedType && (
                <Sparkles className="w-4 h-4" />
              )}
              Continue
              {selectedType && (
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
