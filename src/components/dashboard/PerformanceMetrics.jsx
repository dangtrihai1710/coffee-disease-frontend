// ===================================================================
// File: src/components/dashboard/PerformanceMetrics.jsx - FIXED
'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { dashboardService } from '@/services/dashboardService';

const PerformanceMetrics = () => {
  const [performanceData, setPerformanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState({ days: 7, groupBy: 'day' });

  useEffect(() => {
    loadPerformanceData();
  }, [timeRange]);

  const loadPerformanceData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await dashboardService.getPerformanceMetrics(timeRange);
      setPerformanceData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Hiệu suất theo thời gian</h3>
        <select
          value={`${timeRange.days}-${timeRange.groupBy}`}
          onChange={(e) => {
            const [days, groupBy] = e.target.value.split('-');
            setTimeRange({ days: parseInt(days), groupBy });
          }}
          className="px-3 py-1 border border-gray-300 rounded-md text-sm"
        >
          <option value="7-day">7 ngày</option>
          <option value="30-day">30 ngày</option>
          <option value="7-hour">7 ngày (theo giờ)</option>
        </select>
      </div>

      {performanceData?.predictionsOverTime?.length > 0 || performanceData?.PredictionsOverTime?.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={performanceData.predictionsOverTime || performanceData.PredictionsOverTime}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-64 flex items-center justify-center text-gray-500">
          Không có dữ liệu hiệu suất
        </div>
      )}
    </div>
  );
};

export default PerformanceMetrics;