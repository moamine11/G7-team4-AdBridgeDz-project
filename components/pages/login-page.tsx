'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const loginPicture = '/login_picture.png'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Login attempt:', { email, password })
    router.push('/channels')
  }

  return (
    <div className="h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] flex items-center justify-center p-3 md:p-4 overflow-hidden">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden border border-gray-100 h-full max-h-full flex flex-col">
        {/* Gradient Border Top */}
        <div className="h-1 bg-gradient-to-r from-teal-500 via-blue-500 to-teal-500 flex-shrink-0"></div>
        
        <div className="flex flex-col lg:flex-row flex-1 min-h-0 overflow-hidden">
          {/* Left Side - Form Content */}
          <div className="flex-1 p-3 lg:p-5 xl:p-7 flex flex-col justify-center bg-gradient-to-br from-white to-blue-50/30 overflow-y-auto">
            <div className="max-w-md mx-auto w-full">
              <div className="mb-3 lg:mb-4">
                <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-1 bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                  Welcome Back
                </h1>
                <p className="text-gray-600 text-sm lg:text-base">
                  Sign in to continue to AdBridgeDZ
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-2.5 lg:space-y-3.5">
                {/* Email Input */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-teal-600" />
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none transition-all duration-200 bg-white hover:border-gray-300"
                    required
                  />
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                  <label htmlFor="password" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-teal-600" />
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none transition-all duration-200 bg-white hover:border-gray-300 pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-teal-600 transition-colors duration-200"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Forgot Password Link */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="remember"
                      className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500 focus:ring-2"
                    />
                    <label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer">
                      Remember me
                    </label>
                  </div>
                  <Link 
                    href="/forgot-password" 
                    className="text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors duration-200"
                  >
                    Forgot Password?
                  </Link>
                </div>

                {/* Login Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-semibold py-2.5 lg:py-3 rounded-xl text-sm lg:text-base shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30 transition-all duration-200 flex items-center justify-center gap-2 group"
                >
                  <LogIn className="w-4 h-4 lg:w-5 lg:h-5 group-hover:translate-x-1 transition-transform duration-200" />
                  Sign In
                </Button>

                {/* Register Link */}
                <div className="text-center pt-2">
                  <p className="text-gray-600 text-xs lg:text-sm">
                    Don't have an account?{' '}
                    <Link 
                      href="/account-type" 
                      className="text-teal-600 hover:text-teal-700 font-semibold transition-colors duration-200 hover:underline"
                    >
                      Create Account
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Right Side - Illustration */}
          <div className="flex-1 bg-gradient-to-br from-teal-50 via-blue-50 to-teal-50 flex items-center justify-center p-4 lg:p-6 xl:p-8 min-h-[200px] lg:min-h-0 relative overflow-hidden flex-shrink-0">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-200/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl"></div>
            
            <div className="text-center w-full relative z-10">
              <img
                src={loginPicture}
                alt="Login illustration"
                className="w-full max-w-[200px] lg:max-w-xs xl:max-w-sm h-auto mx-auto object-contain drop-shadow-2xl"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/Adbridgelogo.png' }}
              />
              <div className="mt-3 lg:mt-4 hidden lg:block">
                <p className="text-gray-600 text-xs lg:text-sm font-medium">
                  Connect with premium advertising spaces
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
