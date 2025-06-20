// ===================================================================
// File: src/app/prediction/page.jsx - TRANG CHÍNH CHO MỌI USER
// ===================================================================

'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Link from 'next/link';

const PredictionPage = () => {
  const { user, logout } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // ===================================================================
  // LOGOUT COMPONENT
  // ===================================================================
  const LogoutButton = () => (
    <>
      <button
        onClick={() => setShowLogoutConfirm(true)}
        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Đăng xuất
      </button>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Xác nhận đăng xuất</h3>
                <p className="text-sm text-gray-600">Bạn có chắc muốn đăng xuất?</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={logout}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  // ===================================================================
  // FILE UPLOAD HANDLERS
  // ===================================================================
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      // Reset previous result
      setPredictionResult(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    
    try {
      // Simulate API call (replace with real API)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock result (replace with real API response)
      setPredictionResult({
        diseaseName: 'Rust (Rỉ sắt)',
        confidence: 0.87,
        severityLevel: 'Trung bình',
        treatmentSuggestion: 'Sử dụng fungicide chứa copper hydroxide. Cải thiện thông gió và giảm độ ẩm.'
      });
      
      console.log('✅ Prediction successful');
    } catch (error) {
      console.error('❌ Upload error:', error);
      alert('Có lỗi xảy ra khi phân tích ảnh. Vui lòng thử lại.');
    } finally {
      setIsUploading(false);
    }
  };

  // ===================================================================
  // MAIN COMPONENT
  // ===================================================================
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                🌿 Phân tích bệnh lá cà phê
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* User Info */}
              <div className="flex items-center space-x-3">
                <div className="text-sm">
                  <div className="text-gray-900 font-medium">{user?.fullName || user?.email}</div>
                  <div className="text-gray-500 text-xs">
                    {user?.role === 'Admin' && '👑 Admin'}
                    {user?.role === 'Expert' && '🔬 Expert'}
                    {user?.role === 'User' && '👤 User'}
                  </div>
                </div>
                
                {/* Dashboard Link for Admin/Expert */}
                {user?.role && ['Admin', 'Expert'].includes(user.role) && (
                  <Link
                    href="/dashboard"
                    className="flex items-center px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H9a2 2 0 01-2-2z" />
                    </svg>
                    Dashboard
                  </Link>
                )}
                
                <LogoutButton />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Welcome Message */}
        <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-lg p-6 mb-8 text-white">
          <h2 className="text-2xl font-bold mb-2">
            Chào mừng, {user?.fullName || user?.email?.split('@')[0]}!
          </h2>
          <p className="text-green-100">
            Upload ảnh lá cà phê để AI phân tích và chẩn đoán bệnh cho bạn
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📤 Upload ảnh lá cà phê</h3>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors">
            {preview ? (
              <div className="space-y-4">
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="max-w-full max-h-64 mx-auto rounded-lg shadow-sm"
                />
                <div className="text-sm text-gray-600">
                  📁 {selectedFile?.name} ({(selectedFile?.size / 1024 / 1024).toFixed(2)} MB)
                </div>
                <div className="flex justify-center space-x-3">
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setPreview(null);
                      setPredictionResult(null);
                    }}
                    className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Chọn ảnh khác
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={isUploading}
                    className={`px-6 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isUploading
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {isUploading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang phân tích...
                      </span>
                    ) : (
                      '🔍 Phân tích ảnh'
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="text-lg text-gray-600 mb-2">Kéo thả ảnh hoặc click để chọn</div>
                <div className="text-sm text-gray-500 mb-4">
                  Hỗ trợ: JPG, PNG (tối đa 10MB)
                </div>
                <input
                  type="file"
                  onChange={handleFileSelect}
                  accept="image/*"
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 cursor-pointer transition-colors"
                >
                  📁 Chọn ảnh lá cà phê
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Prediction Result */}
        {predictionResult && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Kết quả phân tích</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-red-50 rounded-lg">
                  <div className="text-sm text-red-600 font-medium">Bệnh được phát hiện</div>
                  <div className="text-xl font-bold text-red-800">{predictionResult.diseaseName}</div>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-600 font-medium">Độ tin cậy</div>
                  <div className="text-xl font-bold text-blue-800">
                    {(predictionResult.confidence * 100).toFixed(1)}%
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                        style={{width: `${predictionResult.confidence * 100}%`}}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="text-sm text-yellow-600 font-medium">Mức độ nghiêm trọng</div>
                  <div className="text-xl font-bold text-yellow-800">{predictionResult.severityLevel}</div>
                </div>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-sm text-green-600 font-medium mb-2">💡 Gợi ý xử lý</div>
                <div className="text-green-800">{predictionResult.treatmentSuggestion}</div>
                
                <div className="mt-4 pt-4 border-t border-green-200">
                  <div className="text-xs text-green-600">
                    ⚠️ Đây chỉ là gợi ý từ AI. Hãy tham khảo ý kiến chuyên gia nông nghiệp.
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                💾 Lưu kết quả
              </button>
              <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm">
                📤 Chia sẻ
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                📋 Xem lịch sử
              </button>
            </div>
          </div>
        )}

        {/* Quick Tips */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Mẹo để có kết quả tốt nhất</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 text-sm">📸</span>
              </div>
              <div>
                <div className="font-medium text-gray-900">Chụp ảnh rõ nét</div>
                <div className="text-sm text-gray-600">Đảm bảo ảnh có độ phân giải cao và ánh sáng đủ</div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 text-sm">🍃</span>
              </div>
              <div>
                <div className="font-medium text-gray-900">Tập trung vào lá</div>
                <div className="text-sm text-gray-600">Chụp cận cảnh lá bị bệnh, tránh nhiều nền</div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-yellow-600 text-sm">☀️</span>
              </div>
              <div>
                <div className="font-medium text-gray-900">Ánh sáng tự nhiên</div>
                <div className="text-sm text-gray-600">Chụp ngoài trời hoặc gần cửa sổ</div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 text-sm">📏</span>
              </div>
              <div>
                <div className="font-medium text-gray-900">Kích thước phù hợp</div>
                <div className="text-sm text-gray-600">File dưới 10MB, định dạng JPG hoặc PNG</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// ===================================================================
// EXPORT WITH PROTECTION
// ===================================================================
export default function PredictionPageWithAuth() {
  return (
    <ProtectedRoute requireAuth={true}>
      <PredictionPage />
    </ProtectedRoute>
  );
}