// File: src/components/debug/ConnectionDebug.jsx
'use client';

import { useState } from 'react';
import { authService } from '@/services/authService';
import { API_BASE_URL } from '@/lib/constants';

export default function ConnectionDebug() {
  const [testResult, setTestResult] = useState(null);
  const [isTesting, setIsTesting] = useState(false);

  const testConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      const result = await authService.testConnection();
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        error: error.message,
        suggestion: 'Kiểm tra lại cấu hình backend'
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-yellow-400">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        🔧 Debug Kết Nối API
      </h3>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600">
            <strong>API URL:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{API_BASE_URL}</code>
          </p>
        </div>

        <button
          onClick={testConnection}
          disabled={isTestin }
          className={`px-4 py-2 rounded-lg font-medium ${
            isTestin 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isTestin  ? 'Đang kiểm tra...' : 'Test Kết Nối'}
        </button>

        {testResult && (
          <div className={`p-4 rounded-lg ${
            testResult.success 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-lg ${testResult.success ? 'text-green-600' : 'text-red-600'}`}>
                {testResult.success ? '✅' : '❌'}
              </span>
              <span className={`font-medium ${testResult.success ? 'text-green-800' : 'text-red-800'}`}>
                {testResult.success ? 'Kết nối thành công!' : 'Kết nối thất bại!'}
              </span>
            </div>
            
            {testResult.error && (
              <div className="text-red-700 text-sm mb-2">
                <strong>Lỗi:</strong> {testResult.error}
              </div>
            )}
            
            {testResult.suggestion && (
              <div className="text-orange-700 text-sm">
                <strong>Gợi ý:</strong> {testResult.suggestion}
              </div>
            )}
            
            {testResult.data && (
              <div className="text-green-700 text-sm">
                <strong>Dữ liệu:</strong> <code className="bg-green-100 px-1 rounded">{JSON.stringify(testResult.data)}</code>
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
          <strong>Các bước kiểm tra:</strong>
          <ol className="list-decimal list-inside mt-2 space-y-1">
            <li>Đảm bảo ASP.NET Core backend đang chạy</li>
            <li>Kiểm tra port trong .env.local (mặc định: 7140)</li>
            <li>Kiểm tra CORS settings trong Program.cs</li>
            <li>Kiểm tra firewall/antivirus blocking</li>
            <li>Thử chuyển từ HTTPS sang HTTP cho development</li>
          </ol>
        </div>
      </div>
    </div>
  );
}