'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { MailCheck } from 'lucide-react';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const emailFromQuery = searchParams.get('email') || '';
  const userTypeFromQuery = searchParams.get('userType') || ''; 
  const [email, setEmail] = useState(emailFromQuery);
  const [userType, setUserType] = useState(userTypeFromQuery); 
  const [loading, setLoading] = useState(false);

  // FIX: Use process.env.BACKEND_URL (Must be defined in .env or next.config.js)
  const API_BASE_URL = process.env.BACKEND_URL || 'http://localhost:5000';

  const handleResend = async () => {
    if (!email) return alert('Email not found.');

    setLoading(true);
    // Determine the correct endpoint based on the user type
    const endpoint = userType === 'company' ? '/api/companies/resend-verification' : '/api/agencies/resend-verification';

    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message || 'Verification email sent!');
      } else {
        alert(data.error || 'Failed to resend verification email.');
      }
    } catch (err) {
      console.error(err);
      alert('Error sending verification email.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoToLogin = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md text-center border-t-4 border-teal-500">
        
        {/* Email Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-teal-500/30">
            <MailCheck className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Check Your Inbox
        </h1>

        {/* Email Display */}
        <p className="text-lg text-gray-600 mb-6">
          A verification link has been sent to: 
          <br />
          <span className="font-semibold text-gray-800">{email || 'your email'}</span>
        </p>
        
        <p className="text-sm text-gray-500 mb-8">
            You must verify your email to log in to your {userType || 'account'}.
        </p>

        {/* Resend Button */}
        <Button
          onClick={handleResend}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-full mb-4"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Resend Verification'}
        </Button>

        {/* Go to Login Link */}
        <button
          onClick={handleGoToLogin}
          className="w-full text-teal-600 hover:text-teal-700 font-medium text-sm mt-2"
        >
          Go to Login Page
        </button>
      </div>
    </div>
  );
}