// ===================================================================
// File: src/hooks/usePrediction.jsx - CẬP NHẬT CHO API THẬT
// ===================================================================
'use client';

import { useState, useCallback } from 'react';
import { predictionService } from '@/services/predictionService';
import { 
  validateImageFile, 
  UPLOAD_STEPS,
  ERROR_CODES,
  ERROR_MESSAGES 
} from '@/lib/constants/prediction';

export const usePrediction = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(null);

  // ✅ Upload ảnh đồng bộ với validation
  const uploadImage = useCallback(async (file, options = {}) => {
    setLoading(true);
    setError(null);
    setProgress(0);
    setCurrentStep(UPLOAD_STEPS.PREPARING);
    
    try {
      // Validate file trước khi upload
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        throw new Error(validation.errors[0]);
      }

      // Chuẩn bị FormData
      const formData = new FormData();
      formData.append('Image', file);
      
      // Thêm symptom IDs nếu có
      if (options.symptomIds && options.symptomIds.length > 0) {
        options.symptomIds.forEach(id => {
          formData.append('SymptomIds', id);
        });
      }
      
      // Thêm notes nếu có
      if (options.notes) {
        formData.append('Notes', options.notes);
      }

      setCurrentStep(UPLOAD_STEPS.UPLOADING);

      // Upload với progress tracking
      const result = await predictionService.uploadImage(formData, (percent) => {
        setProgress(percent);
        if (percent === 100) {
          setCurrentStep(UPLOAD_STEPS.PROCESSING);
        }
      });

      setCurrentStep(UPLOAD_STEPS.COMPLETED);
      setProgress(100);
      
      // Cập nhật state với kết quả mới
      setPredictions(prev => [result, ...prev]);
      
      console.log('✅ Upload completed:', result);
      return result;
      
    } catch (err) {
      console.error('❌ Upload failed:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
      // Reset sau 2 giây
      setTimeout(() => {
        setProgress(0);
        setCurrentStep(null);
      }, 2000);
    }
  }, []);

  // ✅ Upload ảnh bất đồng bộ (async)
  const uploadImageAsync = useCallback(async (file, options = {}) => {
    setLoading(true);
    setError(null);
    setProgress(0);
    setCurrentStep(UPLOAD_STEPS.PREPARING);
    
    try {
      // Validate file
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        throw new Error(validation.errors[0]);
      }

      // Chuẩn bị FormData
      const formData = new FormData();
      formData.append('Image', file);
      
      if (options.symptomIds && options.symptomIds.length > 0) {
        options.symptomIds.forEach(id => {
          formData.append('SymptomIds', id);
        });
      }
      
      if (options.notes) {
        formData.append('Notes', options.notes);
      }

      setCurrentStep(UPLOAD_STEPS.UPLOADING);

      // Upload async
      const uploadResult = await predictionService.uploadImageAsync(formData, (percent) => {
        setProgress(percent);
        if (percent === 100) {
          setCurrentStep(UPLOAD_STEPS.PROCESSING);
        }
      });

      // Nếu cần polling status
      if (uploadResult.requiresPolling && uploadResult.taskId) {
        const finalResult = await predictionService.pollPredictionStatus(
          uploadResult.taskId,
          30, // max attempts
          2000 // interval ms
        );
        
        setCurrentStep(UPLOAD_STEPS.COMPLETED);
        setProgress(100);
        
        setPredictions(prev => [finalResult, ...prev]);
        return finalResult;
      }
      
      // Nếu kết quả trả về ngay
      setCurrentStep(UPLOAD_STEPS.COMPLETED);
      setProgress(100);
      
      setPredictions(prev => [uploadResult, ...prev]);
      return uploadResult;
      
    } catch (err) {
      console.error('❌ Async upload failed:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
      setTimeout(() => {
        setProgress(0);
        setCurrentStep(null);
      }, 2000);
    }
  }, []);

  // ✅ Upload batch nhiều ảnh
  const uploadBatch = useCallback(async (files, options = {}) => {
    setLoading(true);
    setError(null);
    setProgress(0);
    setCurrentStep(UPLOAD_STEPS.PREPARING);
    
    try {
      // Validate tất cả files
      for (const file of files) {
        const validation = validateImageFile(file);
        if (!validation.isValid) {
          throw new Error(`File ${file.name}: ${validation.errors[0]}`);
        }
      }

      setCurrentStep(UPLOAD_STEPS.UPLOADING);

      // Upload batch
      const result = await predictionService.uploadBatch(files, options, (percent) => {
        setProgress(percent);
        if (percent === 100) {
          setCurrentStep(UPLOAD_STEPS.PROCESSING);
        }
      });
      
      setCurrentStep(UPLOAD_STEPS.COMPLETED);
      setProgress(100);
      
      // Thêm tất cả kết quả vào predictions
      if (result.predictions && result.predictions.length > 0) {
        setPredictions(prev => [...result.predictions, ...prev]);
      }
      
      return result;
      
    } catch (err) {
      console.error('❌ Batch upload failed:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
      setTimeout(() => {
        setProgress(0);
        setCurrentStep(null);
      }, 2000);
    }
  }, []);

  // ✅ Lấy lịch sử dự đoán
  const getHistory = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await predictionService.getHistory(params);
      
      // Cập nhật predictions với data từ API
      if (result.data) {
        setPredictions(result.data);
      } else if (Array.isArray(result)) {
        setPredictions(result);
      }
      
      return result;
    } catch (err) {
      console.error('❌ Get history failed:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Lấy chi tiết prediction
  const getPredictionDetail = useCallback(async (predictionId) => {
    try {
      const result = await predictionService.getPredictionDetail(predictionId);
      return result;
    } catch (err) {
      console.error('❌ Get prediction detail failed:', err);
      setError(err.message);
      throw err;
    }
  }, []);

  // ✅ Gửi feedback
  const submitFeedback = useCallback(async (predictionId, feedbackData) => {
    try {
      const result = await predictionService.submitFeedback({
        predictionId,
        ...feedbackData
      });
      
      // Cập nhật prediction trong state
      setPredictions(prev => 
        prev.map(p => 
          p.id === predictionId 
            ? { 
                ...p, 
                feedbackRating: feedbackData.rating,
                feedbackText: feedbackData.feedbackText,
                hasFeedback: true 
              }
            : p
        )
      );
      
      return result;
    } catch (err) {
      console.error('❌ Submit feedback failed:', err);
      setError(err.message);
      throw err;
    }
  }, []);

  // ✅ Lấy danh sách triệu chứng
  const getSymptoms = useCallback(async () => {
    try {
      const result = await predictionService.getSymptoms();
      return result;
    } catch (err) {
      console.error('❌ Get symptoms failed:', err);
      setError(err.message);
      throw err;
    }
  }, []);

  // ✅ Lấy thống kê mô hình
  const getModelStats = useCallback(async () => {
    try {
      const result = await predictionService.getModelStats();
      return result;
    } catch (err) {
      console.error('❌ Get model stats failed:', err);
      setError(err.message);
      throw err;
    }
  }, []);

  // ✅ Kiểm tra trạng thái xử lý
  const checkProcessingStatus = useCallback(async (leafImageId) => {
    try {
      const result = await predictionService.getProcessingStatus(leafImageId);
      return result;
    } catch (err) {
      console.error('❌ Check status failed:', err);
      setError(err.message);
      throw err;
    }
  }, []);

  // ✅ Utility functions
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearPredictions = useCallback(() => {
    setPredictions([]);
  }, []);

  const resetState = useCallback(() => {
    setPredictions([]);
    setError(null);
    setProgress(0);
    setCurrentStep(null);
    setLoading(false);
  }, []);

  // ✅ Get latest prediction
  const getLatestPrediction = useCallback(() => {
    return predictions.length > 0 ? predictions[0] : null;
  }, [predictions]);

  // ✅ Get predictions by disease
  const getPredictionsByDisease = useCallback((diseaseName) => {
    return predictions.filter(p => p.diseaseName === diseaseName);
  }, [predictions]);

  return {
    // State
    predictions,
    loading,
    error,
    progress,
    currentStep,
    
    // Upload functions
    uploadImage,
    uploadImageAsync,
    uploadBatch,
    
    // Data functions
    getHistory,
    getPredictionDetail,
    getSymptoms,
    getModelStats,
    
    // Feedback
    submitFeedback,
    
    // Status
    checkProcessingStatus,
    
    // Utility functions
    clearError,
    clearPredictions,
    resetState,
    getLatestPrediction,
    getPredictionsByDisease
  };
};