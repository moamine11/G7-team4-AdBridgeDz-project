'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react'
import { authService } from '@/lib/services/auth-service'
import { useAuth } from '@/contexts/auth-context'
import { useToast } from '@/components/ui/use-toast'

declare global {
  interface Window {
    google?: any;
    handleCredentialResponse?: (response: any) => void;
  }
}

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const { toast } = useToast()
  const loginPicture = '/login_picture.png'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

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
        toast({
          title: "Error",
          description: data.error || 'Google login failed',
          variant: "destructive",
        })
        return
      }
      
      localStorage.setItem('token', data.token)
      toast({
        title: "Success",
        description: "Logged in successfully with Google",
      })
      router.push('/channels')
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: 'Something went wrong with Google login.',
        variant: "destructive",
      })
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Try logging in as a company first
      try {
        const data = await authService.loginCompany({ email, password });
        login(data.token, data.company, 'company');
        toast({
          title: "Success",
          description: "Logged in successfully as Company",
        });
        return;
      } catch (companyError) {
        // If company login fails, try agency login
        try {
          const data = await authService.loginAgency({ email, password });
          login(data.token, data.agency, 'agency');
          toast({
            title: "Success",
            description: "Logged in successfully as Agency",
          });
          return;
        } catch (agencyError) {
           // If both fail, throw an error
           throw new Error('Invalid credentials');
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to login. Please check your credentials.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-3 md:p-4 overflow-hidden bg-[#020618]">
      <div className="rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden border border-white/10 h-full max-h-full flex flex-col bg-white/10 backdrop-blur-xl">
        {/* Glassy Gradient Border Top */}
        <div className="h-1 bg-gradient-to-r from-blue-600 via-teal-500 to-blue-400 flex-shrink-0 opacity-80"></div>
        <div className="flex flex-col lg:flex-row flex-1 min-h-0 overflow-hidden">
          {/* Left Side - Form Content */}
          <div className="flex-1 p-3 lg:p-5 xl:p-7 flex flex-col justify-center bg-transparent overflow-y-auto">
            <div className="max-w-md mx-auto w-full">
              <div className="mb-3 lg:mb-4">
                <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold mb-1 bg-gradient-to-r from-blue-400 via-teal-400 to-blue-400 bg-clip-text text-transparent drop-shadow">
                  Welcome Back
                </h1>
                <p className="text-slate-300 text-sm lg:text-base">
                  Sign in to continue to AdBridgeDZ
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-2.5 lg:space-y-3.5">
                {/* Email Input */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-teal-600" />
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-white/10 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200 bg-white/10 text-slate-100 placeholder:text-slate-400 hover:border-blue-400 backdrop-blur"
                    required
                  />
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                  <label htmlFor="password" className="text-sm font-semibold text-slate-200 flex items-center gap-2">
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
                      className="w-full px-4 py-3 border-2 border-white/10 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200 bg-white/10 text-slate-100 placeholder:text-slate-400 hover:border-blue-400 pr-12 backdrop-blur"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-blue-400 transition-colors duration-200"
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
                      className="w-4 h-4 text-blue-500 border-white/20 bg-transparent rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <label htmlFor="remember" className="text-sm text-slate-300 cursor-pointer">
                      Remember me
                    </label>
                  </div>
                  <Link 
                    href="/forgot-password" 
                    className="text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors duration-200"
                  >
                    Forgot Password?
                  </Link>
                </div>

                {/* Login Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-500 via-teal-500 to-blue-400 hover:from-blue-700 hover:to-teal-600 text-white font-semibold py-2.5 lg:py-3 rounded-xl text-base shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200 flex items-center justify-center gap-2 group"
                >
                  {isLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 lg:w-5 lg:h-5 group-hover:translate-x-1 transition-transform duration-200" />
                      Sign In
                    </>
                  )}
                </Button>

                {/* Divider */}
                <div className="relative pt-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-transparent text-slate-400">Or continue with</span>
                  </div>
                </div>

                {/* Google Sign-In Button */}
                <div id="googleSignInButton" className="w-full flex justify-center pt-2"></div>

                {/* Register Link */}
                <div className="text-center pt-2">
                  <p className="text-slate-300 text-xs lg:text-sm">
                    Don't have an account?{' '}
                    <Link 
                      href="/account-type" 
                      className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-200 hover:underline"
                    >
                      Create Account
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Right Side - Illustration */}
          <div className="flex-1 bg-[#020618] flex items-center justify-center p-4 lg:p-6 xl:p-8 min-h-[200px] lg:min-h-0 relative overflow-hidden flex-shrink-0">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-900/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-800/20 rounded-full blur-3xl"></div>
            <div className="text-center w-full relative z-10">
              <img
                src={loginPicture}
                alt="Login illustration"
                className="w-full max-w-[200px] lg:max-w-xs xl:max-w-sm h-auto mx-auto object-contain drop-shadow-2xl"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/Adbridgelogo.png' }}
              />
              <div className="mt-3 lg:mt-4 hidden lg:block">
                <p className="text-slate-300 text-xs lg:text-sm font-medium">
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