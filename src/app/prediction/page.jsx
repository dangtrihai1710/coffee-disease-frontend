// ===================================================================
// File: src/app/prediction/page.jsx - SỬ DỤNG SAFE RESULT DISPLAY
// ===================================================================

'use client';

import React, { useState, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePrediction } from '@/hooks/usePrediction';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import SafeResultDisplay from '@/components/prediction/SafeResultDisplay';
import Link from 'next/link';
import { validateImageFile, UPLOAD_STEPS } from '@/lib/constants/prediction';
import toast from 'react-hot-toast';

const PredictionPage = () => {
  const { user, logout } = useAuth();
  const { 
    uploadImage, 
    loading, 
    error, 
    progress, 
    currentStep,
    clearError
  } = usePrediction();

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [notes, setNotes] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  // ===================================================================
  // FILE HANDLING
  // ===================================================================
  const handleFileSelect = useCallback((file) => {
    try {
      // Validate file
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        toast.error(validation.errors[0]);
        return;
      }

      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      // Clear previous results
      setPredictionResult(null);
      clearError();
      
      console.log('📁 File selected:', file.name, file.size);
    } catch (error) {
      console.error('Error selecting file:', error);
      toast.error('Có lỗi khi chọn file');
    }
  }, [clearError]);

  const handleFileChange = useCallback((e) => {
    try {
      const file = e.target.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    } catch (error) {
      console.error('Error handling file change:', error);
      toast.error('Có lỗi khi xử lý file');
    }
  }, [handleFileSelect]);

  // ===================================================================
  // DRAG & DROP
  // ===================================================================
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    try {
      const files = Array.from(e.dataTransfer.files);
      const imageFile = files.find(file => file.type.startsWith('image/'));
      
      if (imageFile) {
        handleFileSelect(imageFile);
      } else {
        toast.error('Vui lòng chọn file hình ảnh');
      }
    } catch (error) {
      console.error('Error handling drop:', error);
      toast.error('Có lỗi khi xử lý file được thả');
    }
  }, [handleFileSelect]);

  // ===================================================================
  // PREDICTION ANALYSIS
  // ===================================================================
  const handleAnalyze = useCallback(async () => {
    if (!selectedFile) {
      toast.error('Vui lòng chọn file ảnh');
      return;
    }

    try {
      console.log('🚀 Starting prediction analysis...');
      
      const options = {
        notes: notes.trim(),
        includeSymptomAnalysis: false
      };

      // Call the upload/analysis function
      const result = await uploadImage(selectedFile, options);
      
      console.log('✅ Analysis completed:', result);
      
      // Set the result - the hook already transforms it safely
      setPredictionResult(result);
      toast.success('Phân tích thành công!');
      
      // Reset notes
      setNotes('');
      
    } catch (err) {
      console.error('❌ Analysis failed:', err);
      // Error is already set by the hook
      const errorMessage = err.message || 'Phân tích thất bại. Vui lòng thử lại.';
      toast.error(errorMessage);
    }
  }, [selectedFile, notes, uploadImage]);

  // ===================================================================
  // RESET FUNCTION
  // ===================================================================
  const handleReset = useCallback(() => {
    try {
      setSelectedFile(null);
      setPreview(null);
      setPredictionResult(null);
      setNotes('');
      clearError();
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      console.log('🔄 Form reset completed');
    } catch (error) {
      console.error('Error resetting form:', error);
    }
  }, [clearError]);

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

      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Xác nhận đăng xuất</h3>
            <p className="text-gray-600 mb-6">Bạn có chắc chắn muốn đăng xuất không?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  logout();
                  setShowLogoutConfirm(false);
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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
  // PROGRESS STEP LABELS
  // ===================================================================
  const getStepLabel = (step) => {
    switch (step) {
      case UPLOAD_STEPS.PREPARING: return 'Chuẩn bị...';
      case UPLOAD_STEPS.UPLOADING: return 'Đang upload...';
      case UPLOAD_STEPS.PROCESSING: return 'Đang phân tích...';
      case UPLOAD_STEPS.COMPLETED: return 'Hoàn thành';
      case UPLOAD_STEPS.ERROR: return 'Có lỗi xảy ra';
      default: return 'Đang xử lý...';
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  ☕ Phân tích bệnh lá cà phê
                </h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Xin chào, <strong>{user?.fullName || user?.userName}</strong>
                </span>
                <Link 
                  href="/history"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Lịch sử
                </Link>
                <LogoutButton />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* Upload Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <span className="text-2xl mr-3">📁</span>
                <h2 className="text-xl font-semibold text-gray-900">Upload ảnh lá cà phê</h2>
              </div>

              {/* Progress Indicator */}
              {loading && (
                <div className="mb-6">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>{getStepLabel(currentStep)}</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-green-600 to-blue-600 h-3 rounded-full transition-all duration-300 relative overflow-hidden"
                      style={{ width: `${progress}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-red-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h4 className="text-red-800 font-medium mb-1">Có lỗi xảy ra</h4>
                      <p className="text-red-700 text-sm">{error}</p>
                      <button
                        onClick={clearError}
                        className="text-red-600 hover:text-red-800 text-sm underline mt-1"
                      >
                        Đóng thông báo
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Drop Zone */}
              <div
                ref={dropZoneRef}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
                  isDragOver 
                    ? 'border-blue-500 bg-blue-50 scale-102' 
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }`}
              >
                {preview ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <img
                        src={preview}
                        alt="Preview"
                        className="max-w-full max-h-64 mx-auto rounded-lg shadow-sm"
                      />
                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">
                          ✓ Đã chọn
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p className="font-medium">{selectedFile?.name}</p>
                      <p>{(selectedFile?.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReset();
                      }}
                      className="px-4 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      🔄 Chọn ảnh khác
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="mx-auto h-16 w-16 text-gray-400">
                      <svg stroke="currentColor" fill="none" viewBox="0 0 48 48" className="h-full w-full">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className="text-gray-600">
                      <p className="text-lg font-medium">Kéo thả ảnh vào đây</p>
                      <p className="text-sm">hoặc click để chọn file</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      Hỗ trợ: JPG, PNG • Tối đa 10MB
                    </p>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* Additional Options */}
              {selectedFile && (
                <div className="mt-6 space-y-4">
                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ghi chú thêm (tùy chọn)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Mô tả thêm về tình trạng lá cây, vị trí phát hiện, thời gian xuất hiện triệu chứng..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={3}
                      maxLength={500}
                    />
                    <div className="text-xs text-gray-500 mt-1 text-right">
                      {notes.length}/500 ký tự
                    </div>
                  </div>

                  {/* Analyze Button */}
                  <button
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white font-medium py-4 px-6 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transform hover:scale-105 disabled:transform-none"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Đang phân tích...</span>
                      </>
                    ) : (
                      <>
                        <span>✨</span>
                        <span>Phân tích ảnh</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Results Section - Using SafeResultDisplay */}
            <SafeResultDisplay 
              result={predictionResult} 
              onReset={handleReset}
            />
          </div>

          {/* Tips Section */}
          {!predictionResult && (
            <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">💡</span>
                Mẹo để có kết quả phân tích tốt nhất
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="space-y-2">
                  <p>✅ Chụp ảnh trong điều kiện ánh sáng tự nhiên</p>
                  <p>✅ Tập trung vào lá bị bệnh</p>
                  <p>✅ Ảnh rõ nét, không bị mờ</p>
                </div>
                <div className="space-y-2">
                  <p>❌ Tránh chụp trong ánh sáng yếu</p>
                  <p>❌ Không chụp ảnh quá xa</p>
                  <p>❌ Tránh ảnh bị nghiêng hoặc lật ngược</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default PredictionPage;