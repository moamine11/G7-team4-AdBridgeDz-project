'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  Building2,
  Mail,
  Lock,
  Phone,
  MapPin,
  Globe,
  Calendar,
  Users,
  Briefcase,
  User,
  Upload,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CreateAgencyAccount() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPressure, setShowConfirmPassword] = useState(false);
  const [availableServices, setAvailableServices] = useState<{ _id: string; name: string }[]>([]);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    agencyName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    countryCode: '+213',
    websiteUrl: '',
    country: '',
    city: '',
    streetAddress: '',
    postalCode: '',
    businessRegistrationNumber: '',
    industry: '',
    companySize: '',
    yearEstablished: '',
    fullName: '',
    jobTitle: '',
    facebookUrl: '',
    linkedinUrl: '',
    agreeToTerms: false,
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [rcDocumentFile, setRcDocumentFile] = useState<File | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const rcInputRef = useRef<HTMLInputElement>(null);

  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  // Fetch services on mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/services');
        if (res.ok) {
          const services = await res.json();
          setAvailableServices(services);
        }
      } catch (err) {
        console.error('Failed to fetch services', err);
      }
    };
    fetchServices();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (name === 'password') {
      setPasswordStrength({
        length: value.length >= 12,
        uppercase: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        number: /[0-9]/.test(value),
        special: /[!@#$%^&*]/.test(value),
      });
    }
  };

  const handleServiceToggle = (id: string) => {
    setSelectedServiceIds((prev) =>
      prev.includes(id) ? prev.filter((sId) => sId !== id) : [...prev, id]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'rc') => {
    const file = e.target.files?.[0] || null;
    if (type === 'logo') setLogoFile(file);
    else setRcDocumentFile(file);
  };

  const getPasswordStrengthLevel = () => {
    const count = Object.values(passwordStrength).filter(Boolean).length;
    if (count <= 2) return 'Weak';
    if (count <= 4) return 'Medium';
    return 'Strong';
  };

  const getPasswordStrengthColor = () => {
    const level = getPasswordStrengthLevel();
    if (level === 'Weak') return 'bg-red-500';
    if (level === 'Medium') return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (!formData.agreeToTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }
    if (selectedServiceIds.length === 0) {
      alert('Please select at least one service your agency offers.');
      return;
    }

    setLoading(true);
    const body = new FormData();

    // Append all form fields (except confirmPassword)
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'confirmPassword') {
        body.append(key, value.toString());
      }
    });
    body.append('userType', 'agency');

    // Append selected service IDs
    selectedServiceIds.forEach((id) => {
      body.append('servicesOffered', id);
    });

    // Append files
    if (logoFile) body.append('logo', logoFile);
    if (rcDocumentFile) body.append('rcDocument', rcDocumentFile);

    try {
      const res = await fetch('http://localhost:5000/api/agencies/register', {
        method: 'POST',
        body,
      });

      const data = await res.json();
      if (res.ok) {
        router.push(`/verify-email?email=${formData.email}&userType=agency`);
      } else {
        alert(data.error || 'Registration failed');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Account Info' },
    { number: 2, title: 'Contact' },
    { number: 3, title: 'Company Details' },
    { number: 4, title: 'Services' },
    { number: 5, title: 'Representative' },
    { number: 6, title: 'Documents' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      'w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all',
                      currentStep >= step.number
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                        : 'bg-gray-200 text-gray-400'
                    )}
                  >
                    {step.number}
                  </div>
                  <p
                    className={cn(
                      'text-sm mt-2 font-medium',
                      currentStep >= step.number ? 'text-emerald-600' : 'text-gray-400'
                    )}
                  >
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      'h-1 flex-1 mx-2 transition-all',
                      currentStep > step.number
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                        : 'bg-gray-200'
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} onKeyDown={(e) => {
         if (e.key === 'Enter' && currentStep < 6) {
           e.preventDefault();
    }
  }}>
            {/* Step 1: Account Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Basic Account Information</h2>
                  <p className="text-gray-600">Create your account credentials</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Agency Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      name="agencyName"
                      value={formData.agencyName}
                      onChange={handleChange}
                      placeholder="Enter your agency name"
                      className="pl-10 py-6 rounded-xl border-gray-200"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="agency@example.com"
                      className="pl-10 py-6 rounded-xl border-gray-200"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter password"
                      className="pl-10 pr-10 py-6 rounded-xl border-gray-200"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {formData.password && (
                    <>
                      <div className="mt-2">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={cn('h-full transition-all', getPasswordStrengthColor())}
                              style={{
                                width: `${(Object.values(passwordStrength).filter(Boolean).length / 5) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium">{getPasswordStrengthLevel()}</span>
                        </div>
                      </div>
                      <ul className="space-y-1 mt-2">
                        {[
                          { key: 'length', text: 'At least 12 characters' },
                          { key: 'uppercase', text: 'One uppercase letter' },
                          { key: 'lowercase', text: 'One lowercase letter' },
                          { key: 'number', text: 'One number' },
                          { key: 'special', text: 'One special character (!@#$%^&*)' },
                        ].map(({ key, text }) => (
                          <li key={key} className="flex items-center gap-2 text-sm">
                            {passwordStrength[key as keyof typeof passwordStrength] ? (
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                            ) : (
                              <XCircle className="w-4 h-4 text-gray-300" />
                            )}
                            <span
                              className={
                                passwordStrength[key as keyof typeof passwordStrength]
                                  ? 'text-green-600'
                                  : 'text-gray-500'
                              }
                            >
                              {text}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type={showConfirmPressure ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      className="pl-10 pr-10 py-6 rounded-xl border-gray-200"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPressure)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {showConfirmPressure ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Contact */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Contact Information</h2>
                  <p className="text-gray-600">Where is your agency located?</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Code <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={handleChange}
                      placeholder="+213"
                      className="py-6 rounded-xl border-gray-200"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="XXX XXX XXX"
                      className="py-6 rounded-xl border-gray-200"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Algeria"
                    className="py-6 rounded-xl border-gray-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Algiers"
                    className="py-6 rounded-xl border-gray-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="streetAddress"
                    value={formData.streetAddress}
                    onChange={handleChange}
                    placeholder="123 Main Street"
                    className="py-6 rounded-xl border-gray-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Postal Code <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="16000"
                    className="py-6 rounded-xl border-gray-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website URL
                  </label>
                  <Input
                    type="url"
                    name="websiteUrl"
                    value={formData.websiteUrl}
                    onChange={handleChange}
                    placeholder="https://youragency.com"
                    className="py-6 rounded-xl border-gray-200"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Company Details */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Company Details</h2>
                  <p className="text-gray-600">Tell us about your agency</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Registration Number <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="businessRegistrationNumber"
                    value={formData.businessRegistrationNumber}
                    onChange={handleChange}
                    placeholder="REG123456"
                    className="py-6 rounded-xl border-gray-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry
                  </label>
                  <Input
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    placeholder="e.g., Advertising"
                    className="py-6 rounded-xl border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Size
                  </label>
                  <select
                    name="companySize"
                    value={formData.companySize}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none appearance-none bg-white"
                  >
                    <option value="">Select company size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="500+">500+ employees</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year Established
                  </label>
                  <Input
                    type="number"
                    name="yearEstablished"
                    value={formData.yearEstablished}
                    onChange={handleChange}
                    placeholder="YYYY"
                    min="1900"
                    max={new Date().getFullYear()}
                    className="py-6 rounded-xl border-gray-200"
                  />
                </div>
              </div>
            )}

            {/* ✅ Step 4: Services Offered */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Services Offered</h2>
                  <p className="text-gray-600">Select all services your agency provides</p>
                </div>
                {availableServices.length === 0 ? (
                  <p className="text-gray-500">Loading services...</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableServices.map((service) => (
                      <label
                        key={service._id}
                        className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-emerald-50"
                      >
                        <input
                          type="checkbox"
                          checked={selectedServiceIds.includes(service._id)}
                          onChange={() => handleServiceToggle(service._id)}
                          className="mt-1 w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                        />
                        <span className="font-medium">{service.name}</span>
                      </label>
                    ))}
                  </div>
                )}
                {selectedServiceIds.length === 0 && (
                  <p className="text-sm text-red-500">Please select at least one service.</p>
                )}
              </div>
            )}

            {/* Step 5: Representative */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Representative Information</h2>
                  <p className="text-gray-600">Who is the main contact person?</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="py-6 rounded-xl border-gray-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    placeholder="CEO / Manager"
                    className="py-6 rounded-xl border-gray-200"
                    required
                  />
                </div>
                <div className="border-t border-gray-200 pt-6 mt-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Social Media (Optional)</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Facebook URL
                      </label>
                      <Input
                        type="url"
                        name="facebookUrl"
                        value={formData.facebookUrl}
                        onChange={handleChange}
                        placeholder="https://facebook.com/youragency"
                        className="py-6 rounded-xl border-gray-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        LinkedIn URL
                      </label>
                      <Input
                        type="url"
                        name="linkedinUrl"
                        value={formData.linkedinUrl}
                        onChange={handleChange}
                        placeholder="https://linkedin.com/company/youragency"
                        className="py-6 rounded-xl border-gray-200"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-xl border-2 border-emerald-200">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    className="mt-1 w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                    required
                  />
                  <label className="text-sm text-gray-700">
                    I agree to the{' '}
                    <a href="/terms" className="text-emerald-600 hover:text-emerald-700 font-medium">
                      Terms and Conditions
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" className="text-emerald-600 hover:text-emerald-700 font-medium">
                      Privacy Policy
                    </a>
                  </label>
                </div>
              </div>
            )}

            {/* Step 6: Documents */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Upload Documents</h2>
                  <p className="text-gray-600">Verify your agency with official files</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Agency Logo (JPG, PNG, GIF, WEBP)
                  </label>
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-emerald-400 transition-colors"
                    onClick={() => logoInputRef.current?.click()}
                  >
                    <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                    <p className="mt-2 text-gray-600">
                      {logoFile ? logoFile.name : 'Click to upload logo'}
                    </p>
                    <input
                      type="file"
                      ref={logoInputRef}
                      className="hidden"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      onChange={(e) => handleFileChange(e, 'logo')}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Registration Document (PDF, DOC, DOCX, JPG, PNG)
                  </label>
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-emerald-400 transition-colors"
                    onClick={() => rcInputRef.current?.click()}
                  >
                    <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                    <p className="mt-2 text-gray-600">
                      {rcDocumentFile ? rcDocumentFile.name : 'Click to upload registration document'}
                    </p>
                    <input
                      type="file"
                      ref={rcInputRef}
                      className="hidden"
                      accept=".pdf,.doc,.docx,image/jpeg,image/png"
                      onChange={(e) => handleFileChange(e, 'rc')}
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Max file size: Logo (5MB), Document (10MB)
                </p>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-4 mt-8">
              {currentStep > 1 && (
                <Button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  variant="outline"
                  className="flex-1 py-6 rounded-xl border-gray-200"
                >
                  Previous
                </Button>
              )}
              {currentStep < 6 ? (
                <Button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-6 rounded-xl"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-6 rounded-xl"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              )}
            </div>
          </form>
        </div>

        <p className="text-center mt-6 text-gray-600">
          Already have an account?{' '}
          <button
            onClick={() => router.push('/login')}
            className="text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}