'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react'
import { authService } from '@/lib/services/auth-service'
import { useAuth } from '@/contexts/auth-context'
import { useToast } from '@/components/ui/use-toast'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const { toast } = useToast()
  const loginPicture = '/login_picture.png'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

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

                {/* Login with Google Button */}
                <div className="pt-4">
                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-3 py-2.5 lg:py-3 rounded-xl bg-white/90 hover:bg-white text-slate-800 font-semibold text-base shadow-md hover:shadow-lg transition-all duration-200 border border-white/30"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clipPath="url(#clip0_17_40)">
                        <path d="M47.999 24.552c0-1.636-.146-3.273-.438-4.872H24.489v9.23h13.23c-.57 2.98-2.37 5.49-5.04 7.18v5.92h8.14c4.77-4.39 7.18-10.86 7.18-17.46z" fill="#4285F4"/>
                        <path d="M24.489 48c6.48 0 11.93-2.13 15.91-5.8l-8.14-5.92c-2.27 1.52-5.18 2.41-7.77 2.41-5.97 0-11.03-4.03-12.85-9.47h-8.32v5.97C7.47 43.98 15.47 48 24.489 48z" fill="#34A853"/>
                        <path d="M11.639 29.22c-.52-1.52-.82-3.13-.82-4.78s.3-3.26.82-4.78v-6.01h-8.32A23.97 23.97 0 000 24.44c0 3.97.96 7.74 2.66 11.01l8.98-6.23z" fill="#FBBC05"/>
                        <path d="M24.489 9.52c3.53 0 6.68 1.21 9.17 3.59l6.87-6.87C36.41 2.13 30.97 0 24.489 0 15.47 0 7.47 4.02 2.66 11.01l8.98 6.23c1.82-5.44 6.88-9.47 12.85-9.47z" fill="#EA4335"/>
                      </g>
                      <defs>
                        <clipPath id="clip0_17_40">
                          <rect width="48" height="48" fill="white"/>
                        </clipPath>
                      </defs>
                    </svg>
                    Login with Google
                  </button>
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
