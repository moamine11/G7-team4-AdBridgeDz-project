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
import { authService } from '@/lib/services/auth-service'
import { useToast } from '@/components/ui/use-toast'

const STORAGE_KEY = 'company_signup_progress'
const TOTAL_STEPS = 4

export default function CreateAccountPage() {
  const router = useRouter()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
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

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const data = {
        name: formData.companyName,
        email: formData.email,
        password: formData.password,
        userType: 'company',
        phonenumber: formData.phoneNumber.replace(/\D/g, ''),
        websiteURL: formData.websiteUrl,
        location: formData.physicalAddress,
        industrySector: formData.industry,
        companySize: formData.companySize,
        yearEstablished: formData.yearEstablished ? parseInt(formData.yearEstablished) : undefined,
        socialMedia: JSON.stringify({
          facebook: formData.facebookUrl,
          linkedin: formData.linkedinUrl,
        }),
        agreesToTerms: true,
      }

      await authService.registerCompany(data);
      
      localStorage.removeItem(STORAGE_KEY) // Clear saved progress
      toast({
        title: "Success",
        description: "Account created successfully. Please check your email to verify your account, then login.",
      });
      router.push('/login')
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false)
    }
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
    <div className="min-h-screen pt-32 pb-12 px-2 bg-[#020618] flex items-center justify-center">
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-[#10182a]/80 via-[#1a223a]/70 to-[#0a0f1c]/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-blue-400/20 overflow-hidden p-10" style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}>
          <h1 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-teal-400 to-blue-400 bg-clip-text text-transparent text-center">Create Your Account</h1>
          <form onSubmit={handleCreateAccount} className="space-y-8">
            {/* Account Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-1">Company Name <span className="text-red-400">*</span></label>
                <Input name="companyName" value={formData.companyName} onChange={handleInputChange} placeholder="Enter your company name" className="w-full bg-white/5 border border-blue-400/30 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 text-blue-100 placeholder:text-blue-300 rounded-xl transition-all duration-200 shadow-inner shadow-blue-900/10" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-1">Email <span className="text-red-400">*</span></label>
                <Input name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="name@example.com" className="w-full bg-white/5 border border-blue-400/30 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 text-blue-100 placeholder:text-blue-300 rounded-xl transition-all duration-200 shadow-inner shadow-blue-900/10" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-1">Password <span className="text-red-400">*</span></label>
                <Input name="password" type="password" value={formData.password} onChange={handleInputChange} placeholder="Create a password" className="w-full bg-white/5 border border-blue-400/30 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 text-blue-100 placeholder:text-blue-300 rounded-xl transition-all duration-200 shadow-inner shadow-blue-900/10" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-1">Confirm Password <span className="text-red-400">*</span></label>
                <Input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleInputChange} placeholder="Confirm your password" className="w-full bg-white/5 border border-blue-400/30 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 text-blue-100 placeholder:text-blue-300 rounded-xl transition-all duration-200 shadow-inner shadow-blue-900/10" required />
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-xl font-semibold text-blue-300 mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-1">Phone Number</label>
                  <Input name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} placeholder="e.g. +213 555 123 456" className="w-full bg-white/5 border border-blue-400/30 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 text-blue-100 placeholder:text-blue-300 rounded-xl transition-all duration-200 shadow-inner shadow-blue-900/10" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-1">Website</label>
                  <Input name="websiteUrl" value={formData.websiteUrl} onChange={handleInputChange} placeholder="https://yourcompany.com" className="w-full bg-white/5 border border-blue-400/30 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 text-blue-100 placeholder:text-blue-300 rounded-xl transition-all duration-200 shadow-inner shadow-blue-900/10" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-blue-200 mb-1">Physical Address</label>
                  <Input name="physicalAddress" value={formData.physicalAddress} onChange={handleInputChange} placeholder="Enter your address" className="w-full bg-white/5 border border-blue-400/30 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 text-blue-100 placeholder:text-blue-300 rounded-xl transition-all duration-200 shadow-inner shadow-blue-900/10" />
                </div>
              </div>
            </div>

            {/* Company Profile */}
            <div>
              <h2 className="text-xl font-semibold text-blue-300 mb-4">Company Profile</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-1">Industry</label>
                  <Input name="industry" value={formData.industry} onChange={handleInputChange} placeholder="e.g. Technology" className="w-full bg-white/5 border border-blue-400/30 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 text-blue-100 placeholder:text-blue-300 rounded-xl transition-all duration-200 shadow-inner shadow-blue-900/10" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-1">Company Size</label>
                  <Input name="companySize" value={formData.companySize} onChange={handleInputChange} placeholder="e.g. 11-50" className="w-full bg-white/5 border border-blue-400/30 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 text-blue-100 placeholder:text-blue-300 rounded-xl transition-all duration-200 shadow-inner shadow-blue-900/10" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-1">Year Established</label>
                  <Input name="yearEstablished" value={formData.yearEstablished} onChange={handleInputChange} placeholder="e.g. 2015" className="w-full bg-white/5 border border-blue-400/30 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 text-blue-100 placeholder:text-blue-300 rounded-xl transition-all duration-200 shadow-inner shadow-blue-900/10" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-blue-200 mb-1">Logo</label>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="block w-full text-sm text-blue-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 bg-white/5 border border-blue-400/30 rounded-xl" />
                  {logoPreview && (
                    <div className="mt-2 flex items-center gap-2">
                      <img src={logoPreview} alt="Logo Preview" className="w-16 h-16 rounded-xl object-cover border border-white/20" />
                      <Button type="button" variant="ghost" onClick={removeLogo} className="text-red-400 hover:text-red-600">Remove</Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Services & Social */}
            <div>
              <h2 className="text-xl font-semibold text-blue-300 mb-4">Services & Social</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-1">Services Offered</label>
                  <Textarea name="servicesOffered" value={formData.servicesOffered.join(', ')} onChange={e => setFormData(prev => ({ ...prev, servicesOffered: e.target.value.split(',').map(s => s.trim()) }))} placeholder="e.g. Outdoor Advertising, Digital Marketing" className="w-full bg-white/5 border border-blue-400/30 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 text-blue-100 placeholder:text-blue-300 rounded-xl transition-all duration-200 shadow-inner shadow-blue-900/10" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-1">Facebook URL</label>
                  <Input name="facebookUrl" value={formData.facebookUrl} onChange={handleInputChange} placeholder="https://facebook.com/yourcompany" className="w-full bg-white/5 border border-blue-400/30 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 text-blue-100 placeholder:text-blue-300 rounded-xl transition-all duration-200 shadow-inner shadow-blue-900/10" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-1">LinkedIn URL</label>
                  <Input name="linkedinUrl" value={formData.linkedinUrl} onChange={handleInputChange} placeholder="https://linkedin.com/company/yourcompany" className="w-full bg-white/5 border border-blue-400/30 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 text-blue-100 placeholder:text-blue-300 rounded-xl transition-all duration-200 shadow-inner shadow-blue-900/10" />
                </div>
              </div>
            </div>

            {/* Sticky Submit Button */}
            <div className="sticky bottom-0 left-0 w-full bg-transparent pt-6 flex justify-center z-20">
              <Button type="submit" disabled={isLoading} className="w-full max-w-xs bg-gradient-to-r from-blue-500 via-teal-500 to-blue-400 hover:from-blue-700 hover:to-teal-600 text-white font-bold py-3 rounded-full shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200 text-lg">
                {isLoading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  'Create Account'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
