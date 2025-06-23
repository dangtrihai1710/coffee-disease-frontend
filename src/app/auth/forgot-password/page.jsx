// ===================================================================
// src/app/auth/forgot-password/page.jsx - ENHANCED WITH OTP FLOW
// ===================================================================
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const router = useRouter();
  
  // Steps: 1 = Email, 2 = OTP Verification, 3 = New Password
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmNewPassword: ''
  });
  
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);

  // Password validation
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    match: false
  });

  // OTP Timer countdown
  useEffect(() => {
    let interval = null;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(time => time - 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [otpTimer]);

  // Update password validation real-time
  const updatePasswordValidation = (newPassword, confirmPassword) => {
    setPasswordValidation({
      length: newPassword.length >= 6,
      uppercase: /[A-Z]/.test(newPassword),
      lowercase: /[a-z]/.test(newPassword),
      number: /\d/.test(newPassword),
      match: newPassword === confirmPassword && newPassword.length > 0
    });
  };

  // Step 1: Send OTP to email
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Vui lòng nhập email');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Mã OTP đã được gửi đến email của bạn!');
        setStep(2);
        setOtpTimer(300); // 5 minutes countdown
      } else {
        setError(data.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
        toast.error(data.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setError('Không thể kết nối đến server. Vui lòng thử lại.');
      toast.error('Lỗi kết nối');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Verify OTP
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    
    if (!otpCode || otpCode.length !== 6) {
      setError('Vui lòng nhập mã OTP 6 số');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          email,
          otpCode 
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Xác thực OTP thành công!');
        setStep(3);
      } else {
        setError(data.message || 'Mã OTP không đúng');
        toast.error(data.message || 'Mã OTP không đúng');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setError('Không thể xác thực OTP. Vui lòng thử lại.');
      toast.error('Lỗi xác thực OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 3: Reset password
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!passwordData.newPassword || !passwordData.confirmNewPassword) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setError('Mật khẩu mới không khớp');
      return;
    }

    if (!Object.values(passwordValidation).every(Boolean)) {
      setError('Mật khẩu không đáp ứng yêu cầu');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          otpCode,
          newPassword: passwordData.newPassword,
          confirmNewPassword: passwordData.confirmNewPassword
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Đặt lại mật khẩu thành công!');
        router.push('/auth/login?message=password_reset_success');
      } else {
        setError(data.message || 'Đặt lại mật khẩu thất bại');
        toast.error(data.message || 'Đặt lại mật khẩu thất bại');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setError('Không thể đặt lại mật khẩu. Vui lòng thử lại.');
      toast.error('Lỗi đặt lại mật khẩu');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));

    // Update validation khi có thay đổi
    if (name === 'newPassword') {
      updatePasswordValidation(value, passwordData.confirmNewPassword);
    }
    if (name === 'confirmNewPassword') {
      updatePasswordValidation(passwordData.newPassword, value);
    }
    
    if (error) setError('');
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (otpTimer > 0) return;
    
    setIsSubmitting(true);
    try {
      await handleEmailSubmit({ preventDefault: () => {} });
      setOtpCode('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const PasswordRequirement = ({ met, text }) => (
    <div className={`flex items-center text-xs ${met ? 'text-green-600' : 'text-gray-400'}`}>
      <div className={`w-2 h-2 rounded-full mr-2 ${met ? 'bg-green-500' : 'bg-gray-300'}`} />
      {text}
    </div>
  );

  const getStepTitle = () => {
    switch (step) {
      case 1: return 'Quên mật khẩu';
      case 2: return 'Xác thực OTP';
      case 3: return 'Đặt lại mật khẩu';
      default: return 'Quên mật khẩu';
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 1: return 'Nhập email để nhận mã OTP xác thực';
      case 2: return 'Nhập mã OTP đã được gửi đến email của bạn';
      case 3: return 'Nhập mật khẩu mới cho tài khoản của bạn';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-orange-100">
            <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-3.586l4.293-4.293A6 6 0 0119 9z" />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {getStepTitle()}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {getStepDescription()}
          </p>
          
          {/* Progress indicator */}
          <div className="mt-6 flex justify-center">
            <div className="flex space-x-2">
              {[1, 2, 3].map((stepNum) => (
                <div
                  key={stepNum}
                  className={`w-3 h-3 rounded-full ${
                    stepNum <= step ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Step 1: Email Input */}
        {step === 1 && (
          <form className="mt-8 space-y-6" onSubmit={handleEmailSubmit}>
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-800">{error}</div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Nhập địa chỉ email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang gửi...
                  </>
                ) : (
                  'Gửi mã OTP'
                )}
              </button>
            </div>

            <div className="text-center">
              <Link href="/auth/login" className="font-medium text-green-600 hover:text-green-500">
                Quay lại đăng nhập
              </Link>
            </div>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <form className="mt-8 space-y-6" onSubmit={handleOtpSubmit}>
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-800">{error}</div>
              </div>
            )}

            <div className="text-center mb-4">
              <p className="text-sm text-gray-600">
                Mã OTP đã được gửi đến: <span className="font-medium">{email}</span>
              </p>
            </div>

            <div>
              <label htmlFor="otpCode" className="block text-sm font-medium text-gray-700 mb-1">
                Mã OTP (6 số)
              </label>
              <input
                id="otpCode"
                name="otpCode"
                type="text"
                maxLength="6"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm text-center text-lg tracking-widest"
                placeholder="000000"
                value={otpCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  if (value.length <= 6) {
                    setOtpCode(value);
                    if (error) setError('');
                  }
                }}
                disabled={isSubmitting}
              />
            </div>

            {/* Timer and Resend */}
            <div className="text-center">
              {otpTimer > 0 ? (
                <p className="text-sm text-gray-600">
                  Mã OTP hết hạn sau: <span className="font-medium text-red-600">{formatTime(otpTimer)}</span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isSubmitting}
                  className="text-sm font-medium text-green-600 hover:text-green-500 disabled:text-gray-400"
                >
                  Gửi lại mã OTP
                </button>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting || otpCode.length !== 6}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang xác thực...
                  </>
                ) : (
                  'Xác thực OTP'
                )}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="font-medium text-gray-600 hover:text-gray-500"
              >
                ← Quay lại thay đổi email
              </button>
            </div>
          </form>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <form className="mt-8 space-y-6" onSubmit={handlePasswordSubmit}>
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-800">{error}</div>
              </div>
            )}

            <div className="text-center mb-4">
              <p className="text-sm text-green-600 font-medium">
                ✓ OTP xác thực thành công
              </p>
              <p className="text-sm text-gray-600">
                Tài khoản: <span className="font-medium">{email}</span>
              </p>
            </div>

            {/* New Password */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu mới
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  name="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="Nhập mật khẩu mới"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 focus:outline-none"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  tabIndex={-1}
                >
                  {showNewPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>

              {/* Password requirements */}
              {passwordData.newPassword && (
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

            {/* Confirm New Password */}
            <div>
              <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Xác nhận mật khẩu mới
              </label>
              <div className="relative">
                <input
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="Nhập lại mật khẩu mới"
                  value={passwordData.confirmNewPassword}
                  onChange={handlePasswordChange}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 focus:outline-none"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>

              {/* Password match indicator */}
              {passwordData.confirmNewPassword && (
                <div className="mt-2">
                  <PasswordRequirement 
                    met={passwordValidation.match} 
                    text="Mật khẩu khớp nhau" 
                  />
                </div>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting || !Object.values(passwordValidation).every(Boolean)}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang đặt lại...
                  </>
                ) : (
                  'Đặt lại mật khẩu'
                )}
              </button>
            </div>

            <div className="text-center">
              <Link href="/auth/login" className="font-medium text-green-600 hover:text-green-500">
                Quay lại đăng nhập
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}