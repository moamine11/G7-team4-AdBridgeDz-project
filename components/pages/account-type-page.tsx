'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Building2, Megaphone, CheckCircle2, Search, Calendar, MapPin, Upload, TrendingUp, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 py-12">
      {/* Header */}
      <div className="text-center mb-12 max-w-2xl">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
          Create Your Account
        </h1>
        <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
          Choose the account type that best fits your needs and start your journey with us
        </p>
      </div>

      {/* Account Type Cards */}
      <div className="grid md:grid-cols-2 gap-4 lg:gap-6 w-full max-w-3xl mb-10">
        {/* Company/Advertiser Card */}
        <div
          onClick={() => setSelectedType('company')}
          className={cn(
            "relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] group overflow-hidden",
            selectedType === 'company'
              ? 'border-blue-500 bg-gradient-to-br from-blue-50 via-blue-100 to-teal-50 shadow-xl shadow-blue-500/20 scale-[1.02]'
              : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-lg shadow-md'
          )}
        >
          {/* Selected Indicator */}
          {selectedType === 'company' && (
            <div className="absolute top-3 right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center animate-in fade-in duration-300">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
          )}

          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          </div>

          <div className="relative z-10">
            {/* Icon Container */}
            <div className={cn(
              "flex justify-center mb-4 transition-transform duration-300",
              selectedType === 'company' ? 'scale-105' : 'group-hover:scale-105'
            )}>
              <div className={cn(
                "p-4 rounded-xl transition-all duration-300",
                selectedType === 'company'
                  ? 'bg-gradient-to-br from-blue-500 to-teal-500 shadow-md shadow-blue-500/50'
                  : 'bg-gradient-to-br from-blue-100 to-teal-100 group-hover:from-blue-200 group-hover:to-teal-200'
              )}>
                <Building2 className={cn(
                  "w-10 h-10 transition-colors duration-300",
                  selectedType === 'company' ? 'text-white' : 'text-blue-600'
                )} />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl lg:text-2xl font-bold text-gray-900 text-center mb-2">
            Company / Advertiser
          </h3>

            {/* Description */}
            <p className="text-gray-600 text-center mb-4 text-base">
              Find & book premium ad spaces for your campaigns
            </p>

            {/* Features List */}
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-xs text-gray-600">
                <div className={cn(
                  "w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-colors",
                  selectedType === 'company' ? 'bg-blue-500' : 'bg-gray-200'
                )}>
                  {selectedType === 'company' && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                </div>
                <span>Browse thousands of available billboard locations</span>
              </li>
              <li className="flex items-center gap-2 text-xs text-gray-600">
                <div className={cn(
                  "w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-colors",
                  selectedType === 'company' ? 'bg-blue-500' : 'bg-gray-200'
                )}>
                  {selectedType === 'company' && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                </div>
                <span>Compare pricing and locations in real-time</span>
              </li>
              <li className="flex items-center gap-2 text-xs text-gray-600">
                <div className={cn(
                  "w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-colors",
                  selectedType === 'company' ? 'bg-blue-500' : 'bg-gray-200'
                )}>
                  {selectedType === 'company' && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                </div>
                <span>Book and manage your advertising campaigns</span>
              </li>
            </ul>

            {/* Hover Arrow */}
            <div className="mt-4 flex justify-center">
              <ArrowRight className={cn(
                "w-5 h-5 transition-all duration-300",
                selectedType === 'company' 
                  ? 'text-blue-600 translate-x-1' 
                  : 'text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1'
              )} />
            </div>
          </div>
        </div>

        {/* Agency/Billboard Provider Card */}
        <div
          onClick={() => setSelectedType('agency')}
          className={cn(
            "relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] group overflow-hidden",
            selectedType === 'agency'
              ? 'border-teal-500 bg-gradient-to-br from-teal-50 via-green-50 to-emerald-50 shadow-xl shadow-teal-500/20 scale-[1.02]'
              : 'border-gray-200 bg-white hover:border-teal-300 hover:shadow-lg shadow-md'
          )}
        >
          {/* Selected Indicator */}
          {selectedType === 'agency' && (
            <div className="absolute top-3 right-3 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center animate-in fade-in duration-300">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
          )}

          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity">
            <div className="absolute top-0 left-0 w-48 h-48 bg-teal-500 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>

          <div className="relative z-10">
            {/* Icon Container */}
            <div className={cn(
              "flex justify-center mb-4 transition-transform duration-300",
              selectedType === 'agency' ? 'scale-105' : 'group-hover:scale-105'
            )}>
              <div className={cn(
                "p-4 rounded-xl transition-all duration-300",
                selectedType === 'agency'
                  ? 'bg-gradient-to-br from-teal-500 to-green-500 shadow-md shadow-teal-500/50'
                  : 'bg-gradient-to-br from-teal-100 to-green-100 group-hover:from-teal-200 group-hover:to-green-200'
              )}>
                <Megaphone className={cn(
                  "w-10 h-10 transition-colors duration-300",
                  selectedType === 'agency' ? 'text-white' : 'text-teal-600'
                )} />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl lg:text-2xl font-bold text-gray-900 text-center mb-2">
            Agency / Billboard Provider
          </h3>

            {/* Description */}
            <p className="text-gray-600 text-center mb-4 text-base">
              List & manage your advertising spaces efficiently
            </p>

            {/* Features List */}
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-xs text-gray-600">
                <div className={cn(
                  "w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-colors",
                  selectedType === 'agency' ? 'bg-teal-500' : 'bg-gray-200'
                )}>
                  {selectedType === 'agency' && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                </div>
                <span>List your billboard spaces and reach more advertisers</span>
              </li>
              <li className="flex items-center gap-2 text-xs text-gray-600">
                <div className={cn(
                  "w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-colors",
                  selectedType === 'agency' ? 'bg-teal-500' : 'bg-gray-200'
                )}>
                  {selectedType === 'agency' && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                </div>
                <span>Manage bookings and availability in real-time</span>
              </li>
              <li className="flex items-center gap-2 text-xs text-gray-600">
                <div className={cn(
                  "w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-colors",
                  selectedType === 'agency' ? 'bg-teal-500' : 'bg-gray-200'
                )}>
                  {selectedType === 'agency' && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                </div>
                <span>Track performance and analytics</span>
              </li>
            </ul>

            {/* Hover Arrow */}
            <div className="mt-4 flex justify-center">
              <ArrowRight className={cn(
                "w-5 h-5 transition-all duration-300",
                selectedType === 'agency' 
                  ? 'text-teal-600 translate-x-1' 
                  : 'text-gray-400 group-hover:text-teal-600 group-hover:translate-x-1'
              )} />
            </div>
          </div>
        </div>
      </div>

      {/* Next Button */}
      <Button
        onClick={handleNext}
        disabled={!selectedType}
        className={cn(
          "relative px-8 py-5 text-base font-semibold rounded-full transition-all duration-300 transform",
          selectedType
            ? "bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30 hover:scale-105"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        )}
      >
        Continue
        {selectedType && (
          <ArrowRight className="ml-2 w-4 h-4 inline-block transition-transform group-hover:translate-x-1" />
        )}
      </Button>
    </div>
  )
}
