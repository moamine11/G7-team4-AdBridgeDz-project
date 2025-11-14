'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { MailCheck } from 'lucide-react'

export default function VerifyEmailPage() {
  const router = useRouter()
  const [email] = useState('user****@example.com')

  const handleResend = () => {
    console.log('Resend verification email')
    // Handle resend logic
  }

  const handleChangeEmail = () => {
    router.back()
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-12 w-full max-w-md text-center">
        {/* Email Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
            <MailCheck className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Check your inbox to verify your email
        </h1>

        {/* Email Display */}
        <p className="text-lg text-gray-600 mb-8">{email}</p>

        {/* Resend Button */}
        <Button
          onClick={handleResend}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-full mb-4"
        >
          Resend Verification
        </Button>

        {/* Change Email Link */}
        <button
          onClick={handleChangeEmail}
          className="w-full text-blue-600 hover:text-blue-700 font-medium"
        >
          Change email
        </button>
      </div>
    </div>
  )
}
