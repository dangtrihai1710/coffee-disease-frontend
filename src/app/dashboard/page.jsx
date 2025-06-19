// File: src/app/dashboard/page.jsx
// ===================================================================
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
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Đang tải dữ liệu từ API...</p>
          </div>
          
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-32"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-200 rounded-lg h-80"></div>
              <div className="bg-gray-200 rounded-lg h-80"></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-200 rounded-lg h-64"></div>
              <div className="bg-gray-200 rounded-lg h-64"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-red-800 font-medium text-lg">Lỗi tải dashboard</h3>
            <p className="text-red-700 mt-2">{error}</p>
            <button
              onClick={loadAllDashboardData}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { overview, performance, feedback, health } = dashboardData;

  // Overview stats cards
  const statsCards = [
    {
      title: 'Tổng số dự đoán',
      value: overview?.totalPredictions || overview?.TotalPredictions || 0,
      icon: '🔍',
      color: 'text-blue-600',
      bgColor: 'bg-blue-500'
    },
    {
      title: 'Người dùng',
      value: overview?.totalUsers || overview?.TotalUsers || 0,
      icon: '👥',
      color: 'text-green-600',
      bgColor: 'bg-green-500'
    },
    {
      title: 'Hình ảnh đã phân tích',
      value: overview?.totalImages || overview?.TotalImages || 0,
      icon: '📸',
      color: 'text-purple-600',
      bgColor: 'bg-purple-500'
    },
    {
      title: 'Dự đoán hôm nay',
      value: overview?.todayPredictions || overview?.TodayPredictions || 0,
      icon: '📊',
      color: 'text-orange-600',
      bgColor: 'bg-orange-500'
    }
  ];

  // Health status services
  const getHealthStatus = (service) => {
    if (!service) return { status: 'Unknown', color: 'bg-gray-500' };
    
    const status = service.status || service.Status;
    if (status === 'Healthy') return { status: 'Healthy', color: 'bg-green-500' };
    if (status === 'Degraded') return { status: 'Degraded', color: 'bg-yellow-500' };
    if (status === 'Unhealthy') return { status: 'Unhealthy', color: 'bg-red-500' };
    return { status: 'Unknown', color: 'bg-gray-500' };
  };

  const healthServices = [
    { 
      name: 'Database', 
      ...getHealthStatus(health?.database || health?.Database),
      responseTime: health?.database?.responseTime || health?.Database?.ResponseTime || 'N/A'
    },
    { 
      name: 'AI Model', 
      ...getHealthStatus(health?.aiModel || health?.AIModel),
      responseTime: health?.aiModel?.responseTime || health?.AIModel?.ResponseTime || 'N/A'
    },
    { 
      name: 'Cache', 
      ...getHealthStatus(health?.cache || health?.Cache),
      responseTime: health?.cache?.responseTime || health?.Cache?.ResponseTime || 'N/A'
    },
    { 
      name: 'Storage', 
      ...getHealthStatus(health?.storage || health?.Storage),
      responseTime: health?.storage?.responseTime || health?.Storage?.ResponseTime || 'N/A'
    }
  ];

  // Colors for charts
  const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Theo dõi hiệu suất hệ thống phân tích bệnh cà phê</p>
          {overview?.timestamp && (
            <p className="text-sm text-gray-500 mt-1">
              Cập nhật lần cuối: {new Date(overview.timestamp).toLocaleString('vi-VN')}
            </p>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                  </p>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center text-white text-xl`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Performance Over Time Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Hiệu suất theo thời gian</h3>
            {performance?.predictionsOverTime?.length > 0 || performance?.PredictionsOverTime?.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performance.predictionsOverTime || performance.PredictionsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} name="Số lượng dự đoán" />
                  <Line type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={2} name="Độ chính xác %" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-72 flex items-center justify-center text-gray-500">
                Không có dữ liệu hiệu suất
              </div>
            )}
          </div>

          {/* Feedback Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân bố đánh giá</h3>
            {feedback?.feedbackDistribution?.length > 0 || feedback?.FeedbackDistribution?.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={feedback.feedbackDistribution || feedback.FeedbackDistribution}
                    dataKey="count"
                    nameKey="rating"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({rating, percentage}) => `${rating} sao: ${percentage?.toFixed(1) || 0}%`}
                  >
                    {(feedback.feedbackDistribution || feedback.FeedbackDistribution || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-72 flex items-center justify-center text-gray-500">
                Không có dữ liệu feedback
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* System Health Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tình trạng hệ thống</h3>
            <div className="space-y-4">
              {healthServices.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${service.color}`}></div>
                    <span className="font-medium text-gray-900">{service.name}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>{service.status}</span>
                    {service.responseTime !== 'N/A' && (
                      <span>({service.responseTime}ms)</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {health?.overallStatus && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <div className="text-center">
                  <span className="text-sm font-medium text-green-800">
                    Trạng thái tổng thể: {health.overallStatus || health.OverallStatus}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Accuracy Trends */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Xu hướng độ chính xác</h3>
            {performance?.accuracyOverTime?.length > 0 || performance?.AccuracyOverTime?.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={performance.accuracyOverTime || performance.AccuracyOverTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[80, 100]} />
                  <Tooltip />
                  <Bar dataKey="accuracyRate" fill="#3b82f6" name="Độ chính xác %" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-60 flex items-center justify-center text-gray-500">
                Không có dữ liệu xu hướng độ chính xác
              </div>
            )}
          </div>
        </div>

        {/* Debug Information (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 bg-gray-100 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Debug - Raw API Data</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Overview API Response:</h4>
                <pre className="text-xs bg-white p-3 rounded border overflow-auto max-h-40">
                  {JSON.stringify(overview, null, 2)}
                </pre>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Performance API Response:</h4>
                <pre className="text-xs bg-white p-3 rounded border overflow-auto max-h-40">
                  {JSON.stringify(performance, null, 2)}
                </pre>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Feedback API Response:</h4>
                <pre className="text-xs bg-white p-3 rounded border overflow-auto max-h-40">
                  {JSON.stringify(feedback, null, 2)}
                </pre>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Health API Response:</h4>
                <pre className="text-xs bg-white p-3 rounded border overflow-auto max-h-40">
                  {JSON.stringify(health, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;