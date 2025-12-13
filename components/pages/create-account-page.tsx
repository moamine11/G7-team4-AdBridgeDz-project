'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Eye, EyeOff, CheckCircle2, XCircle, Building2, Mail, Lock, Phone, MapPin, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import AuthNavbar from '@/components/ui/auth-navbar';

export default function CreateCompanyAccount() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreesToTerms, setAgreesToTerms] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phonenumber: '',
    location: '',
  });

  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'password') {
      setIsPasswordValid(value.length >= 6);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Get the current checkbox state directly from the form
    const termsCheckbox = (e.target as HTMLFormElement).querySelector('#terms') as HTMLInputElement;
    const isTermsChecked = termsCheckbox?.checked || agreesToTerms;

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (!isTermsChecked) {
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
      submissionData.append('agreesToTerms', 'true');

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

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <AuthNavbar variant="transparent" showGetStarted={false} />
      <div className="flex-1 pt-12 pb-12 px-2 flex items-center justify-center">
        <div className="w-full max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-slate-900/80 via-slate-800/70 to-slate-950/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-teal-500/20 overflow-hidden p-10" style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}>
          <button
            onClick={() => router.push('/account-type')}
            className="flex items-center gap-2 text-slate-300 hover:text-teal-400 mb-6 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Account Type</span>
          </button>
          <h1 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-500 bg-clip-text text-transparent text-center">Create Your Account</h1>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Account Info */}
                <div>
              <h2 className="text-xl font-semibold text-teal-300 mb-4">Account Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-teal-200 mb-1">Company Name <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-400 w-5 h-5" />
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your company name"
                      className="pl-10 py-6 rounded-xl bg-white/5 border border-teal-400/30 text-slate-100 placeholder:text-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30" 
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-teal-200 mb-1">Email <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-400 w-5 h-5" />
                    <Input
                      name="email" 
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com" 
                      className="pl-10 py-6 rounded-xl bg-white/5 border border-teal-400/30 text-slate-100 placeholder:text-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30" 
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-teal-200 mb-1">Password <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-400 w-5 h-5" />
                    <Input
                      name="password" 
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password" 
                      className="pl-10 pr-10 py-6 rounded-xl bg-white/5 border border-teal-400/30 text-slate-100 placeholder:text-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30" 
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-teal-400"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {formData.password && (
                    <div className="mt-2">
                      {isPasswordValid ? (
                        <p className="text-xs text-teal-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Password is valid
                        </p>
                      ) : (
                        <p className="text-xs text-slate-400">
                          Password must be at least 6 characters
                        </p>
                      )}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-teal-200 mb-1">Confirm Password <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-400 w-5 h-5" />
                    <Input
                      name="confirmPassword" 
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      className="pl-10 pr-10 py-6 rounded-xl bg-white/5 border border-teal-400/30 text-slate-100 placeholder:text-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30" 
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-teal-400"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
                </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-xl font-semibold text-teal-300 mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-teal-200 mb-1">Phone Number <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-400 w-5 h-5" />
                    <Input
                      name="phonenumber" 
                      type="tel"
                      value={formData.phonenumber}
                      onChange={handleChange}
                      placeholder="e.g. +213 555 123 456" 
                      className="pl-10 py-6 rounded-xl bg-white/5 border border-teal-400/30 text-slate-100 placeholder:text-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30" 
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-teal-200 mb-1">Physical Address <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-400 w-5 h-5" />
                    <Input
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Enter your address" 
                      className="pl-10 py-6 rounded-xl bg-white/5 border border-teal-400/30 text-slate-100 placeholder:text-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30" 
                      required
                    />
                  </div>
                </div>
                  </div>
              <p className="text-xs text-slate-400 mt-3">
                💡 You can add more details like website, industry, and social media links in your profile settings after signing up.
                </p>
              </div>

            {/* Terms & Conditions */}
            <div className="bg-teal-500/10 p-4 rounded-xl border border-teal-500/30">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="terms"
                  name="agreesToTerms"
                      checked={agreesToTerms}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setAgreesToTerms(checked);
                  }}
                  className="mt-1 h-5 w-5 text-teal-500 border-slate-600 rounded focus:ring-2 focus:ring-teal-500 bg-slate-800 cursor-pointer"
                  required
                />
                <label htmlFor="terms" className="text-sm text-slate-200 cursor-pointer flex-1">
                      I agree to the{' '}
                  <a href="#" className="text-teal-400 hover:text-teal-300 font-medium" onClick={(e) => e.stopPropagation()}>
                        Terms and Conditions
                      </a>{' '}
                      and{' '}
                  <a href="#" className="text-teal-400 hover:text-teal-300 font-medium" onClick={(e) => e.stopPropagation()}>
                        Privacy Policy
                      </a>
                  <span className="text-red-400"> *</span>
                    </label>
                  </div>
                </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
                <Button
                  type="submit"
                  disabled={loading || !agreesToTerms}
                className="w-full max-w-xs bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-600 hover:from-teal-600 hover:to-cyan-600 text-white font-bold py-3 rounded-full shadow-lg shadow-teal-500/20 hover:shadow-xl hover:shadow-teal-500/30 transition-all duration-200 text-lg disabled:opacity-50"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
            </div>
          </form>
        </div>

        {/* Login Link */}
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
