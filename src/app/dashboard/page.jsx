 
// File: src/app/dashboard/page.jsx
'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import DashboardStats from '@/components/dashboard/DashboardStats';
import RecentPredictions from '@/components/dashboard/RecentPredictions';
import PredictionChart from '@/components/charts/PredictionChart';
import DiseaseDistribution from '@/components/charts/DiseaseDistribution';
import QuickActions from '@/components/dashboard/QuickActions';
import SystemHealth from '@/components/dashboard/SystemHealth';
import { predictionService } from '@/services/predictionService';
import { dashboardService } from '@/services/dashboardService';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentPredictions, setRecentPredictions] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [healthStatus, setHealthStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load data parallel
      const [statsRes, historyRes, chartRes, healthRes] = await Promise.allSettled([
        dashboardService.getOverview(),
        predictionService.getHistory({ pageSize: 5 }),
        dashboardService.getPerformanceMetrics(7),
        dashboardService.getHealthStatus()
      ]);

      if (statsRes.status === 'fulfilled') {
        setStats(statsRes.value);
      }

      if (historyRes.status === 'fulfilled') {
        setRecentPredictions(historyRes.value.data || []);
      }

      if (chartRes.status === 'fulfilled') {
        setChartData(chartRes.value);
      }

      if (healthRes.status === 'fulfilled') {
        setHealthStatus(healthRes.value);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Tổng quan hệ thống phân tích bệnh lá cà phê
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Cập nhật lần cuối</div>
              <div className="text-sm font-medium">
                {new Date().toLocaleString('vi-VN')}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <QuickActions />

        {/* Stats Cards */}
        <DashboardStats stats={stats} />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PredictionChart data={chartData} />
          <DiseaseDistribution data={stats?.performance?.diseaseDistribution} />
        </div>

        {/* Recent Activity & Health */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentPredictions predictions={recentPredictions} />
          </div>
          <div className="lg:col-span-1">
            <SystemHealth healthStatus={healthStatus} />
          </div>
        </div>
      </div>
    </Layout>
  );
}