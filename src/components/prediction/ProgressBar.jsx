// File: src/components/prediction/ProgressBar.jsx
'use client';

import { ClockIcon } from '@heroicons/react/24/outline';

const ProgressBar = ({ progress, isVisible, message = "Đang xử lý..." }) => {
  if (!isVisible) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-3">
        <ClockIcon className="h-5 w-5 text-blue-600" />
        <span className="text-sm font-medium text-gray-700">
          {message} {progress}%
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        >
          <div className="h-full bg-white/20 animate-pulse"></div>
        </div>
      </div>

      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>Bắt đầu</span>
        <span>Hoàn thành</span>
      </div>
    </div>
  );
};

export default ProgressBar;