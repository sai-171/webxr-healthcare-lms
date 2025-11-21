import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Heart, UserCheck, GraduationCap } from 'lucide-react';
import { useAuth } from '../store/auth';
import { Button } from '../components/shared/Button';
import type { RegisterData } from '../types';

export const RegisterPage: React.FC = () => {
  const { register: registerUser, isLoading } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'student' | 'instructor'>('student');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<RegisterData & { confirmPassword: string }>({
    defaultValues: {
      role: 'student'
    }
  });

  const watchPassword = watch('password');

  const onSubmit = async (data: RegisterData & { confirmPassword: string }) => {
    const { confirmPassword, ...registerData } = data;
    registerData.role = selectedRole;
    
    const success = await registerUser(registerData);
    if (success) {
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } else {
      toast.error('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Hero section and form content similar to Login */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16">
        <div className="w-full max-w-md mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Create your account
            </h2>
            <p className="text-gray-600">
              Get started with your medical education journey
            </p>
          </div>

          {/* Simplified register form for now */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                {...register('name', { required: 'Name is required' })}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                {...register('email', { required: 'Email is required' })}
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                {...register('password', { required: 'Password is required' })}
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Create a password"
              />
            </div>

            <Button type="submit" loading={isLoading} className="w-full" size="lg">
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
