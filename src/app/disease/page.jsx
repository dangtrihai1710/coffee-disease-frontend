// ===================================================================
// File: src/app/disease/page.jsx - CẬP NHẬT VỚI HEADER MỚI
// ===================================================================

'use client';

import React, { useState, useEffect } from 'react';
import DiseaseAnalysisHeader from '@/components/layout/DiseaseAnalysisHeader'; // ✅ IMPORT HEADER MỚI
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { 
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  BugAntIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

// Disease data constants
const DISEASE_CATEGORIES = {
  RUST: 'Rust',
  CERCOSPORA: 'Cercospora', 
  PHOMA: 'Phoma',
  MINER: 'Miner',
  HEALTHY: 'Healthy'
};

const DISEASE_NAMES = {
  [DISEASE_CATEGORIES.RUST]: 'Bệnh rỉ sắt',
  [DISEASE_CATEGORIES.CERCOSPORA]: 'Bệnh đốm nâu Cercospora',
  [DISEASE_CATEGORIES.PHOMA]: 'Bệnh đốm đen Phoma',
  [DISEASE_CATEGORIES.MINER]: 'Sâu đục lá',
  [DISEASE_CATEGORIES.HEALTHY]: 'Lá khỏe mạnh'
};

const DISEASE_DESCRIPTIONS = {
  [DISEASE_CATEGORIES.RUST]: 'Bệnh rỉ sắt tạo ra các đốm cam/vàng dưới mặt lá, có thể làm lá vàng và rụng.',
  [DISEASE_CATEGORIES.CERCOSPORA]: 'Bệnh nấm gây ra các đốm nâu tròn trên lá, có thể làm lá vàng và rụng sớm.',
  [DISEASE_CATEGORIES.PHOMA]: 'Bệnh nấm gây ra các đốm đen với viền vàng trên lá.',
  [DISEASE_CATEGORIES.MINER]: 'Sâu đục tạo ra các đường hầm uốn khúc bên trong lá.',
  [DISEASE_CATEGORIES.HEALTHY]: 'Lá cây khỏe mạnh, không có dấu hiệu bệnh tật.'
};

const DISEASE_INFO = {
  [DISEASE_CATEGORIES.RUST]: {
    scientificName: 'Hemileia vastatrix',
    severity: 'Nặng',
    prevalence: 'Cao',
    symptoms: [
      'Đốm cam vàng dưới mặt lá',
      'Lá vàng và rụng sớm',
      'Giảm năng suất'
    ],
    causes: [
      'Độ ẩm cao',
      'Nhiệt độ 21-25°C',
      'Thông gió kém'
    ],
    treatment: [
      'Sử dụng thuốc fungicide chứa triazole',
      'Tăng cường thông gió',
      'Giảm độ ẩm xung quanh cây'
    ],
    economicImpact: 'Có thể làm giảm 50-70% năng suất'
  },
  [DISEASE_CATEGORIES.CERCOSPORA]: {
    scientificName: 'Cercospora coffeicola',
    severity: 'Trung bình',
    prevalence: 'Trung bình',
    symptoms: [
      'Đốm nâu tròn trên lá',
      'Viền đỏ nâu xung quanh đốm',
      'Lá vàng và rụng'
    ],
    causes: [
      'Độ ẩm cao',
      'Mưa nhiều',
      'Cây bị stress'
    ],
    treatment: [
      'Sử dụng thuốc fungicide chứa copper',
      'Tăng cường thoát nước',
      'Loại bỏ lá bị nhiễm'
    ],
    economicImpact: 'Giảm 20-40% năng suất'
  },
  [DISEASE_CATEGORIES.PHOMA]: {
    scientificName: 'Phoma costarricensis',
    severity: 'Nhẹ đến Trung bình',
    prevalence: 'Thấp',
    symptoms: [
      'Đốm đen với viền vàng',
      'Các vết loét trên lá',
      'Lá khô và rụng'
    ],
    causes: [
      'Tưới nước lên lá',
      'Độ ẩm cao',
      'Thời tiết mưa'
    ],
    treatment: [
      'Áp dụng thuốc fungicide',
      'Cải thiện thoát nước',
      'Tránh tưới nước lên lá'
    ],
    economicImpact: 'Giảm 10-25% năng suất'
  },
  [DISEASE_CATEGORIES.MINER]: {
    scientificName: 'Leucoptera coffeella',
    severity: 'Trung bình',
    prevalence: 'Cao',
    symptoms: [
      'Đường hầm uốn khúc trong lá',
      'Lá bị đục lỗ',
      'Lá vàng và rụng'
    ],
    causes: [
      'Côn trùng trưởng thành đẻ trứng',
      'Điều kiện khí hậu thuận lợi',
      'Thiếu thiên địch tự nhiên'
    ],
    treatment: [
      'Sử dụng thuốc trừ sâu systemic',
      'Sử dụng bẫy dính màu vàng',
      'Loại bỏ lá bị nhiễm'
    ],
    economicImpact: 'Giảm 15-30% năng suất'
  },
  [DISEASE_CATEGORIES.HEALTHY]: {
    scientificName: 'Coffea arabica (healthy)',
    severity: 'Không có',
    prevalence: 'Mong muốn',
    symptoms: [
      'Lá xanh tươi',
      'Không có đốm bệnh',
      'Tăng trưởng tốt'
    ],
    causes: [
      'Chăm sóc đúng cách',
      'Điều kiện môi trường tốt',
      'Quản lý dinh dưỡng tốt'
    ],
    treatment: [
      'Duy trì chế độ chăm sóc hiện tại',
      'Theo dõi thường xuyên',
      'Đảm bảo dinh dưỡng đầy đủ'
    ],
    economicImpact: 'Tối ưu năng suất và chất lượng'
  }
};

const DiseasePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('');
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [filteredDiseases, setFilteredDiseases] = useState([]);

  // All diseases data
  const allDiseases = Object.values(DISEASE_CATEGORIES).map(category => ({
    id: category,
    name: DISEASE_NAMES[category],
    description: DISEASE_DESCRIPTIONS[category],
    ...DISEASE_INFO[category]
  }));

  // Filter diseases
  useEffect(() => {
    let filtered = allDiseases;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(disease =>
        disease.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        disease.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        disease.scientificName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by severity
    if (selectedSeverity) {
      filtered = filtered.filter(disease => disease.severity === selectedSeverity);
    }

    setFilteredDiseases(filtered);
  }, [searchTerm, selectedSeverity]);

  // Disease severity colors
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Nặng': return 'bg-red-100 text-red-800 border-red-200';
      case 'Trung bình': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Nhẹ đến Trung bình': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Không có': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Disease category icons
  const getDiseaseIcon = (category) => {
    switch (category) {
      case DISEASE_CATEGORIES.RUST: return <ExclamationTriangleIcon className="w-5 h-5" />;
      case DISEASE_CATEGORIES.CERCOSPORA: return <div className="w-5 h-5 text-orange-600">🎯</div>;
      case DISEASE_CATEGORIES.PHOMA: return <InformationCircleIcon className="w-5 h-5" />;
      case DISEASE_CATEGORIES.MINER: return <BugAntIcon className="w-5 h-5" />;
      case DISEASE_CATEGORIES.HEALTHY: return <CheckCircleIcon className="w-5 h-5" />;
      default: return <div className="w-5 h-5 text-green-600">🌿</div>;
    }
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleFilterChange = (value) => {
    // Convert filter value to severity
    const severityMap = {
      'Rust': 'Nặng',
      'Cercospora': 'Trung bình', 
      'Phoma': 'Nhẹ đến Trung bình',
      'Miner': 'Trung bình',
      'Healthy': 'Không có',
      '': ''
    };
    setSelectedSeverity(severityMap[value] || '');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* ✅ SỬ DỤNG HEADER MỚI */}
        <DiseaseAnalysisHeader 
          currentPage="disease"
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onFilterChange={handleFilterChange}
        />

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Results Summary */}
          <div className="mb-6">
            <p className="text-gray-600">
              Hiển thị {filteredDiseases.length} trong tổng số {allDiseases.length} loại bệnh
            </p>
          </div>

          {/* Disease Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDiseases.map((disease) => (
              <div
                key={disease.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedDisease(disease)}
              >
                {/* Disease Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${getSeverityColor(disease.severity).replace('border-', 'border ')}`}>
                        {getDiseaseIcon(disease.id)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">
                          {disease.name}
                        </h3>
                        <p className="text-sm text-gray-500 italic">
                          {disease.scientificName}
                        </p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSeverityColor(disease.severity)}`}>
                      {disease.severity}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4">
                    {disease.description}
                  </p>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      Phổ biến: <span className="font-medium text-gray-700">{disease.prevalence}</span>
                    </span>
                    <button className="text-green-600 hover:text-green-700 font-medium">
                      Xem chi tiết →
                    </button>
                  </div>
                </div>

                {/* Quick Info */}
                <div className="p-4 bg-gray-50">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Triệu chứng:</span>
                      <p className="text-gray-700 text-xs mt-1">
                        {disease.symptoms?.[0] || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Tác động:</span>
                      <p className="text-gray-700 text-xs mt-1 line-clamp-2">
                        {disease.economicImpact}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredDiseases.length === 0 && (
            <div className="text-center py-12">
              <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Không tìm thấy kết quả</h3>
              <p className="mt-1 text-sm text-gray-500">
                Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc.
              </p>
            </div>
          )}
        </main>

        {/* Disease Detail Modal */}
        {selectedDisease && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedDisease.name}
                </h2>
                <button
                  onClick={() => setSelectedDisease(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="space-y-6">
                {/* Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Mức độ nghiêm trọng</h4>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getSeverityColor(selectedDisease.severity)}`}>
                      {selectedDisease.severity}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Tần suất xuất hiện</h4>
                    <p className="text-gray-700">{selectedDisease.prevalence}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Tác động kinh tế</h4>
                    <p className="text-gray-700 text-sm">{selectedDisease.economicImpact}</p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Mô tả chi tiết</h3>
                  <p className="text-gray-700">{selectedDisease.description}</p>
                </div>

                {/* Symptoms */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Triệu chứng</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedDisease.symptoms?.map((symptom, index) => (
                      <div key={index} className="flex items-center p-3 bg-red-50 rounded-lg">
                        <ExclamationTriangleIcon className="w-4 h-4 text-red-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{symptom}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Causes */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Nguyên nhân</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedDisease.causes?.map((cause, index) => (
                      <div key={index} className="flex items-center p-3 bg-yellow-50 rounded-lg">
                        <InformationCircleIcon className="w-4 h-4 text-yellow-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{cause}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Treatment */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Phương pháp điều trị</h3>
                  <div className="space-y-2">
                    {selectedDisease.treatment?.map((method, index) => (
                      <div key={index} className="flex items-start p-3 bg-green-50 rounded-lg">
                        <CheckCircleIcon className="w-4 h-4 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{method}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedDisease(null)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default DiseasePage;