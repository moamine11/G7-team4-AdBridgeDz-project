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

const STORAGE_KEY = 'agency_signup_progress'
const TOTAL_STEPS = 5

export default function CreateAgencyAccountPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const rcDocumentInputRef = useRef<HTMLInputElement>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [rcDocumentPreview, setRcDocumentPreview] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
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
        setCurrentStep(savedData.step || 1)
        if (savedData.logoPreview) {
          setLogoPreview(savedData.logoPreview)
        }
        if (savedData.rcDocumentPreview) {
          setRcDocumentPreview(savedData.rcDocumentPreview)
        }
      } catch (e) {
        console.error('Error loading saved progress:', e)
      }
    }
  }, [])

  // Save progress on form data change
  useEffect(() => {
    const dataToSave = {
      data: {
        ...formData,
        logo: null, // Don't save file object
        rcDocument: null, // Don't save file object
      },
      step: currentStep,
      logoPreview,
      rcDocumentPreview,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
  }, [formData, currentStep, logoPreview, rcDocumentPreview])

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Password validation
  const validatePassword = (password: string) => {
    const criteria = {
      length: password.length >= 12,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    }
    setPasswordCriteria(criteria)
    return Object.values(criteria).every(v => v)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // Email validation
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

    // Password validation
    if (name === 'password') {
      const isValid = validatePassword(value)
      setValidation(prev => ({
        ...prev,
        password: { touched: true, valid: isValid },
      }))
      
      // Check confirm password match
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

    // Confirm password validation
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
        : prev.servicesOffered.filter(s => s !== service),
    }))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'rcDocument') => {
    const file = e.target.files?.[0]
    if (file) {
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
        reader.onloadend = () => {
          setLogoPreview(reader.result as string)
        }
        reader.readAsDataURL(file)
      } else {
        // RC Document - accept PDF and images
        if (!file.type.match(/^(application\/pdf|image\/(jpeg|jpg|png))/)) {
          alert('Please upload a PDF, JPG, or PNG file')
          return
        }
        setFormData(prev => ({ ...prev, rcDocument: file }))
        const reader = new FileReader()
        reader.onloadend = () => {
          setRcDocumentPreview(reader.result as string)
        }
        reader.readAsDataURL(file)
      }
    }
  }

  const removeFile = (type: 'logo' | 'rcDocument') => {
    if (type === 'logo') {
      setFormData(prev => ({ ...prev, logo: null }))
      setLogoPreview(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } else {
      setFormData(prev => ({ ...prev, rcDocument: null }))
      setRcDocumentPreview(null)
      if (rcDocumentInputRef.current) {
        rcDocumentInputRef.current.value = ''
      }
    }
  }

  const getPasswordStrength = () => {
    const met = Object.values(passwordCriteria).filter(Boolean).length
    if (met < 3) return { level: 'weak', color: 'bg-red-500', text: 'Weak' }
    if (met < 5) return { level: 'medium', color: 'bg-yellow-500', text: 'Medium' }
    return { level: 'strong', color: 'bg-green-500', text: 'Strong' }
  }

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Create agency account:', formData)
    localStorage.removeItem(STORAGE_KEY) // Clear saved progress
    router.push('/verify-email')
  }

  const steps = [
    { number: 1, title: 'Account Info' },
    { number: 2, title: 'Contact' },
    { number: 3, title: 'Verification' },
    { number: 4, title: 'Profile' },
    { number: 5, title: 'Additional' },
  ]

  const servicesOptions = [
    'Billboard Advertising',
    'Digital Billboards',
    'Transit Advertising',
    'Street Furniture Advertising',
    'Airport Advertising',
    'Stadium Advertising',
  ]

  const industryOptions = [
    'Outdoor Advertising',
    'Digital Marketing Agency',
    'Media Planning',
    'Creative Services',
    'Full-Service Advertising',
    'Other',
  ]

  const companySizeOptions = [
    { value: 'solo', label: 'Solo Practitioner' },
    { value: '2-5', label: '2-5 employees' },
    { value: '6-20', label: '6-20 employees' },
    { value: '21-50', label: '21-50 employees' },
    { value: '51-200', label: '51-200 employees' },
    { value: '200+', label: '200+ employees' },
  ]

  return (
    <div className="min-h-screen py-8 px-4">
      {/* Navbar provided by RootLayout */}

      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div 
                  className="flex flex-col items-center flex-1 cursor-pointer"
                  onClick={() => setCurrentStep(step.number)}
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300",
                      currentStep > step.number
                        ? "bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:scale-110"
                        : currentStep === step.number
                        ? "bg-gradient-to-r from-teal-500 to-blue-500 text-white ring-4 ring-teal-500/20 scale-110"
                        : "bg-gray-200 text-gray-500 hover:bg-gray-300 hover:scale-105"
                    )}
                  >
                    {currentStep > step.number ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <span
                    className={cn(
                      "mt-2 text-xs font-medium transition-colors",
                      currentStep >= step.number
                        ? "text-gray-900"
                        : "text-gray-400"
                    )}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-0.5 mx-2 -mt-6">
                    <div
                      className={cn(
                        "h-full transition-all duration-300",
                        currentStep > step.number
                          ? "bg-gradient-to-r from-teal-500 to-blue-500"
                          : "bg-gray-200"
                      )}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <form onSubmit={handleCreateAccount}>
            {/* Step 1: Basic Account Information */}
            <div
              className={cn(
                "transition-all duration-500 ease-in-out",
                currentStep === 1
                  ? "opacity-100 translate-x-0 block"
                  : "opacity-0 translate-x-[-100%] hidden"
              )}
            >
              <div className="p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Account Information</h2>
                  <p className="text-gray-600">Create your account credentials</p>
                </div>

                <div className="space-y-5">
                  {/* Agency Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Agency Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="agencyName"
                      value={formData.agencyName}
                      onChange={handleInputChange}
                      placeholder="Enter your agency name"
                      className="w-full"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Your registered business name</p>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                        placeholder="contact@youragency.dz"
                        className={cn(
                          "w-full pr-10",
                          validation.email.touched &&
                            (validation.email.valid
                              ? "border-green-500 focus:border-green-500"
                              : "border-red-500 focus:border-red-500")
                        )}
                        required
                      />
                      {validation.email.touched && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {validation.email.valid ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-500" />
                          )}
                        </div>
                      )}
                    </div>
                    {validation.email.touched && (
                      <p
                        className={cn(
                          "text-xs mt-1 flex items-center gap-1",
                          validation.email.valid ? "text-green-600" : "text-red-500"
                        )}
                      >
                        {validation.email.valid ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            Valid email
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            {validation.email.message}
                          </>
                        )}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Create a secure password"
                        className={cn(
                          "w-full pr-10",
                          validation.password.touched &&
                            (validation.password.valid
                              ? "border-green-500 focus:border-green-500"
                              : "border-red-500 focus:border-red-500")
                        )}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {validation.password.touched && formData.password && (
                      <div className="mt-2">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full transition-all duration-300",
                              getPasswordStrength().color
                            )}
                            style={{
                              width: `${
                                (Object.values(passwordCriteria).filter(Boolean).length / 5) * 100
                              }%`,
                            }}
                          />
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          Password strength: <span className="font-medium">{getPasswordStrength().text}</span>
                        </p>
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center gap-2 text-xs">
                            {passwordCriteria.length ? (
                              <Check className="w-3 h-3 text-green-500" />
                            ) : (
                              <X className="w-3 h-3 text-gray-400" />
                            )}
                            <span className={passwordCriteria.length ? 'text-gray-700' : 'text-gray-400'}>
                              At least 12 characters
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            {passwordCriteria.uppercase ? (
                              <Check className="w-3 h-3 text-green-500" />
                            ) : (
                              <X className="w-3 h-3 text-gray-400" />
                            )}
                            <span className={passwordCriteria.uppercase ? 'text-gray-700' : 'text-gray-400'}>
                              One uppercase letter
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            {passwordCriteria.lowercase ? (
                              <Check className="w-3 h-3 text-green-500" />
                            ) : (
                              <X className="w-3 h-3 text-gray-400" />
                            )}
                            <span className={passwordCriteria.lowercase ? 'text-gray-700' : 'text-gray-400'}>
                              One lowercase letter
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            {passwordCriteria.number ? (
                              <Check className="w-3 h-3 text-green-500" />
                            ) : (
                              <X className="w-3 h-3 text-gray-400" />
                            )}
                            <span className={passwordCriteria.number ? 'text-gray-700' : 'text-gray-400'}>
                              One number
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            {passwordCriteria.special ? (
                              <Check className="w-3 h-3 text-green-500" />
                            ) : (
                              <X className="w-3 h-3 text-gray-400" />
                            )}
                            <span className={passwordCriteria.special ? 'text-gray-700' : 'text-gray-400'}>
                              One special character (!@#$%^&*)
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm your password"
                        className={cn(
                          "w-full pr-10",
                          validation.confirmPassword.touched &&
                            (validation.confirmPassword.valid
                              ? "border-green-500 focus:border-green-500"
                              : "border-red-500 focus:border-red-500")
                        )}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {validation.confirmPassword.touched && (
                      <p
                        className={cn(
                          "text-xs mt-1 flex items-center gap-1",
                          validation.confirmPassword.valid ? "text-green-600" : "text-red-500"
                        )}
                      >
                        {validation.confirmPassword.valid ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            Passwords match
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            {validation.confirmPassword.message}
                          </>
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Contact Information */}
            <div
              className={cn(
                "transition-all duration-500 ease-in-out",
                currentStep === 2
                  ? "opacity-100 translate-x-0 block"
                  : currentStep < 2
                  ? "opacity-0 translate-x-[100%] hidden"
                  : "opacity-0 translate-x-[-100%] hidden"
              )}
            >
              <div className="p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Information</h2>
                  <p className="text-gray-600">How can we reach you?</p>
                </div>

                <div className="space-y-5">
                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <Select
                        value={formData.countryCode}
                        onValueChange={(value) => handleSelectChange('countryCode', value)}
                      >
                        <SelectTrigger className="w-24">
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
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                          placeholder="555 123 456"
                          className="w-full pl-10"
                          required
                    />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      We'll use this to contact you about your account and bookings
                    </p>
                  </div>

                  {/* Website URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website URL <span className="text-gray-400 text-xs">(optional)</span>
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      name="websiteUrl"
                      value={formData.websiteUrl}
                      onChange={handleInputChange}
                        placeholder="https://www.youragency.dz"
                        className="w-full pl-10"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Your agency website (optional)</p>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Address <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-3">
                      <Select
                        value={formData.country}
                        onValueChange={(value) => handleSelectChange('country', value)}
                      >
                        <SelectTrigger className="w-full">
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
                      <Input
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="City"
                        className="w-full"
                        required
                      />
                      <Input
                        name="streetAddress"
                        value={formData.streetAddress}
                        onChange={handleInputChange}
                        placeholder="Street Address"
                        className="w-full"
                        required
                      />
                      <Input
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        placeholder="Postal Code"
                      className="w-full"
                        required
                    />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Your business registered address</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Business Verification */}
            <div
              className={cn(
                "transition-all duration-500 ease-in-out",
                currentStep === 3
                  ? "opacity-100 translate-x-0 block"
                  : currentStep < 3
                  ? "opacity-0 translate-x-[100%] hidden"
                  : "opacity-0 translate-x-[-100%] hidden"
              )}
            >
              <div className="p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Business Verification</h2>
                  <p className="text-gray-600">Verify your agency's legitimacy</p>
              </div>

                <div className="space-y-6">
                  {/* Info Box */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex gap-3">
                      <Info className="w-5 h-5 flex-shrink-0 text-blue-600 mt-0.5" />
              <div>
                        <p className="text-sm font-medium text-blue-900 mb-1">
                          Verification Required
                        </p>
                        <p className="text-xs text-blue-700">
                          This is required to verify your agency and ensure the safety of our platform. 
                          We'll review your documents within 24-48 hours.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Business Registration Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Registration Number (RC) <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="businessRegistrationNumber"
                      value={formData.businessRegistrationNumber}
                      onChange={handleInputChange}
                      placeholder="Enter your RC number"
                      className="w-full"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Your official business registration number (RC) - Required for verification
                    </p>
                  </div>

                  {/* Registration Certificate Document */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Registration Certificate Document <span className="text-red-500">*</span>
                    </label>
                    {rcDocumentPreview ? (
                      <div className="space-y-3">
                        <div className="relative border-2 border-gray-200 rounded-lg p-4">
                          {formData.rcDocument?.type === 'application/pdf' ? (
                            <div className="flex items-center gap-3">
                              <FileText className="w-10 h-10 text-red-500" />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                  {formData.rcDocument.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {(formData.rcDocument.size / 1024 / 1024).toFixed(2)} MB
                                </p>
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
                                className="w-full max-h-48 object-contain rounded-lg"
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
                        <p className="text-xs text-gray-500">
                          Status: <span className="font-medium text-orange-600">Pending verification</span>
                        </p>
                      </div>
                    ) : (
                      <div
                        onClick={() => rcDocumentInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-teal-500 hover:bg-teal-50/50 transition-all"
                      >
                        <FileText className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          PDF, JPG, or PNG (max 5MB)
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          Upload your business registration certificate (RC document)
                        </p>
                        <p className="text-xs text-blue-600 mt-1 font-medium">
                          This document is required to verify your agency's legitimacy. We'll review it within 24-48 hours.
                        </p>
                      </div>
                    )}
                    <input
                      ref={rcDocumentInputRef}
                      type="file"
                      accept="application/pdf,image/jpeg,image/jpg,image/png"
                      onChange={(e) => handleFileUpload(e, 'rcDocument')}
                      className="hidden"
                    />
                  </div>

                  {/* Agency Logo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Agency Logo <span className="text-gray-400 text-xs">(optional)</span>
                    </label>
                    {logoPreview ? (
                      <div className="relative inline-block">
                        <img
                          src={logoPreview}
                          alt="Agency logo preview"
                          className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile('logo')}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-teal-500 hover:bg-teal-50/50 transition-all"
                      >
                        <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          JPG, PNG, or SVG (max 5MB)
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          Upload your agency logo to enhance your profile visibility
                        </p>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/svg+xml"
                      onChange={(e) => handleFileUpload(e, 'logo')}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4: Company Profile & Details */}
            <div
              className={cn(
                "transition-all duration-500 ease-in-out",
                currentStep === 4
                  ? "opacity-100 translate-x-0 block"
                  : currentStep < 4
                  ? "opacity-0 translate-x-[100%] hidden"
                  : "opacity-0 translate-x-[-100%] hidden"
              )}
            >
              <div className="p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Company Profile & Details</h2>
                  <p className="text-gray-600">Tell us about your agency</p>
                </div>

                <div className="space-y-5">
                  {/* Industry */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Industry/Sector <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={formData.industry}
                      onValueChange={(value) => handleSelectChange('industry', value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {industryOptions.map((industry) => (
                          <SelectItem key={industry} value={industry}>
                            {industry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Company Size */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Size <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={formData.companySize}
                      onValueChange={(value) => handleSelectChange('companySize', value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select company size" />
                      </SelectTrigger>
                      <SelectContent>
                        {companySizeOptions.map((size) => (
                          <SelectItem key={size.value} value={size.value}>
                            {size.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Year Established */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Year Established <span className="text-gray-400 text-xs">(optional)</span>
                    </label>
                    <Input
                      type="number"
                      name="yearEstablished"
                      value={formData.yearEstablished}
                      onChange={handleInputChange}
                      placeholder="e.g., 2015"
                      min="1900"
                      max={new Date().getFullYear()}
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500 mt-1">When was your agency founded? (optional)</p>
                      </div>

                  {/* Primary Contact Person */}
                  <div className="border-t border-gray-200 pt-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Primary Contact Person</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="First and last name"
                          className="w-full"
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          The main person we'll contact for account matters
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Job Title <span className="text-red-500">*</span>
                        </label>
                        <Input
                          name="jobTitle"
                          value={formData.jobTitle}
                          onChange={handleInputChange}
                          placeholder="e.g., Marketing Director, CEO"
                          className="w-full"
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">Your position in the agency</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 5: Additional Information */}
            <div
              className={cn(
                "transition-all duration-500 ease-in-out",
                currentStep === 5
                  ? "opacity-100 translate-x-0 block"
                  : "opacity-0 translate-x-[100%] hidden"
              )}
            >
              <div className="p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Additional Information</h2>
                  <p className="text-gray-600">Tell us more about what you offer (optional)</p>
                </div>

                <div className="space-y-5">
                  {/* Services Offered */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Services Offered <span className="text-gray-400 text-xs">(optional)</span>
                    </label>
                    <div className="space-y-2 border border-gray-200 rounded-lg p-4">
                      {servicesOptions.map((service) => (
                        <div key={service} className="flex items-center gap-2">
                          <Checkbox
                            checked={formData.servicesOffered.includes(service)}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange(service, checked as boolean)
                            }
                          />
                          <label className="text-sm text-gray-700 cursor-pointer flex-1">
                            {service}
                          </label>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Select services your agency offers (optional)
                    </p>
                  </div>

                  {/* Social Media */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Facebook <span className="text-gray-400 text-xs">(optional)</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <Facebook className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <Input
                          name="facebookUrl"
                          value={formData.facebookUrl}
                    onChange={handleInputChange}
                          placeholder="https://facebook.com/youragency"
                          className="flex-1"
                  />
                </div>
                    </div>
                <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        LinkedIn <span className="text-gray-400 text-xs">(optional)</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <Linkedin className="w-5 h-5 text-blue-700 flex-shrink-0" />
                  <Input
                          name="linkedinUrl"
                          value={formData.linkedinUrl}
                    onChange={handleInputChange}
                          placeholder="https://linkedin.com/company/youragency"
                          className="flex-1"
                  />
                </div>
              </div>
            </div>

                  {/* Terms & Conditions */}
                  <div className="border-t border-gray-200 pt-5">
                    <div className="flex items-start gap-3">
              <Checkbox
                checked={formData.agreeToTerms}
                        onCheckedChange={(checked) =>
                          setFormData(prev => ({ ...prev, agreeToTerms: checked as boolean }))
                        }
                        className="mt-1"
                      />
                      <label className="text-sm text-gray-700 cursor-pointer">
                        I agree to the{' '}
                        <a href="#" className="text-blue-600 hover:text-blue-700 underline">
                          Terms of Service
                        </a>{' '}
                        and{' '}
                        <a href="#" className="text-blue-600 hover:text-blue-700 underline">
                          Privacy Policy
                        </a>
                        <span className="text-red-500">*</span>
              </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 ml-7">
                      By creating an account, you agree to our terms
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="border-t border-gray-200 p-6 bg-gray-50/50 flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (currentStep === 1) {
                    router.back()
                  } else {
                    prevStep()
                  }
                }}
                className="px-6 py-2 rounded-full"
              >
                {currentStep === 1 ? 'Cancel' : 'Back'}
              </Button>

              {currentStep < TOTAL_STEPS ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white px-8 py-2 rounded-full font-semibold"
                >
                  Continue
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={!formData.agreeToTerms}
                  className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white px-8 py-2 rounded-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Register Account
                </Button>
              )}
            </div>
          </form>
          </div>
      </div>
    </div>
  )
}
