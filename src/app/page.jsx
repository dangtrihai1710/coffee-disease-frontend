// ===================================================================
// File: src/app/page.jsx - TRANG GIỚI THIỆU CHÍNH
// ===================================================================

'use client';

import React from 'react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-green-600">
                🌿 Coffee Disease Analysis
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/auth/login"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Đăng nhập
              </Link>
              <Link
                href="/auth/register"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Đăng ký
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="text-6xl mb-6">🌱☕🔬</div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Phân tích bệnh lá cà phê
              <span className="block text-green-600">bằng trí tuệ nhân tạo</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Hệ thống AI tiên tiến giúp nông dân phát hiện và chẩn đoán bệnh lá cà phê một cách nhanh chóng, chính xác. 
              Chỉ cần chụp ảnh, nhận kết quả ngay lập tức.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              href="/auth/login"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              🔍 Bắt đầu phân tích ngay
            </Link>
            <Link
              href="#features"
              className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300"
            >
              📋 Tìm hiểu thêm
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">87.5%</div>
              <div className="text-gray-600">Độ chính xác AI</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">5</div>
              <div className="text-gray-600">Loại bệnh phát hiện</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">&lt;3s</div>
              <div className="text-gray-600">Thời gian phân tích</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ✨ Tính năng nổi bật
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hệ thống được phát triển với công nghệ AI tiên tiến, mang lại trải nghiệm tốt nhất cho người dùng
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Thông minh</h3>
              <p className="text-gray-600">
                Sử dụng mô hình ResNet50 được huấn luyện trên hàng nghìn ảnh lá cà phê, 
                đảm bảo độ chính xác cao trong việc phát hiện bệnh.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Phân tích nhanh</h3>
              <p className="text-gray-600">
                Kết quả phân tích trong vòng 3 giây. Upload ảnh và nhận ngay lời khuyên 
                về cách xử lý bệnh phù hợp.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Chính xác cao</h3>
              <p className="text-gray-600">
                Độ chính xác 87.5% trong việc phát hiện 5 loại bệnh phổ biến: 
                Rỉ sắt, Cercospora, Phoma, Miner và đánh giá lá khỏe mạnh.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Dễ sử dụng</h3>
              <p className="text-gray-600">
                Giao diện thân thiện, phù hợp cho mọi đối tượng người dùng. 
                Chỉ cần chụp ảnh hoặc upload từ thiết bị.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Lời khuyên chuyên gia</h3>
              <p className="text-gray-600">
                Không chỉ phát hiện bệnh, hệ thống còn đưa ra gợi ý điều trị 
                và phòng ngừa cụ thể cho từng loại bệnh.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Lưu trữ lịch sử</h3>
              <p className="text-gray-600">
                Theo dõi quá trình phân tích, so sánh kết quả theo thời gian 
                để có cái nhìn tổng quan về tình hình cây trồng.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              🔄 Cách thức hoạt động
            </h2>
            <p className="text-xl text-gray-600">
              Chỉ với 3 bước đơn giản, bạn có thể biết ngay tình trạng sức khỏe của cây cà phê
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">📸 Chụp ảnh lá</h3>
              <p className="text-gray-600">
                Chụp ảnh cận cảnh lá cà phê bị bệnh với ánh sáng tự nhiên, 
                đảm bảo ảnh rõ nét và tập trung vào vùng bị tổn thương.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">🔍 AI phân tích</h3>
              <p className="text-gray-600">
                Hệ thống AI sẽ xử lý ảnh trong vài giây, so sánh với cơ sở dữ liệu 
                hàng nghìn mẫu để đưa ra chẩn đoán chính xác.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">📋 Nhận kết quả</h3>
              <p className="text-gray-600">
                Xem kết quả chi tiết bao gồm tên bệnh, độ tin cậy, mức độ nghiêm trọng 
                và hướng dẫn điều trị cụ thể.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Disease Detection */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              🦠 Các bệnh có thể phát hiện
            </h2>
            <p className="text-xl text-gray-600">
              Hệ thống có khả năng nhận diện 5 tình trạng phổ biến của lá cà phê
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-red-800 mb-2">🍂 Rỉ sắt (Rust)</h3>
              <p className="text-red-700 text-sm">
                Bệnh phổ biến nhất, gây ra những đốm vàng cam trên mặt dưới lá, 
                làm giảm năng suất nghiêm trọng.
              </p>
            </div>

            <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-orange-800 mb-2">🍁 Cercospora</h3>
              <p className="text-orange-700 text-sm">
                Gây ra các đốm nâu tròn với viền vàng, thường xuất hiện 
                trong điều kiện ẩm ướt cao.
              </p>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">🟤 Phoma</h3>
              <p className="text-yellow-700 text-sm">
                Tạo ra các vết đen nhỏ trên lá, có thể dẫn đến rụng lá 
                nếu không được điều trị kịp thời.
              </p>
            </div>

            <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-800 mb-2">🐛 Miner</h3>
              <p className="text-purple-700 text-sm">
                Do côn trùng đào hầm trong lá gây ra, tạo thành những đường 
                uốn lượn đặc trưng trên bề mặt lá.
              </p>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-2">✅ Healthy</h3>
              <p className="text-green-700 text-sm">
                Lá khỏe mạnh không có dấu hiệu bệnh tật, màu xanh tươi 
                và bề mặt nhẵn mịn.
              </p>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl text-blue-600 mb-2">🔬</div>
                <p className="text-blue-700 font-medium">
                  Và nhiều bệnh khác đang được nghiên cứu bổ sung...
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Sẵn sàng bảo vệ vườn cà phê của bạn?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Đăng ký ngay để trải nghiệm công nghệ AI phân tích bệnh lá cà phê miễn phí
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="bg-white text-green-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              🚀 Đăng ký miễn phí
            </Link>
            <Link
              href="/auth/login"
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
            >
              📲 Đã có tài khoản? Đăng nhập
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-green-400 mb-4">
                🌿 Coffee Disease Analysis
              </h3>
              <p className="text-gray-400">
                Hệ thống AI tiên tiến giúp nông dân phát hiện và chẩn đoán bệnh lá cà phê 
                một cách nhanh chóng và chính xác.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Tính năng</h4>
              <ul className="space-y-2 text-gray-400">
                <li>• Phân tích AI thông minh</li>
                <li>• Kết quả nhanh chóng</li>
                <li>• Độ chính xác cao</li>
                <li>• Lời khuyên chuyên gia</li>
                <li>• Lưu trữ lịch sử</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Liên hệ</h4>
              <div className="space-y-2 text-gray-400">
                <p>📧 support@coffeedisease.com</p>
                <p>📞 +84 xxx xxx xxx</p>
                <p>🏢 Việt Nam</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Coffee Disease Analysis. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}