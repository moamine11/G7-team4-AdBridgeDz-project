'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { MailCheck, CheckCircle2, XCircle } from 'lucide-react';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const emailFromQuery = searchParams.get('email') || '';
  const userTypeFromQuery = searchParams.get('userType') || '';
  const tokenFromQuery = searchParams.get('token') || '';
  const idFromQuery = searchParams.get('id') || '';
  
  const [email, setEmail] = useState(emailFromQuery);
  const [userType, setUserType] = useState(userTypeFromQuery);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [verificationMessage, setVerificationMessage] = useState('');

  // FIX: Use NEXT_PUBLIC_BACKEND_URL for client-side access
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

  // Auto-verify if token and id are present
  useEffect(() => {
    if (tokenFromQuery && idFromQuery && verificationStatus === 'idle') {
      handleAutoVerify();
    }
  }, [tokenFromQuery, idFromQuery]);

  const handleAutoVerify = async () => {
    if (!tokenFromQuery || !idFromQuery) return;

    setVerifying(true);
    setVerificationStatus('idle');

    try {
      // Determine the correct endpoint based on the user type or try both
      const endpoints = userTypeFromQuery === 'company' 
        ? ['/api/companies/verify-email']
        : userTypeFromQuery === 'agency'
        ? ['/api/agencies/verify-email']
        : ['/api/companies/verify-email', '/api/agencies/verify-email'];

      let verified = false;
      let errorMessage = '';

      for (const endpoint of endpoints) {
        try {
          const res = await fetch(`${API_BASE_URL}${endpoint}?token=${tokenFromQuery}&id=${idFromQuery}`, {
            method: 'GET',
          });

          // Handle both JSON and plain text responses
          const contentType = res.headers.get('content-type');
          let data;
          
          if (contentType && contentType.includes('application/json')) {
            data = await res.json();
          } else {
            // Handle plain text response (for backward compatibility)
            const text = await res.text();
            if (res.ok) {
              data = { message: text };
            } else {
              data = { error: text };
            }
          }
          
          if (res.ok) {
            setVerificationStatus('success');
            setVerificationMessage(data.message || 'Email verified successfully!');
            verified = true;
            // Redirect to login after 2 seconds
            setTimeout(() => {
              router.push('/login');
            }, 2000);
            break;
          } else {
            errorMessage = data.error || 'Verification failed';
          }
        } catch (err) {
          console.error(`Error verifying with ${endpoint}:`, err);
          errorMessage = 'Network error during verification';
        }
      }

      if (!verified) {
        setVerificationStatus('error');
        setVerificationMessage(errorMessage || 'Verification failed. The link may be invalid or expired.');
      }
    } catch (err) {
      console.error(err);
      setVerificationStatus('error');
      setVerificationMessage('An error occurred during verification.');
    } finally {
      setVerifying(false);
    }
  };

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

  // Show verification status if token/id are present
  if (tokenFromQuery && idFromQuery) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950">
        <div className="bg-gradient-to-br from-slate-900/80 via-slate-800/70 to-slate-950/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-teal-500/20 p-10 w-full max-w-md text-center">
          {verifying ? (
            <>
              <div className="flex justify-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg shadow-teal-500/30 animate-pulse">
                  <MailCheck className="w-10 h-10 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-white mb-3">Verifying Email...</h1>
              <p className="text-slate-300">Please wait while we verify your email address.</p>
            </>
          ) : verificationStatus === 'success' ? (
            <>
              <div className="flex justify-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg shadow-teal-500/30">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-white mb-3">Email Verified!</h1>
              <p className="text-slate-300 mb-6">{verificationMessage}</p>
              <p className="text-sm text-slate-400">Redirecting to login page...</p>
            </>
          ) : verificationStatus === 'error' ? (
            <>
              <div className="flex justify-center mb-8">
                <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30">
                  <XCircle className="w-10 h-10 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-white mb-3">Verification Failed</h1>
              <p className="text-slate-300 mb-6">{verificationMessage}</p>
              <Button
                onClick={handleGoToLogin}
                className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-full"
              >
                Go to Login
              </Button>
            </>
          ) : null}
        </div>
      </div>
    );
  }

  // Original page for when email/userType are in query (from signup redirect)
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950">
      <div className="bg-gradient-to-br from-slate-900/80 via-slate-800/70 to-slate-950/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-teal-500/20 p-10 w-full max-w-md text-center">
        
        {/* Email Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg shadow-teal-500/30">
            <MailCheck className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-white mb-3">
          Check Your Inbox
        </h1>

        {/* Email Display */}
        <p className="text-lg text-slate-300 mb-6">
          A verification link has been sent to: 
          <br />
          <span className="font-semibold text-teal-400">{email || 'your email'}</span>
        </p>
        
        <p className="text-sm text-slate-400 mb-8">
            You must verify your email to log in to your {userType || 'account'}.
        </p>

        {/* Resend Button */}
        <Button
          onClick={handleResend}
          className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-full mb-4"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Resend Verification'}
        </Button>

        {/* Go to Login Link */}
        <button
          onClick={handleGoToLogin}
          className="w-full text-teal-400 hover:text-teal-300 font-medium text-sm mt-2"
        >
          Go to Login Page
        </button>
      </div>
    </div>
  );
}
