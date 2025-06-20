// File: src/components/ui/Input.jsx - COMPLETE INPUT COMPONENT
'use client';

import { forwardRef, useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

const Input = forwardRef(({
  type = 'text',
  className = '',
  error = false,
  helperText = '',
  showPasswordToggle = false,
  disabled = false,
  leftIcon,
  rightIcon,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  
  // ✅ Determine actual input type
  const actualType = showPasswordToggle 
    ? (showPassword ? 'text' : 'password')
    : type;

  // ✅ Toggle password visibility
  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPassword(prev => !prev);
  };

  // ✅ Base input classes
  const baseClasses = clsx(
    'appearance-none relative block w-full px-3 py-2',
    'border border-gray-300 placeholder-gray-500 text-gray-900',
    'rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500',
    'sm:text-sm transition-colors',
    {
      'border-red-300 focus:border-red-500 focus:ring-red-500': error,
      'bg-gray-50 cursor-not-allowed': disabled,
      'pr-10': showPasswordToggle || rightIcon,
      'pl-10': leftIcon
    },
    className
  );

  return (
    <div className="w-full">
      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {leftIcon}
          </div>
        )}

        {/* Input Element */}
        <input
          ref={ref}
          type={actualType}
          className={baseClasses}
          disabled={disabled}
          {...props}
        />

        {/* Right Icon or Password Toggle */}
        {(showPasswordToggle || rightIcon) && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {showPasswordToggle ? (
              <button
                type="button"
                className="hover:text-gray-600 focus:outline-none disabled:opacity-50"
                onClick={togglePasswordVisibility}
                tabIndex={-1}
                disabled={disabled}
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
            ) : (
              rightIcon
            )}
          </div>
        )}
      </div>

      {/* Helper Text or Error Message */}
      {helperText && (
        <p className={clsx(
          'mt-1 text-sm',
          error ? 'text-red-600' : 'text-gray-500'
        )}>
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;