// ===================================================================
// FIXED FILES - Thêm 'use client' directive cho tất cả dashboard components
// ===================================================================

// File: src/app/dashboard/page.jsx - FIXED
'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

// Import real dashboard service
import { dashboardService } from '@/services/dashboardService';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    overview: null,
    performance: null,
    feedback: null,
    health: null
  });

  useEffect(() => {
    loadAllDashboardData();
  }, []);

  const loadAllDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔄 Loading all dashboard data from real APIs...');
      
      // Load all dashboard endpoints in parallel
      const [overview, performance, feedback, health] = await Promise.all([
        dashboardService.getOverview(),
        dashboardService.getPerformanceMetrics({ days: 7, groupBy: 'day' }),
        dashboardService.getFeedbackAnalysis(),
        dashboardService.getHealthStatus()
      ]);

      setDashboardData({
        overview,
        performance,
        feedback,
        health
      });

      console.log('✅ All real dashboard data loaded successfully');
    } catch (err) {
      console.error('❌ Dashboard load error:', err);
      setError(err.message || 'Không thể tải dữ liệu dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border p-6 h-32"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border p-6 h-80"></div>
            <div className="bg-white rounded-lg shadow-sm border p-6 h-80"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-red-800 text-lg font-semibold mb-2">Lỗi tải Dashboard</h2>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={loadAllDashboardData}
            className="px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Phân tích Bệnh Cà phê</h1>
        
        {/* Overview Stats */}
        {dashboardData.overview && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <span className="text-2xl">🔍</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Tổng dự đoán</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboardData.overview.totalPredictions || dashboardData.overview.TotalPredictions || 0}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <span className="text-2xl">👥</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Người dùng</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboardData.overview.totalUsers || dashboardData.overview.TotalUsers || 0}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <span className="text-2xl">⚡</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Độ chính xác</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {((dashboardData.overview.accuracy || dashboardData.overview.Accuracy || 0) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <span className="text-2xl">⭐</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Đánh giá TB</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(dashboardData.overview.averageRating || dashboardData.overview.AverageRating || 0).toFixed(1)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Chart */}
          {dashboardData.performance && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Hiệu suất theo thời gian</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dashboardData.performance.predictionsOverTime || dashboardData.performance.PredictionsOverTime || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Feedback Analysis */}
          {dashboardData.feedback && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân bố đánh giá</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dashboardData.feedback.feedbackDistribution || dashboardData.feedback.FeedbackDistribution || []}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="count"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {(dashboardData.feedback.feedbackDistribution || dashboardData.feedback.FeedbackDistribution || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'][index % 5]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Health Status */}
        {dashboardData.health && (
          <div className="mt-6 bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Trạng thái hệ thống</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-3 ${
                  (dashboardData.health.apiStatus || dashboardData.health.ApiStatus) === 'Healthy' ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span className="text-sm">API Status: {dashboardData.health.apiStatus || dashboardData.health.ApiStatus || 'Unknown'}</span>
              </div>
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-3 ${
                  (dashboardData.health.databaseStatus || dashboardData.health.DatabaseStatus) === 'Healthy' ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span className="text-sm">Database: {dashboardData.health.databaseStatus || dashboardData.health.DatabaseStatus || 'Unknown'}</span>
              </div>
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-3 ${
                  (dashboardData.health.modelStatus || dashboardData.health.ModelStatus) === 'Healthy' ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span className="text-sm">AI Model: {dashboardData.health.modelStatus || dashboardData.health.ModelStatus || 'Unknown'}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;