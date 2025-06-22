// src/app/history/page.jsx - TIMEZONE FIXED
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import predictionService from '@/services/predictionService';

// ✅ IMPORT FIXED TIMEZONE UTILS
import { 
  formatVietnameseDate, 
  formatRelativeTime, 
  formatDateAndTime,
  debugTimezone,
  safeFormatDate 
} from '@/utils/dateUtils';

// Simple icon components
const ArrowLeft = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const Camera = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0118.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
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
  // State management
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [diseaseFilter, setDiseaseFilter] = useState('');
  const [pageSize] = useState(10);

  // ✅ FIXED: Load history với timezone handling
  const loadHistory = useCallback(async (page = 1, replace = false) => {
    if (page < 1 || page > totalPages) return;
    
    try {
      setLoading(true);
      setError(null);

      console.log('🔄 Loading history page:', page);

      const response = await predictionService.getHistory({
        pageNumber: page,
        pageSize: pageSize,
        diseaseFilter: diseaseFilter || undefined
      });

      console.log('✅ History response:', response);

      // ✅ TIMEZONE DEBUG: Log thời gian để debug
      if (response.data && response.data.length > 0) {
        console.log('🕐 Timezone Debug - First item:');
        debugTimezone(response.data[0].predictionDate, 'First History Item');
      }

      if (response.data) {
        if (replace) {
          setHistory(response.data);
        } else {
          setHistory(prev => page === 1 ? 
            response.data : [...prev, ...response.data]);
        }
        
        setTotalPages(response.totalPages || 1);
        setTotalItems(response.totalItems || response.data.length);
        setCurrentPage(page);
      }
      
    } catch (err) {
      console.error('❌ Load history error:', err);
      setError(err.message || 'Không thể tải lịch sử phân tích');
    } finally {
      setLoading(false);
    }
  }, [pageSize, diseaseFilter, totalPages]);

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

  // ✅ FIXED: Format date function - không convert thêm
  const formatDate = (dateString) => {
    // Backend đã lưu Vietnam time, chỉ cần format
    return safeFormatDate(dateString, 'N/A');
  };

  // ✅ FIXED: Format relative time
  const formatTime = (dateString) => {
    return formatRelativeTime(dateString);
  };

  // ✅ FIXED: Format date and time separately  
  const formatDateTime = (dateString) => {
    return formatDateAndTime(dateString);
  };

  // Get disease display name
  const getDiseaseDisplayName = (diseaseName) => {
    const diseaseMap = {
      'Healthy': 'Lá khỏe mạnh',
      'Rust': 'Bệnh rỉ sắt', 
      'Cercospora': 'Bệnh đốm nâu Cercospora',
      'Phoma': 'Bệnh đốm đen Phoma',
      'Miner': 'Sâu đục lá'
    };
    
    return diseaseMap[diseaseName] || diseaseName;
  };

  // Get confidence display
  const formatConfidence = (confidence) => {
    if (typeof confidence === 'number') {
      return `${(confidence * 100).toFixed(1)}%`;
    }
    return 'N/A';
  };

  // Get disease color
  const getDiseaseColor = (diseaseName) => {
    const colors = {
      'Healthy': 'bg-green-100 text-green-800',
      'Rust': 'bg-red-100 text-red-800',
      'Cercospora': 'bg-orange-100 text-orange-800',
      'Phoma': 'bg-yellow-100 text-yellow-800',
      'Miner': 'bg-purple-100 text-purple-800'
    };
    
    return colors[diseaseName] || 'bg-gray-100 text-gray-800';
  };

  // Disease filter options
  const diseaseOptions = [
    { value: '', label: 'Tất cả bệnh' },
    { value: 'Healthy', label: 'Lá khỏe mạnh' },
    { value: 'Rust', label: 'Bệnh rỉ sắt' },
    { value: 'Cercospora', label: 'Bệnh đốm nâu' },
    { value: 'Phoma', label: 'Bệnh đốm đen' },
    { value: 'Miner', label: 'Sâu đục lá' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link 
                href="/prediction"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Quay lại
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-semibold text-gray-900">
                📋 Lịch sử phân tích
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {totalItems > 0 && `${totalItems} kết quả`}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <select
              value={diseaseFilter}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {diseaseOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <button
            onClick={() => loadHistory(1, true)}
            disabled={loading}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <Search className="w-4 h-4 mr-2" />
            {loading ? 'Đang tải...' : 'Lọc kết quả'}
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Lỗi tải dữ liệu</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
            <button
              onClick={() => loadHistory(1, true)}
              className="mt-3 text-sm text-red-600 hover:text-red-500 font-medium"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
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
                {history.map((item, index) => {
                  // ✅ FIXED: Format time với timezone đúng
                  const dateTime = formatDateTime(item.predictionDate);
                  const relativeTime = formatTime(item.predictionDate);
                  
                  return (
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
                              
                              {/* ✅ FIXED: Hiển thị thời gian đúng */}
                              <div className="text-sm text-gray-600 space-y-1">
                                <p>📅 {dateTime.date} ⏰ {dateTime.time}</p>
                                <p className="text-gray-500">⏱️ {relativeTime}</p>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getDiseaseColor(item.diseaseName)}`}>
                                {formatConfidence(item.confidence)} tin cậy
                              </span>
                            </div>
                          </div>

                          {/* Description */}
                          <div className="text-sm text-gray-600">
                            <p className="mb-2">
                              <strong>Điều trị:</strong> {item.treatmentSuggestion || 'Tiếp tục chăm sóc theo quy trình hiện tại.'}
                            </p>
                            
                            {item.severityLevel && (
                              <p className="mb-2">
                                <strong>Mức độ:</strong> 
                                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                                  item.severityLevel === 'Nhẹ' ? 'bg-green-100 text-green-700' :
                                  item.severityLevel === 'Trung bình' ? 'bg-yellow-100 text-yellow-700' :
                                  item.severityLevel === 'Nặng' ? 'bg-red-100 text-red-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {item.severityLevel}
                                </span>
                              </p>
                            )}
                            
                            {item.processingTimeMs && (
                              <p className="text-xs text-gray-500">
                                ⚡ Phân tích trong {item.processingTimeMs}ms
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Trang {currentPage} / {totalPages} 
                      {totalItems > 0 && ` • ${totalItems} kết quả`}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage <= 1 || loading}
                        className="p-2 rounded-lg border border-gray-300 text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      
                      <span className="px-3 py-1 text-sm font-medium text-gray-700">
                        {currentPage}
                      </span>
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages || loading}
                        className="p-2 rounded-lg border border-gray-300 text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default HistoryPage;