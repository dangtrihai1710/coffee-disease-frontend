// File: src/components/dashboard/RecentPredictions.jsx
import Link from 'next/link';
import { SEVERITY_LEVELS } from '@/lib/constants';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

const RecentPredictions = ({ predictions }) => {
  if (!predictions || predictions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Dự đoán gần đây
        </h2>
        <div className="text-center py-8">
          <div className="text-gray-400 text-4xl mb-2">📋</div>
          <p className="text-gray-500">Chưa có dự đoán nào</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Dự đoán gần đây
        </h2>
        <Link 
          href="/history"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Xem tất cả →
        </Link>
      </div>

      <div className="space-y-4">
        {predictions.map((prediction) => (
          <div 
            key={prediction.id}
            className="flex items-center space-x-4 p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
          >
            {/* Image Thumbnail */}
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
              {prediction.imagePath ? (
                <img 
                  src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${prediction.imagePath}`}
                  alt="Leaf"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400 text-xs">🍃</span>
              )}
            </div>

            {/* Prediction Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {prediction.diseaseName}
                </h3>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  SEVERITY_LEVELS[prediction.severityLevel] || 'text-gray-600 bg-gray-100'
                }`}>
                  {prediction.severityLevel}
                </span>
              </div>
              
              <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500">
                <span>
                  Độ tin cậy: {(prediction.confidence * 100).toFixed(1)}%
                </span>
                <span>
                  {formatDistanceToNow(new Date(prediction.predictionDate), { 
                    addSuffix: true, 
                    locale: vi 
                  })}
                </span>
              </div>
            </div>

            {/* Confidence Bar */}
            <div className="w-20">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    prediction.confidence >= 0.8 ? 'bg-green-500' :
                    prediction.confidence >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${prediction.confidence * 100}%` }}
                />
              </div>
            </div>

            {/* Rating */}
            {prediction.feedbackRating && (
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span 
                    key={star}
                    className={`text-xs ${
                      star <= prediction.feedbackRating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    ⭐
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentPredictions;