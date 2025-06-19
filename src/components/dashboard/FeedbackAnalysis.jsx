// ===================================================================
// File: src/components/dashboard/FeedbackAnalysis.jsx
// ===================================================================
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { dashboardService } from '@/services/dashboardService';

const FeedbackAnalysis = () => {
  const [feedbackData, setFeedbackData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadFeedbackData();
  }, []);

  const loadFeedbackData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await dashboardService.getFeedbackAnalysis();
      setFeedbackData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'];

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="text-red-600">Lỗi: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Feedback Distribution */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân bố đánh giá</h3>
        {feedbackData?.feedbackDistribution?.length > 0 || feedbackData?.FeedbackDistribution?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={feedbackData.feedbackDistribution || feedbackData.FeedbackDistribution}
                  dataKey="count"
                  nameKey="rating"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({rating, percentage}) => `${rating} sao: ${percentage?.toFixed(1) || 0}%`}
                >
                  {(feedbackData.feedbackDistribution || feedbackData.FeedbackDistribution || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="flex flex-col justify-center space-y-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {feedbackData?.averageRating?.toFixed(1) || feedbackData?.AverageRating?.toFixed(1) || 'N/A'}
                </p>
                <p className="text-sm text-gray-600">Đánh giá trung bình</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">
                  {feedbackData?.totalFeedbacks?.toLocaleString() || feedbackData?.TotalFeedbacks?.toLocaleString() || '0'}
                </p>
                <p className="text-sm text-gray-600">Tổng số feedback</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-500">
            Không có dữ liệu feedback
          </div>
        )}
      </div>

      {/* Training Data Sources */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Nguồn dữ liệu huấn luyện</h3>
        {feedbackData?.trainingDataBySource?.length > 0 || feedbackData?.TrainingDataBySource?.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={feedbackData.trainingDataBySource || feedbackData.TrainingDataBySource}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="source" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" name="Tổng số" />
              <Bar dataKey="validated" fill="#10b981" name="Đã xác thực" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-500">
            Không có dữ liệu training data
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackAnalysis;