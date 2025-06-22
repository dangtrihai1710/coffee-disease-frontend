// ===================================================================
// File: src/app/batch-analysis/page.jsx - Trang Phân Tích Nhiều Ảnh
// ===================================================================
"use client";

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import predictionService from '@/services/predictionService';

// Simple icon components
const ArrowLeft = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

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

const Eye = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const Clock = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const History = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const BatchAnalysisPage = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  // Handle file selection
  const handleFileSelect = useCallback((event) => {
    const files = Array.from(event.target.files);
    const validImages = [];
    const errors = [];

    files.forEach(file => {
      const validation = predictionService.validateImageFile(file);
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
      setError(`Một số file không hợp lệ:\n${errors.join('\n')}`);
    } else {
      setError('');
    }

    setSelectedImages(prev => [...prev, ...validImages].slice(0, 10)); // Giới hạn 10 ảnh
  }, []);

  // Remove image
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

  // Analyze batch
  const analyzeBatch = async () => {
    if (selectedImages.length === 0) {
      setError('Vui lòng chọn ít nhất 1 ảnh');
      return;
    }

    setAnalyzing(true);
    setError('');
    setProgress(0);
    setResults(null);

    try {
      const images = selectedImages.map(img => img.file);
      
      const result = await predictionService.analyzeBatch(
        images, 
        {}, 
        (progressData) => {
          setProgress(progressData.loaded / progressData.total * 100);
        }
      );

      const formattedResult = predictionService.formatBatchResult(result);
      setResults(formattedResult);
      
    } catch (err) {
      console.error('Batch analysis error:', err);
      setError(err.message || 'Có lỗi xảy ra khi phân tích ảnh');
    } finally {
      setAnalyzing(false);
      setProgress(0);
    }
  };

  // Clear all
  const clearAll = () => {
    selectedImages.forEach(img => URL.revokeObjectURL(img.preview));
    setSelectedImages([]);
    setResults(null);
    setError('');
  };

  // Reset for new batch
  const startNewBatch = () => {
    clearAll();
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get disease display name
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

  // Get severity color
  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'nhẹ': return 'text-green-600 bg-green-50';
      case 'trung bình': return 'text-yellow-600 bg-yellow-50';
      case 'nặng': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Get confidence color
  const getConfidenceColor = (confidence) => {
    const percent = confidence * 100;
    if (percent >= 80) return 'text-green-600 bg-green-50';
    if (percent >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Back Button */}
              <Link 
                href="/prediction"
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại
              </Link>
              
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Phân Tích Nhiều Ảnh
                </h1>
                <p className="text-gray-600">
                  Tải lên và phân tích nhiều ảnh lá cà phê cùng lúc để phát hiện bệnh nhanh chóng
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* History Button */}
              <Link 
                href="/history"
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
              >
                <History className="w-4 h-4 mr-2" />
                Lịch sử
              </Link>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Chọn Ảnh ({selectedImages.length}/10)
            </h2>
            {selectedImages.length > 0 && (
              <button
                onClick={clearAll}
                className="text-red-600 hover:text-red-800 font-medium"
              >
                Xóa tất cả
              </button>
            )}
          </div>

          {/* File Input */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors">
            <input
              type="file"
              multiple
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleFileSelect}
              className="hidden"
              id="batch-file-input"
              disabled={analyzing || selectedImages.length >= 10}
            />
            <label 
              htmlFor="batch-file-input" 
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">
                Chọn nhiều ảnh lá cà phê
              </p>
              <p className="text-sm text-gray-500">
                Hỗ trợ JPG, PNG • Tối đa 10MB/ảnh • Tối đa 10 ảnh
              </p>
            </label>
          </div>

          {/* Selected Images Grid */}
          {selectedImages.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium text-gray-900 mb-3">Ảnh đã chọn:</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {selectedImages.map((image) => (
                  <div key={image.id} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                      <img
                        src={image.preview}
                        alt={image.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      onClick={() => removeImage(image.id)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="mt-1 text-xs text-gray-500 truncate">
                      {image.name}
                    </div>
                    <div className="text-xs text-gray-400">
                      {formatFileSize(image.size)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analyze Button */}
          {selectedImages.length > 0 && !results && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={analyzeBatch}
                disabled={analyzing}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                {analyzing ? (
                  <>
                    <Clock className="w-5 h-5 animate-spin" />
                    Đang phân tích... {Math.round(progress)}%
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Phân tích {selectedImages.length} ảnh
                  </>
                )}
              </button>
            </div>
          )}

          {/* Progress Bar */}
          {analyzing && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 rounded-full h-2 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-center text-sm text-gray-600 mt-2">
                Đang xử lý {selectedImages.length} ảnh...
              </p>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-red-800">Có lỗi xảy ra</h3>
                <p className="text-red-700 whitespace-pre-line">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {results && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Kết Quả Phân Tích
              </h2>
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Tổng:</span> {results.totalImages} ảnh • 
                  <span className="font-medium"> Thành công:</span> {results.processedImages} • 
                  <span className="font-medium"> Thời gian:</span> {Math.round(results.totalProcessingTimeMs / 1000)}s
                </div>
                <button
                  onClick={startNewBatch}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Phân tích batch mới
                </button>
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid gap-6">
              {results.results?.map((result, index) => (
                <div key={result.id || index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex gap-4">
                    {/* Image */}
                    <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-200 flex-shrink-0 bg-gray-100">
                      {selectedImages[index] ? (
                        <img
                          src={selectedImages[index].preview}
                          alt="Analyzed"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Eye className="w-6 h-6 text-gray-400" />
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
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor(result.confidence)}`}>
                            {Math.round(result.confidence * 100)}% tin cậy
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {result.severityLevel && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Mức độ:</span>
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(result.severityLevel)}`}>
                              {result.severityLevel}
                            </span>
                          </div>
                        )}
                        
                        {result.treatmentSuggestion && (
                          <div>
                            <span className="font-medium text-gray-700">Điều trị: </span>
                            <span className="text-gray-600">{result.treatmentSuggestion}</span>
                          </div>
                        )}

                        {result.detectedSymptoms?.length > 0 && (
                          <div>
                            <span className="font-medium text-gray-700">Triệu chứng: </span>
                            <span className="text-gray-600">
                              {result.detectedSymptoms.join(', ')}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          {result.modelVersion && (
                            <span>Model: {result.modelVersion}</span>
                          )}
                          {result.processingTimeMs && (
                            <span>Thời gian: {result.processingTimeMs}ms</span>
                          )}
                          {result.isRealAI !== undefined && (
                            <span className={result.isRealAI ? 'text-green-600' : 'text-orange-600'}>
                              {result.isRealAI ? 'AI thực' : 'Demo'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Errors */}
            {results.errors?.length > 0 && (
              <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-medium text-red-800 mb-2">Lỗi xử lý:</h3>
                <ul className="text-red-700 space-y-1">
                  {results.errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BatchAnalysisPage;