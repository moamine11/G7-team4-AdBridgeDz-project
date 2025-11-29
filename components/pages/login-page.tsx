'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'


declare global {
  interface Window {
    google?: any;
    handleCredentialResponse?: (response: any) => void;
  }
}

export default function LoginPage() {
  const router = useRouter()
  const loginPicture = '/login_picture.png'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    document.body.appendChild(script)
    window.handleCredentialResponse = handleGoogleLogin

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: '847708558168-12ljci267ehd9eonebevvos968u1o6md.apps.googleusercontent.com', 
          callback: handleGoogleLogin
        })
        window.google.accounts.id.renderButton(
          document.getElementById('googleSignInButton'),
          { 
            theme: 'outline', 
            size: 'large',
            width: '100%',
            text: 'signin_with',
            shape: 'rectangular'
          }
        )
      }
    }

    return () => {
      document.body.removeChild(script)
      delete window.handleCredentialResponse
    }
  }, [])

  const handleGoogleLogin = async (response: any) => {
    const idToken = response.credential
    console.log(idToken)

    try {
      const res = await fetch('http://localhost:5000/api/companies/google-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ idToken })
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || 'Google login failed')
        return
      }
      localStorage.setItem('token', data.token)
      router.push('/dashboard')

     
    } catch (error) {
      console.error(error)
      alert('Something went wrong with Google login.')
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch('http://localhost:5000/api/companies/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || 'Login failed')
        return
      }

     
      localStorage.setItem('token', data.token)
      if (data.userType === 'agency') {
        router.push('/agency-dashboard')
      } else if (data.userType === 'company') {
        router.push('/company-dashboard')
      }
    } catch (error) {
      console.error(error)
      alert('Something went wrong.')
    }
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

            <div className="space-y-5 lg:space-y-6 flex-1 flex flex-col justify-between">
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
                  onClick={handleLogin}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-full text-base lg:text-lg"
                >
                  Login
                </Button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                {/* Google Sign-In Button */}
                <div id="googleSignInButton" className="w-full flex justify-center"></div>

                {/* Register Link */}
                <div className="text-center">
                  <p className="text-gray-600 text-sm">
                    Don't have an account?{' '}
                    <Link href="/account-type" className="text-blue-600 hover:text-blue-700 font-medium underline">
                      Register
                    </Link>
                  </p>
                </div>
              </div>
            </div>
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
