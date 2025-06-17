// File: src/components/dashboard/DashboardStats.jsx
import { 
  UsersIcon, 
  PhotoIcon, 
  CpuChipIcon, 
  ChatBubbleLeftRightIcon 
} from '@heroicons/react/24/outline';

const DashboardStats = ({ stats }) => {
  if (!stats) return null;

  const statsCards = [
    {
      title: 'Tổng người dùng',
      value: stats.systemStats?.totalUsers || 0,
      change: '+12%',
      changeType: 'increase',
      icon: UsersIcon,
      color: 'blue'
    },
    {
      title: 'Ảnh đã phân tích',
      value: stats.systemStats?.totalImages || 0,
      change: '+23%',
      changeType: 'increase', 
      icon: PhotoIcon,
      color: 'green'
    },
    {
      title: 'Dự đoán thành công',
      value: stats.systemStats?.totalPredictions || 0,
      change: '+18%',
      changeType: 'increase',
      icon: CpuChipIcon,
      color: 'purple'
    },
    {
      title: 'Phản hồi',
      value: stats.systemStats?.totalFeedbacks || 0,
      change: '+8%',
      changeType: 'increase',
      icon: ChatBubbleLeftRightIcon,
      color: 'orange'
    }
  ];

  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500', 
    purple: 'bg-purple-500',
    orange: 'bg-orange-500'
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsCards.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                {stat.title}
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stat.value.toLocaleString('vi-VN')}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[stat.color]}`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
          </div>
          
          <div className="mt-4 flex items-center">
            <span className={`text-sm font-medium ${
              stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
            }`}>
              {stat.change}
            </span>
            <span className="text-sm text-gray-500 ml-2">
              so với tháng trước
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;