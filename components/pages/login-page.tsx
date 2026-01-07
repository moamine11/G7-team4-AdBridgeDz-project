'use client';

import { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, ChevronDown, Loader2 } from 'lucide-react';
import AuthNavbar from '@/components/ui/auth-navbar';

type UserType = 'company' | 'agency' | 'admin' | null;

type SubscriptionStatus = 'trial' | 'active' | 'expired';
type SubscriptionInfo = {
  status: SubscriptionStatus;
  planName?: string;
  daysRemaining?: number;
  endsAt?: string | null;
  trialEndsAt?: string | null;
  subscriptionEndsAt?: string | null;
};

declare global {
  interface Window {
    google?: any;
    handleCredentialResponse?: (response: any) => void;
  }
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<UserType>('company');
  const [loading, setLoading] = useState(false);

  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo | null>(null);
  const [activatingSubscription, setActivatingSubscription] = useState(false);

  const API_BASE_URL = 'https://backend-se-7rkj.onrender.com/api';
  const GOOGLE_CLIENT_ID = '847708558168-12ljci267ehd9eonebevvos968u1o6md.apps.googleusercontent.com';

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    window.handleCredentialResponse = handleGoogleLogin;

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleLogin,
        });
        window.google.accounts.id.renderButton(
          document.getElementById('googleSignInButton'),
          {
            theme: 'outline',
            size: 'large',
            text: 'signin_with',
            shape: 'rectangular',
            logo_alignment: 'left',
            locale: 'en',
          }
        );
      }
    };

    return () => {
      document.body.removeChild(script);
      delete window.handleCredentialResponse;
    };
  }, [userType]);

  const handleGoogleLogin = async (response: any) => {
    if (!userType) {
      alert('Please select your account type first.');
      return;
    }

    if (userType === 'admin') {
      alert('Google login is not available for Admin accounts.');
      return;
    }

    const idToken = response.credential;
    setLoading(true);

    try {
      const endpoint = userType === 'company' ? 'companies' : 'agencies';
      const res = await fetch(`${API_BASE_URL}/${endpoint}/google-auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Google login failed');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('userType', userType);

      if (userType === 'agency') {
        // Prefer server-provided subscription info; fallback to status endpoint.
        let subscription: SubscriptionInfo | null = data.subscription || null;
        if (!subscription) {
          const statusRes = await fetch(`${API_BASE_URL}/agencies/subscription`, {
            headers: { Authorization: `Bearer ${data.token}` },
          });
          const statusData = await statusRes.json();
          subscription = statusData?.subscription || null;
        }

        setSubscriptionInfo(subscription);
        setPlanModalOpen(true);
        return;
      }

      window.location.href = '/dashboard';
    } catch (error) {
      console.error(error);
      alert('Something went wrong with Google login.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!userType) {
      alert('Please select your account type first.');
      return;
    }

    setLoading(true);

    try {
      const emailToSend = email.trim();
      const res = await fetch(
        userType === 'admin'
          ? `${API_BASE_URL}/auth/login`
          : `${API_BASE_URL}/${userType === 'company' ? 'companies' : 'agencies'}/login`,
        {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: emailToSend, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || data.message || 'Login failed');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('userType', userType);

      if (userType === 'agency') {
        let subscription: SubscriptionInfo | null = data.subscription || null;
        if (!subscription) {
          const statusRes = await fetch(`${API_BASE_URL}/agencies/subscription`, {
            headers: { Authorization: `Bearer ${data.token}` },
          });
          const statusData = await statusRes.json();
          subscription = statusData?.subscription || null;
        }

        setSubscriptionInfo(subscription);
        setPlanModalOpen(true);
        return;
      }

      window.location.href = userType === 'admin' ? '/admin/dashboard' : '/dashboard';
    } catch (error) {
      console.error(error);
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleContinueToDashboard = () => {
    setPlanModalOpen(false);
    window.location.href = '/Agencydashboard';
  };

  const handleBackToLogin = () => {
    // Back out of the post-login modal: clear session so the user truly returns to login.
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    setSubscriptionInfo(null);
    setPlanModalOpen(false);
  };

  const handleActivateSubscription = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Missing session token. Please log in again.');
      setPlanModalOpen(false);
      return;
    }

    setActivatingSubscription(true);
    try {
      const res = await fetch(`${API_BASE_URL}/agencies/subscription/activate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ planName: 'Standard' }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to activate subscription');
        return;
      }

      setSubscriptionInfo(data.subscription || null);
    } catch (error) {
      console.error(error);
      alert('Network error. Please try again.');
    } finally {
      setActivatingSubscription(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-teal-900 flex flex-col overflow-hidden">
      <AuthNavbar variant="transparent" showGetStarted={true} />
      <div className="flex-1 flex items-center justify-center p-2 min-h-0">
        <div className="w-full max-w-6xl mx-auto h-full flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden shadow-2xl w-full h-full max-h-[90vh]">
          {/* Left: Form */}
          <div className="bg-white p-4 lg:p-5 flex flex-col justify-center overflow-hidden">
            <div className="max-w-md mx-auto w-full">
              <h1 className="text-lg font-bold text-slate-800 mb-0.5">Welcome Back</h1>
              <p className="text-slate-600 mb-3 text-[11px]">
                Sign in to manage your campaigns or ad inventory
              </p>

              <div className="space-y-2.5">
                {/* Account Type */}
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    Account Type
                  </label>
                  <div className="relative">
                    <select
                      value={userType || ''}
                      onChange={(e) => setUserType(e.target.value as UserType)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3 py-1.5 pr-8 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 appearance-none"
                    >
                      <option value="" disabled>
                        Select account type
                      </option>
                      <option value="company">Advertiser</option>
                      <option value="agency">Agency / Billboard Provider</option>
                      <option value="admin">Admin</option>
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5 pointer-events-none" />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="email"
                      placeholder="bcnriabah@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 rounded-lg pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 rounded-lg pl-9 pr-9 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Forgot Password */}
                <div className="text-right -mt-1">
                  <a href="/forgot-password" className="text-teal-600 hover:text-teal-700 text-[10px] font-medium">
                    Forgot password?
                  </a>
                </div>

                {/* Login Button */}
                <button
                  onClick={handleLogin}
                  disabled={loading || !userType}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                      Signing In...
                    </span>
                  ) : (
                    'Sign In'
                  )}
                </button>

                {/* Divider */}
                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-2 text-slate-500 text-[10px]">Or continue with</span>
                  </div>
                </div>

                {/* Google Sign-In */}
                {userType !== 'admin' && (
                  <div id="googleSignInButton" className="w-full scale-80 origin-center"></div>
                )}

                {/* Register Link */}
                <div className="text-center pt-0.5">
                  <p className="text-slate-600 text-[10px]">
                    Don't have an account?{' '}
                    <a href="/account-type" className="text-teal-600 hover:text-teal-700 font-medium">
                      Create one
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Illustration */}
          <div className="hidden lg:flex bg-gradient-to-br from-slate-900 via-blue-950 to-teal-900 p-4 flex-col items-center justify-center relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-10 left-10 w-20 h-20 bg-teal-500 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-20 right-10 w-28 h-28 bg-cyan-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="relative z-10 text-center max-w-md">
              {/* Isometric Map Illustration */}
              <div className="mb-3 relative">
                <svg viewBox="0 0 400 300" className="w-full h-auto max-h-[200px]">
                  {/* Base platform */}
                  <path
                    d="M 200 240 L 320 180 L 320 100 L 200 40 L 80 100 L 80 180 Z"
                    fill="url(#platformGradient)"
                    stroke="#0d9488"
                    strokeWidth="2"
                  />
                  
                  {/* Grid lines */}
                  <line x1="140" y1="140" x2="140" y2="180" stroke="#14b8a6" strokeWidth="1" opacity="0.3" />
                  <line x1="180" y1="120" x2="180" y2="200" stroke="#14b8a6" strokeWidth="1" opacity="0.3" />
                  <line x1="220" y1="120" x2="220" y2="200" stroke="#14b8a6" strokeWidth="1" opacity="0.3" />
                  <line x1="260" y1="140" x2="260" y2="180" stroke="#14b8a6" strokeWidth="1" opacity="0.3" />

                  {/* Map outline (Algeria) */}
                  <path
                    d="M 150 120 L 180 105 L 220 110 L 250 120 L 260 140 L 250 165 L 220 175 L 180 170 L 150 150 Z"
                    fill="#0d9488"
                    opacity="0.6"
                  />

                  {/* Location pins */}
                  <g className="animate-bounce" style={{ animationDuration: '2s', animationDelay: '0s' }}>
                    <circle cx="170" cy="135" r="3" fill="#06b6d4" />
                    <line x1="170" y1="135" x2="170" y2="150" stroke="#06b6d4" strokeWidth="2" />
                  </g>
                  
                  <g className="animate-bounce" style={{ animationDuration: '2s', animationDelay: '0.3s' }}>
                    <circle cx="200" cy="125" r="3" fill="#06b6d4" />
                    <line x1="200" y1="125" x2="200" y2="140" stroke="#06b6d4" strokeWidth="2" />
                  </g>
                  
                  <g className="animate-bounce" style={{ animationDuration: '2s', animationDelay: '0.6s' }}>
                    <circle cx="230" cy="140" r="3" fill="#06b6d4" />
                    <line x1="230" y1="140" x2="230" y2="155" stroke="#06b6d4" strokeWidth="2" />
                  </g>

                  {/* Data cards floating */}
                  <g opacity="0.9">
                    <rect x="90" y="70" width="50" height="30" rx="4" fill="#1e293b" stroke="#14b8a6" strokeWidth="1" />
                    <line x1="95" y1="78" x2="125" y2="78" stroke="#14b8a6" strokeWidth="2" />
                    <line x1="95" y1="85" x2="115" y2="85" stroke="#0d9488" strokeWidth="2" />
                    <line x1="95" y1="92" x2="130" y2="92" stroke="#0d9488" strokeWidth="2" />
                  </g>

                  <g opacity="0.9">
                    <rect x="260" y="60" width="50" height="35" rx="4" fill="#1e293b" stroke="#14b8a6" strokeWidth="1" />
                    <circle cx="285" cy="72" r="8" fill="none" stroke="#14b8a6" strokeWidth="2" />
                    <path d="M 278 72 L 282 76 L 292 66" stroke="#14b8a6" strokeWidth="2" fill="none" />
                    <line x1="267" y1="85" x2="303" y2="85" stroke="#0d9488" strokeWidth="2" />
                  </g>

                  {/* Gradients */}
                  <defs>
                    <linearGradient id="platformGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#0f172a', stopOpacity: 0.9 }} />
                      <stop offset="100%" style={{ stopColor: '#1e3a5f', stopOpacity: 0.9 }} />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <h2 className="text-lg font-bold text-white mb-1.5">
                Powering Algerian Advertising
              </h2>
              <p className="text-slate-300 text-xs leading-relaxed">
                Connect advertisers with high-impact outdoor ad spaces — fast, transparent, and trusted.
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>

      {planModalOpen && userType === 'agency' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-950 shadow-2xl border border-cyan-500/20 overflow-hidden">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white">Your Plan</h2>
                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="text-xs text-gray-300 hover:text-white bg-slate-900/60 hover:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 transition-colors"
                >
                  Back
                </button>
              </div>

              <p className="mt-1 text-xs text-gray-300">
                {subscriptionInfo?.status === 'active'
                  ? 'Your subscription is active.'
                  : subscriptionInfo?.status === 'trial'
                  ? 'You are currently on a free trial.'
                  : 'Your free trial has expired.'}
              </p>

              <div className="mt-4 rounded-xl bg-slate-900/60 border border-slate-800 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-300">Plan</span>
                  <span className="text-xs font-semibold text-white">
                    {subscriptionInfo?.planName || 'Trial'}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-300">Days remaining</span>
                  <span className="text-xs font-semibold text-white">
                    {typeof subscriptionInfo?.daysRemaining === 'number'
                      ? subscriptionInfo.daysRemaining
                      : '—'}
                  </span>
                </div>
                <div className="mt-2 text-[11px] text-gray-400 leading-relaxed">
                  This is a simple trial/subscription placeholder flow. Payment is not integrated yet.
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="bg-slate-900/60 hover:bg-slate-900 text-gray-200 px-4 py-2 rounded-lg border border-slate-800 transition-colors text-xs"
                >
                  Back
                </button>
                {subscriptionInfo?.status === 'expired' ? (
                  <button
                    onClick={handleActivateSubscription}
                    disabled={activatingSubscription}
                    className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                  >
                    {activatingSubscription ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                        Activating...
                      </span>
                    ) : (
                      'Activate Subscription (Mock)'
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleContinueToDashboard}
                    className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-lg transition-colors text-xs"
                  >
                    Continue to Dashboard
                  </button>
                )}
              </div>

              {subscriptionInfo?.status === 'expired' && (
                <div className="mt-3 text-[11px] text-gray-400">
                  Trial expired blocks creating/updating posts until activated.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}