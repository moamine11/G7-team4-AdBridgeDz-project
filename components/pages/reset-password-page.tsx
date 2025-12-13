'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Eye, EyeOff, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import AuthNavbar from '@/components/ui/auth-navbar';
import { Button } from '@/components/ui/button';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const tokenFromQuery = searchParams.get('token');
  const idFromQuery = searchParams.get('id');
  const userTypeFromQuery = searchParams.get('userType') || 'company';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const verifyToken = async () => {
      if (!tokenFromQuery || !idFromQuery) {
        setTokenValid(false);
        setError('Invalid reset link. Please request a new one.');
        setVerifying(false);
        return;
      }

      try {
        const endpoint = userTypeFromQuery === 'company' 
          ? '/companies/verify-reset-token' 
          : '/agencies/verify-reset-token';
        
        const res = await fetch(`${API_BASE_URL}${endpoint}?token=${tokenFromQuery}&id=${idFromQuery}`);
        
        // Check if response is JSON
        const contentType = res.headers.get('content-type');
        let data;
        
        if (contentType && contentType.includes('application/json')) {
          data = await res.json();
        } else {
          // If not JSON, read as text
          const text = await res.text();
          console.error('Non-JSON response:', text);
          setTokenValid(false);
          setError('Server error. Please make sure the backend server is running.');
          setVerifying(false);
          return;
        }

        if (res.ok) {
          setTokenValid(true);
        } else {
          setTokenValid(false);
          setError(data.error || 'Invalid or expired reset link. Please request a new one.');
        }
      } catch (err) {
        console.error(err);
        setTokenValid(false);
        setError('Error verifying reset link. Please make sure the backend server is running.');
      } finally {
        setVerifying(false);
      }
    };

    verifyToken();
  }, [tokenFromQuery, idFromQuery, userTypeFromQuery, API_BASE_URL]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!tokenFromQuery || !idFromQuery) {
      setError('Invalid reset link');
      return;
    }

    setLoading(true);

    try {
      const endpoint = userTypeFromQuery === 'company' 
        ? '/companies/reset-password' 
        : '/agencies/reset-password';
      
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: tokenFromQuery,
          id: idFromQuery,
          password
        })
      });

      // Check if response is JSON
      const contentType = res.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        // If not JSON, read as text
        const text = await res.text();
        console.error('Non-JSON response:', text);
        setError('Server error. Please make sure the backend server is running.');
        return;
      }

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(data.error || 'Failed to reset password. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('Network error. Please make sure the backend server is running on http://localhost:5000');
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-teal-900 flex flex-col overflow-hidden">
        <AuthNavbar variant="transparent" showGetStarted={false} />
        <div className="flex-1 flex items-center justify-center p-3 min-h-0">
          <div className="w-full max-w-md mx-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden shadow-2xl border border-white/10">
              <div className="bg-white p-8 text-center">
                <Loader2 className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
                <p className="text-slate-600">Verifying reset link...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-teal-900 flex flex-col overflow-hidden">
        <AuthNavbar variant="transparent" showGetStarted={false} />
        <div className="flex-1 flex items-center justify-center p-3 min-h-0">
          <div className="w-full max-w-md mx-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden shadow-2xl border border-white/10">
              <div className="bg-white p-8 text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-teal-600" />
                </div>
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Password Reset Successful!</h1>
                <p className="text-slate-600 mb-6 text-sm">
                  Your password has been reset successfully. Redirecting to login...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-teal-900 flex flex-col overflow-hidden">
        <AuthNavbar variant="transparent" showGetStarted={false} />
        <div className="flex-1 flex items-center justify-center p-3 min-h-0">
          <div className="w-full max-w-md mx-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden shadow-2xl border border-white/10">
              <div className="bg-white p-8 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Invalid Reset Link</h1>
                <p className="text-slate-600 mb-6 text-sm">
                  {error || 'This reset link is invalid or has expired. Please request a new one.'}
                </p>
                <Button
                  onClick={() => router.push('/forgot-password')}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 rounded-lg"
                >
                  Request New Reset Link
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-teal-900 flex flex-col overflow-hidden">
      <AuthNavbar variant="transparent" showGetStarted={false} />
      <div className="flex-1 flex items-center justify-center p-3 min-h-0">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden shadow-2xl border border-white/10">
            <div className="bg-white p-6 lg:p-8">
              <h1 className="text-2xl font-bold text-slate-800 mb-1">Reset Your Password</h1>
              <p className="text-slate-600 mb-5 text-sm">
                Enter your new password below.
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* New Password */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 rounded-lg pl-10 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Must be at least 6 characters</p>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 rounded-lg pl-10 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
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
                      Resetting Password...
                    </span>
                  ) : (
                    'Reset Password'
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

