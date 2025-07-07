import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, Shield, Zap, BarChart3, FileText, Gavel, Brain } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Button, Input } from '@/components/ui/UIComponents'
import { motion } from 'framer-motion'

interface LoginFormData {
  email: string
  password: string
  rememberMe: boolean
}

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<LoginFormData>({
    mode: 'onChange',
    defaultValues: {
      email: 'demo@counselflow.com',
      password: 'password123',
      rememberMe: false
    }
  })

  // Ensure default values are set on component mount
  React.useEffect(() => {
    setValue('email', 'demo@counselflow.com')
    setValue('password', 'password123')
  }, [setValue])

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      console.log('Login form submitted with:', { email: data.email, password: data.password })
      await login(data.email, data.password)
      console.log('Login successful')
    } catch (error) {
      console.error('Login failed:', error)
      // Don't show error toast here since AuthContext handles it
    } finally {
      setIsLoading(false)
    }
  }

  const features = [
    { icon: Brain, text: "AI-Powered Legal Intelligence", color: "text-accent-purple" },
    { icon: Gavel, text: "Complete Matter Management", color: "text-primary" },
    { icon: FileText, text: "Contract Lifecycle Management", color: "text-success" },
    { icon: BarChart3, text: "Advanced Analytics & Reporting", color: "text-warning" },
    { icon: Shield, text: "Enterprise-Grade Security", color: "text-danger" },
    { icon: Zap, text: "Lightning-Fast Performance", color: "text-info" }
  ]

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-neutral-50 via-white to-light-gray">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary-600 to-primary-700 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-32 right-16 w-48 h-48 bg-accent-purple/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-xl animate-bounce"></div>
        </div>
        
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center w-full max-w-lg"
          >
            {/* Modern CF Logo - matching sidebar */}
            <div className="flex justify-center mb-8">
              <div className="relative w-20 h-20 bg-gradient-to-br from-white via-blue-50 to-indigo-100 rounded-3xl flex items-center justify-center shadow-2xl border-2 border-white/30 backdrop-blur-sm">
                <div className="relative flex items-center justify-center w-full h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-400/20 to-primary-600/30 rounded-3xl animate-pulse"></div>
                  <div className="relative z-20 flex items-center">
                    <span className="font-extrabold text-3xl bg-gradient-to-r from-primary-700 via-primary-600 to-primary-800 bg-clip-text text-transparent tracking-tight">
                      C
                    </span>
                    <span className="font-extrabold text-3xl bg-gradient-to-r from-accent-purple via-primary-600 to-primary-700 bg-clip-text text-transparent -ml-1">
                      F
                    </span>
                  </div>
                  <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-primary-400 rounded-full opacity-60"></div>
                  <div className="absolute bottom-2 right-2 w-1 h-1 bg-accent-purple rounded-full opacity-40"></div>
                </div>
              </div>
            </div>
            
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              CounselFlow Ultimate
            </h1>
            <p className="text-xl text-blue-100 mb-12 font-medium">
              The Complete Legal Management System
            </p>
            
            {/* Feature grid */}
            <div className="grid grid-cols-1 gap-4 text-left">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300"
                >
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-4 backdrop-blur-sm">
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-white font-medium">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-md w-full"
        >
          <div className="bg-white rounded-3xl shadow-2xl border border-neutral-200 p-8 backdrop-blur-sm">
            <div className="text-center mb-8">
              {/* Mobile logo */}
              <div className="lg:hidden mb-6 flex justify-center">
                <div className="relative w-16 h-16 bg-gradient-to-br from-primary via-primary-600 to-primary-700 rounded-2xl flex items-center justify-center shadow-xl">
                  <div className="relative flex items-center justify-center w-full h-full">
                    <div className="relative z-20 flex items-center">
                      <span className="font-extrabold text-2xl text-white tracking-tight">C</span>
                      <span className="font-extrabold text-2xl text-blue-200 -ml-0.5">F</span>
                    </div>
                  </div>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-dark-navy mb-2">Welcome Back</h2>
              <p className="text-muted-gray">Sign in to your CounselFlow account</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-dark-navy mb-3">
                  Email Address
                </label>
                <Input
                  {...register('email', {
                    required: 'Email is required'
                  })}
                  type="email"
                  placeholder="Enter your email"
                  className="w-full"
                  defaultValue="demo@counselflow.com"
                  error={errors.email?.message}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-dark-navy mb-3">
                  Password
                </label>
                <div className="relative">
                  <Input
                    {...register('password', {
                      required: 'Password is required'
                    })}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className="w-full pr-12"
                    defaultValue="password123"
                    error={errors.password?.message}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-gray hover:text-dark-navy transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg p-1"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer group">
                  <input
                    {...register('rememberMe')}
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary border-muted-gray rounded transition-colors duration-200"
                  />
                  <span className="ml-3 text-sm text-muted-gray group-hover:text-dark-navy transition-colors duration-200">
                    Remember me
                  </span>
                </label>
                <a 
                  href="#" 
                  className="text-sm text-primary hover:text-primary-600 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg px-1 py-1"
                >
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full h-12"
                loading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>

              {/* Backup login button if form validation fails */}
              <button
                type="button"
                onClick={async () => {
                  setIsLoading(true)
                  try {
                    await login('demo@counselflow.com', 'password123')
                  } catch (error) {
                    console.error('Backup login failed:', error)
                  } finally {
                    setIsLoading(false)
                  }
                }}
                className="w-full mt-2 h-12 bg-secondary hover:bg-secondary-600 text-white font-medium rounded-lg transition-colors duration-200"
                disabled={isLoading}
              >
                🚀 Quick Demo Login
              </button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-8 p-6 bg-gradient-to-r from-light-gray to-neutral-100 rounded-2xl border border-neutral-200">
              <div className="flex items-center justify-center mb-3">
                <Shield className="h-5 w-5 text-primary mr-2" />
                <h4 className="text-sm font-semibold text-dark-navy">
                  Demo Credentials
                </h4>
              </div>
              <div className="text-sm text-muted-gray space-y-2 text-center">
                <div className="bg-white rounded-lg p-3 border border-neutral-200">
                  <div className="font-medium text-dark-navy">demo@counselflow.com</div>
                  <div className="font-medium text-dark-navy">password123</div>
                </div>
              </div>
              <p className="text-xs text-muted-gray mt-3 text-center">
                Use these credentials to explore the system
              </p>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-gray">
                Don't have an account?{' '}
                <a 
                  href="#" 
                  className="text-primary hover:text-primary-600 font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg px-1 py-1"
                >
                  Contact your administrator
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}