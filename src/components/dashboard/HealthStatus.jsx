// ===================================================================
// File: src/components/dashboard/HealthStatus.jsx
// ===================================================================
import React, { useState, useEffect } from 'react';
import { dashboardService } from '@/services/dashboardService';

const HealthStatus = () => {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadHealthData();
    
    // Auto refresh every 30 seconds
    const interval = setInterval(loadHealthData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadHealthData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await dashboardService.getHealthStatus();
      setHealthData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getHealthStatus = (service) => {
    if (!service) return { status: 'Unknown', color: 'bg-gray-500' };
    
    const status = service.status || service.Status;
    if (status === 'Healthy') return { status: 'Healthy', color: 'bg-green-500' };
    if (status === 'Degraded') return { status: 'Degraded', color: 'bg-yellow-500' };
    if (status === 'Unhealthy') return { status: 'Unhealthy', color: 'bg-red-500' };
    return { status: 'Unknown', color: 'bg-gray-500' };
  };

  if (loading && !healthData) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const healthServices = [
    { 
      name: 'Database', 
      service: healthData?.database || healthData?.Database,
    },
    { 
      name: 'AI Model', 
      service: healthData?.aiModel || healthData?.AIModel,
    },
    { 
      name: 'Cache', 
      service: healthData?.cache || healthData?.Cache,
    },
    { 
      name: 'Storage', 
      service: healthData?.storage || healthData?.Storage,
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Tình trạng hệ thống</h3>
        <button
          onClick={loadHealthData}
          disabled={loading}
          className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50"
        >
          {loading ? 'Đang tải...' : 'Làm mới'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          Lỗi: {error}
        </div>
      )}

      <div className="space-y-3">
        {healthServices.map((item, index) => {
          const healthStatus = getHealthStatus(item.service);
          const responseTime = item.service?.responseTime || item.service?.ResponseTime;
          
          return (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${healthStatus.color}`}></div>
                <span className="font-medium text-gray-900">{item.name}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>{healthStatus.status}</span>
                {responseTime && (
                  <span>({responseTime}ms)</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {healthData?.overallStatus && (
        <div className="mt-4 p-3 bg-green-50 rounded-lg">
          <div className="text-center">
            <span className="text-sm font-medium text-green-800">
              Trạng thái tổng thể: {healthData.overallStatus || healthData.OverallStatus}
            </span>
          </div>
        </div>
      )}

      {healthData?.timestamp && (
        <div className="mt-4 text-xs text-gray-500 text-center">
          Cập nhật lần cuối: {new Date(healthData.timestamp).toLocaleString('vi-VN')}
        </div>
      )}
    </div>
  );
};

export default HealthStatus;