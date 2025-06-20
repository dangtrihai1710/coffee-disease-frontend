// ===================================================================
// File: src/app/prediction/page.jsx - CẬP NHẬT SỬ DỤNG API THẬT
// ===================================================================

'use client';

import React, { useState, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePrediction } from '@/hooks/usePrediction';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Link from 'next/link';
import { 
  validateImageFile, 
  getDiseaseName, 
  getTreatmentSuggestion,
  formatConfidence,
  getConfidenceLevel,
  getSeverityColor,
  UPLOAD_STEPS
} from '@/lib/constants/prediction';
import toast from 'react-hot-toast';

const PredictionPage = () => {
  const { user, logout } = useAuth();
  const { 
    uploadImage, 
    loading, 
    error, 
    progress, 
    currentStep,
    clearError,
    getLatestPrediction 
  } = usePrediction();

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [symptoms, setSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [notes, setNotes] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  // ===================================================================
  // FILE HANDLING
  // ===================================================================
  const handleFileSelect = useCallback((file) => {
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
  }, [clearError]);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
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
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleFileSelect(imageFile);
    } else {
      toast.error('Vui lòng chọn file hình ảnh');
    }
  }, [handleFileSelect]);

  // ===================================================================
  // PREDICTION
  // ===================================================================
  const handleAnalyze = useCallback(async () => {
    if (!selectedFile) {
      toast.error('Vui lòng chọn file ảnh');
      return;
    }

    try {
      console.log('🚀 Starting prediction...');
      
      const options = {
        symptomIds: selectedSymptoms,
        notes: notes.trim()
      };

      const result = await uploadImage(selectedFile, options);
      
      console.log('✅ Prediction result:', result);
      
      setPredictionResult(result);
      toast.success('Phân tích thành công!');
      
      // Reset form
      setSelectedSymptoms([]);
      setNotes('');
      
    } catch (err) {
      console.error('❌ Prediction failed:', err);
      toast.error(err.message || 'Phân tích thất bại. Vui lòng thử lại.');
    }
  }, [selectedFile, selectedSymptoms, notes, uploadImage]);

  // ===================================================================
  // RESET
  // ===================================================================
  const handleReset = useCallback(() => {
    setSelectedFile(null);
    setPreview(null);
    setPredictionResult(null);
    setSelectedSymptoms([]);
    setNotes('');
    clearError();
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
                onClick={() => {
                  logout();
                  setShowLogoutConfirm(false);
                }}
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
  // PROGRESS COMPONENT
  // ===================================================================
  const ProgressIndicator = () => {
    if (!loading && !currentStep) return null;

    return (
      <div className="bg-white rounded-lg border-2 border-blue-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {currentStep?.label || 'Đang xử lý...'}
          </h3>
          <span className="text-sm text-gray-600">
            {progress}%
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <p className="text-sm text-gray-600">
          {currentStep?.description || 'Vui lòng chờ...'}
        </p>
        
        {/* Steps indicator */}
        <div className="flex justify-between mt-4">
          {Object.values(UPLOAD_STEPS).map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep && step.step <= currentStep.step
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {step.step}
              </div>
              <span className="text-xs text-gray-600 mt-1 text-center max-w-20">
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">🍃</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Phân tích bệnh lá cây cà phê
                </h1>
                <p className="text-sm text-gray-600">
                  Hệ thống AI chẩn đoán bệnh cây trồng
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* User Info */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm font-medium">
                    {user?.fullName?.charAt(0) || user?.email?.charAt(0) || '?'}
                  </span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{user?.fullName || 'User'}</p>
                  <p className="text-xs text-gray-600">{user?.role || 'Người dùng'}</p>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex items-center space-x-2">
                <Link
                  href="/history"
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Lịch sử
                </Link>
                <LogoutButton />
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-6 mb-8 text-white">
          <h2 className="text-2xl font-bold mb-2">
            Chào mừng, {user?.fullName || 'System Administrator'}!
          </h2>
          <p className="text-green-100">
            Upload ảnh lá cà phê để AI phân tích và chẩn đoán bệnh cho bạn
          </p>
        </div>

        {/* Progress Indicator */}
        <ProgressIndicator />

        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-2xl mr-3">📁</span>
            <h3 className="text-xl font-semibold text-gray-900">Upload ảnh lá cà phê</h3>
          </div>

          {/* Drop Zone */}
          <div
            ref={dropZoneRef}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              isDragOver
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            {preview ? (
              <div className="space-y-4">
                <div className="relative max-w-md mx-auto">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    onClick={handleReset}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
                <div className="text-sm text-gray-600">
                  <p className="font-medium">{selectedFile?.name}</p>
                  <p>{selectedFile && (selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl">🍃</span>
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Kéo thả ảnh vào đây hoặc
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    chọn file từ máy tính
                  </button>
                </div>
                <p className="text-sm text-gray-500">
                  Hỗ trợ JPG, PNG. Tối đa 10MB
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
                  placeholder="Mô tả thêm về tình trạng lá cây..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              {/* Analyze Button */}
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white font-medium py-3 px-6 rounded-lg hover:from-green-700 hover:to-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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

        {/* Results Section */}
        {predictionResult && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <span className="text-2xl mr-3">🎯</span>
              <h3 className="text-xl font-semibold text-gray-900">Kết quả phân tích</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Disease Info */}
              <div className="space-y-4">
                <div className="p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">Bệnh được phát hiện</h4>
                    <span className={`px-2 py-1 text-sm rounded-full ${
                      predictionResult.severityLevel ? getSeverityColor(predictionResult.severityLevel) : 'text-gray-600 bg-gray-100'
                    }`}>
                      {predictionResult.severityLevel || 'Trung bình'}
                    </span>
                  </div>
                  <p className="text-lg font-bold text-red-600">
                    {getDiseaseName(predictionResult.diseaseName)}
                  </p>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Độ tin cậy</h4>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full ${
                          predictionResult.confidence >= 0.8 ? 'bg-green-500' :
                          predictionResult.confidence >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${predictionResult.confidence * 100}%` }}
                      />
                    </div>
                    <span className="font-bold text-lg">
                      {formatConfidence(predictionResult.confidence)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Mức độ nghiêm trọng: <span className="font-medium">
                      {predictionResult.severityLevel || 'Trung bình'}
                    </span>
                  </p>
                </div>
              </div>

              {/* Treatment Suggestions */}
              {predictionResult.treatmentSuggestion && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">💡 Gợi ý xử lý</h4>
                  <div className="text-sm text-gray-700 space-y-2">
                    <p>{predictionResult.treatmentSuggestion}</p>
                  </div>
                  <div className="mt-3 text-xs text-gray-500">
                    ⚠️ Đây chỉ là gợi ý từ AI. Hãy tham khảo ý kiến chuyên gia nông nghiệp.
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mt-6">
              <button
                onClick={() => {
                  // Save result to local storage for sharing
                  localStorage.setItem('latestPrediction', JSON.stringify(predictionResult));
                  toast.success('Kết quả đã được lưu!');
                }}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span className="mr-2">💾</span>
                Lưu kết quả
              </button>
              
              <button
                onClick={() => {
                  // Share functionality
                  if (navigator.share) {
                    navigator.share({
                      title: 'Kết quả phân tích bệnh lá cà phê',
                      text: `Bệnh: ${getDiseaseName(predictionResult.diseaseName)}, Độ tin cậy: ${formatConfidence(predictionResult.confidence)}`,
                    });
                  } else {
                    // Fallback copy to clipboard
                    const shareText = `Kết quả phân tích: ${getDiseaseName(predictionResult.diseaseName)} (${formatConfidence(predictionResult.confidence)})`;
                    navigator.clipboard.writeText(shareText);
                    toast.success('Đã copy kết quả!');
                  }
                }}
                className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <span className="mr-2">📋</span>
                Chia sẻ
              </button>
              
              <Link
                href="/history"
                className="flex items-center px-4 py-2 text-green-700 bg-green-100 rounded-lg hover:bg-green-200 transition-colors"
              >
                <span className="mr-2">📚</span>
                Xem lịch sử
              </Link>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <span className="text-red-500 mr-2">⚠️</span>
              <div>
                <h4 className="font-medium text-red-800">Có lỗi xảy ra</h4>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
              <button
                onClick={clearError}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Tips Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <span className="text-2xl mr-3">💡</span>
            <h3 className="text-xl font-semibold text-gray-900">Tips cho kết quả tốt nhất</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 text-sm">📷</span>
              </div>
              <div>
                <div className="font-medium text-gray-900">Chất lượng ảnh tốt</div>
                <div className="text-sm text-gray-600">Ảnh rõ nét, không bị mờ hoặc rung</div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 text-sm">🍃</span>
              </div>
              <div>
                <div className="font-medium text-gray-900">Lá đơn lẻ</div>
                <div className="text-sm text-gray-600">Chụp từng lá riêng biệt, tránh chụp nhiều lá</div>
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

        {/* Model Information */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Sử dụng mô hình AI ResNet50 v1.1 với độ chính xác 87.5%
          </p>
          <p>
            Được huấn luyện trên 50,000+ ảnh lá cà phê từ nhiều vùng miền khác nhau
          </p>
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