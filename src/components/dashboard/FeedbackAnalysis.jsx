// ===================================================================
// File: src/components/dashboard/FeedbackAnalysis.jsx - FIXED
'use client';

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
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={feedbackData.feedbackDistribution || feedbackData.FeedbackDistribution}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="count"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {(feedbackData.feedbackDistribution || feedbackData.FeedbackDistribution).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-500">
            Không có dữ liệu phản hồi
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackAnalysis;