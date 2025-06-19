// File: src/components/prediction/ResultDisplay.jsx
'use client';

import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ShareIcon,
  BookmarkIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';

const ResultDisplay = ({ result, onSave, onShare, onFeedback }) => {
  const [showDetails, setShowDetails] = useState(false);

  if (!result) {
    return (
      <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-8 text-center">
        <CheckCircleIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Kết quả sẽ hiển thị ở đây
        </h3>
        <p className="text-gray-600">
          Upload ảnh và nhấn "Phân tích ngay" để xem kết quả
        </p>
      </div>
    );
  }

  const getConfidenceColor = (confidence) => {
    if (confidence > 0.8) return 'bg-green-100 text-green-800';
    if (confidence > 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'nhẹ': return 'text-green-600';
      case 'trung bình': return 'text-yellow-600';
      case 'nặng': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <CheckCircleIcon className="h-6 w-6 text-green-600" />
        Kết quả phân tích
      </h2>

      <div className="space-y-4">
        {/* Main Result */}
        <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">Bệnh phát hiện:</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getConfidenceColor(result.confidence)}`}>
              {(result.confidence * 100).toFixed(1)}% tin cậy
            </span>
          </div>
          
          <p className="text-xl font-bold text-gray-900 mb-2">
            {result.diseaseName === 'Healthy' ? 'Lá khỏe mạnh' : result.diseaseName}
          </p>

          {result.severityLevel && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Mức độ:</span>
              <span className={`font-medium text-sm ${getSeverityColor(result.severityLevel)}`}>
                {result.severityLevel}
              </span>
            </div>
          )}
        </div>

        {/* Treatment Suggestion */}
        {result.treatmentSuggestion && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <InformationCircleIcon className="h-5 w-5" />
              Khuyến nghị điều trị:
            </h4>
            <p className="text-sm text-blue-800">{result.treatmentSuggestion}</p>
          </div>
        )}

        {/* Additional Info */}
        {result.description && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Mô tả chi tiết:</h4>
            <p className="text-sm text-gray-700">{result.description}</p>
          </div>
        )}

        {/* Confidence Warning */}
        {result.confidence < 0.7 && (
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-start gap-2">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-900">Lưu ý:</h4>
                <p className="text-sm text-yellow-800">
                  Độ tin cậy thấp. Nên tham khảo ý kiến chuyên gia hoặc upload ảnh rõ nét hơn.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Detailed Info */}
        <div className="border-t pt-4">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm text-gray-600 hover:text-gray-800 mb-2"
          >
            {showDetails ? 'Ẩn' : 'Hiện'} thông tin chi tiết
          </button>

          {showDetails && (
            <div className="text-xs text-gray-500 space-y-1 bg-gray-50 p-3 rounded-lg">
              <p>Model: {result.modelVersion || 'ResNet50 v1.1'}</p>
              <p>Thời gian phân tích: {new Date(result.predictionDate || Date.now()).toLocaleString('vi-VN')}</p>
              {result.leafImageId && <p>Prediction ID: #{result.leafImageId}</p>}
              {result.processingTime && <p>Thời gian xử lý: {result.processingTime}ms</p>}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => onSave?.(result)}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <BookmarkIcon className="h-4 w-4" />
            Lưu
          </button>
          
          <button
            onClick={() => onShare?.(result)}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            <ShareIcon className="h-4 w-4" />
            Chia sẻ
          </button>

          <button
            onClick={() => onFeedback?.(result)}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <ChatBubbleLeftRightIcon className="h-4 w-4" />
            Phản hồi
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;