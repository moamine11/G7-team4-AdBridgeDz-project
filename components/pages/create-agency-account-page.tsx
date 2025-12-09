'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  CheckCircle2, 
  XCircle, 
  Eye, 
  EyeOff, 
  Phone, 
  Upload, 
  X, 
  Facebook, 
  Linkedin,
  Globe,
  MapPin,
  FileText,
  AlertCircle,
  Check,
  Building2,
  Briefcase,
  Calendar,
  Info
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { authService } from '@/lib/services/auth-service'
import { useToast } from '@/components/ui/use-toast'

const STORAGE_KEY = 'agency_signup_progress'

export default function CreateAgencyAccountPage() {
  const router = useRouter()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const rcDocumentInputRef = useRef<HTMLInputElement>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [rcDocumentPreview, setRcDocumentPreview] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    agencyName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    countryCode: '+213',
    websiteUrl: '',
    country: 'Algeria',
    city: '',
    streetAddress: '',
    postalCode: '',
    businessRegistrationNumber: '',
    rcDocument: null as File | null,
    logo: null as File | null,
    industry: '',
    companySize: '',
    yearEstablished: '',
    fullName: '',
    jobTitle: '',
    servicesOffered: [] as string[],
    facebookUrl: '',
    linkedinUrl: '',
    agreeToTerms: false,
  })

  const [validation, setValidation] = useState({
    email: { touched: false, valid: false, message: '' },
    password: { touched: false, valid: false },
    confirmPassword: { touched: false, valid: false, message: '' },
  })

  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  })

  // Load saved progress on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const savedData = JSON.parse(saved)
        setFormData(prev => ({ ...prev, ...savedData.data }))
        if (savedData.logoPreview) {
          setLogoPreview(savedData.logoPreview)
        }
        if (savedData.rcDocumentPreview) {
          setRcDocumentPreview(savedData.rcDocumentPreview)
        }
      } catch (error) {
        console.error('Error loading saved progress:', error)
      }
    }
  }, [])

  // Persist progress anytime form data or previews change
  useEffect(() => {
    const dataToSave = {
      data: {
        ...formData,
        logo: null,
        rcDocument: null,
      },
      logoPreview,
      rcDocumentPreview,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
  }, [formData, logoPreview, rcDocumentPreview])

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string) => {
    const criteria = {
      length: password.length >= 12,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    }
    setPasswordCriteria(criteria)
    return Object.values(criteria).every(Boolean)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    if (name === 'email') {
      const isValid = validateEmail(value)
      setValidation(prev => ({
        ...prev,
        email: {
          touched: true,
          valid: isValid,
          message: isValid ? '' : 'Please enter a valid email address',
        },
      }))
    }

    if (name === 'password') {
      const isValid = validatePassword(value)
      setValidation(prev => ({
        ...prev,
        password: { touched: true, valid: isValid },
      }))

      if (formData.confirmPassword) {
        setValidation(prev => ({
          ...prev,
          confirmPassword: {
            touched: true,
            valid: value === formData.confirmPassword,
            message: value === formData.confirmPassword ? '' : 'Passwords do not match',
          },
        }))
      }
    }

    if (name === 'confirmPassword') {
      const isValid = value === formData.password
      setValidation(prev => ({
        ...prev,
        confirmPassword: {
          touched: true,
          valid: isValid,
          message: isValid ? '' : 'Passwords do not match',
        },
      }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (service: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      servicesOffered: checked
        ? [...prev.servicesOffered, service]
        : prev.servicesOffered.filter(item => item !== service),
    }))
  }

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'logo' | 'rcDocument'
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    if (type === 'logo') {
      if (!file.type.match(/^image\/(jpeg|jpg|png|svg)/)) {
        alert('Please upload a JPG, PNG, or SVG file')
        return
      }
      setFormData(prev => ({ ...prev, logo: file }))
      const reader = new FileReader()
      reader.onloadend = () => setLogoPreview(reader.result as string)
      reader.readAsDataURL(file)
    } else {
      if (!file.type.match(/^(application\/pdf|image\/(jpeg|jpg|png))/)) {
        alert('Please upload a PDF, JPG, or PNG file')
        return
      }
      setFormData(prev => ({ ...prev, rcDocument: file }))
      const reader = new FileReader()
      reader.onloadend = () => setRcDocumentPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const removeFile = (type: 'logo' | 'rcDocument') => {
    if (type === 'logo') {
      setFormData(prev => ({ ...prev, logo: null }))
      setLogoPreview(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    } else {
      setFormData(prev => ({ ...prev, rcDocument: null }))
      setRcDocumentPreview(null)
      if (rcDocumentInputRef.current) rcDocumentInputRef.current.value = ''
    }
  }

  const getPasswordStrength = () => {
    const met = Object.values(passwordCriteria).filter(Boolean).length
    if (met < 3) return { level: 'weak', color: 'bg-red-500', text: 'weak' }
    if (met < 5) return { level: 'medium', color: 'bg-yellow-500', text: 'medium' }
    return { level: 'strong', color: 'bg-green-500', text: 'strong' }
  }

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.agencyName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('phone', formData.phoneNumber);
      formDataToSend.append('website', formData.websiteUrl);
      formDataToSend.append('address', `${formData.streetAddress}, ${formData.city}, ${formData.postalCode}, ${formData.country}`);
      formDataToSend.append('businessRegistrationNumber', formData.businessRegistrationNumber);
      formDataToSend.append('industry', formData.industry);
      formDataToSend.append('companySize', formData.companySize);
      formDataToSend.append('yearEstablished', formData.yearEstablished);
      formDataToSend.append('contactPerson[name]', formData.fullName);
      formDataToSend.append('contactPerson[title]', formData.jobTitle);
      
      formData.servicesOffered.forEach(service => {
        formDataToSend.append('services[]', service);
      });
      
      formDataToSend.append('socialMedia[facebook]', formData.facebookUrl);
      formDataToSend.append('socialMedia[linkedin]', formData.linkedinUrl);

      if (formData.logo) {
        formDataToSend.append('logo', formData.logo);
      }
      
      if (formData.rcDocument) {
        formDataToSend.append('rcDocument', formData.rcDocument);
      }

      await authService.registerAgency(formDataToSend);
      
      localStorage.removeItem(STORAGE_KEY)
      toast({
        title: "Success",
        description: "Agency account created successfully. Please check your email to verify your account, then login.",
      });
      router.push('/login')
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create agency account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="min-h-screen pt-32 pb-12 px-2 bg-[#020618] flex items-center justify-center">
      <div className="w-full max-w-5xl mx-auto">
        <div
          className="bg-gradient-to-br from-[#10182a]/80 via-[#1a223a]/70 to-[#0a0f1c]/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-blue-400/20 overflow-hidden"
          style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}
        >
          <div className="px-8 pt-8 pb-6 text-center border-b border-white/10">
            <p className="text-xs uppercase tracking-[0.3em] text-blue-200/70 mb-2">Agency Registration</p>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-300 via-teal-300 to-blue-400 bg-clip-text text-transparent">
              Create Your Agency Account
            </h1>
            <p className="text-sm text-blue-100/80 mt-2">
              Complete the form below to get your agency verified and start receiving bookings.
            </p>
          </div>

          <form onSubmit={handleCreateAccount} className="px-8 md:px-10 pb-10 space-y-10">
            {/* Agency Credentials */}
            <section>
              <div className="mb-6">
                <p className="text-xs uppercase tracking-[0.4em] text-blue-300/80 mb-2">Step 1</p>
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-blue-50">Agency Credentials</h2>
                    <p className="text-blue-200/80 text-sm">Create the login you will use to manage your bookings.</p>
                  </div>
                  <div className="text-xs text-blue-200/60">
                    <span className="font-semibold text-white">All fields required</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-blue-200 mb-1">
                    Agency Name <span className="text-red-400">*</span>
                  </label>
                  <Input
                    name="agencyName"
                    value={formData.agencyName}
                    onChange={handleInputChange}
                    placeholder="Registered agency name"
                    className={inputStyles}
                    required
                  />
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-blue-200 mb-1">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="contact@youragency.dz"
                    className={cn(
                      inputStyles,
                      'pr-10',
                      validation.email.touched &&
                        (validation.email.valid
                          ? 'border-green-500 focus:border-green-500'
                          : 'border-red-500 focus:border-red-500')
                    )}
                    required
                  />
                  {validation.email.touched && (
                    <div className="absolute right-3 bottom-3">
                      {validation.email.valid ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-blue-200 mb-1">Password <span className="text-red-400">*</span></label>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Create a secure password"
                    className={cn(
                      inputStyles,
                      'pr-10',
                      validation.password.touched &&
                        (validation.password.valid
                          ? 'border-green-500 focus:border-green-500'
                          : 'border-red-500 focus:border-red-500')
                    )}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-blue-200/70 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-blue-200 mb-1">Confirm Password <span className="text-red-400">*</span></label>
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Re-type your password"
                    className={cn(
                      inputStyles,
                      'pr-10',
                      validation.confirmPassword.touched &&
                        (validation.confirmPassword.valid
                          ? 'border-green-500 focus:border-green-500'
                          : 'border-red-500 focus:border-red-500')
                    )}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-9 text-blue-200/70 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {formData.password && (
                <div className="mt-6 bg-white/5 border border-white/10 rounded-2xl p-4">
                  <p className="text-sm font-medium text-blue-100 mb-2">Password strength: <span className="capitalize">{getPasswordStrength().text}</span></p>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={cn('h-full transition-all duration-300', getPasswordStrength().color)}
                      style={{ width: `${(Object.values(passwordCriteria).filter(Boolean).length / 5) * 100}%` }}
                    />
                  </div>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-blue-200/80">
                    {[
                      { met: passwordCriteria.length, label: 'At least 12 characters' },
                      { met: passwordCriteria.uppercase, label: 'One uppercase letter' },
                      { met: passwordCriteria.lowercase, label: 'One lowercase letter' },
                      { met: passwordCriteria.number, label: 'One number' },
                      { met: passwordCriteria.special, label: 'One special character' },
                    ].map(item => (
                      <div key={item.label} className="flex items-center gap-2">
                        {item.met ? (
                          <Check className="w-3 h-3 text-green-400" />
                        ) : (
                          <X className="w-3 h-3 text-blue-300/50" />
                        )}
                        <span className={item.met ? 'text-blue-50' : 'text-blue-100/60'}>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Contact & Location */}
            <section>
              <div className="mb-6">
                <p className="text-xs uppercase tracking-[0.4em] text-blue-300/80 mb-2">Step 2</p>
                <h2 className="text-2xl font-semibold text-blue-50">Contact & Location</h2>
                <p className="text-blue-200/80 text-sm">How brands can reach you and where you're based.</p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-1">Phone Number <span className="text-red-400">*</span></label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Select
                      value={formData.countryCode}
                      onValueChange={value => handleSelectChange('countryCode', value)}
                    >
                      <SelectTrigger className={cn('sm:w-32', selectTriggerStyles)}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="+213">🇩🇿 +213</SelectItem>
                        <SelectItem value="+33">🇫🇷 +33</SelectItem>
                        <SelectItem value="+1">🇺🇸 +1</SelectItem>
                        <SelectItem value="+44">🇬🇧 +44</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex-1 relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
                      <Input
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="555 123 456"
                        className={cn(inputStyles, 'pl-10')}
                        required
                      />
                    </div>
                  </div>
                  <p className="text-xs text-blue-200/70 mt-1">We'll use this to contact you about bookings and verification.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-1">Website <span className="text-blue-200/60">(optional)</span></label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
                    <Input
                      name="websiteUrl"
                      value={formData.websiteUrl}
                      onChange={handleInputChange}
                      placeholder="https://www.youragency.dz"
                      className={cn(inputStyles, 'pl-10')}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-1">Country <span className="text-red-400">*</span></label>
                    <Select value={formData.country} onValueChange={value => handleSelectChange('country', value)}>
                      <SelectTrigger className={selectTriggerStyles}>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Algeria">🇩🇿 Algeria</SelectItem>
                        <SelectItem value="France">🇫🇷 France</SelectItem>
                        <SelectItem value="Tunisia">🇹🇳 Tunisia</SelectItem>
                        <SelectItem value="Morocco">🇲🇦 Morocco</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-1">City <span className="text-red-400">*</span></label>
                    <Input
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="e.g., Algiers"
                      className={inputStyles}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-blue-200 mb-1">Street Address <span className="text-red-400">*</span></label>
                    <Input
                      name="streetAddress"
                      value={formData.streetAddress}
                      onChange={handleInputChange}
                      placeholder="123 Example Street, Business Center"
                      className={inputStyles}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-1">Postal Code <span className="text-red-400">*</span></label>
                    <Input
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      placeholder="16000"
                      className={inputStyles}
                      required
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Business Verification */}
            <section>
              <div className="mb-6">
                <p className="text-xs uppercase tracking-[0.4em] text-blue-300/80 mb-2">Step 3</p>
                <h2 className="text-2xl font-semibold text-blue-50">Business Verification</h2>
                <p className="text-blue-200/80 text-sm">We verify every agency to keep the marketplace safe.</p>
              </div>

              <div className="space-y-6">
                <div className="bg-white/5 border border-cyan-400/20 rounded-2xl p-4 text-blue-100">
                  <div className="flex gap-3">
                    <Info className="w-5 h-5 flex-shrink-0 text-cyan-300 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold mb-1">Documents are reviewed within 24-48h.</p>
                      <p className="text-xs text-blue-100/80">Upload clear copies—PDF, JPG or PNG up to 5MB each.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-1">Business Registration Number (RC) <span className="text-red-400">*</span></label>
                  <Input
                    name="businessRegistrationNumber"
                    value={formData.businessRegistrationNumber}
                    onChange={handleInputChange}
                    placeholder="Enter your RC number"
                    className={inputStyles}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">Registration Certificate (RC document) <span className="text-red-400">*</span></label>
                  {rcDocumentPreview ? (
                    <div className="space-y-3">
                      <div className="relative border-2 border-blue-400/30 rounded-2xl p-4 bg-white/5">
                        {formData.rcDocument?.type === 'application/pdf' ? (
                          <div className="flex items-center gap-3">
                            <FileText className="w-10 h-10 text-red-500" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-blue-100">{formData.rcDocument?.name}</p>
                              <p className="text-xs text-blue-200/70">{((formData.rcDocument?.size || 0) / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile('rcDocument')}
                              className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="relative">
                            <img
                              src={rcDocumentPreview}
                              alt="RC Document preview"
                              className="w-full max-h-48 object-contain rounded-2xl border border-white/10"
                            />
                            <button
                              type="button"
                              onClick={() => removeFile('rcDocument')}
                              className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-blue-200/70">Status: <span className="font-medium text-orange-300">Pending verification</span></p>
                    </div>
                  ) : (
                    <div
                      onClick={() => rcDocumentInputRef.current?.click()}
                      className="border-2 border-dashed border-blue-400/40 rounded-2xl p-8 text-center cursor-pointer hover:border-cyan-400 hover:bg-white/5 transition-all text-blue-100"
                    >
                      <FileText className="w-10 h-10 text-blue-300 mx-auto mb-2" />
                      <p className="text-sm font-medium">Click to upload or drag & drop</p>
                      <p className="text-xs text-blue-200/70">PDF, JPG or PNG — max 5MB</p>
                    </div>
                  )}
                  <input
                    ref={rcDocumentInputRef}
                    type="file"
                    accept="application/pdf,image/jpeg,image/jpg,image/png"
                    onChange={e => handleFileUpload(e, 'rcDocument')}
                    className="hidden"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">Agency Logo <span className="text-blue-200/60">(optional)</span></label>
                  {logoPreview ? (
                    <div className="relative inline-block">
                      <img src={logoPreview} alt="Agency logo" className="w-32 h-32 object-cover rounded-2xl border-2 border-blue-400/40" />
                      <button
                        type="button"
                        onClick={() => removeFile('logo')}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-blue-400/40 rounded-2xl p-8 text-center cursor-pointer hover:border-cyan-400 hover:bg-white/5 transition-all text-blue-100"
                    >
                      <Upload className="w-10 h-10 text-blue-300 mx-auto mb-2" />
                      <p className="text-sm font-medium">Upload agency logo</p>
                      <p className="text-xs text-blue-200/70">JPG, PNG, SVG — max 5MB</p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/svg+xml"
                    onChange={e => handleFileUpload(e, 'logo')}
                    className="hidden"
                  />
                </div>
              </div>
            </section>

            {/* Agency Profile */}
            <section>
              <div className="mb-6">
                <p className="text-xs uppercase tracking-[0.4em] text-blue-300/80 mb-2">Step 4</p>
                <h2 className="text-2xl font-semibold text-blue-50">Agency Profile</h2>
                <p className="text-blue-200/80 text-sm">Tell us about your positioning and main contact.</p>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-1">Industry/Sector <span className="text-red-400">*</span></label>
                    <Select value={formData.industry} onValueChange={value => handleSelectChange('industry', value)}>
                      <SelectTrigger className={selectTriggerStyles}>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {industryOptions.map(item => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-1">Company Size <span className="text-red-400">*</span></label>
                    <Select value={formData.companySize} onValueChange={value => handleSelectChange('companySize', value)}>
                      <SelectTrigger className={selectTriggerStyles}>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        {companySizeOptions.map(item => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-1">Year Established <span className="text-blue-200/60">(optional)</span></label>
                    <Input
                      type="number"
                      name="yearEstablished"
                      value={formData.yearEstablished}
                      onChange={handleInputChange}
                      placeholder="e.g., 2015"
                      min="1900"
                      max={new Date().getFullYear()}
                      className={inputStyles}
                    />
                  </div>
                </div>

                <div className="border border-white/10 rounded-2xl p-5 bg-white/5">
                  <h3 className="text-lg font-semibold text-blue-100 mb-4">Primary Contact Person</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-200 mb-1">Full Name <span className="text-red-400">*</span></label>
                      <Input
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="First and last name"
                        className={inputStyles}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-200 mb-1">Job Title <span className="text-red-400">*</span></label>
                      <Input
                        name="jobTitle"
                        value={formData.jobTitle}
                        onChange={handleInputChange}
                        placeholder="e.g., Managing Director"
                        className={inputStyles}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Services & Social */}
            <section>
              <div className="mb-6">
                <p className="text-xs uppercase tracking-[0.4em] text-blue-300/80 mb-2">Step 5</p>
                <h2 className="text-2xl font-semibold text-blue-50">Services & Social</h2>
                <p className="text-blue-200/80 text-sm">Help brands understand what you offer.</p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-1">Services Offered <span className="text-blue-200/70">(optional)</span></label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {servicesOptions.map(service => (
                      <label key={service} className="flex items-center gap-3 text-sm text-blue-100 bg-white/5 border border-white/10 rounded-2xl p-3">
                        <Checkbox
                          checked={formData.servicesOffered.includes(service)}
                          onCheckedChange={checked => handleCheckboxChange(service, checked as boolean)}
                        />
                        <span>{service}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-1">Facebook <span className="text-blue-200/70">(optional)</span></label>
                    <div className="relative">
                      <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
                      <Input
                        name="facebookUrl"
                        value={formData.facebookUrl}
                        onChange={handleInputChange}
                        placeholder="https://facebook.com/youragency"
                        className={cn(inputStyles, 'pl-10')}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-1">LinkedIn <span className="text-blue-200/70">(optional)</span></label>
                    <div className="relative">
                      <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
                      <Input
                        name="linkedinUrl"
                        value={formData.linkedinUrl}
                        onChange={handleInputChange}
                        placeholder="https://linkedin.com/company/youragency"
                        className={cn(inputStyles, 'pl-10')}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Agreement & Submit */}
            <section className="space-y-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={formData.agreeToTerms}
                  onCheckedChange={checked => setFormData(prev => ({ ...prev, agreeToTerms: checked as boolean }))}
                  className="mt-1"
                />
                <p className="text-sm text-blue-100">
                  I agree to the{' '}
                  <a href="#" className="text-cyan-300 hover:text-cyan-100 underline">Terms of Service</a>{' '}
                  and{' '}
                  <a href="#" className="text-cyan-300 hover:text-cyan-100 underline">Privacy Policy</a>
                  <span className="text-red-400"> *</span>
                </p>
              </div>

              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
                <p className="text-sm text-blue-200/80 flex-1">
                  You can pause later and resume anytime. We will notify you via email once your agency is verified.
                </p>
                <Button
                  type="submit"
                  disabled={!formData.agreeToTerms || isLoading}
                  className="w-full md:w-auto bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white px-10 py-3 rounded-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/30"
                >
                  {isLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    'Create Agency Account'
                  )}
                </Button>
              </div>
            </section>
          </form>
        </div>
      </div>
    </div>
  )
}

const inputStyles = 'w-full bg-white/5 border border-blue-400/30 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 text-blue-100 placeholder:text-blue-300 rounded-2xl transition-all duration-200 shadow-inner shadow-blue-900/10'

const selectTriggerStyles = 'bg-white/5 border border-blue-400/30 text-blue-100 rounded-2xl focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30'

const servicesOptions = [
  'Outdoor advertising',
  'Digital marketing',
  'Media planning & buying',
  'Brand strategy',
  'Creative production',
  'Influencer marketing',
]

const industryOptions = [
  'Media & Advertising',
  'Technology & SaaS',
  'Retail & E-commerce',
  'Tourism & Hospitality',
  'Finance & Banking',
  'Healthcare & Pharma',
  'Automotive',
  'Education',
  'Other',
]

const companySizeOptions = [
  { value: '1-10', label: '1-10 employees (Boutique)' },
  { value: '11-50', label: '11-50 employees (Growing)' },
  { value: '51-200', label: '51-200 employees (Established)' },
  { value: '201-1000', label: '201-1000 employees (Large)' },
  { value: '1000+', label: '1000+ employees (Enterprise)' },
]
