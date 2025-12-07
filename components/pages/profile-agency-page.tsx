'use client'

import { useState } from 'react'
import Link from 'next/link'
import Sidebar from '@/components/layout/sidebar'
import Navbar from '@/components/ui/navbar'
import { Upload, Save } from 'lucide-react'

export default function ProfileAgencyPage() {
  const [formData, setFormData] = useState({
    agencyName: 'Creative Solutions Inc.',
    email: 'contact@creativesolutions.com',
    password: '••••••••••••',
    phoneNumber: '+213 555 123 456',
    website: 'https://example.com',
    streetAddress: '123 Advertising Avenue',
    country: 'Algeria',
    city: 'Algiers',
    postalCode: '16000',
    industry: 'Advertising',
    companySize: '11-50 employees',
    yearEstablished: '2010',
    fullName: 'John Doe',
    jobTitle: 'CEO / Founder',
    registrationNumber: 'e.g., 123456789',
    facebookUrl: 'https://facebook.com/agency',
    linkedinUrl: 'https://linkedin.com/company/agency',
    services: {
      billboard: true,
      digitalBillboards: false,
      streetFurniture: false,
      transit: false,
      airport: false,
      stadium: false
    }
  })

  const handleSubmit = () => {
    console.log('Profile updated:', formData)
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Navbar />
        
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Agency Profile</h1>
              <p className="text-slate-400">Manage your agency profile, contact information, and business details.</p>
            </div>

            {/* Basic Account Information */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-6">
              <h2 className="text-xl font-bold text-white mb-6">Basic Account Information</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Agency Name</label>
                    <input
                      type="text"
                      value={formData.agencyName}
                      onChange={(e) => setFormData({...formData, agencyName: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Password</label>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={formData.password}
                      readOnly
                      className="flex-1 px-4 py-3 bg-slate-800/30 border border-white/10 rounded-lg text-white"
                    />
                    <button
                      type="button"
                      className="px-6 py-3 text-blue-400 hover:text-blue-300 font-semibold hover:bg-blue-500/10 rounded-lg transition-colors"
                    >
                      Change Password
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-6">
              <h2 className="text-xl font-bold text-white mb-6">Contact Information</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Website URL <span className="text-slate-500 font-normal">(optional)</span></label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({...formData, website: e.target.value})}
                      placeholder="https://example.com"
                      className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Street Address</label>
                  <input
                    type="text"
                    value={formData.streetAddress}
                    onChange={(e) => setFormData({...formData, streetAddress: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Country</label>
                    <select
                      value={formData.country}
                      onChange={(e) => setFormData({...formData, country: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option>Algeria</option>
                      <option>Morocco</option>
                      <option>Tunisia</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">City</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Postal Code</label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Additional sections truncated for brevity - add remaining sections from original */}

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Save className="w-5 h-5" />
                Save Changes
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}