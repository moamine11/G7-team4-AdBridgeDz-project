'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Sidebar, SidebarProvider } from '@/components/ui/sidebar'
import Navbar from '@/components/ui/navbar'
import { Upload, Save, Building2, MapPin, Globe, Mail, Phone, FileText, User, Share2 } from 'lucide-react'
import { authService } from '@/lib/services/auth-service'
import { useAuth } from '@/contexts/auth-context'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'

export default function ProfileAgencyPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  
  const [formData, setFormData] = useState({
    agencyName: '',
    email: '',
    phoneNumber: '',
    website: '',
    streetAddress: '',
    country: 'Algeria',
    city: '',
    postalCode: '',
    industry: '',
    companySize: '',
    yearEstablished: '',
    fullName: '',
    jobTitle: '',
    registrationNumber: '',
    facebookUrl: '',
    linkedinUrl: '',
    services: {
      billboard: false,
      digitalBillboards: false,
      streetFurniture: false,
      transit: false,
      airport: false,
      stadium: false
    }
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authService.getAgencyProfile()
        // Map backend data to form state
        setFormData({
          agencyName: data.name || '',
          email: data.email || '',
          phoneNumber: data.phone || '',
          website: data.website || '',
          streetAddress: data.address?.split(',')[0] || '',
          country: data.address?.split(',').pop()?.trim() || 'Algeria',
          city: data.address?.split(',')[1]?.trim() || '',
          postalCode: data.address?.split(',')[2]?.trim() || '',
          industry: data.industry || '',
          companySize: data.companySize || '',
          yearEstablished: data.yearEstablished || '',
          fullName: data.contactPerson?.name || '',
          jobTitle: data.contactPerson?.title || '',
          registrationNumber: data.businessRegistrationNumber || '',
          facebookUrl: data.socialMedia?.facebook || '',
          linkedinUrl: data.socialMedia?.linkedin || '',
          services: {
            billboard: data.services?.includes('Billboard Advertising') || false,
            digitalBillboards: data.services?.includes('Digital Billboards') || false,
            streetFurniture: data.services?.includes('Street Furniture Advertising') || false,
            transit: data.services?.includes('Transit Advertising') || false,
            airport: data.services?.includes('Airport Advertising') || false,
            stadium: data.services?.includes('Stadium Advertising') || false
          }
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

    if (user && user.role === 'agency') {
      fetchProfile()
    }
  }, [user, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
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
              <span className="text-white font-medium">Agency Profile</span>
            </nav>

            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Agency Profile</h1>
                <p className="text-slate-400">Manage your agency profile, contact information, and business details.</p>
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
                      <label className="text-sm font-medium text-slate-300">Agency Name</label>
                      <input
                        type="text"
                        value={formData.agencyName}
                        onChange={(e) => setFormData({...formData, agencyName: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-600"
                        placeholder="Enter agency name"
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
                          placeholder="agency@example.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                          type="tel"
                          value={formData.phoneNumber}
                          onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
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
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                <div className="p-6 border-b border-white/10 flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <MapPin className="w-5 h-5 text-purple-400" />
                  </div>
                  <h2 className="text-lg font-bold text-white">Location Details</h2>
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Street Address</label>
                    <input
                      type="text"
                      value={formData.streetAddress}
                      onChange={(e) => setFormData({...formData, streetAddress: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-600"
                      placeholder="123 Business Avenue"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Country</label>
                      <select
                        value={formData.country}
                        onChange={(e) => setFormData({...formData, country: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                      >
                        <option className="bg-slate-900">Algeria</option>
                        <option className="bg-slate-900">Morocco</option>
                        <option className="bg-slate-900">Tunisia</option>
                        <option className="bg-slate-900">France</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">City</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-600"
                        placeholder="Algiers"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Postal Code</label>
                      <input
                        type="text"
                        value={formData.postalCode}
                        onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-600"
                        placeholder="16000"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Profile & Details */}
              <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                <div className="p-6 border-b border-white/10 flex items-center gap-3">
                  <div className="p-2 bg-teal-500/10 rounded-lg">
                    <FileText className="w-5 h-5 text-teal-400" />
                  </div>
                  <h2 className="text-lg font-bold text-white">Company Details</h2>
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Industry/Sector</label>
                      <select
                        value={formData.industry}
                        onChange={(e) => setFormData({...formData, industry: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                      >
                        <option className="bg-slate-900">Advertising</option>
                        <option className="bg-slate-900">Marketing</option>
                        <option className="bg-slate-900">Media</option>
                        <option className="bg-slate-900">Technology</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Company Size</label>
                      <select
                        value={formData.companySize}
                        onChange={(e) => setFormData({...formData, companySize: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                      >
                        <option className="bg-slate-900">1-10 employees</option>
                        <option className="bg-slate-900">11-50 employees</option>
                        <option className="bg-slate-900">51-200 employees</option>
                        <option className="bg-slate-900">200+ employees</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Year Established <span className="text-slate-500 font-normal text-xs ml-1">(Optional)</span></label>
                      <input
                        type="text"
                        value={formData.yearEstablished}
                        onChange={(e) => setFormData({...formData, yearEstablished: e.target.value})}
                        placeholder="2010"
                        className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-600"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Business Registration Number (RC)</label>
                      <input
                        type="text"
                        value={formData.registrationNumber}
                        onChange={(e) => setFormData({...formData, registrationNumber: e.target.value})}
                        placeholder="e.g., 123456789"
                        className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Registration Certificate</label>
                      <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-blue-500/50 hover:bg-white/5 transition-all cursor-pointer group">
                        <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                          <Upload className="w-5 h-5 text-slate-400 group-hover:text-blue-400" />
                        </div>
                        <p className="text-sm text-slate-300 font-medium mb-1">Click to upload or drag and drop</p>
                        <p className="text-xs text-slate-500">PDF, PNG, JPG (MAX. 5MB)</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Agency Logo <span className="text-slate-500 font-normal text-xs ml-1">(Optional)</span></label>
                      <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-blue-500/50 hover:bg-white/5 transition-all cursor-pointer group">
                        <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                          <Upload className="w-5 h-5 text-slate-400 group-hover:text-blue-400" />
                        </div>
                        <p className="text-sm text-slate-300 font-medium mb-1">Click to upload or drag and drop</p>
                        <p className="text-xs text-slate-500">PNG, JPG (MAX. 2MB)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Primary Contact Person */}
              <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                <div className="p-6 border-b border-white/10 flex items-center gap-3">
                  <div className="p-2 bg-orange-500/10 rounded-lg">
                    <User className="w-5 h-5 text-orange-400" />
                  </div>
                  <h2 className="text-lg font-bold text-white">Primary Contact</h2>
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Full Name</label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-600"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Job Title</label>
                      <input
                        type="text"
                        value={formData.jobTitle}
                        onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                        placeholder="CEO / Founder"
                        className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-600"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                <div className="p-6 border-b border-white/10 flex items-center gap-3">
                  <div className="p-2 bg-pink-500/10 rounded-lg">
                    <Share2 className="w-5 h-5 text-pink-400" />
                  </div>
                  <h2 className="text-lg font-bold text-white">Services & Social</h2>
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-slate-300">Services Offered</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        { id: 'billboard', label: 'Billboard Advertising' },
                        { id: 'digitalBillboards', label: 'Digital Billboards' },
                        { id: 'transit', label: 'Transit Advertising' },
                        { id: 'streetFurniture', label: 'Street Furniture' },
                        { id: 'airport', label: 'Airport Advertising' },
                        { id: 'stadium', label: 'Stadium Advertising' }
                      ].map((service) => (
                        <label key={service.id} className="flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-slate-900/30 hover:bg-slate-900/50 hover:border-white/10 transition-all cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.services[service.id as keyof typeof formData.services]}
                            onChange={(e) => setFormData({
                              ...formData,
                              services: {...formData.services, [service.id]: e.target.checked}
                            })}
                            className="w-5 h-5 text-blue-500 border-white/10 bg-slate-800 rounded focus:ring-blue-500 focus:ring-offset-0"
                          />
                          <span className="text-sm text-slate-300">{service.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Facebook URL <span className="text-slate-500 font-normal text-xs ml-1">(Optional)</span></label>
                      <input
                        type="url"
                        value={formData.facebookUrl}
                        onChange={(e) => setFormData({...formData, facebookUrl: e.target.value})}
                        placeholder="https://facebook.com/agency"
                        className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-600"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">LinkedIn URL <span className="text-slate-500 font-normal text-xs ml-1">(Optional)</span></label>
                      <input
                        type="url"
                        value={formData.linkedinUrl}
                        onChange={(e) => setFormData({...formData, linkedinUrl: e.target.value})}
                        placeholder="https://linkedin.com/company/agency"
                        className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-600"
                      />
                    </div>
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
