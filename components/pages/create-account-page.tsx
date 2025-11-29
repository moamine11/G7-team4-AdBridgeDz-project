'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, CheckCircle2, XCircle, Building2, Mail, Lock, Phone, MapPin, Globe, Calendar, Users, Briefcase, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRef } from 'react';

export default function CreateCompanyAccount() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  
  const [agreesToTerms, setAgreesToTerms] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phonenumber: '',
    location: '',
    websiteURL: '',
    industrySector: '',
    companySize: '',
    yearEstablished: '',
    socialMedia: {
      facebook: '',
      linkedin: '',
    },
  });

  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('socialMedia.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        socialMedia: { ...prev.socialMedia, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'logo') {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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

    if (!agreesToTerms) {
      alert('You must agree to the Terms and Conditions to proceed.');
      return;
    }

    setLoading(true);

    try {
    
      const submissionData = new FormData();
      submissionData.append('name', formData.name);
      submissionData.append('email', formData.email);
      submissionData.append('userType', 'company');
      submissionData.append('password', formData.password);
      submissionData.append('phonenumber', formData.phonenumber);
      submissionData.append('location', formData.location);
      submissionData.append('websiteURL', formData.websiteURL);
      submissionData.append('industrySector', formData.industrySector);
      submissionData.append('companySize', formData.companySize);
      submissionData.append('yearEstablished', formData.yearEstablished);
      submissionData.append('socialMedia', JSON.stringify(formData.socialMedia));

      
      if (logoFile) {
        submissionData.append('logo', logoFile);
      }

      const response = await fetch('http://localhost:5000/api/companies/register', {
        method: 'POST',
        body: submissionData,
      });

      const data = await response.json();

      if (response.ok) {
        router.push(`/verify-email?email=${formData.email}&userType=company`);
      } else {
        alert(data.error || 'Registration failed');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Account Info' },
    { number: 2, title: 'Contact' },
    { number: 3, title: 'Company Profile' },
    { number: 4, title: 'Services & Social' },
    { number: 5, title: 'Upload Logo' },
    { number: 6, title: 'Terms & Conditions' },
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
                  <p className={cn(
                    'text-sm mt-2 font-medium',
                    currentStep >= step.number ? 'text-emerald-600' : 'text-gray-400'
                  )}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    'h-1 flex-1 mx-2 transition-all',
                    currentStep > step.number ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gray-200'
                  )} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Account Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Basic Account Information</h2>
                  <p className="text-gray-600">Create your account credentials</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your company name"
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
                      placeholder="company@example.com"
                      className="pl-10 py-6 rounded-xl border-gray-200"
                      required
                    />
                  </div>
                  {formData.email && (
                    <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Valid email
                    </p>
                  )}
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
                            <div className={cn('h-full transition-all', getPasswordStrengthColor())} style={{ width: `${(Object.values(passwordStrength).filter(Boolean).length / 5) * 100}%` }} />
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
                            <span className={passwordStrength[key as keyof typeof passwordStrength] ? 'text-green-600' : 'text-gray-500'}>
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
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      className="pl-10 pr-10 py-6 rounded-xl border-gray-200"
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
            )}

            {/* Step 2: Contact */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Contact Information</h2>
                  <p className="text-gray-600">How can we reach you?</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="tel"
                      name="phonenumber"
                      value={formData.phonenumber}
                      onChange={handleChange}
                      placeholder="+213 XXX XXX XXX"
                      className="pl-10 py-6 rounded-xl border-gray-200"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="City, Country"
                      className="pl-10 py-6 rounded-xl border-gray-200"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website URL
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="url"
                      name="websiteURL"
                      value={formData.websiteURL}
                      onChange={handleChange}
                      placeholder="https://yourcompany.com  "
                      className="pl-10 py-6 rounded-xl border-gray-200"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Company Profile */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Company Profile</h2>
                  <p className="text-gray-600">Tell us about your company</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry Sector
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      name="industrySector"
                      value={formData.industrySector}
                      onChange={handleChange}
                      placeholder="e.g., Technology, Healthcare, Finance"
                      className="pl-10 py-6 rounded-xl border-gray-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Size
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      name="companySize"
                      value={formData.companySize}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none appearance-none bg-white"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year Established
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="number"
                      name="yearEstablished"
                      value={formData.yearEstablished}
                      onChange={handleChange}
                      placeholder="YYYY"
                      min="1900"
                      max={new Date().getFullYear()}
                      className="pl-10 py-6 rounded-xl border-gray-200"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Social Media */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Social Media</h2>
                  <p className="text-gray-600">Connect your social profiles (optional)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Facebook URL
                  </label>
                  <Input
                    type="url"
                    name="socialMedia.facebook"
                    value={formData.socialMedia.facebook}
                    onChange={handleChange}
                    placeholder="https://facebook.com/yourcompany  "
                    className="py-6 rounded-xl border-gray-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn URL
                  </label>
                  <Input
                    type="url"
                    name="socialMedia.linkedin"
                    value={formData.socialMedia.linkedin}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/company/yourcompany  "
                    className="py-6 rounded-xl border-gray-200"
                  />
                </div>
              </div>
            )}

            {/* Step 5: Upload Logo */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Upload Company Logo</h2>
                  <p className="text-gray-600">Add your company's visual identity</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Logo (JPG, PNG, GIF, WEBP)
                  </label>
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-emerald-400 transition-colors"
                    onClick={() => logoInputRef.current?.click()}
                  >
                    {logoPreview ? (
                      <div className="flex flex-col items-center">
                        <img src={logoPreview} alt="Logo Preview" className="max-w-full max-h-20 object-contain mb-2" />
                        <p className="mt-2 text-gray-600">{logoFile?.name}</p>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                        <p className="mt-2 text-gray-600">
                          Click to upload logo
                        </p>
                      </>
                    )}
                    <input
                      type="file"
                      ref={logoInputRef}
                      className="hidden"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      onChange={(e) => handleFileChange(e, 'logo')}
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Max file size: 5MB
                </p>
              </div>
            )}

            {/* Step 6: Terms & Conditions */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Terms & Conditions</h2>
                  <p className="text-gray-600">Please review and accept our terms before proceeding.</p>
                </div>
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={agreesToTerms}
                      onChange={(e) => setAgreesToTerms(e.target.checked)}
                      className="mt-1 h-5 w-5 text-emerald-600 border-gray-300 rounded focus:ring-2 focus:ring-emerald-500"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-700">
                      I agree to the{' '}
                      <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium">
                        Terms and Conditions
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium">
                        Privacy Policy
                      </a>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
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
                  disabled={loading || !agreesToTerms}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-6 rounded-xl"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* Login Link */}
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