"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
// Import predictionService từ đường dẫn đúng
import predictionService from '@/services/predictionService';

// Simple icon components
const ArrowLeft = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const Camera = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const Clock = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Search = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const ChevronLeft = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRight = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const Eye = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const AlertCircle = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [diseaseFilter, setDiseaseFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Danh sách bệnh để filter
  const diseaseOptions = [
    { value: '', label: 'Tất cả bệnh' },
    { value: 'Healthy', label: 'Lá khỏe mạnh' },
    { value: 'Rust', label: 'Bệnh rỉ sắt' },
    { value: 'Cercospora', label: 'Bệnh đốm nâu' },
    { value: 'Phoma', label: 'Bệnh đốm đen' },
    { value: 'Miner', label: 'Sâu đục lá' }
  ];

  // Load lịch sử
  const loadHistory = useCallback(async (page = 1, reset = false) => {
    try {
      setLoading(true);
      setError('');

      const params = {
        pageNumber: page,
        pageSize: pageSize,
        ...(diseaseFilter && { diseaseFilter })
      };

      // Sử dụng API thật từ backend
      const response = await predictionService.getHistory(params);
      
      if (response && response.data) {
        if (reset) {
          setHistory(response.data);
        } else {
          setHistory(prev => page === 1 ? response.data : [...prev, ...response.data]);
        }
        
        setTotalPages(response.totalPages || 1);
        setTotalItems(response.totalItems || response.data.length);
        setCurrentPage(page);
      }
      
    } catch (err) {
      console.error('Load history error:', err);
      setError(err.message || 'Không thể tải lịch sử phân tích');
    } finally {
      setLoading(false);
    }
  }, [pageSize, diseaseFilter]);

  // Effect để load dữ liệu khi component mount hoặc filter thay đổi
  useEffect(() => {
    loadHistory(1, true);
  }, [loadHistory]);

  // Handle filter change
  const handleFilterChange = (newFilter) => {
    setDiseaseFilter(newFilter);
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && !loading) {
      loadHistory(newPage, true);
    }
  };

  // Format date with Vietnam timezone
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      
      // Nếu database lưu UTC, convert sang Vietnam time (UTC+7)
      const vietnamTime = new Date(date.getTime() + (7 * 60 * 60 * 1000));
      
      return vietnamTime.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Ho_Chi_Minh' // ✅ Force Vietnam timezone
      });
    } catch {
      return 'N/A';
    }
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

  // Get confidence color
  const getConfidenceColor = (confidence) => {
    const percent = confidence * 100;
    if (percent >= 80) return 'text-green-600 bg-green-50';
    if (percent >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Back to Prediction Button */}
              <Link 
                href="/prediction"
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại
              </Link>
              
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Lịch Sử Phân Tích
                </h1>
                <p className="text-gray-600">
                  Xem lại các kết quả phân tích bệnh lá cà phê đã thực hiện
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-500">
                Tổng cộng: {totalItems} kết quả
              </div>
              
              {/* New Analysis Button */}
              <Link 
                href="/prediction"
                className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200"
              >
                <Camera className="w-4 h-4 mr-2" />
                Phân tích mới
              </Link>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Disease Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lọc theo bệnh
              </label>
              <select
                value={diseaseFilter}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black"
              >
                {diseaseOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Search (UI only - backend chưa hỗ trợ) */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tìm kiếm (sắp có)
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên file..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
                  disabled
                />
                <Search className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-red-800">Có lỗi xảy ra</h3>
                <p className="text-red-700">{error}</p>
                <button
                  onClick={() => loadHistory(1, true)}
                  className="mt-2 text-red-600 hover:text-red-800 font-medium"
                >
                  Thử lại
                </button>
              </div>
            </div>
          </div>
        )}

        {/* History List */}
        <div className="bg-white rounded-lg shadow-sm">
          {loading && history.length === 0 ? (
            // Initial loading
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải lịch sử...</p>
            </div>
          ) : history.length === 0 ? (
            // No data
            <div className="p-12 text-center">
              <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Chưa có lịch sử phân tích
              </h3>
              <p className="text-gray-600 mb-6">
                Hãy tải lên ảnh lá cà phê để bắt đầu phân tích
              </p>
              <Link 
                href="/prediction"
                className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200"
              >
                <Camera className="w-5 h-5 mr-2" />
                Bắt đầu phân tích
              </Link>
            </div>
          ) : (
            <>
              {/* History Items */}
              <div className="divide-y divide-gray-200">
                {history.map((item, index) => (
                  <div key={item.id || index} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex gap-4">
                      {/* Image Thumbnail */}
                      <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200 flex-shrink-0 bg-gray-100">
                        {item.imagePath ? (
                          <img
                            src={item.imagePath}
                            alt="Analyzed leaf"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <Eye className="w-6 h-6 text-gray-400" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900 mb-1">
                              {getDiseaseDisplayName(item.diseaseName)}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {formatDate(item.predictionDate)}
                            </p>
                          </div>

                          {/* Confidence Badge */}
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor(item.confidence)}`}>
                            {Math.round((item.finalConfidence || item.confidence) * 100)}% tin cậy
                          </span>
                        </div>

                        {/* Details */}
                        <div className="space-y-2">
                          {/* Severity Level */}
                          {item.severityLevel && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">Mức độ:</span>
                              <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getSeverityColor(item.severityLevel)}`}>
                                {item.severityLevel}
                              </span>
                            </div>
                          )}

                          {/* Treatment Suggestion */}
                          {item.treatmentSuggestion && (
                            <div>
                              <span className="text-sm font-medium text-gray-700">Điều trị: </span>
                              <span className="text-sm text-gray-600">{item.treatmentSuggestion}</span>
                            </div>
                          )}

                          {/* Detected Symptoms */}
                          {item.detectedSymptoms?.length > 0 && (
                            <div>
                              <span className="text-sm font-medium text-gray-700">Triệu chứng: </span>
                              <span className="text-sm text-gray-600">
                                {item.detectedSymptoms.join(', ')}
                              </span>
                            </div>
                          )}

                          {/* Model Info */}
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            {item.modelVersion && (
                              <span>Model: {item.modelVersion}</span>
                            )}
                            {item.processingTimeMs && (
                              <span>Thời gian: {item.processingTimeMs}ms</span>
                            )}
                            {item.isRealAI !== undefined && (
                              <span className={item.isRealAI ? 'text-green-600' : 'text-orange-600'}>
                                {item.isRealAI ? 'AI thực' : 'Demo'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Trang {currentPage} / {totalPages} ({totalItems} kết quả)
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1 || loading}
                        className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Trước
                      </button>

                      {/* Page Numbers */}
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const pageNum = Math.max(1, currentPage - 2) + i;
                          if (pageNum > totalPages) return null;
                          
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              disabled={loading}
                              className={`px-3 py-2 text-sm font-medium rounded-lg ${
                                pageNum === currentPage
                                  ? 'bg-green-600 text-white'
                                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                              } disabled:opacity-50`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages || loading}
                        className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Sau
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Loading more indicator */}
              {loading && history.length > 0 && (
                <div className="p-4 text-center border-t border-gray-200">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;