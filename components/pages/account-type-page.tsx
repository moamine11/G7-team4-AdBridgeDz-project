'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Building2, Megaphone, CheckCircle2, ArrowRight } from 'lucide-react'
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 py-12 bg-gray-50">
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
      <div className="grid md:grid-cols-2 gap-6 w-full max-w-3xl mb-10">
        {/* Company/Advertiser Card */}
        <div
          onClick={() => setSelectedType('company')}
          className={cn(
            "relative p-8 rounded-2xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] group shadow-lg",
            selectedType === 'company'
              ? 'border-blue-500 bg-gradient-to-br from-blue-50 via-blue-100 to-white scale-[1.02] shadow-blue-500/20'
              : 'border-gray-200 bg-white hover:border-blue-300'
          )}
        >
          {/* Selected Indicator */}
          {selectedType === 'company' && (
            <div className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center animate-in fade-in duration-300">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
          )}

          <div className="relative z-10">
            {/* Icon Container */}
            <div className="flex justify-center mb-4">
              <div className={cn(
                "p-4 rounded-xl transition-all duration-300",
                selectedType === 'company'
                  ? 'bg-gradient-to-br from-blue-500 to-teal-500 shadow-md shadow-blue-500/50'
                  : 'bg-blue-100'
              )}>
                <Building2 className={cn(
                  "w-10 h-10 transition-colors duration-300",
                  selectedType === 'company' ? 'text-white' : 'text-blue-600'
                )} />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Company / Advertiser
          </h3>

            {/* Description */}
            <p className="text-gray-600 text-center mb-6 text-base">
              Find & book premium ad spaces for your campaigns
            </p>

            {/* Features List */}
            <ul className="space-y-2 px-4">
              <li className="flex items-center gap-3 text-sm text-gray-700">
                <CheckCircle2 className={cn("w-4 h-4 flex-shrink-0", selectedType === 'company' ? 'text-blue-500' : 'text-gray-400')} />
                <span>Browse thousands of available billboard locations</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-700">
                <CheckCircle2 className={cn("w-4 h-4 flex-shrink-0", selectedType === 'company' ? 'text-blue-500' : 'text-gray-400')} />
                <span>Compare pricing and locations in real-time</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-700">
                <CheckCircle2 className={cn("w-4 h-4 flex-shrink-0", selectedType === 'company' ? 'text-blue-500' : 'text-gray-400')} />
                <span>Book and manage your advertising campaigns</span>
              </li>
            </ul>

          </div>
        </div>

        {/* Agency/Billboard Provider Card */}
        <div
          onClick={() => setSelectedType('agency')}
          className={cn(
            "relative p-8 rounded-2xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] group shadow-lg",
            selectedType === 'agency'
              ? 'border-teal-500 bg-gradient-to-br from-teal-50 via-green-50 to-white scale-[1.02] shadow-teal-500/20'
              : 'border-gray-200 bg-white hover:border-teal-300'
          )}
        >
          {selectedType === 'agency' && (
            <div className="absolute top-4 right-4 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center animate-in fade-in duration-300">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
          )}

          <div className="relative z-10">
            {/* Icon Container */}
            <div className="flex justify-center mb-4">
              <div className={cn(
                "p-4 rounded-xl transition-all duration-300",
                selectedType === 'agency'
                  ? 'bg-gradient-to-br from-teal-500 to-green-500 shadow-md shadow-teal-500/50'
                  : 'bg-teal-100'
              )}>
                <Megaphone className={cn(
                  "w-10 h-10 transition-colors duration-300",
                  selectedType === 'agency' ? 'text-white' : 'text-teal-600'
                )} />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Agency / Billboard Provider
          </h3>

            {/* Description */}
            <p className="text-gray-600 text-center mb-6 text-base">
              List & manage your advertising spaces efficiently
            </p>

            {/* Features List */}
            <ul className="space-y-2 px-4">
              <li className="flex items-center gap-3 text-sm text-gray-700">
                <CheckCircle2 className={cn("w-4 h-4 flex-shrink-0", selectedType === 'agency' ? 'text-teal-500' : 'text-gray-400')} />
                <span>List your billboard spaces and reach more advertisers</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-700">
                <CheckCircle2 className={cn("w-4 h-4 flex-shrink-0", selectedType === 'agency' ? 'text-teal-500' : 'text-gray-400')} />
                <span>Manage bookings and availability in real-time</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-700">
                <CheckCircle2 className={cn("w-4 h-4 flex-shrink-0", selectedType === 'agency' ? 'text-teal-500' : 'text-gray-400')} />
                <span>Track performance and analytics</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Next Button */}
      <Button
        onClick={handleNext}
        disabled={!selectedType}
        className={cn(
          "relative px-10 py-4 text-lg font-semibold rounded-full transition-all duration-300",
          selectedType
            ? "bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30 hover:scale-[1.02]"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        )}
      >
        Continue
        {selectedType && (
          <ArrowRight className="ml-3 w-5 h-5 transition-transform group-hover:translate-x-1" />
        )}
      </Button>
    </div>
  )
}