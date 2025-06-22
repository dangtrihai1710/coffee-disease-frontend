// ===================================================================
// File: src/components/UploadComponent.jsx - CẬP NHẬT THEO API MỚI
// ===================================================================
'use client';

import React, { useState, useCallback } from 'react';
import { usePrediction } from '@/hooks/usePrediction';
import { 
  DISEASE_NAMES, 
  UPLOAD_STEP_LABELS, 
  FILE_VALIDATION,
  SUCCESS_MESSAGES 
} from '@/lib/constants';

const UploadComponent = () => {
  const {
    predictions,
    loading,
    error,
    progress,
    currentStep,
    analyzeImage,
    analyzeBatch,
    clearError,
    UPLOAD_STEPS
  } = usePrediction();

  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadMode, setUploadMode] = useState('single'); // 'single' | 'batch'
  const [analysisOptions, setAnalysisOptions] = useState({
    includeSymptomAnalysis: false,
    notes: '',
    symptomIds: []
  });

  // ✅ Handle file drag events
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  // ✅ Handle file drop
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      handleFileSelection(files);
    }
  }, [uploadMode]);

  // ✅ Handle file input change
  const handleFileChange = useCallback((e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const files = Array.from(e.target.files);
      handleFileSelection(files);
    }
  }, [uploadMode]);

  // ✅ Handle file selection and validation
  const handleFileSelection = useCallback((files) => {
    clearError();
    
    // Validate file count for batch mode
    if (uploadMode === 'batch' && files.length > FILE_VALIDATION.MAX_BATCH_SIZE) {
      alert(`Tối đa ${FILE_VALIDATION.MAX_BATCH_SIZE} ảnh mỗi batch`);
      return;
    }

    // Validate each file
    const validFiles = [];
    const errors = [];

    files.forEach((file, index) => {
      if (!FILE_VALIDATION.ALLOWED_TYPES.includes(file.type)) {
        errors.push(`File ${file.name}: Định dạng không được hỗ trợ`);
        return;
      }

      if (file.size > FILE_VALIDATION.MAX_SIZE) {
        errors.push(`File ${file.name}: Quá lớn (>${FILE_VALIDATION.MAX_SIZE / 1024 / 1024}MB)`);
        return;
      }

      validFiles.push(file);
    });

    if (errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }

    setSelectedFiles(validFiles);
    
    // Auto upload for single mode
    if (uploadMode === 'single' && validFiles.length === 1) {
      handleUpload(validFiles[0]);
    }
  }, [uploadMode, analysisOptions]);

  // ✅ Handle upload
  const handleUpload = useCallback(async (fileOrFiles) => {
    try {
      if (uploadMode === 'single') {
        const file = fileOrFiles || selectedFiles[0];
        if (!file) {
          alert('Vui lòng chọn ảnh');
          return;
        }

        await analyzeImage(file, analysisOptions);
        alert(SUCCESS_MESSAGES.ANALYSIS_SUCCESS);
        setSelectedFiles([]);
      } else {
        const files = fileOrFiles || selectedFiles;
        if (!files || files.length === 0) {
          alert('Vui lòng chọn ít nhất 1 ảnh');
          return;
        }

        await analyzeBatch(files, analysisOptions);
        alert(SUCCESS_MESSAGES.BATCH_ANALYSIS_SUCCESS);
        setSelectedFiles([]);
      }
    } catch (err) {
      console.error('Upload failed:', err);
      // Error đã được handle trong hook
    }
  }, [uploadMode, selectedFiles, analysisOptions, analyzeImage, analyzeBatch]);

  // ✅ Remove selected file
  const removeFile = useCallback((index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  // ✅ Clear all files
  const clearFiles = useCallback(() => {
    setSelectedFiles([]);
    clearError();
  }, [clearError]);

  // ✅ Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          📷 Phân tích bệnh lá cà phê
        </h2>
        <p className="text-gray-600">
          Upload ảnh lá cà phê để AI phân tích và chẩn đoán bệnh
        </p>
      </div>

      {/* Upload Mode Toggle */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => {
              setUploadMode('single');
              clearFiles();
            }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              uploadMode === 'single'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📸 Ảnh đơn lẻ
          </button>
          <button
            onClick={() => {
              setUploadMode('batch');
              clearFiles();
            }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              uploadMode === 'batch'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📁 Batch (tối đa {FILE_VALIDATION.MAX_BATCH_SIZE} ảnh)
          </button>
        </div>
      </div>

      {/* Analysis Options */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">⚙️ Tùy chọn phân tích</h3>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={analysisOptions.includeSymptomAnalysis}
              onChange={(e) => setAnalysisOptions(prev => ({
                ...prev,
                includeSymptomAnalysis: e.target.checked
              }))}
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <span className="ml-2 text-sm text-gray-600">
              Bao gồm phân tích triệu chứng chi tiết
            </span>
          </label>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ghi chú (tùy chọn)
            </label>
            <textarea
              value={analysisOptions.notes}
              onChange={(e) => setAnalysisOptions(prev => ({
                ...prev,
                notes: e.target.value
              }))}
              placeholder="Thêm ghi chú về tình trạng cây, điều kiện môi trường..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              rows="2"
              maxLength="500"
            />
            <p className="text-xs text-gray-500 mt-1">
              {analysisOptions.notes.length}/500 ký tự
            </p>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div className="mb-6">
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
            dragActive
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          } ${loading ? 'pointer-events-none opacity-50' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            multiple={uploadMode === 'batch'}
            accept={FILE_VALIDATION.ALLOWED_TYPES.join(',')}
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={loading}
          />
          
          <div className="text-center">
            <div className="text-4xl mb-4">
              {loading ? '⏳' : selectedFiles.length > 0 ? '✅' : '📤'}
            </div>
            
            {loading ? (
              <div>
                <p className="text-lg font-medium text-gray-900 mb-2">
                  {UPLOAD_STEP_LABELS[currentStep] || 'Đang xử lý...'}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">{progress}%</p>
              </div>
            ) : selectedFiles.length > 0 ? (
              <div>
                <p className="text-lg font-medium text-gray-900 mb-2">
                  {uploadMode === 'single' 
                    ? `📷 Đã chọn: ${selectedFiles[0].name}`
                    : `📁 Đã chọn ${selectedFiles.length} ảnh`
                  }
                </p>
                {uploadMode === 'batch' && (
                  <button
                    onClick={() => handleUpload()}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                  >
                    🚀 Phân tích batch
                  </button>
                )}
              </div>
            ) : (
              <div>
                <p className="text-lg font-medium text-gray-900 mb-2">
                  {uploadMode === 'single' 
                    ? 'Kéo thả ảnh hoặc click để chọn'
                    : 'Kéy thả nhiều ảnh hoặc click để chọn'
                  }
                </p>
                <p className="text-sm text-gray-600">
                  Hỗ trợ JPG, PNG • Tối đa {FILE_VALIDATION.MAX_SIZE / 1024 / 1024}MB
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selected Files List (for batch mode) */}
      {uploadMode === 'batch' && selectedFiles.length > 0 && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-900">
              📁 Ảnh đã chọn ({selectedFiles.length})
            </h3>
            <button
              onClick={clearFiles}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              🗑️ Xóa tất cả
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl mr-3">🖼️</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex">
            <div className="text-red-500 text-xl mr-3">⚠️</div>
            <div>
              <h3 className="text-sm font-medium text-red-800">
                Có lỗi xảy ra
              </h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <button
                onClick={clearError}
                className="text-sm text-red-600 hover:text-red-800 mt-2 underline"
              >
                Đóng thông báo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recent Results */}
      {predictions.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            🔬 Kết quả phân tích gần đây
          </h3>
          <div className="grid gap-4">
            {predictions.slice(0, 3).map((prediction, index) => (
              <div key={prediction.id || index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-lg text-gray-900">
                      {DISEASE_NAMES[prediction.diseaseName] || prediction.diseaseName}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Độ tin cậy: {Math.round((prediction.finalConfidence || prediction.confidence) * 100)}%
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    prediction.diseaseName === 'Healthy'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {prediction.severityLevel || 'Đã phân tích'}
                  </span>
                </div>
                
                {prediction.description && (
                  <p className="text-sm text-gray-600 mb-2">{prediction.description}</p>
                )}
                
                {prediction.treatmentSuggestion && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-md">
                    <p className="text-sm font-medium text-blue-900 mb-1">💡 Gợi ý xử lý:</p>
                    <p className="text-sm text-blue-800">{prediction.treatmentSuggestion}</p>
                  </div>
                )}
                
                <div className="mt-3 flex justify-between items-center text-xs text-gray-500">
                  <span>
                    📅 {new Date(prediction.predictionDate).toLocaleString('vi-VN')}
                  </span>
                  {prediction.processingTimeMs && (
                    <span>⚡ {prediction.processingTimeMs}ms</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadComponent;