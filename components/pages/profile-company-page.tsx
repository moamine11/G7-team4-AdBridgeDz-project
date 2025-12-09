'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Sidebar, SidebarProvider } from '@/components/ui/sidebar'
import Navbar from '@/components/ui/navbar'
import { Save, Building2, MapPin, Globe, Mail, Phone, FileText, Target } from 'lucide-react'
import { authService } from '@/lib/services/auth-service'
import { useAuth } from '@/contexts/auth-context'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'

export default function ProfileCompanyPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  
  const [formData, setFormData] = useState({
    companyName: '',
    brandTagline: '',
    email: '',
    phone: '',
    website: '',
    location: '',
    industrySector: '',
    companySize: '',
    budgetRange: '',
    decisionWindow: '',
    goals: ''
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authService.getCompanyProfile()
        setFormData({
          companyName: data.name || '',
          brandTagline: data.brandTagline || '',
          email: data.email || '',
          phone: data.phonenumber || '',
          website: data.websiteURL || '',
          location: data.location || '',
          industrySector: data.industrySector || '',
          companySize: data.companySize || '',
          budgetRange: data.budgetRange || '',
          decisionWindow: data.decisionWindow || '',
          goals: data.notes || ''
        })
      } catch (error) {
        console.error('Failed to fetch profile:', error)
        toast({
          title: "Error",
          description: "Failed to load profile data.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    // Fetch profile regardless of user check - let the API handle auth
    fetchProfile()
  }, [toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    try {
      const apiData = {
        name: formData.companyName,
        brandTagline: formData.brandTagline,
        email: formData.email,
        phonenumber: formData.phone,
        websiteURL: formData.website,
        location: formData.location,
        industrySector: formData.industrySector,
        companySize: formData.companySize,
        budgetRange: formData.budgetRange,
        decisionWindow: formData.decisionWindow,
        notes: formData.goals
      }
      
      await authService.updateCompanyProfile(apiData)
      toast({
        title: "Success",
        description: "Profile updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen bg-slate-950">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Navbar />
            <main className="flex-1 p-8 flex justify-center items-center">
              <span className="loading loading-spinner loading-lg text-blue-500"></span>
            </main>
          </div>
        </div>
      </SidebarProvider>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-slate-950 text-slate-50">
        <Sidebar />
        
        <div className="flex-1 flex flex-col">
          <Navbar />
          
          <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            {/* Breadcrumb */}
            <nav className="text-sm text-slate-400 mb-4 flex items-center gap-2">
              <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
              <span className="text-slate-600">/</span>
              <span className="text-white font-medium">Company Profile</span>
            </nav>

            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Company Profile</h1>
                <p className="text-slate-400">Manage your company profile, contact information, and business details.</p>
              </div>
              <Button 
                onClick={handleSubmit}
                disabled={isSaving}
                className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white shadow-lg shadow-blue-500/20"
              >
                {isSaving ? (
                  <>
                    <span className="loading loading-spinner loading-xs mr-2"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Basic Account Information */}
              <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                <div className="p-6 border-b border-white/10 flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Building2 className="w-5 h-5 text-blue-400" />
                  </div>
                  <h2 className="text-lg font-bold text-white">Basic Information</h2>
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Company Name</label>
                      <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-600"
                        placeholder="Enter company name"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Brand Tagline <span className="text-slate-500 font-normal text-xs ml-1">(Optional)</span></label>
                      <input
                        type="text"
                        value={formData.brandTagline}
                        onChange={(e) => setFormData({...formData, brandTagline: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-600"
                        placeholder="Your brand slogan"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-600"
                          placeholder="company@example.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-600"
                          placeholder="+213 555 123 456"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Website URL <span className="text-slate-500 font-normal text-xs ml-1">(Optional)</span></label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                          type="url"
                          value={formData.website}
                          onChange={(e) => setFormData({...formData, website: e.target.value})}
                          className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-600"
                          placeholder="https://example.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Location</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                          className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-600"
                          placeholder="City, Country"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Details */}
              <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                <div className="p-6 border-b border-white/10 flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <FileText className="w-5 h-5 text-purple-400" />
                  </div>
                  <h2 className="text-lg font-bold text-white">Company Details</h2>
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Industry/Sector</label>
                      <select
                        value={formData.industrySector}
                        onChange={(e) => setFormData({...formData, industrySector: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                      >
                        <option className="bg-slate-900" value="">Select Industry</option>
                        <option className="bg-slate-900">Technology</option>
                        <option className="bg-slate-900">Finance</option>
                        <option className="bg-slate-900">Healthcare</option>
                        <option className="bg-slate-900">Retail</option>
                        <option className="bg-slate-900">Education</option>
                        <option className="bg-slate-900">Manufacturing</option>
                        <option className="bg-slate-900">Entertainment</option>
                        <option className="bg-slate-900">FMCG</option>
                        <option className="bg-slate-900">Real Estate</option>
                        <option className="bg-slate-900">Other</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Company Size</label>
                      <select
                        value={formData.companySize}
                        onChange={(e) => setFormData({...formData, companySize: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                      >
                        <option className="bg-slate-900" value="">Select Size</option>
                        <option className="bg-slate-900">1-10 employees</option>
                        <option className="bg-slate-900">11-50 employees</option>
                        <option className="bg-slate-900">51-200 employees</option>
                        <option className="bg-slate-900">200+ employees</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Campaign Preferences */}
              <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                <div className="p-6 border-b border-white/10 flex items-center gap-3">
                  <div className="p-2 bg-teal-500/10 rounded-lg">
                    <Target className="w-5 h-5 text-teal-400" />
                  </div>
                  <h2 className="text-lg font-bold text-white">Campaign Preferences</h2>
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Budget Range</label>
                      <select
                        value={formData.budgetRange}
                        onChange={(e) => setFormData({...formData, budgetRange: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                      >
                        <option className="bg-slate-900" value="">Select Budget Range</option>
                        <option className="bg-slate-900">DZD 1M - 5M</option>
                        <option className="bg-slate-900">DZD 5M - 10M</option>
                        <option className="bg-slate-900">DZD 10M - 20M</option>
                        <option className="bg-slate-900">DZD 20M+</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Decision Window</label>
                      <select
                        value={formData.decisionWindow}
                        onChange={(e) => setFormData({...formData, decisionWindow: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                      >
                        <option className="bg-slate-900" value="">Select Timeline</option>
                        <option className="bg-slate-900">Immediate (1-2 weeks)</option>
                        <option className="bg-slate-900">This Month</option>
                        <option className="bg-slate-900">This Quarter</option>
                        <option className="bg-slate-900">Planning Phase</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Primary Goals & Notes <span className="text-slate-500 font-normal text-xs ml-1">(Optional)</span></label>
                    <textarea
                      value={formData.goals}
                      onChange={(e) => setFormData({...formData, goals: e.target.value})}
                      rows={4}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-600 resize-none"
                      placeholder="What are you looking to achieve? (e.g. Brand Awareness, Product Launch, Lead Generation)"
                    />
                  </div>
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-blue-500 border-white/10 bg-slate-900 rounded focus:ring-blue-500 mt-0.5"
                  />
                  <span className="text-sm text-slate-400">
                    I confirm that the information provided is accurate and I agree to the <Link href="/terms" className="text-blue-400 hover:text-blue-300 font-medium hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-blue-400 hover:text-blue-300 font-medium hover:underline">Privacy Policy</Link>.
                  </span>
                </label>
              </div>

              {/* Bottom Action Bar */}
              <div className="flex justify-end pt-4">
                <Button 
                  onClick={handleSubmit}
                  disabled={isSaving}
                  className="h-12 px-8 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white shadow-lg shadow-blue-500/20 rounded-xl text-base font-medium"
                >
                  {isSaving ? (
                    <>
                      <span className="loading loading-spinner loading-sm mr-2"></span>
                      Saving Changes...
                    </>
                  ) : (
                    'Save All Changes'
                  )}
                </Button>
              </div>
            </form>
          </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
