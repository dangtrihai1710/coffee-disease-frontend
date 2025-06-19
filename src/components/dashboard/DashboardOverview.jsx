// File: src/components/dashboard/DashboardOverview.jsx
// ===================================================================
import React, { useState, useEffect } from 'react';
import { dashboardService } from '@/services/dashboardService';

const DashboardOverview = () => {
  const [overviewData, setOverviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Loading dashboard overview data...');
      const data = await dashboardService.getOverview();
      
      console.log('✅ Dashboard data loaded:', data);
      setOverviewData(data);
    } catch (err) {
      console.error('❌ Dashboard load error:', err);
      setError(err.message || 'Không thể tải dữ liệu dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-gray-200 rounded-lg p-6 h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Lỗi tải dữ liệu</h3>
          <p className="text-red-700 text-sm mt-1">{error}</p>
          <button
            onClick={loadDashboardData}
            className="mt-3 px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!overviewData) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">
          Không có dữ liệu để hiển thị
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Tổng số dự đoán',
      value: overviewData.totalPredictions || overviewData.TotalPredictions || 0,
      icon: '🔍',
      color: 'bg-blue-50 text-blue-800'
    },
    {
      title: 'Người dùng',
      value: overviewData.totalUsers || overviewData.TotalUsers || 0,
      icon: '👥',
      color: 'bg-green-50 text-green-800'
    },
    {
      title: 'Hình ảnh đã tải',
      value: overviewData.totalImages || overviewData.TotalImages || 0,
      icon: '📸',
      color: 'bg-purple-50 text-purple-800'
    },
    {
      title: 'Dự đoán hôm nay',
      value: overviewData.todayPredictions || overviewData.TodayPredictions || 0,
      icon: '📊',
      color: 'bg-orange-50 text-orange-800'
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Tổng quan hệ thống</h2>
        <p className="text-gray-600 mt-1">Thống kê tổng quan về hoạt động của hệ thống</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center text-xl`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Info */}
      {overviewData.timestamp && (
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">
            Dữ liệu được cập nhật lần cuối: {' '}
            <span className="font-medium">
              {new Date(overviewData.timestamp).toLocaleString('vi-VN')}
            </span>
          </p>
        </div>
      )}

      {/* Debug Info (chỉ hiển thị trong development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="text-yellow-800 font-medium">Debug Info</h4>
          <pre className="text-xs text-yellow-700 mt-2 overflow-auto">
            {JSON.stringify(overviewData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default DashboardOverview;