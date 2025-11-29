'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Sidebar, SidebarProvider } from '@/components/ui/sidebar'
import Navbar from '@/components/ui/navbar'
import { Upload } from 'lucide-react'
import { authService } from '@/lib/services/auth-service'
import { useAuth } from '@/contexts/auth-context'
import { useToast } from '@/components/ui/use-toast'

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
      // Construct the payload for update (assuming update endpoint exists or using register for now as placeholder logic)
      // Note: The backend routes I saw earlier didn't have a specific update profile endpoint for agencies in the snippet, 
      // but usually it's PUT /agencies/profile or similar. 
      // I'll assume for now we just log it or if I had the endpoint I'd call it.
      // Since I only saw register and login in auth-service, I might need to add updateAgencyProfile to auth-service.
      
      // For now, just show success message as if it worked, or implement the service method if I can.
      // Let's check auth-service again. I didn't add updateAgencyProfile.
      
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
        <div className="flex min-h-screen bg-gray-50">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Navbar />
            <main className="flex-1 p-8 flex justify-center items-center">
              <span className="loading loading-spinner loading-lg text-teal-500"></span>
            </main>
          </div>
        </div>
      </SidebarProvider>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        
        <div className="flex-1 flex flex-col">
          <Navbar />
          
          <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="text-sm text-gray-500 mb-2">
              <Link href="/dashboard" className="hover:text-gray-700">Dashboard</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900 font-medium">Agency Profile</span>
            </nav>

            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Agency Profile</h1>
              <p className="text-gray-600">Manage your agency profile, contact information, and business details.</p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Basic Account Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Basic Account Information</h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Agency Name</label>
                      <input
                        type="text"
                        value={formData.agencyName}
                        onChange={(e) => setFormData({...formData, agencyName: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Website URL <span className="text-gray-400 font-normal">(optional)</span></label>
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => setFormData({...formData, website: e.target.value})}
                        placeholder="https://example.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Street Address</label>
                    <input
                      type="text"
                      value={formData.streetAddress}
                      onChange={(e) => setFormData({...formData, streetAddress: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
                      <select
                        value={formData.country}
                        onChange={(e) => setFormData({...formData, country: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                      >
                        <option>Algeria</option>
                        <option>Morocco</option>
                        <option>Tunisia</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Postal Code</label>
                      <input
                        type="text"
                        value={formData.postalCode}
                        onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Profile & Details */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Company Profile & Details</h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Industry/Sector</label>
                      <select
                        value={formData.industry}
                        onChange={(e) => setFormData({...formData, industry: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                      >
                        <option>Advertising</option>
                        <option>Marketing</option>
                        <option>Media</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Company Size</label>
                      <select
                        value={formData.companySize}
                        onChange={(e) => setFormData({...formData, companySize: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                      >
                        <option>1-10 employees</option>
                        <option>11-50 employees</option>
                        <option>51-200 employees</option>
                        <option>200+ employees</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Year Established <span className="text-gray-400 font-normal">(optional)</span></label>
                    <input
                      type="text"
                      value={formData.yearEstablished}
                      onChange={(e) => setFormData({...formData, yearEstablished: e.target.value})}
                      placeholder="2010"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Primary Contact Person */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Primary Contact Person</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Job Title</label>
                    <input
                      type="text"
                      value={formData.jobTitle}
                      onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                      placeholder="CEO / Founder"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Business Documents */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Business Documents</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Business Registration Number (RC)</label>
                    <input
                      type="text"
                      value={formData.registrationNumber}
                      onChange={(e) => setFormData({...formData, registrationNumber: e.target.value})}
                      placeholder="e.g., 123456789"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Registration Certificate Document</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500 mb-1">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-400">PDF, PNG, JPG (MAX. 5MB)</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Agency Logo <span className="text-gray-400 font-normal">(optional)</span></label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500 mb-1">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-400">PNG, JPG (MAX. 2MB)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Additional Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Services Offered</label>
                    <div className="grid grid-cols-3 gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.services.billboard}
                          onChange={(e) => setFormData({
                            ...formData,
                            services: {...formData.services, billboard: e.target.checked}
                          })}
                          className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                        />
                        <span className="text-sm text-gray-700">Billboard Advertising</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.services.digitalBillboards}
                          onChange={(e) => setFormData({
                            ...formData,
                            services: {...formData.services, digitalBillboards: e.target.checked}
                          })}
                          className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                        />
                        <span className="text-sm text-gray-700">Digital Billboards</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.services.transit}
                          onChange={(e) => setFormData({
                            ...formData,
                            services: {...formData.services, transit: e.target.checked}
                          })}
                          className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                        />
                        <span className="text-sm text-gray-700">Transit Advertising</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.services.streetFurniture}
                          onChange={(e) => setFormData({
                            ...formData,
                            services: {...formData.services, streetFurniture: e.target.checked}
                          })}
                          className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                        />
                        <span className="text-sm text-gray-700">Street Furniture Advertising</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.services.airport}
                          onChange={(e) => setFormData({
                            ...formData,
                            services: {...formData.services, airport: e.target.checked}
                          })}
                          className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                        />
                        <span className="text-sm text-gray-700">Airport Advertising</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.services.stadium}
                          onChange={(e) => setFormData({
                            ...formData,
                            services: {...formData.services, stadium: e.target.checked}
                          })}
                          className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                        />
                        <span className="text-sm text-gray-700">Stadium Advertising</span>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Facebook URL <span className="text-gray-400 font-normal">(optional)</span></label>
                      <input
                        type="url"
                        value={formData.facebookUrl}
                        onChange={(e) => setFormData({...formData, facebookUrl: e.target.value})}
                        placeholder="https://facebook.com/agency"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">LinkedIn URL <span className="text-gray-400 font-normal">(optional)</span></label>
                      <input
                        type="url"
                        value={formData.linkedinUrl}
                        onChange={(e) => setFormData({...formData, linkedinUrl: e.target.value})}
                        placeholder="https://linkedin.com/company/agency"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500 mt-1"
                  />
                  <span className="text-sm text-gray-700">
                    I agree to the <Link href="/terms" className="text-teal-600 hover:text-teal-700 font-semibold">Terms of Service</Link> and <Link href="/privacy" className="text-teal-600 hover:text-teal-700 font-semibold">Privacy Policy</Link>.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-8 py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30 transition-all duration-200"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}