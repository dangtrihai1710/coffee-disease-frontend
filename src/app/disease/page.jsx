'use client';

import { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon, 
  AdjustmentsHorizontalIcon, 
  ArrowLeftIcon, 
  InformationCircleIcon, 
  ExclamationTriangleIcon, 
  CheckCircleIcon, 
  BugAntIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { DISEASE_CATEGORIES, DISEASE_NAMES, DISEASE_DESCRIPTIONS, TREATMENT_SUGGESTIONS } from '@/lib/constants/prediction';

// Sample images for each disease (placeholder URLs - replace with actual symptom images)
const DISEASE_IMAGES = {
  [DISEASE_CATEGORIES.RUST]: [
    '/images/diseases/rust-1.jpg',
    '/images/diseases/rust-2.jpg',
    '/images/diseases/rust-3.jpg'
  ],
  [DISEASE_CATEGORIES.CERCOSPORA]: [
    '/images/diseases/cercospora-1.jpg',
    '/images/diseases/cercospora-2.jpg',
    '/images/diseases/cercospora-3.jpg'
  ],
  [DISEASE_CATEGORIES.PHOMA]: [
    '/images/diseases/phoma-1.jpg',
    '/images/diseases/phoma-2.jpg',
    '/images/diseases/phoma-3.jpg'
  ],
  [DISEASE_CATEGORIES.MINER]: [
    '/images/diseases/miner-1.jpg',
    '/images/diseases/miner-2.jpg',
    '/images/diseases/miner-3.jpg'
  ],
  [DISEASE_CATEGORIES.HEALTHY]: [
    '/images/diseases/healthy-1.jpg',
    '/images/diseases/healthy-2.jpg',
    '/images/diseases/healthy-3.jpg'
  ]
};

// Extended disease information
const DISEASE_INFO = {
  [DISEASE_CATEGORIES.RUST]: {
    scientificName: 'Hemileia vastatrix',
    severity: 'Nặng',
    prevalence: 'Rất phổ biến',
    symptoms: [
      'Đốm vàng cam trên mặt dưới lá',
      'Lá vàng và rụng sớm',
      'Giảm năng suất đáng kể',
      'Bào tử cam trên bề mặt lá'
    ],
    causes: [
      'Độ ẩm cao (trên 80%)',
      'Nhiệt độ 21-25°C',
      'Mưa nhiều trong mùa khô',
      'Thiếu ánh sáng mặt trời'
    ],
    prevention: [
      'Trồng giống kháng bệnh',
      'Tỉa cành tạo thông gió',
      'Tránh tưới nước lên lá',
      'Phun phòng bệnh định kỳ'
    ],
    treatment: TREATMENT_SUGGESTIONS[DISEASE_CATEGORIES.RUST],
    economicImpact: 'Có thể làm giảm năng suất 30-50% nếu không điều trị kịp thời'
  },
  [DISEASE_CATEGORIES.CERCOSPORA]: {
    scientificName: 'Cercospora coffeicola',
    severity: 'Trung bình',
    prevalence: 'Phổ biến',
    symptoms: [
      'Đốm nâu tròn với viền vàng',
      'Các đốm có tâm xám trắng',
      'Lá vàng và rụng dần',
      'Ảnh hưởng chất lượng quả'
    ],
    causes: [
      'Độ ẩm cao kéo dài',
      'Nhiệt độ 20-28°C',
      'Cây yếu, thiếu dinh dưỡng',
      'Khu vực thông gió kém'
    ],
    prevention: [
      'Cải thiện thoát nước',
      'Bón phân cân đối',
      'Tỉa bỏ cành bệnh',
      'Xử lý đất trước trồng'
    ],
    treatment: TREATMENT_SUGGESTIONS[DISEASE_CATEGORIES.CERCOSPORA],
    economicImpact: 'Giảm 15-25% năng suất và ảnh hưởng chất lượng cà phê'
  },
  [DISEASE_CATEGORIES.PHOMA]: {
    scientificName: 'Phoma costarricensis',
    severity: 'Trung bình',
    prevalence: 'Ít phổ biến',
    symptoms: [
      'Đốm đen nhỏ trên lá',
      'Viền vàng quanh đốm',
      'Lá khô và rụng sớm',
      'Có thể lan sang cành'
    ],
    causes: [
      'Vết thương trên cây',
      'Độ ẩm cao',
      'Cây stress do hạn hán',
      'Thiếu chất dinh dưỡng'
    ],
    prevention: [
      'Tránh gây thương tích cây',
      'Cải thiện dẫn lưu nước',
      'Tưới đúng cách',
      'Bón phân đầy đủ'
    ],
    treatment: TREATMENT_SUGGESTIONS[DISEASE_CATEGORIES.PHOMA],
    economicImpact: 'Giảm 10-20% năng suất nếu nhiễm nặng'
  },
  [DISEASE_CATEGORIES.MINER]: {
    scientificName: 'Leucoptera coffeella',
    severity: 'Nhẹ đến Trung bình',
    prevalence: 'Phổ biến',
    symptoms: [
      'Đường hầm uốn khúc trong lá',
      'Vết cắn nhỏ trên bề mặt',
      'Lá khô dần từ vết cắn',
      'Sâu con màu trắng nhỏ'
    ],
    causes: [
      'Sự hiện diện của côn trụng trưởng thành',
      'Điều kiện thời tiết thuận lợi',
      'Thiếu thiên địch tự nhiên',
      'Mật độ trồng cao'
    ],
    prevention: [
      'Sử dụng bẫy dính vàng',
      'Khuyến khích thiên địch',
      'Kiểm tra định kỳ',
      'Tỉa cành để thoáng'
    ],
    treatment: TREATMENT_SUGGESTIONS[DISEASE_CATEGORIES.MINER],
    economicImpact: 'Giảm 5-15% năng suất, chủ yếu ảnh hưởng chất lượng lá'
  },
  [DISEASE_CATEGORIES.HEALTHY]: {
    scientificName: 'Coffea arabica/robusta',
    severity: 'Không có',
    prevalence: 'Mong muốn',
    symptoms: [
      'Lá xanh tươi, không đốm',
      'Bề mặt lá mịn, không khuyết tật',
      'Tăng trưởng bình thường',
      'Không có dấu hiệu bệnh tật'
    ],
    causes: [
      'Chăm sóc đúng cách',
      'Điều kiện môi trường phù hợp',
      'Dinh dưỡng cân đối',
      'Không có mầm bệnh'
    ],
    prevention: [
      'Duy trì chế độ chăm sóc hiện tại',
      'Kiểm tra định kỳ',
      'Phòng bệnh tổng hợp',
      'Quản lý dinh dưỡng tốt'
    ],
    treatment: TREATMENT_SUGGESTIONS[DISEASE_CATEGORIES.HEALTHY],
    economicImpact: 'Tối ưu năng suất và chất lượng'
  }
};

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

const DiseasesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('');
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [filteredDiseases, setFilteredDiseases] = useState([]);

  // All diseases data
  const allDiseases = Object.values(DISEASE_CATEGORIES).map(category => ({
    id: category,
    name: DISEASE_NAMES[category],
    description: DISEASE_DESCRIPTIONS[category],
    ...DISEASE_INFO[category],
    images: DISEASE_IMAGES[category] || []
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link 
                href="/prediction"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Quay lại
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-semibold text-gray-900 flex items-center">
                🦠 Thông tin bệnh cà phê
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Search and Filter Section */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm bệnh theo tên, mô tả hoặc tên khoa học..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Severity Filter */}
            <div className="md:w-64">
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Tất cả mức độ</option>
                <option value="Nặng">Nặng</option>
                <option value="Trung bình">Trung bình</option>
                <option value="Nhẹ đến Trung bình">Nhẹ đến Trung bình</option>
                <option value="Không có">Khỏe mạnh</option>
              </select>
            </div>
          </div>
        </div>
      </section>

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

              {/* Symptom Preview */}
              <div className="p-4 bg-gray-50">
                <h4 className="font-medium text-gray-900 mb-2">Triệu chứng chính:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {disease.symptoms?.slice(0, 2).map((symptom, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                      {symptom}
                    </li>
                  ))}
                  {disease.symptoms?.length > 2 && (
                    <li className="text-gray-500 italic">
                      +{disease.symptoms.length - 2} triệu chứng khác...
                    </li>
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredDiseases.length === 0 && (
          <div className="text-center py-12">
            <MagnifyingGlassIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không tìm thấy kết quả
            </h3>
            <p className="text-gray-600">
              Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
            </p>
          </div>
        )}
      </main>

      {/* Disease Detail Modal */}
      {selectedDisease && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  {getDiseaseIcon(selectedDisease.id)}
                  <span className="ml-3">{selectedDisease.name}</span>
                </h2>
                <p className="text-gray-600 italic mt-1">{selectedDisease.scientificName}</p>
              </div>
              <button
                onClick={() => setSelectedDisease(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
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

              {/* Prevention */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Biện pháp phòng ngừa</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedDisease.prevention?.map((prevention, index) => (
                    <div key={index} className="flex items-center p-3 bg-blue-50 rounded-lg">
                      <CheckCircleIcon className="w-4 h-4 text-blue-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{prevention}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Treatment */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Phương pháp điều trị</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedDisease.treatment?.map((treatment, index) => (
                    <div key={index} className="flex items-center p-3 bg-green-50 rounded-lg">
                      <div className="w-4 h-4 text-green-500 mr-3 flex-shrink-0">🎯</div>
                      <span className="text-gray-700">{treatment}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end p-6 border-t border-gray-200">
              <button
                onClick={() => setSelectedDisease(null)}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiseasesPage;