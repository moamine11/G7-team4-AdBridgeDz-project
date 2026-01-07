'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  User,
  Check,
  ArrowLeft,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import AuthNavbar from '@/components/ui/auth-navbar';

export default function CreateAgencyAccount() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [availableServices, setAvailableServices] = useState<{ _id: string; name: string }[]>([]);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);

  const [rcDocumentFile, setRcDocumentFile] = useState<File | null>(null);
  const [nifNisDocumentFile, setNifNisDocumentFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    agencyName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    countryCode: '+213',
    country: 'Algeria',
    city: '',
    streetAddress: '',
    postalCode: '',
    businessRegistrationNumber: '',
    fullName: '',
    jobTitle: '',
    agreeToTerms: false,
  });


  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      };

      // Validate confirm password when password changes
      if (name === 'password' && newData.confirmPassword) {
        if (newData.confirmPassword !== value && newData.confirmPassword.length > 0) {
          setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
        } else if (newData.confirmPassword === value) {
          setErrors(prev => ({ ...prev, confirmPassword: '' }));
        }
      }

      // Validate confirm password when confirmPassword changes
      if (name === 'confirmPassword') {
        if (value !== newData.password && value.length > 0) {
          setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
        } else {
          setErrors(prev => ({ ...prev, confirmPassword: '' }));
        }
      }

      return newData;
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Password validation
    if (name === 'password') {
      setIsPasswordValid(value.length >= 6);
      if (value.length > 0 && value.length < 6) {
        setErrors(prev => ({ ...prev, password: 'Password must be at least 6 characters' }));
      } else {
        setErrors(prev => ({ ...prev, password: '' }));
      }
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceToggle = (id: string) => {
    setSelectedServiceIds((prev) =>
      prev.includes(id) ? prev.filter((sId) => sId !== id) : [...prev, id]
    );
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

    if (!rcDocumentFile || !nifNisDocumentFile) {
      alert('Please upload both verification documents (RC + second document).');
      return;
    }

    setLoading(true);
    const body = new FormData();

    // Append all form fields (except confirmPassword)
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'confirmPassword' && key !== 'agreeToTerms') {
        body.append(key, value.toString());
      }
    });
    body.append('userType', 'agency');

    // Append selected service IDs
    selectedServiceIds.forEach((id) => {
      body.append('servicesOffered', id);
    });

    body.append('rcDocument', rcDocumentFile);
    body.append('nifNisDocument', nifNisDocumentFile);

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

  const inputStyles = 'w-full bg-white/5 border border-teal-400/30 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 text-slate-100 placeholder:text-slate-400 rounded-2xl transition-all duration-200 shadow-inner shadow-slate-900/10';

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <AuthNavbar variant="transparent" showGetStarted={false} />
      <div className="flex-1 pt-12 pb-12 px-2 flex items-center justify-center">
        <div className="w-full max-w-5xl mx-auto">
        <div
          className="bg-gradient-to-br from-slate-900/80 via-slate-800/70 to-slate-950/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-teal-500/20 overflow-hidden"
          style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}
        >
          <div className="px-8 pt-8 pb-6 border-b border-white/10">
            <button
              onClick={() => router.push('/account-type')}
              className="flex items-center gap-2 text-slate-300 hover:text-teal-400 mb-6 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back to Account Type</span>
            </button>
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-500 bg-clip-text text-transparent">
                Create Your Agency Account
              </h1>
                </div>
              </div>

          <form onSubmit={handleSubmit} className="px-8 md:px-10 pb-10 space-y-8">
            {/* Agency Credentials */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-5">Agency Credentials</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-teal-200 mb-1.5">
                    Agency Name <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-400" />
                    <Input
                      name="agencyName"
                      value={formData.agencyName}
                      onChange={handleChange}
                      placeholder="Registered agency name"
                      className={cn(inputStyles, 'pl-10')}
                      required
                    />
                  </div>
                  {errors.agencyName && (
                    <p className="text-xs text-red-400 mt-1.5">{errors.agencyName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-teal-200 mb-1.5">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-400" />
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="contact@youragency.dz"
                      className={cn(inputStyles, 'pl-10')}
                      required
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-400 mt-1.5">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-teal-200 mb-1.5">Password <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-400" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a secure password"
                      className={cn(inputStyles, 'pl-10 pr-10')}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-400"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-400 mt-1.5">{errors.password}</p>
                  )}
                  {formData.password && !errors.password && isPasswordValid && (
                    <p className="text-xs text-teal-400 mt-1.5 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Password is valid
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-teal-200 mb-1.5">Confirm Password <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-400" />
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-type your password"
                      className={cn(inputStyles, 'pl-10 pr-10')}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-400"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-400 mt-1.5">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>
            </section>

            {/* Contact & Location */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-5">Contact & Location</h2>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-teal-200 mb-1">Phone Number <span className="text-red-400">*</span></label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Select
                      value={formData.countryCode}
                      onValueChange={value => handleSelectChange('countryCode', value)}
                    >
                      <SelectTrigger className={cn('sm:w-32', 'bg-white/5 border border-teal-400/30 text-slate-100 rounded-2xl focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30')}>
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
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-400" />
                    <Input
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                        placeholder="555 123 456"
                        className={cn(inputStyles, 'pl-10')}
                      required
                    />
                  </div>
                </div>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-teal-200 mb-1">Country <span className="text-red-400">*</span></label>
                    <Select value={formData.country} onValueChange={value => handleSelectChange('country', value)}>
                      <SelectTrigger className="bg-white/5 border border-teal-400/30 text-slate-100 rounded-2xl focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30">
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
                    <label className="block text-sm font-medium text-teal-200 mb-1">City <span className="text-red-400">*</span></label>
                  <Input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                      placeholder="e.g., Algiers"
                      className={inputStyles}
                    required
                  />
                </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-teal-200 mb-1">Street Address <span className="text-red-400">*</span></label>
                  <Input
                    name="streetAddress"
                    value={formData.streetAddress}
                    onChange={handleChange}
                      placeholder="123 Example Street, Business Center"
                      className={inputStyles}
                    required
                  />
                </div>
                <div>
                    <label className="block text-sm font-medium text-teal-200 mb-1">Postal Code <span className="text-red-400">*</span></label>
                  <Input
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
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
              <h2 className="text-xl font-semibold text-white mb-5">Business Verification</h2>
              <div>
                <label className="block text-sm font-medium text-teal-200 mb-1.5">Business Registration Number (RC) <span className="text-red-400">*</span></label>
                <Input
                  name="businessRegistrationNumber"
                  value={formData.businessRegistrationNumber}
                  onChange={handleChange}
                  placeholder="Enter your RC number"
                  className={inputStyles}
                  required
                />
                {errors.businessRegistrationNumber && (
                  <p className="text-xs text-red-400 mt-1.5">{errors.businessRegistrationNumber}</p>
                )}
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-teal-200 mb-1.5">
                    RC Document (PDF or image) <span className="text-red-400">*</span>
                  </label>
                  <Input
                    type="file"
                    accept="application/pdf,image/*"
                    className={inputStyles}
                    required
                    onChange={(e) => setRcDocumentFile(e.target.files?.[0] || null)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-teal-200 mb-1.5">
                    NIF/NIS Document (PDF or image) <span className="text-red-400">*</span>
                  </label>
                  <Input
                    type="file"
                    accept="application/pdf,image/*"
                    className={inputStyles}
                    required
                    onChange={(e) => setNifNisDocumentFile(e.target.files?.[0] || null)}
                  />
                </div>
              </div>
            </section>

            {/* Contact Person */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-5">Primary Contact Person</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-teal-200 mb-1">Full Name <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-400" />
                  <Input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                      placeholder="First and last name"
                      className={cn(inputStyles, 'pl-10')}
                    required
                  />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-teal-200 mb-1">Job Title <span className="text-red-400">*</span></label>
                  <Input
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    placeholder="e.g., Managing Director"
                    className={inputStyles}
                    required
                  />
                </div>
              </div>
            </section>

            {/* Services */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-5">Services Offered</h2>
              <div>
                <label className="block text-sm font-medium text-teal-200 mb-3">Services <span className="text-red-400">*</span></label>
                {availableServices.length === 0 ? (
                  <p className="text-slate-400 text-sm">Loading services...</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {availableServices.map(service => (
                      <label key={service._id} className="flex items-center gap-3 text-sm text-slate-200 bg-white/5 border border-white/10 rounded-2xl p-3 cursor-pointer hover:bg-teal-500/10 transition-colors">
                        <Checkbox
                          checked={selectedServiceIds.includes(service._id)}
                          onCheckedChange={checked => handleServiceToggle(service._id)}
                          className="border-teal-400/30"
                        />
                        <span>{service.name}</span>
                      </label>
                    ))}
                  </div>
                )}
                {selectedServiceIds.length === 0 && (
                  <p className="text-xs text-red-400 mt-2">Please select at least one service.</p>
                )}
              </div>
            </section>

            {/* Agreement & Submit */}
            <section className="space-y-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={formData.agreeToTerms}
                  onCheckedChange={checked => setFormData(prev => ({ ...prev, agreeToTerms: checked as boolean }))}
                  className="mt-1 border-teal-400/30"
                />
                <p className="text-sm text-slate-200">
                  I agree to the{' '}
                  <a href="#" className="text-teal-400 hover:text-teal-300 underline">Terms of Service</a>{' '}
                  and{' '}
                  <a href="#" className="text-teal-400 hover:text-teal-300 underline">Privacy Policy</a>
                  <span className="text-red-400"> *</span>
                </p>
              </div>

              <div className="flex justify-center">
                <Button
                  type="submit"
                  disabled={!formData.agreeToTerms || loading || selectedServiceIds.length === 0}
                  className="w-full md:w-auto bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-600 hover:from-teal-600 hover:to-cyan-600 text-white px-10 py-3 rounded-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-teal-500/30"
                >
                  {loading ? 'Creating Account...' : 'Create Agency Account'}
                </Button>
              </div>
            </section>
          </form>
        </div>

        <p className="text-center mt-6 text-slate-300">
          Already have an account?{' '}
          <button
            onClick={() => router.push('/login')}
            className="text-teal-400 hover:text-teal-300 font-medium"
          >
            Sign in
          </button>
        </p>
        </div>
      </div>
    </div>
  );
}

