// src/app/auth/register/page.jsx - FIXED VALIDATION & ERROR HANDLING
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

// Simple icon components to avoid @heroicons dependency issues
const EyeIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeSlashIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
  </svg>
);

const CheckCircleIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const XCircleIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default function RegisterPage() {
  const router = useRouter();
  const { register, loading, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState([]); // ✅ ARRAY FOR MULTIPLE ERRORS
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false
  });

  // Redirect nếu đã đăng nhập
  useEffect(() => {
    if (isAuthenticated && !loading) {
      router.push('/prediction');
    }
  }, [isAuthenticated, loading, router]);

  // Validate password real-time
  useEffect(() => {
    const password = formData.password;
    setPasswordValidation({
      length: password.length >= 6, // ✅ RELAXED: 6 chars minimum
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password)
    });
  }, [formData.password]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user types
    if (error) setError('');
    if (errors.length > 0) setErrors([]);
    if (successMessage) setSuccessMessage('');
  };

  // ✅ IMPROVED VALIDATION
  const validateForm = () => {
    const newErrors = [];

    // Check required fields
    if (!formData.fullName.trim()) {
      newErrors.push('Vui lòng nhập họ tên');
    }

    if (!formData.email.trim()) {
      newErrors.push('Vui lòng nhập email');
    } else {
      // Check email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.push('Email không hợp lệ');
      }
    }

    if (!formData.password) {
      newErrors.push('Vui lòng nhập mật khẩu');
    } else {
      // Check password requirements (relaxed)
      if (formData.password.length < 6) {
        newErrors.push('Mật khẩu phải có ít nhất 6 ký tự');
      }
    }

    if (!formData.confirmPassword) {
      newErrors.push('Vui lòng xác nhận mật khẩu');
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.push('Mật khẩu xác nhận không khớp');
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setError(newErrors[0]); // Set first error as main error
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setErrors([]);
    setSuccessMessage('');
    setIsSubmitting(true);

    console.log('📝 Form submitted with data:', {
      fullName: formData.fullName,
      email: formData.email,
      hasPassword: !!formData.password,
      hasConfirmPassword: !!formData.confirmPassword,
      passwordsMatch: formData.password === formData.confirmPassword
    });

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      console.log('🚀 Calling register API...');
      const result = await register(formData);
      
      console.log('✅ Registration result:', result);
      
      setSuccessMessage(result.message || 'Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.');
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/auth/login?registered=true');
      }, 2000);

    } catch (err) {
      console.error('❌ Register error:', err);
      
      // ✅ IMPROVED ERROR HANDLING
      if (err.errors && Array.isArray(err.errors)) {
        setErrors(err.errors);
        setError(err.errors[0]);
      } else {
        const errorMessage = err.message || 'Có lỗi xảy ra khi đăng ký';
        setError(errorMessage);
        setErrors([errorMessage]);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Hiển thị loading nếu đang kiểm tra authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang kiểm tra thông tin đăng nhập...</p>
        </div>
      </div>
    );
  }

  const PasswordRequirement = ({ met, text }) => (
    <div className={`flex items-center text-xs ${met ? 'text-green-600' : 'text-gray-500'}`}>
      <CheckCircleIcon className={`h-4 w-4 mr-2 ${met ? 'text-green-500' : 'text-gray-300'}`} />
      {text}
    </div>
  );

  // Check if all password requirements are met
  const isPasswordValid = Object.values(passwordValidation).every(Boolean);
  const isFormValid = isPasswordValid && 
                     formData.password === formData.confirmPassword && 
                     formData.fullName.trim() && 
                     formData.email.trim();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-green-100">
            <span className="text-3xl">👤</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Đăng ký tài khoản
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Hoặc{' '}
            <Link href="/auth/login" className="font-medium text-green-600 hover:text-green-500">
              đăng nhập với tài khoản có sẵn
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* ✅ IMPROVED ERROR DISPLAY */}
          {(error || errors.length > 0) && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <XCircleIcon className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    {errors.length > 1 ? 'Có một số lỗi cần sửa:' : error}
                  </h3>
                  {errors.length > 1 && (
                    <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                      {errors.map((err, index) => (
                        <li key={index}>{err}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircleIcon className="h-5 w-5 text-green-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    {successMessage}
                  </h3>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                required
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Nhập họ và tên đầy đủ"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                disabled={isSubmitting}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Nhập địa chỉ email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                disabled={isSubmitting}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Nhập mật khẩu"
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              
              {/* ✅ RELAXED Password requirements */}
              {formData.password && (
                <div className="mt-2 space-y-1">
                  <PasswordRequirement 
                    met={passwordValidation.length} 
                    text="Ít nhất 6 ký tự" 
                  />
                  <PasswordRequirement 
                    met={passwordValidation.uppercase} 
                    text="Có ít nhất 1 chữ hoa" 
                  />
                  <PasswordRequirement 
                    met={passwordValidation.lowercase} 
                    text="Có ít nhất 1 chữ thường" 
                  />
                  <PasswordRequirement 
                    met={passwordValidation.number} 
                    text="Có ít nhất 1 số" 
                  />
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Xác nhận mật khẩu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Nhập lại mật khẩu"
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isSubmitting}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              
              {/* Password match indicator */}
              {formData.confirmPassword && (
                <div className="mt-1">
                  {formData.password === formData.confirmPassword ? (
                    <div className="flex items-center text-xs text-green-600">
                      <CheckCircleIcon className="h-4 w-4 mr-2 text-green-500" />
                      Mật khẩu khớp
                    </div>
                  ) : (
                    <div className="flex items-center text-xs text-red-600">
                      <XCircleIcon className="h-4 w-4 mr-2 text-red-400" />
                      Mật khẩu không khớp
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting || !isFormValid}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang đăng ký...
                </>
              ) : (
                'Đăng ký'
              )}
            </button>
          </div>

          {/* Terms and Privacy */}
          <div className="text-xs text-gray-500 text-center">
            Bằng việc đăng ký, bạn đồng ý với{' '}
            <a href="#" className="text-green-600 hover:text-green-500">Điều khoản sử dụng</a>
            {' '}và{' '}
            <a href="#" className="text-green-600 hover:text-green-500">Chính sách bảo mật</a>
            {' '}của chúng tôi.
          </div>
        </form>
      </div>
    </div>
  );
}