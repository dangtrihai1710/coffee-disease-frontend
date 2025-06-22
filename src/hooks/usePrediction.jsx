// ===================================================================
// File: src/hooks/usePrediction.jsx - FIXED VERSION CHO API MỚI
// ===================================================================
'use client';

import { useState, useCallback } from 'react';
import predictionService from '@/services/predictionService';

// ✅ Upload steps constants
export const UPLOAD_STEPS = {
  PREPARING: 'PREPARING',
  UPLOADING: 'UPLOADING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  ERROR: 'ERROR'
};

export const usePrediction = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(null);

  // ✅ BACKWARDS COMPATIBILITY: Keep uploadImage for existing code
  const uploadImage = useCallback(async (file, options = {}) => {
    setLoading(true);
    setError(null);
    setProgress(0);
    setCurrentStep(UPLOAD_STEPS.PREPARING);
    
    try {
      // Validate file trước khi upload
      const validation = predictionService.validateImageFile(file);
      if (!validation.isValid) {
        throw new Error(validation.errors[0]);
      }

      // Chuẩn bị FormData
      const formData = predictionService.createAnalyzeFormData(file, options);
      
      setCurrentStep(UPLOAD_STEPS.UPLOADING);

      // Upload với progress tracking
      const result = await predictionService.analyzeImage(formData, (percent) => {
        setProgress(percent);
        if (percent === 100) {
          setCurrentStep(UPLOAD_STEPS.PROCESSING);
        }
      });
      
      setCurrentStep(UPLOAD_STEPS.COMPLETED);
      setProgress(100);
      
      // Format và lưu kết quả
      const formattedResult = predictionService.formatAnalysisResult(result);
      setPredictions(prev => [formattedResult, ...prev]);
      
      return formattedResult;
      
    } catch (err) {
      console.error('❌ Image analysis failed:', err);
      setError(err.message);
      setCurrentStep(UPLOAD_STEPS.ERROR);
      throw err;
    } finally {
      setLoading(false);
      setTimeout(() => {
        setProgress(0);
        setCurrentStep(null);
      }, 2000);
    }
  }, []);

  // ✅ New method name (same functionality as uploadImage)
  const analyzeImage = useCallback(async (file, options = {}) => {
    return await uploadImage(file, options);
  }, [uploadImage]);

  // ✅ Phân tích batch nhiều ảnh
  const analyzeBatch = useCallback(async (files, options = {}) => {
    setLoading(true);
    setError(null);
    setProgress(0);
    setCurrentStep(UPLOAD_STEPS.PREPARING);
    
    try {
      // Validate tất cả files
      for (const file of files) {
        const validation = predictionService.validateImageFile(file);
        if (!validation.isValid) {
          throw new Error(`File ${file.name}: ${validation.errors[0]}`);
        }
      }

      // Kiểm tra số lượng files (tối đa 10 theo backend)
      if (files.length > 10) {
        throw new Error('Tối đa 10 ảnh mỗi batch');
      }

      setCurrentStep(UPLOAD_STEPS.UPLOADING);

      // Upload batch
      const result = await predictionService.analyzeBatch(files, options, (percent) => {
        setProgress(percent);
        if (percent === 100) {
          setCurrentStep(UPLOAD_STEPS.PROCESSING);
        }
      });
      
      setCurrentStep(UPLOAD_STEPS.COMPLETED);
      setProgress(100);
      
      // Format và lưu kết quả
      const formattedResult = predictionService.formatBatchResult(result);
      
      // Thêm từng kết quả vào predictions list
      if (formattedResult.results && formattedResult.results.length > 0) {
        setPredictions(prev => [...formattedResult.results, ...prev]);
      }
      
      return formattedResult;
      
    } catch (err) {
      console.error('❌ Batch analysis failed:', err);
      setError(err.message);
      setCurrentStep(UPLOAD_STEPS.ERROR);
      throw err;
    } finally {
      setLoading(false);
      setTimeout(() => {
        setProgress(0);
        setCurrentStep(null);
      }, 2000);
    }
  }, []);

  // ✅ BACKWARDS COMPATIBILITY: Keep uploadBatch for existing code
  const uploadBatch = useCallback(async (files, options = {}) => {
    return await analyzeBatch(files, options);
  }, [analyzeBatch]);

  // ✅ Lấy lịch sử phân tích
  const getHistory = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await predictionService.getHistory(params);
      
      // Nếu có dữ liệu, update predictions list
      if (result && result.data) {
        const formattedResults = result.data.map(item => 
          predictionService.formatAnalysisResult(item)
        );
        setPredictions(formattedResults);
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

  // ✅ Kiểm tra sức khỏe service
  const checkHealth = useCallback(async () => {
    try {
      const result = await predictionService.checkHealth();
      return result;
    } catch (err) {
      console.error('❌ Health check failed:', err);
      return { healthy: false, error: err.message };
    }
  }, []);

  // ✅ Clear errors
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ✅ Clear predictions
  const clearPredictions = useCallback(() => {
    setPredictions([]);
  }, []);

  // ✅ Reset toàn bộ state
  const resetState = useCallback(() => {
    setPredictions([]);
    setLoading(false);
    setError(null);
    setProgress(0);
    setCurrentStep(null);
  }, []);

  // ✅ Get latest prediction
  const getLatestPrediction = useCallback(() => {
    return predictions[0] || null;
  }, [predictions]);

  // ✅ Get prediction by ID
  const getPredictionById = useCallback((id) => {
    return predictions.find(pred => pred.id === id || pred.predictionId === id);
  }, [predictions]);

  // ✅ Remove prediction from list
  const removePrediction = useCallback((id) => {
    setPredictions(prev => prev.filter(pred => 
      pred.id !== id && pred.predictionId !== id
    ));
  }, []);

  // ✅ Update prediction in list
  const updatePrediction = useCallback((id, updates) => {
    setPredictions(prev => prev.map(pred => 
      (pred.id === id || pred.predictionId === id) 
        ? { ...pred, ...updates }
        : pred
    ));
  }, []);

  // ✅ Get predictions by disease
  const getPredictionsByDisease = useCallback((diseaseName) => {
    return predictions.filter(pred => pred.diseaseName === diseaseName);
  }, [predictions]);

  // ✅ Get recent predictions
  const getRecentPredictions = useCallback((limit = 5) => {
    return predictions
      .sort((a, b) => new Date(b.predictionDate) - new Date(a.predictionDate))
      .slice(0, limit);
  }, [predictions]);

  // ✅ Calculate statistics
  const getStatistics = useCallback(() => {
    const total = predictions.length;
    const diseaseCount = {};
    let averageConfidence = 0;
    
    predictions.forEach(pred => {
      // Count diseases
      if (pred.diseaseName) {
        diseaseCount[pred.diseaseName] = (diseaseCount[pred.diseaseName] || 0) + 1;
      }
      
      // Sum confidence
      averageConfidence += pred.finalConfidence || pred.confidence || 0;
    });
    
    averageConfidence = total > 0 ? averageConfidence / total : 0;
    
    return {
      total,
      diseaseCount,
      averageConfidence: Math.round(averageConfidence * 100) / 100,
      healthyCount: diseaseCount['Healthy'] || 0,
      infectedCount: total - (diseaseCount['Healthy'] || 0)
    };
  }, [predictions]);

  return {
    // State
    predictions,
    loading,
    error,
    progress,
    currentStep,
    
    // Primary Actions (NEW API)
    analyzeImage,
    analyzeBatch,
    getHistory,
    checkHealth,
    
    // Backwards Compatibility (OLD API) 
    uploadImage,    // ✅ Same as analyzeImage
    uploadBatch,    // ✅ Same as analyzeBatch
    
    // Utilities
    clearError,
    clearPredictions,
    resetState,
    getLatestPrediction,
    getPredictionById,
    removePrediction,
    updatePrediction,
    getPredictionsByDisease,
    getRecentPredictions,
    getStatistics,
    
    // Constants
    UPLOAD_STEPS
  };
};