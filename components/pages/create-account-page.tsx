'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
  Building2,
  Mail,
  Lock,
  Users,
  Calendar,
  Globe,
  MapPin,
  Briefcase,
  Check
} from 'lucide-react'
import { cn } from '@/lib/utils'

const STORAGE_KEY = 'company_signup_progress'
const TOTAL_STEPS = 4

export default function CreateAccountPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    countryCode: '+213',
    websiteUrl: '',
    physicalAddress: '',
    logo: null as File | null,
    industry: '',
    companySize: '',
    yearEstablished: '',
    servicesOffered: [] as string[],
    facebookUrl: '',
    linkedinUrl: '',
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
      },
      step: currentStep,
      logoPreview,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
  }, [formData, currentStep, logoPreview])

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB')
        return
      }
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
    }
  }

  const removeLogo = () => {
    setFormData(prev => ({ ...prev, logo: null }))
    setLogoPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const getPasswordStrength = () => {
    const met = Object.values(passwordCriteria).filter(Boolean).length
    if (met < 3) return { level: 'weak', color: 'bg-red-500', text: 'Weak' }
    if (met < 5) return { level: 'medium', color: 'bg-yellow-500', text: 'Medium' }
    return { level: 'strong', color: 'bg-green-500', text: 'Strong' }
  }

  const canProceedStep1 = () => {
    return (
      formData.companyName.trim() !== '' &&
      formData.email.trim() !== '' &&
      validation.email.touched &&
      validation.email.valid &&
      formData.password.trim() !== '' &&
      validation.password.touched &&
      validation.password.valid &&
      formData.confirmPassword.trim() !== '' &&
      validation.confirmPassword.touched &&
      validation.confirmPassword.valid
    )
  }

  const canProceedStep2 = () => {
    return formData.phoneNumber.trim() !== ''
  }

  const canProceedStep3 = () => {
    return formData.industry !== '' && formData.companySize !== ''
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
    console.log('Create account:', formData)
    localStorage.removeItem(STORAGE_KEY) // Clear saved progress
    router.push('/verify-email')
  }

  const steps = [
    { number: 1, title: 'Account Info' },
    { number: 2, title: 'Contact' },
    { number: 3, title: 'Company Profile' },
    { number: 4, title: 'Services & Social' },
  ]

  const servicesOptions = [
    'Outdoor Advertising',
    'Digital Marketing',
    'Brand Strategy',
    'Media Planning',
    'Creative Services',
  ]

  const industryOptions = [
    'Retail & E-commerce',
    'Food & Beverage',
    'Technology',
    'Healthcare',
    'Finance & Banking',
    'Real Estate',
    'Education',
    'Tourism & Hospitality',
    'Manufacturing',
    'Other',
  ]

  const companySizeOptions = [
    { value: '1-10', label: '1-10 employees (Startup)' },
    { value: '11-50', label: '11-50 employees (Small)' },
    { value: '51-200', label: '51-200 employees (Medium)' },
    { value: '201-1000', label: '201-1000 employees (Large)' },
    { value: '1000+', label: '1000+ employees (Enterprise)' },
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
                  {/* Company Name */}
              <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name <span className="text-red-500">*</span>
                    </label>
                <Input
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                      placeholder="Enter your company name"
                  className="w-full"
                  required
                />
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
                        placeholder="company@example.com"
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
                      We'll use this to contact you about your account
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
                        placeholder="https://www.yourcompany.com"
                        className="w-full pl-10"
                />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Your company website (optional)</p>
              </div>

                  {/* Physical Address */}
              <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Physical Address <span className="text-gray-400 text-xs">(optional)</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  name="physicalAddress"
                  value={formData.physicalAddress}
                  onChange={handleInputChange}
                        placeholder="Street address, City, Algeria"
                        className="w-full pl-10"
                />
              </div>
                    <p className="text-xs text-gray-500 mt-1">Your business location (optional)</p>
                </div>
                </div>
                </div>
              </div>

            {/* Step 3: Company Profile */}
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
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Company Profile</h2>
                  <p className="text-gray-600">Tell us about your company</p>
                </div>

                <div className="space-y-5">
                  {/* Company Logo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Logo <span className="text-gray-400 text-xs">(optional)</span>
                    </label>
                    {logoPreview ? (
                      <div className="relative inline-block">
                        <img
                          src={logoPreview}
                          alt="Company logo preview"
                          className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={removeLogo}
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
                          Upload your company logo to build trust with advertisers
                        </p>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/svg+xml"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>

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
                      placeholder="e.g., 2020"
                      min="1900"
                      max={new Date().getFullYear()}
                    className="w-full"
                  />
                    <p className="text-xs text-gray-500 mt-1">When was your company founded? (optional)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4: Services & Social Media */}
            <div
              className={cn(
                "transition-all duration-500 ease-in-out",
                currentStep === 4
                  ? "opacity-100 translate-x-0 block"
                  : "opacity-0 translate-x-[100%] hidden"
              )}
            >
              <div className="p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Services & Social Media</h2>
                  <p className="text-gray-600">Tell us more about what you offer (optional)</p>
                </div>

                <div className="space-y-5">
                  {/* Services Offered */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Services You Offer <span className="text-gray-400 text-xs">(optional)</span>
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
                      Select services your company provides (optional)
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
                          placeholder="https://facebook.com/yourcompany"
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
                          placeholder="https://linkedin.com/company/yourcompany"
                      className="flex-1"
                    />
                  </div>
                </div>
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
                  className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white px-8 py-2 rounded-full font-semibold"
          >
            Create Account
          </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
