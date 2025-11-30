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
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    agencyName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
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

    setLoading(true);
    const body = new FormData();

    // Append all form fields (except confirmPassword)
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'confirmPassword') {
        body.append(key, value.toString());
      }
    });
    body.append('userType', 'agency');

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-950 rounded-3xl shadow-2xl p-8 border border-slate-700">
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-cyan-400 mb-2">Create Your Account</h1>
              <p className="text-gray-400">Get started by filling out the information below.</p>
            </div>

            {/* Account Info Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-blue-300 mb-4">Account Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      name="agencyName"
                      value={formData.agencyName}
                      onChange={handleChange}
                      placeholder="Enter your company name"
                      className="pl-10 py-3 rounded-lg border border-slate-600 bg-slate-900 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      className="pl-10 py-3 rounded-lg border border-slate-600 bg-slate-900 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                      className="pl-10 pr-10 py-3 rounded-lg border border-slate-600 bg-slate-900 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
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
                    <div className="mt-2">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={cn('h-full transition-all', getPasswordStrengthColor())}
                            style={{
                              width: `${(Object.values(passwordStrength).filter(Boolean).length / 5) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-300">{getPasswordStrengthLevel()}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className="pl-10 pr-10 py-3 rounded-lg border border-slate-600 bg-slate-900 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-blue-300 mb-4">Contact Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="e.g. +213 555 123 456"
                      className="pl-10 py-3 rounded-lg border border-slate-600 bg-slate-900 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Website
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="url"
                      name="websiteUrl"
                      value={formData.websiteUrl}
                      onChange={handleChange}
                      placeholder="https://yourcompany.com"
                      className="pl-10 py-3 rounded-lg border border-slate-600 bg-slate-900 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Physical Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    name="streetAddress"
                    value={formData.streetAddress}
                    onChange={handleChange}
                    placeholder="Enter your address"
                    className="pl-10 py-3 rounded-lg border border-slate-600 bg-slate-900 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Company Profile Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-blue-300 mb-4">Company Profile</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Industry
                  </label>
                  <Input
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    placeholder="e.g., Advertising"
                    className="py-3 rounded-lg border border-slate-600 bg-slate-900 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Company Size
                  </label>
                  <select
                    name="companySize"
                    value={formData.companySize}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-slate-600 bg-slate-900 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none appearance-none"
                  >
                    <option value="">Select company size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="500+">500+ employees</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Business Registration Number
                </label>
                <Input
                  name="businessRegistrationNumber"
                  value={formData.businessRegistrationNumber}
                  onChange={handleChange}
                  placeholder="REG123456"
                  className="py-3 rounded-lg border border-slate-600 bg-slate-900 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Representative Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-blue-300 mb-4">Representative Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="py-3 rounded-lg border border-slate-600 bg-slate-900 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    placeholder="CEO / Manager"
                    className="py-3 rounded-lg border border-slate-600 bg-slate-900 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="border-t border-slate-700 pt-6 mt-6">
                <h3 className="text-lg font-semibold text-blue-300 mb-4">Social Media (Optional)</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Facebook URL
                    </label>
                    <Input
                      type="url"
                      name="facebookUrl"
                      value={formData.facebookUrl}
                      onChange={handleChange}
                      placeholder="https://facebook.com/youragency"
                      className="py-3 rounded-lg border border-slate-600 bg-slate-900 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      LinkedIn URL
                    </label>
                    <Input
                      type="url"
                      name="linkedinUrl"
                      value={formData.linkedinUrl}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/company/youragency"
                      className="py-3 rounded-lg border border-slate-600 bg-slate-900 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-slate-900 rounded-lg border border-slate-700">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="mt-1 w-5 h-5 text-cyan-500 border-gray-300 rounded focus:ring-cyan-500"
                  required
                />
                <label className="text-sm text-gray-300">
                  I agree to the{' '}
                  <a href="/terms" className="text-cyan-400 hover:text-cyan-300 font-medium">
                    Terms and Conditions
                  </a>{' '}
                  and{' '}
                  <a href="/privacy" className="text-cyan-400 hover:text-cyan-300 font-medium">
                    Privacy Policy
                  </a>
                </label>
              </div>
            </div>

            {/* Documents Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-blue-300 mb-4">Upload Documents</h2>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Agency Logo (JPG, PNG, GIF, WEBP)
                </label>
                <div
                  className="border-2 border-dashed border-slate-600 rounded-lg p-4 text-center cursor-pointer hover:border-cyan-400 transition-colors"
                  onClick={() => logoInputRef.current?.click()}
                >
                  <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                  <p className="mt-2 text-sm text-gray-400">
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
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Business Registration Document (PDF, DOC, DOCX, JPG, PNG)
                </label>
                <div
                  className="border-2 border-dashed border-slate-600 rounded-lg p-4 text-center cursor-pointer hover:border-cyan-400 transition-colors"
                  onClick={() => rcInputRef.current?.click()}
                >
                  <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                  <p className="mt-2 text-sm text-gray-400">
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

            {/* Submit Button */}
            <div className="pt-6">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 rounded-lg"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </div>

          </form>
        </div>

        <p className="text-center mt-6 text-gray-400">
          Already have an account?{' '}
          <button
            onClick={() => router.push('/login')}
            className="text-cyan-400 hover:text-cyan-300 font-medium"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}