import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Heart, ArrowRight } from 'lucide-react';
import { useAuth } from '../store/auth';
import { Button } from '../components/shared/Button';
import type { LoginCredentials } from '../types';

export const LoginPage: React.FC = () => {
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState<string>('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<LoginCredentials>();

  const onSubmit = async (data: LoginCredentials) => {
    const success = await login(data);
    if (success) {
      toast.success('Welcome to MedAR Learn!');
      navigate('/dashboard');
    } else {
      toast.error(error || 'Login failed');
    }
  };

  const handleDemoLogin = (email: string, role: string) => {
    setValue('email', email);
    setValue('password', 'demo123');
    setSelectedDemo(role);
  };

  const demoAccounts = [
    {
      role: 'Student',
      email: 'demo@medar.com',
      description: 'Access student features, AR learning, progress tracking',
      color: 'from-blue-500 to-blue-600'
    },
    {
      role: 'Instructor', 
      email: 'instructor@medar.com',
      description: 'Manage courses, view analytics, student progress',
      color: 'from-green-500 to-green-600'
    },
    {
      role: 'Admin',
      email: 'admin@medar.com', 
      description: 'Full system access, user management, system settings',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-medical-500 to-primary-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="flex items-center mb-8">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Heart className="h-8 w-8" />
            </div>
            <span className="ml-3 text-2xl font-bold">MedAR Learn</span>
          </div>
          
          <h1 className="text-4xl font-bold mb-6 leading-tight">
            Experience the Future of
            <br />
            <span className="text-yellow-300">Medical Education</span>
          </h1>
          
          <p className="text-lg opacity-90 mb-8 leading-relaxed">
            Learn anatomy, pathology, and medical procedures through immersive 
            augmented reality experiences powered by advanced AI assistance.
          </p>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="h-2 w-2 bg-yellow-300 rounded-full" />
              <span>Interactive 3D anatomical models</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-2 w-2 bg-yellow-300 rounded-full" />
              <span>AI-powered medical Q&A assistant</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-2 w-2 bg-yellow-300 rounded-full" />
              <span>Progress tracking and achievements</span>
            </div>
          </div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32" />
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16">
        <div className="w-full max-w-md mx-auto">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center mb-8">
            <div className="p-2 bg-gradient-to-br from-medical-500 to-primary-600 rounded-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <span className="ml-2 text-xl font-bold text-gray-900">MedAR Learn</span>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back
            </h2>
            <p className="text-gray-600">
              Sign in to continue your medical learning journey
            </p>
          </div>

          {/* Demo Account Section */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Try with demo accounts:
            </h3>
            <div className="grid gap-2">
              {demoAccounts.map((account) => (
                <button
                  key={account.role}
                  onClick={() => handleDemoLogin(account.email, account.role)}
                  className={`p-3 rounded-lg border text-left transition-all hover:shadow-md ${
                    selectedDemo === account.role
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${account.color}`} />
                        <span className="font-medium text-gray-900">{account.role}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {account.description}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Please enter a valid email address'
                  }
                })}
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              loading={isLoading}
              className="w-full"
              size="lg"
            >
              Sign in
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Sign up
              </Link>
            </p>
          </div>

          {/* Demo Info */}
          <div className="mt-6 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-700 text-center">
              🚀 Demo Mode: Use password "demo123" for all demo accounts
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
