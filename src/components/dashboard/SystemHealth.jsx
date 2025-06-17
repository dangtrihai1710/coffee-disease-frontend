// File: src/components/dashboard/SystemHealth.jsx
import { CheckCircleIcon, ExclamationCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const SystemHealth = ({ healthStatus }) => {
  if (!healthStatus) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Tình trạng hệ thống
        </h2>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'healthy':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'degraded':
        return <ExclamationCircleIcon className="h-5 w-5 text-yellow-500" />;
      case 'unhealthy':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ExclamationCircleIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'healthy':
        return 'text-green-600 bg-green-100';
      case 'degraded':
        return 'text-yellow-600 bg-yellow-100';
      case 'unhealthy':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const components = [
    { name: 'Database', status: healthStatus.components?.database },
    { name: 'AI Model', status: healthStatus.components?.aiModel },
    { name: 'Cache', status: healthStatus.components?.cache },
    { name: 'Message Queue', status: healthStatus.components?.messageQueue },
    { name: 'Storage', status: healthStatus.components?.storage }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Tình trạng hệ thống
        </h2>
        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
          getStatusColor(healthStatus.overallStatus)
        }`}>
          {healthStatus.overallStatus}
        </span>
      </div>

      <div className="space-y-3">
        {components.map((component, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getStatusIcon(component.status?.status)}
              <span className="text-sm text-gray-700">
                {component.name}
              </span>
            </div>
            <span className={`px-2 py-1 text-xs rounded-full ${
              getStatusColor(component.status?.status)
            }`}>
              {component.status?.status || 'Unknown'}
            </span>
          </div>
        ))}
      </div>

      {healthStatus.issues && healthStatus.issues.length > 0 && (
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
          <h4 className="text-sm font-medium text-yellow-800 mb-2">
            Vấn đề cần chú ý:
          </h4>
          <ul className="text-xs text-yellow-700 space-y-1">
            {healthStatus.issues.map((issue, index) => (
              <li key={index}>• {issue}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500 text-center">
        Cập nhật: {new Date(healthStatus.timestamp).toLocaleString('vi-VN')}
      </div>
    </div>
  );
};

export default SystemHealth;