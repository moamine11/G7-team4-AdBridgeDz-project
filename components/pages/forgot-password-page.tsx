'use client';

import { useState } from 'react';
import { Mail, Loader2, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import AuthNavbar from '@/components/ui/auth-navbar';
import { Button } from '@/components/ui/button';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState<'company' | 'agency'>('company');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://backend-se-7rkj.onrender.com/api';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const endpoint = userType === 'company' ? '/companies/forgot-password' : '/agencies/forgot-password';
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      // Check if response is JSON
      const contentType = res.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        // If not JSON, read as text to see what we got
        const text = await res.text();
        console.error('Non-JSON response:', text);
        setError('Server error. Please make sure the backend server is running.');
        return;
      }
      
      if (res.ok) {
        setMessage(data.message || 'If that email exists, a password reset link has been sent.');
        setEmail('');
      } else {
        setError(data.error || 'Failed to send reset email. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('Network error. Please make sure the backend server is running on http://localhost:5000');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-teal-900 flex flex-col overflow-hidden">
      <AuthNavbar variant="transparent" showGetStarted={false} />
      <div className="flex-1 flex items-center justify-center p-3 min-h-0">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden shadow-2xl border border-white/10">
            <div className="bg-white p-6 lg:p-8">
              <button
                onClick={() => router.push('/login')}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-4 text-sm transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </button>

              <h1 className="text-2xl font-bold text-slate-800 mb-1">Forgot Password?</h1>
              <p className="text-slate-600 mb-5 text-sm">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              {message && (
                <div className="mb-4 p-3 bg-teal-50 border border-teal-200 rounded-lg text-sm text-teal-800">
                  {message}
                </div>
              )}

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Account Type */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Account Type
                  </label>
                  <div className="relative">
                    <select
                      value={userType}
                      onChange={(e) => setUserType(e.target.value as 'company' | 'agency')}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 appearance-none"
                    >
                      <option value="company">Advertiser</option>
                      <option value="agency">Agency / Billboard Provider</option>
                    </select>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    'Send Reset Link'
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

