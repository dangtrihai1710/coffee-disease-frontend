// File: src/app/prediction/page.jsx - PHIÊN BẢN CẢI TIẾN
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import UploadZone from '@/components/prediction/UploadZone';
import SymptomSelector from '@/components/prediction/SymptomSelector';
import ResultDisplay from '@/components/prediction/ResultDisplay';
import ProgressBar from '@/components/prediction/ProgressBar';
import predictionService from '@/services/predictionService';
import toast from 'react-hot-toast';
import { 
  SparklesIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

// Danh sách triệu chứng mặc định (sẽ được load từ API)
const DEFAULT_SYMPTOMS = [
  { id: 1, name: 'Đốm vàng trên lá', description: 'Xuất hiện các đốm màu vàng nhỏ' },
  { id: 2, name: 'Đốm nâu', description: 'Các vết đốm màu nâu trên bề mặt lá' },
  { id: 3, name: 'Lá héo, khô', description: 'Lá bị khô héo, mất nước' },
  { id: 4, name: 'Rỉ sắt', description: 'Bột màu cam đỏ ở mặt dưới lá' },
  { id: 5, name: 'Lỗ thủng trên lá', description: 'Các lỗ nhỏ xuất hiện trên lá' },
  { id: 6, name: 'Viền lá đen', description: 'Viền lá chuyển màu đen' },
  { id: 7, name: 'Lá cuốn lại', description: 'Lá bị cuốn, biến dạng' },
  { id: 8, name: 'Đường kẻ trắng', description: 'Xuất hiện đường kẻ màu trắng' }
];

export default function PredictionPage() {
  const { user } = useAuth();
  
  // States
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [symptoms, setSymptoms] = useState(DEFAULT_SYMPTOMS);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [notes, setNotes] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [processingMode, setProcessingMode] = useState('sync'); // 'sync' hoặc 'async'

  // Load symptoms từ API khi component mount
  useEffect(() => {
    loadSymptoms();
  }, []);

  const loadSymptoms = async () => {
    try {
      const symptomsData = await predictionService.getSymptoms();
      if (symptomsData && symptomsData.length > 0) {
        setSymptoms(symptomsData);
      }
    } catch (error) {
      console.warn('Không thể load symptoms từ API, sử dụng danh sách mặc định:', error);
      // Tiếp tục sử dụng DEFAULT_SYMPTOMS
    }
  };

  // Xử lý chọn file
  const handleFileSelect = (file) => {
    setSelectedFile(file);
    
    // Tạo preview
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);

    // Reset result cũ
    setResult(null);
  };

  // Xử lý xóa file
  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    setUploadProgress(0);
  };

  // Xử lý chọn triệu chứng
  const handleSymptomToggle = (symptomId) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptomId)
        ? prev.filter(id => id !== symptomId)
        : [...prev, symptomId]
    );
  };

  // Tạo FormData
  const createFormData = () => {
    const formData = new FormData();
    formData.append('Image', selectedFile);
    
    // Thêm triệu chứng
    selectedSymptoms.forEach(symptomId => {
      formData.append('SymptomIds', symptomId);
    });

    // Thêm ghi chú
    if (notes.trim()) {
      formData.append('Notes', notes.trim());
    }

    return formData;
  };

  // Xử lý upload đồng bộ
  const handleSyncUpload = async () => {
    setIsUploading(true);
    setUploadProgress(0);
    setResult(null);

    try {
      const formData = createFormData();
      
      const response = await predictionService.uploadImage(
        formData, 
        (progress) => setUploadProgress(progress)
      );
      
      setResult(response);
      toast.success('Phân tích thành công!');

    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Có lỗi xảy ra khi phân tích ảnh');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Xử lý upload bất đồng bộ
  const handleAsyncUpload = async () => {
    setIsUploading(true);
    setUploadProgress(0);
    setResult(null);

    try {
      const formData = createFormData();
      
      // Upload async
      const response = await predictionService.uploadImageAsync(formData);
      
      if (response.success && response.leafImageId) {
        toast.success('Đã gửi yêu cầu phân tích. Đang xử lý...');
        
        // Theo dõi trạng thái xử lý
        await pollProcessingStatus(response.leafImageId);
      } else {
        throw new Error('Không thể khởi tạo xử lý async');
      }

    } catch (error) {
      console.error('Async upload error:', error);
      toast.error(error.message || 'Có lỗi xảy ra khi phân tích ảnh');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Theo dõi trạng thái xử lý async
  const pollProcessingStatus = async (leafImageId) => {
    const maxAttempts = 30; // Tối đa 30 lần kiểm tra (5 phút)
    let attempts = 0;

    const checkStatus = async () => {
      try {
        attempts++;
        setUploadProgress((attempts / maxAttempts) * 90); // Tiến trình tối đa 90%

        const status = await predictionService.getProcessingStatus(leafImageId);
        
        if (status.isCompleted) {
          setUploadProgress(100);
          setResult(status.result);
          setIsUploading(false);
          toast.success('Phân tích hoàn thành!');
          return;
        }

        if (status.hasError) {
          throw new Error(status.errorMessage || 'Lỗi khi xử lý ảnh');
        }

        // Tiếp tục kiểm tra sau 10 giây
        if (attempts < maxAttempts) {
          setTimeout(checkStatus, 10000);
        } else {
          throw new Error('Quá thời gian chờ xử lý');
        }

      } catch (error) {
        console.error('Status check error:', error);
        toast.error(error.message || 'Lỗi khi kiểm tra trạng thái');
        setIsUploading(false);
        setUploadProgress(0);
      }
    };

    checkStatus();
  };

  // Xử lý submit chính
  const handleSubmit = async () => {
    if (!selectedFile) {
      toast.error('Vui lòng chọn ảnh cần phân tích');
      return;
    }

    if (processingMode === 'sync') {
      await handleSyncUpload();
    } else {
      await handleAsyncUpload();
    }
  };

  // Reset form
  const handleReset = () => {
    setSelectedFile(null);
    setPreview(null);
    setSelectedSymptoms([]);
    setNotes('');
    setResult(null);
    setUploadProgress(0);
    setIsUploading(false);
  };

  // Xử lý lưu kết quả
  const handleSaveResult = async (resultData) => {
    try {
      // Implement save logic - có thể lưu vào local storage hoặc gọi API
      localStorage.setItem(`prediction_${Date.now()}`, JSON.stringify(resultData));
      toast.success('Đã lưu kết quả thành công!');
    } catch (error) {
      toast.error('Không thể lưu kết quả');
    }
  };

  // Xử lý chia sẻ kết quả
  const handleShareResult = async (resultData) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Kết quả phân tích bệnh lá cà phê',
          text: `Bệnh phát hiện: ${resultData.diseaseName} (${(resultData.confidence * 100).toFixed(1)}% tin cậy)`,
          url: window.location.href
        });
      } else {
        // Fallback: copy to clipboard
        const shareText = `Kết quả phân tích bệnh lá cà phê:\nBệnh: ${resultData.diseaseName}\nĐộ tin cậy: ${(resultData.confidence * 100).toFixed(1)}%`;
        await navigator.clipboard.writeText(shareText);
        toast.success('Đã copy thông tin vào clipboard!');
      }
    } catch (error) {
      toast.error('Không thể chia sẻ kết quả');
    }
  };

  // Xử lý feedback
  const handleFeedback = async (resultData) => {
    try {
      // Implement feedback modal hoặc navigate to feedback page
      toast.info('Tính năng feedback đang được phát triển');
    } catch (error) {
      toast.error('Không thể gửi feedback');
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <SparklesIcon className="h-8 w-8 text-green-600" />
            Phân Tích Bệnh Lá Cà Phê AI
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Upload ảnh lá cà phê để AI phân tích và chẩn đoán bệnh với độ chính xác cao
          </p>

          {/* Processing Mode Toggle */}
          <div className="mt-4 flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
            <InformationCircleIcon className="h-5 w-5 text-blue-600" />
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-blue-900">Chế độ xử lý:</span>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="sync"
                  checked={processingMode === 'sync'}
                  onChange={(e) => setProcessingMode(e.target.value)}
                  className="text-blue-600"
                />
                <span className="text-sm text-blue-800">Đồng bộ (nhanh)</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="async"
                  checked={processingMode === 'async'}
                  onChange={(e) => setProcessingMode(e.target.value)}
                  className="text-blue-600"
                />
                <span className="text-sm text-blue-800">Bất đồng bộ (chất lượng cao)</span>
              </label>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* File Upload */}
            <UploadZone
              onFileSelect={handleFileSelect}
              selectedFile={selectedFile}
              preview={preview}
              onRemove={handleRemoveFile}
            />

            {/* Symptoms Selection */}
            <SymptomSelector
              symptoms={symptoms}
              selectedSymptoms={selectedSymptoms}
              onSymptomToggle={handleSymptomToggle}
            />

            {/* Notes Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Ghi chú thêm (tùy chọn)
              </h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Mô tả thêm về tình trạng cây, điều kiện thời tiết, thời gian phát hiện bệnh..."
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none transition-colors"
                rows={4}
                maxLength={500}
              />
              <div className="mt-2 text-xs text-gray-500 text-right">
                {notes.length}/500 ký tự
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleSubmit}
                disabled={!selectedFile || isUploading}
                className={`
                  flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-lg font-semibold text-white transition-all transform
                  ${!selectedFile || isUploading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 hover:scale-105 shadow-lg hover:shadow-xl'
                  }
                `}
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    {processingMode === 'async' ? 'Đang xử lý...' : 'Đang phân tích...'}
                  </>
                ) : (
                  <>
                    <SparklesIcon className="h-5 w-5" />
                    Phân tích ngay
                  </>
                )}
              </button>

              {(selectedFile || result) && (
                <button
                  onClick={handleReset}
                  disabled={isUploading}
                  className="px-6 py-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowPathIcon className="h-5 w-5 inline mr-2" />
                  Làm mới
                </button>
              )}
            </div>

            {/* Progress Bar */}
            <ProgressBar
              progress={uploadProgress}
              isVisible={isUploading}
              message={processingMode === 'async' ? 'Đang xử lý trong hàng đợi' : 'Đang phân tích'}
            />

            {/* Processing Info */}
            {processingMode === 'async' && (
              <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-6">
                <h3 className="font-semibold text-yellow-900 mb-3 flex items-center gap-2">
                  <InformationCircleIcon className="h-5 w-5" />
                  Chế độ xử lý bất đồng bộ
                </h3>
                <ul className="text-sm text-yellow-800 space-y-2">
                  <li>• Ảnh sẽ được xử lý bằng mô hình AI chất lượng cao</li>
                  <li>• Thời gian xử lý: 2-5 phút tùy vào độ phức tạp</li>
                  <li>• Kết quả sẽ được cập nhật tự động</li>
                  <li>• Bạn có thể rời khỏi trang và quay lại sau</li>
                </ul>
              </div>
            )}
          </div>

          {/* Result Section */}
          <div className="space-y-6">
            <ResultDisplay
              result={result}
              onSave={handleSaveResult}
              onShare={handleShareResult}
              onFeedback={handleFeedback}
            />

            {/* Tips */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border border-green-200 p-6">
              <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                <ExclamationTriangleIcon className="h-5 w-5" />
                Mẹo để có kết quả tốt nhất
              </h3>
              <ul className="text-sm text-green-800 space-y-2">
                <li>• Chụp ảnh rõ nét, đủ sáng tự nhiên</li>
                <li>• Tập trung vào lá bị bệnh rõ nhất</li>
                <li>• Tránh bóng đổ che khuất triệu chứng</li>
                <li>• Chọn triệu chứng quan sát được</li>
                <li>• Thêm ghi chú về điều kiện môi trường</li>
                <li>• Sử dụng chế độ async cho kết quả chính xác hơn</li>
              </ul>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Thống kê hệ thống</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Độ chính xác AI:</span>
                  <span className="font-medium text-green-600">87.5%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Ảnh đã phân tích:</span>
                  <span className="font-medium text-blue-600">15,247+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Bệnh phát hiện:</span>
                  <span className="font-medium text-purple-600">5 loại</span>
                </div>
              </div>
            </div>

            {/* User Info */}
            {user && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Thông tin tài khoản</h3>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Xin chào, <span className="font-medium text-gray-900">{user.fullName || user.userName}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Vai trò: <span className="font-medium text-blue-600">{user.role}</span>
                  </p>
                  {user.role === 'Admin' && (
                    <p className="text-xs text-green-600">
                      ✓ Bạn có quyền truy cập đầy đủ các tính năng
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Hoạt động gần đây</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Hệ thống hoạt động bình thường</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Model AI được cập nhật mới nhất</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>Độ chính xác đã được cải thiện</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Disease Info Cards */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Bệnh Rỉ Sắt</h3>
            <p className="text-sm text-gray-600 mb-3">
              Bệnh phổ biến nhất trên cây cà phê, gây ra bởi nấm Hemileia vastatrix.
            </p>
            <div className="text-xs text-gray-500">
              Triệu chứng: Đốm vàng, bột cam đỏ
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Bệnh Cercospora</h3>
            <p className="text-sm text-gray-600 mb-3">
              Gây ra các đốm nâu tròn với viền đỏ trên lá cà phê.
            </p>
            <div className="text-xs text-gray-500">
              Triệu chứng: Đốm nâu, viền đỏ
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Lá Khỏe Mạnh</h3>
            <p className="text-sm text-gray-600 mb-3">
              Lá cà phê không có dấu hiệu bệnh tật, xanh tốt.
            </p>
            <div className="text-xs text-gray-500">
              Đặc điểm: Màu xanh đều, không đốm
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}