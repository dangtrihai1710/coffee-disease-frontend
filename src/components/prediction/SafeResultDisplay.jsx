// ===================================================================
// File: src/components/prediction/SafeResultDisplay.jsx
// Component an toàn để hiển thị kết quả phân tích, tránh lỗi "Objects not valid as React child"
// ===================================================================

'use client';

import React from 'react';
import Link from 'next/link';

const SafeResultDisplay = ({ result, onReset }) => {
  // ===================================================================
  // SAFE RENDERING HELPERS
  // ===================================================================
  
  const safeRender = (value, fallback = 'Không xác định') => {
    if (value === null || value === undefined) return fallback;
    if (typeof value === 'object') {
      if (value.toString && typeof value.toString === 'function') {
        return value.toString();
      }
      return JSON.stringify(value);
    }
    return String(value);
  };

  const safeFormatConfidence = (confidence) => {
    try {
      if (typeof confidence === 'number') {
        return `${Math.round(confidence * 100)}%`;
      }
      if (typeof confidence === 'string' && !isNaN(parseFloat(confidence))) {
        return `${Math.round(parseFloat(confidence) * 100)}%`;
      }
      return '0%';
    } catch (error) {
      console.warn('Error formatting confidence:', error);
      return '0%';
    }
  };

  const safeGetDiseaseName = (diseaseName) => {
    try {
      if (!diseaseName) return 'Không xác định';
      if (typeof diseaseName === 'object') {
        return diseaseName.name || diseaseName.diseaseName || diseaseName.value || 'Không xác định';
      }
      return String(diseaseName);
    } catch (error) {
      console.warn('Error getting disease name:', error);
      return 'Không xác định';
    }
  };

  const safeGetSeverityLevel = (severityLevel) => {
    try {
      if (!severityLevel) return null;
      if (typeof severityLevel === 'object') {
        return severityLevel.level || severityLevel.name || severityLevel.value || null;
      }
      return String(severityLevel);
    } catch (error) {
      console.warn('Error getting severity level:', error);
      return null;
    }
  };

  const safeFormatDate = (dateValue) => {
    try {
      if (!dateValue) return new Date().toLocaleString('vi-VN');
      const date = new Date(dateValue);
      return isNaN(date.getTime()) ? new Date().toLocaleString('vi-VN') : date.toLocaleString('vi-VN');
    } catch (error) {
      console.warn('Error formatting date:', error);
      return new Date().toLocaleString('vi-VN');
    }
  };

  // ===================================================================
  // SAFE VALUE EXTRACTION
  // ===================================================================
  
  if (!result) {
    return (
      <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-8 text-center">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Kết quả sẽ hiển thị ở đây
        </h3>
        <p className="text-gray-600">
          Upload ảnh và nhấn "Phân tích ảnh" để xem kết quả
        </p>
      </div>
    );
  }

  // Safe extraction of values
  const diseaseName = safeGetDiseaseName(result.diseaseName);
  const confidence = typeof result.confidence === 'number' ? result.confidence : 0;
  const confidencePercent = safeFormatConfidence(confidence);
  const severityLevel = safeGetSeverityLevel(result.severityLevel);
  const treatmentSuggestion = safeRender(result.treatmentSuggestion);
  const description = safeRender(result.description);
  const processingTime = result.processingTimeMs || result.processingTime || 0;
  const modelVersion = safeRender(result.modelVersion, 'ResNet50 v1.0');
  const predictionDate = safeFormatDate(result.predictionDate);

  // ===================================================================
  // SEVERITY COLOR HELPER
  // ===================================================================
  
  const getSeverityColor = (level) => {
    if (!level) return 'bg-gray-100 text-gray-800';
    const levelStr = String(level).toLowerCase();
    switch (levelStr) {
      case 'nhẹ':
      case 'nhe':
      case 'light':
      case 'mild':
        return 'bg-green-100 text-green-800';
      case 'trung bình':
      case 'trung binh':
      case 'medium':
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'nặng':
      case 'nang':
      case 'severe':
      case 'heavy':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // ===================================================================
  // CONFIDENCE COLOR HELPER
  // ===================================================================
  
  const getConfidenceColor = (conf) => {
    if (conf >= 0.8) return 'from-green-500 to-emerald-500';
    if (conf >= 0.6) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-6">
        <span className="text-2xl mr-3">🎯</span>
        <h3 className="text-xl font-semibold text-gray-900">Kết quả phân tích</h3>
      </div>

      <div className="space-y-6">
        {/* Main Disease Result */}
        <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Bệnh được phát hiện:</h4>
              <p className="text-2xl font-bold text-gray-900 mb-2">
                {diseaseName === 'Healthy' ? '🌿 Lá khỏe mạnh' : `🦠 ${diseaseName}`}
              </p>
            </div>
            
            {severityLevel && (
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getSeverityColor(severityLevel)}`}>
                {severityLevel}
              </span>
            )}
          </div>

          {/* Confidence Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Độ tin cậy:</span>
              <span className="text-lg font-bold text-gray-900">{confidencePercent}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full bg-gradient-to-r ${getConfidenceColor(confidence)} transition-all duration-500`}
                style={{ width: `${confidence * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Treatment Suggestion */}
        {treatmentSuggestion && treatmentSuggestion !== 'Không xác định' && (
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-900 mb-2 flex items-center">
              <span className="mr-2">💊</span>
              Khuyến nghị điều trị:
            </h4>
            <p className="text-sm text-green-800 leading-relaxed">
              {treatmentSuggestion}
            </p>
          </div>
        )}

        {/* Description */}
        {description && description !== 'Không xác định' && description.trim() !== '' && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
              <span className="mr-2">📋</span>
              Mô tả chi tiết:
            </h4>
            <p className="text-sm text-blue-800 leading-relaxed">
              {description}
            </p>
          </div>
        )}

        {/* Low Confidence Warning */}
        {confidence < 0.7 && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start">
              <span className="text-yellow-600 mr-2 text-lg">⚠️</span>
              <div>
                <h4 className="font-medium text-yellow-900 mb-1">Lưu ý về độ tin cậy</h4>
                <p className="text-sm text-yellow-800">
                  Độ tin cậy thấp ({confidencePercent}). Khuyến nghị:
                </p>
                <ul className="text-sm text-yellow-800 mt-2 list-disc list-inside space-y-1">
                  <li>Upload ảnh rõ nét hơn</li>
                  <li>Chụp ảnh trong điều kiện ánh sáng tốt</li>
                  <li>Tham khảo ý kiến chuyên gia</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Technical Details */}
        <div className="bg-gray-50 rounded-lg p-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 group-open:text-gray-900">
              <span className="mr-2">🔧</span>
              Thông tin kỹ thuật
            </summary>
            <div className="mt-3 text-sm text-gray-600 space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium">Model AI:</span> {modelVersion}
                </div>
                <div>
                  <span className="font-medium">Thời gian xử lý:</span> {processingTime}ms
                </div>
              </div>
              <div>
                <span className="font-medium">Thời gian phân tích:</span> {predictionDate}
              </div>
              {result.leafImageId && (
                <div>
                  <span className="font-medium">ID phân tích:</span> #{result.leafImageId}
                </div>
              )}
            </div>
          </details>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={onReset}
            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            <span className="mr-2">🔄</span>
            Phân tích ảnh khác
          </button>
          <Link
            href="/history"
            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium text-center"
          >
            <span className="mr-2">📚</span>
            Xem lịch sử
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SafeResultDisplay;