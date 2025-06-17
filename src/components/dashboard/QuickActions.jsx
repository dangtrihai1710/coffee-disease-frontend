// File: src/components/dashboard/QuickActions.jsx
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { 
  PhotoIcon, 
  CloudArrowUpIcon, 
  DocumentChartBarIcon,
  CpuChipIcon 
} from '@heroicons/react/24/outline';

const QuickActions = () => {
  const actions = [
    {
      title: 'Phân tích ảnh mới',
      description: 'Upload ảnh lá cà phê để phân tích bệnh',
      href: '/prediction',
      icon: PhotoIcon,
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      title: 'Upload batch',
      description: 'Xử lý nhiều ảnh cùng lúc',
      href: '/prediction?mode=batch',
      icon: CloudArrowUpIcon,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      title: 'Xem báo cáo',
      description: 'Thống kê chi tiết và xu hướng',
      href: '/analytics',
      icon: DocumentChartBarIcon,
      color: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      title: 'Quản lý model',
      description: 'Cập nhật và tối ưu model AI',
      href: '/models',
      icon: CpuChipIcon,
      color: 'bg-orange-600 hover:bg-orange-700'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Thao tác nhanh
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className="group block p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${action.color} transition-colors`}>
                <action.icon className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900 group-hover:text-gray-700">
                  {action.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {action.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;