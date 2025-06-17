// File: src/app/page.js
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-20 pb-16 text-center lg:pt-32">
          {/* Hero Section */}
          <div className="mx-auto max-w-4xl">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              <span className="text-green-600">AI Phân tích</span> bệnh lá cà phê
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Sử dụng công nghệ AI tiên tiến để chẩn đoán chính xác 5 loại bệnh phổ biến 
              trên lá cây cà phê với độ chính xác lên đến 92%.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/auth/register">
                <Button size="lg" variant="primary">
                  Bắt đầu sử dụng
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline">
                  Đăng nhập
                </Button>
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="mt-20">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
                  <span className="text-2xl">🔬</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold">Chẩn đoán chính xác</h3>
                <p className="mt-2 text-gray-600">
                  Model AI ResNet50 với độ chính xác 92% cho 5 loại bệnh phổ biến
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold">Xử lý nhanh chóng</h3>
                <p className="mt-2 text-gray-600">
                  Kết quả trong vòng 2-3 giây với xử lý đồng bộ và bất đồng bộ
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold">Thống kê chi tiết</h3>
                <p className="mt-2 text-gray-600">
                  Theo dõi lịch sử, phân tích xu hướng và báo cáo hiệu suất
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 bg-white rounded-2xl shadow-lg p-8">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">92%</div>
                <div className="text-sm text-gray-600">Độ chính xác</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">5</div>
                <div className="text-sm text-gray-600">Loại bệnh</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">2s</div>
                <div className="text-sm text-gray-600">Thời gian xử lý</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}