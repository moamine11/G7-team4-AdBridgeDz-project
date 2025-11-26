'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const loginPicture = '/login_picture.png'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Login attempt:', { email, password })
    router.push('/dashboard')
  }

  return (
    <div className="h-screen flex items-center justify-center p-4 overflow-hidden">
      <div className="bg-white rounded-3xl shadow-2xl p-0 w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Gradient Border Top */}
        <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        
        <div className="flex flex-col lg:flex-row flex-1 min-h-0">
          {/* Left Side - Form Content */}
          <div className="flex-1 p-6 lg:p-10 flex flex-col justify-center">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 lg:mb-8">Secure Login</h1>

            <form onSubmit={handleLogin} className="space-y-5 lg:space-y-6 flex-1 flex flex-col justify-between">
              <div className="space-y-5 lg:space-y-6">
              {/* Email Input */}
              <div>
                <Input
                  type="email"
                  placeholder="Email name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password ••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                </button>
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <Link href="/forgot-password" className="text-blue-600 hover:text-blue-700 text-sm font-medium underline">
                  Forgot Password?
                </Link>
                </div>
              </div>

              <div className="space-y-4">
              {/* Login Button */}
              <Button
                type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-full text-base lg:text-lg"
              >
                Login
              </Button>

            {/* Register Link */}
                <div className="text-center">
              <p className="text-gray-600 text-sm">
                Don't have dar account?{' '}
                <Link href="/account-type" className="text-blue-600 hover:text-blue-700 font-medium underline">
                  Register
                </Link>
              </p>
            </div>
              </div>
            </form>
          </div>

          {/* Right Side - Logo */}
          <div className="flex-1 bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-6 lg:p-10 min-h-[200px] lg:min-h-0">
            <div className="text-center w-full">
              <img
                src={loginPicture}
                alt="Login illustration"
                className="w-full max-w-xs lg:max-w-sm h-auto mx-auto object-contain"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/Adbridgelogo.png' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
