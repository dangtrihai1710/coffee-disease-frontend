// ===================================================================
// File: src/app/prediction/page.jsx - CẬP NHẬT VỚI HEADER MỚI
// ===================================================================

'use client';

import React, { useState, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePrediction } from '@/hooks/usePrediction';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import SafeResultDisplay from '@/components/prediction/SafeResultDisplay';
import DiseaseAnalysisHeader from '@/components/layout/DiseaseAnalysisHeader'; // ✅ IMPORT HEADER MỚI
import Link from 'next/link';
import { validateImageFile, UPLOAD_STEPS } from '@/lib/constants/prediction';
import predictionService from '@/services/predictionService';
import toast from 'react-hot-toast';

// Simple Icons
const Upload = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const X = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const CheckCircle = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const AlertTriangle = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
);

const PredictionPage = () => {
  const { uploadImage, loading, error, progress, currentStep, clearError } = usePrediction();

  // UI State
  const [mode, setMode] = useState('single'); // 'single' | 'batch'
  const [isDragOver, setIsDragOver] = useState(false);

  // Single Mode State
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [notes, setNotes] = useState('');
  const [predictionResult, setPredictionResult] = useState(null);

  // Batch Mode State
  const [selectedImages, setSelectedImages] = useState([]);
  const [batchResults, setBatchResults] = useState(null);
  const [batchProgress, setBatchProgress] = useState(0);
  const [batchAnalyzing, setBatchAnalyzing] = useState(false);

  const fileInputRef = useRef(null);

  // ===================================================================
  // UTILITY FUNCTIONS
  // ===================================================================
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getDiseaseDisplayName = (diseaseName) => {
    const diseaseMap = {
      'Healthy': 'Lá khỏe mạnh',
      'Rust': 'Bệnh rỉ sắt', 
      'Cercospora': 'Bệnh đốm nâu',
      'Phoma': 'Bệnh đốm đen',
      'Miner': 'Sâu đục lá'
    };
    return diseaseMap[diseaseName] || diseaseName;
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'nhẹ': return 'text-green-600 bg-green-50';
      case 'trung bình': return 'text-yellow-600 bg-yellow-50';
      case 'nặng': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getConfidenceColor = (confidence) => {
    const percent = confidence * 100;
    if (percent >= 80) return 'text-green-600 bg-green-50';
    if (percent >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  // ===================================================================
  // FILE HANDLING
  // ===================================================================
  const handleFileSelect = useCallback((files) => {
    try {
      const fileArray = Array.from(files);
      
      if (mode === 'single') {
        const file = fileArray[0];
        if (!file) return;

        const validation = validateImageFile(file);
        if (!validation.isValid) {
          toast.error(validation.errors[0]);
          return;
        }

        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target.result);
        reader.readAsDataURL(file);
        setPredictionResult(null);
        clearError();
      } else {
        // Batch mode
        const validImages = [];
        const errors = [];

        fileArray.forEach(file => {
          const validation = validateImageFile(file);
          if (validation.isValid) {
            validImages.push({
              file,
              id: Math.random().toString(36).substr(2, 9),
              preview: URL.createObjectURL(file),
              name: file.name,
              size: file.size
            });
          } else {
            errors.push(`${file.name}: ${validation.errors.join(', ')}`);
          }
        });

        if (errors.length > 0) {
          toast.error(`Một số file không hợp lệ:\n${errors.join('\n')}`);
        }

        setSelectedImages(prev => [...prev, ...validImages].slice(0, 10));
        setBatchResults(null);
      }
    } catch (error) {
      console.error('Error selecting files:', error);
      toast.error('Có lỗi khi chọn file');
    }
  }, [mode, clearError]);

  const handleFileChange = useCallback((e) => {
    const files = e.target.files;
    if (files?.length > 0) {
      handleFileSelect(files);
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
      const imageFiles = files.filter(file => file.type.startsWith('image/'));
      
      if (imageFiles.length > 0) {
        handleFileSelect(imageFiles);
      } else {
        toast.error('Vui lòng chọn file hình ảnh');
      }
    } catch (error) {
      console.error('Error handling drop:', error);
      toast.error('Có lỗi khi xử lý file được thả');
    }
  }, [handleFileSelect]);

  // ===================================================================
  // SINGLE ANALYSIS
  // ===================================================================
  const handleSingleAnalyze = useCallback(async () => {
    if (!selectedFile) {
      toast.error('Vui lòng chọn file ảnh');
      return;
    }

    try {
      const options = { notes: notes.trim(), includeSymptomAnalysis: false };
      const result = await uploadImage(selectedFile, options);
      setPredictionResult(result);
      toast.success('Phân tích thành công!');
      setNotes('');
    } catch (err) {
      console.error('Analysis failed:', err);
      toast.error(err.message || 'Phân tích thất bại. Vui lòng thử lại.');
    }
  }, [selectedFile, notes, uploadImage]);

  // ===================================================================
  // BATCH ANALYSIS
  // ===================================================================
  const handleBatchAnalyze = useCallback(async () => {
    if (selectedImages.length === 0) {
      toast.error('Vui lòng chọn ít nhất 1 ảnh');
      return;
    }

    setBatchAnalyzing(true);
    setBatchProgress(0);
    setBatchResults(null);

    try {
      const images = selectedImages.map(img => img.file);
      
      const result = await predictionService.analyzeBatch(
        images, 
        {}, 
        (progressData) => {
          setBatchProgress(progressData.loaded / progressData.total * 100);
        }
      );

      const formattedResult = predictionService.formatBatchResult(result);
      setBatchResults(formattedResult);
      toast.success('Phân tích batch thành công!');
      
    } catch (err) {
      console.error('Batch analysis error:', err);
      toast.error(err.message || 'Có lỗi xảy ra khi phân tích ảnh');
    } finally {
      setBatchAnalyzing(false);
      setBatchProgress(0);
    }
  }, [selectedImages]);

  // ===================================================================
  // RESET FUNCTIONS
  // ===================================================================
  const handleReset = useCallback(() => {
    setSelectedFile(null);
    setPreview(null);
    setPredictionResult(null);
    setNotes('');
    clearError();
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [clearError]);

  const handleBatchReset = useCallback(() => {
    selectedImages.forEach(img => URL.revokeObjectURL(img.preview));
    setSelectedImages([]);
    setBatchResults(null);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [selectedImages]);

  const removeImage = useCallback((imageId) => {
    setSelectedImages(prev => {
      const updated = prev.filter(img => img.id !== imageId);
      const removed = prev.find(img => img.id === imageId);
      if (removed) {
        URL.revokeObjectURL(removed.preview);
      }
      return updated;
    });
  }, []);

  // ===================================================================
  // MODE SWITCHING
  // ===================================================================
  const switchMode = useCallback((newMode) => {
    if (newMode === mode) return;
    
    // Reset current mode state
    if (mode === 'single') {
      handleReset();
    } else {
      handleBatchReset();
    }
    
    setMode(newMode);
    clearError();
  }, [mode, handleReset, handleBatchReset, clearError]);

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
        {/* ✅ SỬ DỤNG HEADER MỚI */}
        <DiseaseAnalysisHeader />

        {/* User Welcome Info - simplified */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex justify-center items-center">
              <div className="text-center">
                <h2 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  ☕ Phân tích bệnh lá cà phê với AI
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Hệ thống phân tích thông minh giúp phát hiện và điều trị bệnh cây cà phê
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Mode Selector */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Chọn chế độ phân tích</h2>
            <div className="flex gap-4">
              <button
                onClick={() => switchMode('single')}
                className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                  mode === 'single' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">🔍</div>
                  <div className="font-semibold">Phân tích đơn</div>
                  <div className="text-sm text-gray-600">Phân tích 1 ảnh duy nhất</div>
                </div>
              </button>
              
              <button
                onClick={() => switchMode('batch')}
                className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                  mode === 'batch' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">📚</div>
                  <div className="font-semibold">Phân tích nhiều ảnh</div>
                  <div className="text-sm text-gray-600">Phân tích tối đa 10 ảnh cùng lúc</div>
                </div>
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* Upload Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <span className="text-2xl mr-3">📁</span>
                <h2 className="text-xl font-semibold text-gray-900">
                  {mode === 'single' ? 'Upload ảnh lá cà phê' : `Upload ảnh (${selectedImages.length}/10)`}
                </h2>
              </div>

              {/* Progress Indicator */}
              {(loading || batchAnalyzing) && (
                <div className="mb-6">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>{mode === 'single' ? getStepLabel(currentStep) : `Đang phân tích... ${Math.round(batchProgress)}%`}</span>
                    <span>{mode === 'single' ? progress : batchProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-green-600 to-blue-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${mode === 'single' ? progress : batchProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-red-600 mr-2 mt-0.5" />
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
                {mode === 'single' && preview ? (
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
                ) : mode === 'batch' && selectedImages.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-2">
                      {selectedImages.slice(0, 6).map((image) => (
                        <div key={image.id} className="relative group">
                          <div className="aspect-square rounded-lg overflow-hidden border">
                            <img
                              src={image.preview}
                              alt={image.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeImage(image.id);
                            }}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      {selectedImages.length > 6 && (
                        <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center border">
                          <span className="text-sm text-gray-600">+{selectedImages.length - 6}</span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBatchReset();
                      }}
                      className="px-4 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      🔄 Xóa tất cả
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Upload className="mx-auto h-16 w-16 text-gray-400" />
                    <div className="text-gray-600">
                      <p className="text-lg font-medium">
                        {mode === 'single' ? 'Kéo thả ảnh vào đây' : 'Kéo thả nhiều ảnh vào đây'}
                      </p>
                      <p className="text-sm">hoặc click để chọn file</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      Hỗ trợ: JPG, PNG • Tối đa 10MB{mode === 'batch' ? ' • Tối đa 10 ảnh' : ''}
                    </p>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple={mode === 'batch'}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* Additional Options for Single Mode */}
              {mode === 'single' && selectedFile && (
                <div className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ghi chú thêm (tùy chọn)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Mô tả thêm về tình trạng lá cây..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={3}
                      maxLength={500}
                    />
                    <div className="text-xs text-gray-500 mt-1 text-right">
                      {notes.length}/500 ký tự
                    </div>
                  </div>

                  <button
                    onClick={handleSingleAnalyze}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white font-medium py-4 px-6 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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

              {/* Analyze Button for Batch Mode */}
              {mode === 'batch' && selectedImages.length > 0 && (
                <div className="mt-6">
                  <button
                    onClick={handleBatchAnalyze}
                    disabled={batchAnalyzing}
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white font-medium py-4 px-6 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {batchAnalyzing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Đang phân tích {selectedImages.length} ảnh...</span>
                      </>
                    ) : (
                      <>
                        <span>📚</span>
                        <span>Phân tích {selectedImages.length} ảnh</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Results Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <span className="text-2xl mr-3">📊</span>
                <h2 className="text-xl font-semibold text-gray-900">Kết quả phân tích</h2>
              </div>

              {/* Single Mode Results */}
              {mode === 'single' && predictionResult && (
                <SafeResultDisplay 
                  result={predictionResult} 
                  onReset={handleReset}
                />
              )}

              {/* Batch Mode Results */}
              {mode === 'batch' && batchResults && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Tổng:</span> {batchResults.totalImages} ảnh • 
                      <span className="font-medium"> Thành công:</span> {batchResults.processedImages} • 
                      <span className="font-medium"> Thời gian:</span> {Math.round(batchResults.totalProcessingTimeMs / 1000)}s
                    </div>
                    <button
                      onClick={handleBatchReset}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Phân tích batch mới
                    </button>
                  </div>

                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {batchResults.results?.map((result, index) => (
                      <div key={result.id || index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex gap-4">
                          {/* Image */}
                          <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200 flex-shrink-0 bg-gray-100">
                            {selectedImages[index] ? (
                              <img
                                src={selectedImages[index].preview}
                                alt="Analyzed"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                              </div>
                            )}
                          </div>

                          {/* Result Info */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-semibold text-lg text-gray-900">
                                  {getDiseaseDisplayName(result.diseaseName)}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  {selectedImages[index]?.name || `Ảnh ${index + 1}`}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(result.confidence)}`}>
                                  {Math.round(result.confidence * 100)}%
                                </span>
                              </div>
                            </div>

                            <div className="space-y-1">
                              {result.severityLevel && (
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-600">Mức độ:</span>
                                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(result.severityLevel)}`}>
                                    {result.severityLevel}
                                  </span>
                                </div>
                              )}
                              
                              {result.treatmentSuggestion && (
                                <div className="text-xs">
                                  <span className="font-medium text-gray-700">Điều trị: </span>
                                  <span className="text-gray-600">{result.treatmentSuggestion}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Errors */}
                  {batchResults.errors?.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h3 className="font-medium text-red-800 mb-2">Lỗi xử lý:</h3>
                      <ul className="text-red-700 space-y-1 text-sm">
                        {batchResults.errors.map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Empty State */}
              {!predictionResult && !batchResults && (
                <div className="text-center py-12">
                  <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
                    <svg fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {mode === 'single' ? 'Chưa có kết quả phân tích' : 'Chưa có kết quả phân tích batch'}
                  </h3>
                  <p className="text-gray-600">
                    {mode === 'single' 
                      ? 'Upload ảnh lá cà phê để bắt đầu phân tích' 
                      : 'Upload nhiều ảnh lá cà phê để phân tích hàng loạt'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Tips Section */}
          {!predictionResult && !batchResults && (
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
                  {mode === 'batch' && <p>✅ Đặt tên file có ý nghĩa để dễ theo dõi</p>}
                </div>
                <div className="space-y-2">
                  <p>❌ Tránh chụp trong ánh sáng yếu</p>
                  <p>❌ Không chụp ảnh quá xa</p>
                  <p>❌ Tránh ảnh bị nghiêng hoặc lật ngược</p>
                  {mode === 'batch' && <p>❌ Không upload ảnh trùng lặp</p>}
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