// ===================================================================
// File: src/hooks/usePrediction.jsx - FIXED VERSION VỚI XỬ LÝ DỮ LIỆU AN TOÀN
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

// ✅ Safe data transformation helpers
const safePredictionTransform = (rawResult) => {
  try {
    if (!rawResult) {
      console.warn('No prediction result received');
      return null;
    }

    console.log('🔄 Transforming raw result:', rawResult);

    // Helper function to safely extract string values
    const safeString = (value, fallback = 'Không xác định') => {
      if (value === null || value === undefined) return fallback;
      if (typeof value === 'object') {
        return value.name || value.value || value.toString() || fallback;
      }
      return String(value);
    };

    // Helper function to safely extract numbers
    const safeNumber = (value, fallback = 0) => {
      if (typeof value === 'number' && !isNaN(value)) return value;
      if (typeof value === 'string' && !isNaN(parseFloat(value))) return parseFloat(value);
      return fallback;
    };

    // Helper function to safely extract dates
    const safeDate = (value) => {
      try {
        if (!value) return new Date().toISOString();
        const date = new Date(value);
        return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
      } catch (error) {
        console.warn('Error parsing date:', error);
        return new Date().toISOString();
      }
    };

    // Transform the result with safe extraction
    const transformedResult = {
      // Core prediction data
      id: rawResult.id || rawResult.predictionId || null,
      predictionId: rawResult.predictionId || rawResult.id || null,
      leafImageId: rawResult.leafImageId || null,
      
      // Disease information - safely extracted
      diseaseName: safeString(rawResult.diseaseName || rawResult.disease || rawResult.name),
      confidence: safeNumber(rawResult.confidence || rawResult.finalConfidence, 0),
      finalConfidence: safeNumber(rawResult.finalConfidence || rawResult.confidence, 0),
      
      // Severity and treatment
      severityLevel: rawResult.severityLevel ? safeString(rawResult.severityLevel) : null,
      treatmentSuggestion: rawResult.treatmentSuggestion ? safeString(rawResult.treatmentSuggestion) : null,
      description: rawResult.description ? safeString(rawResult.description) : null,
      
      // Metadata
      predictionDate: safeDate(rawResult.predictionDate || rawResult.timestamp),
      imagePath: safeString(rawResult.imagePath || rawResult.imageUrl, ''),
      
      // Processing info
      processingTimeMs: safeNumber(rawResult.processingTimeMs || rawResult.processingTime, 0),
      modelVersion: safeString(rawResult.modelVersion || rawResult.model, 'ResNet50 v1.0'),
      modelType: safeString(rawResult.modelType, 'CNN'),
      
      // Additional data
      detectedSymptoms: Array.isArray(rawResult.detectedSymptoms) ? rawResult.detectedSymptoms : [],
      isRealAI: Boolean(rawResult.isRealAI),
      status: safeString(rawResult.status, 'completed'),
      
      // Keep original data for debugging
      _original: rawResult
    };

    console.log('✅ Transformed result:', transformedResult);
    return transformedResult;

  } catch (error) {
    console.error('❌ Error transforming prediction result:', error);
    console.error('Raw result was:', rawResult);
    
    // Return a safe fallback result
    return {
      id: null,
      predictionId: null,
      leafImageId: null,
      diseaseName: 'Lỗi xử lý kết quả',
      confidence: 0,
      finalConfidence: 0,
      severityLevel: null,
      treatmentSuggestion: 'Vui lòng thử lại hoặc liên hệ hỗ trợ',
      description: 'Có lỗi xảy ra khi xử lý kết quả phân tích',
      predictionDate: new Date().toISOString(),
      imagePath: '',
      processingTimeMs: 0,
      modelVersion: 'Unknown',
      modelType: 'CNN',
      detectedSymptoms: [],
      isRealAI: false,
      status: 'error',
      _error: error.message,
      _original: rawResult
    };
  }
};

export const usePrediction = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(null);

  // ✅ Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ✅ Progress tracking handler
  const handleProgress = useCallback((progressData) => {
    try {
      if (typeof progressData === 'number') {
        setProgress(Math.min(100, Math.max(0, progressData)));
      } else if (progressData && typeof progressData.percent === 'number') {
        setProgress(Math.min(100, Math.max(0, progressData.percent)));
      }
    } catch (error) {
      console.warn('Progress tracking error:', error);
    }
  }, []);

  // ✅ MAIN UPLOAD IMAGE FUNCTION - FIXED WITH SAFE TRANSFORMATION
  const uploadImage = useCallback(async (file, options = {}) => {
    setLoading(true);
    setError(null);
    setProgress(0);
    setCurrentStep(UPLOAD_STEPS.PREPARING);
    
    try {
      console.log('🚀 Starting image upload and analysis...');
      
      // 1. Validate file
      const validation = predictionService.validateImageFile(file);
      if (!validation.isValid) {
        throw new Error(validation.errors[0]);
      }

      // 2. Create FormData
      setCurrentStep(UPLOAD_STEPS.UPLOADING);
      const formData = predictionService.createAnalyzeFormData(file, options);
      
      // 3. Set processing step before API call
      setProgress(50);
      setCurrentStep(UPLOAD_STEPS.PROCESSING);

      // 4. Call API with progress tracking
      const rawResult = await predictionService.analyzeImage(formData, handleProgress);
      
      // 5. Transform result safely
      setCurrentStep(UPLOAD_STEPS.COMPLETED);
      setProgress(100);
      
      const safeResult = safePredictionTransform(rawResult);
      
      if (!safeResult) {
        throw new Error('Không thể xử lý kết quả phân tích');
      }

      // 6. Update predictions list
      setPredictions(prev => [safeResult, ...prev]);
      
      console.log('✅ Upload and analysis completed successfully');
      return safeResult;

    } catch (err) {
      console.error('❌ Upload image error:', err);
      setCurrentStep(UPLOAD_STEPS.ERROR);
      setError(err.message || 'Có lỗi xảy ra khi phân tích ảnh');
      throw err;
    } finally {
      setTimeout(() => {
        setLoading(false);
        setCurrentStep(null);
        setProgress(0);
      }, 1000); // Small delay to show completion
    }
  }, [handleProgress]);

  // ✅ ANALYZE IMAGE - ALIAS FOR UPLOAD IMAGE
  const analyzeImage = useCallback(async (file, options = {}) => {
    return await uploadImage(file, options);
  }, [uploadImage]);

  // ✅ BATCH ANALYSIS
  const analyzeBatch = useCallback(async (files, options = {}) => {
    setLoading(true);
    setError(null);
    setProgress(0);
    setCurrentStep(UPLOAD_STEPS.PREPARING);
    
    try {
      console.log('🚀 Starting batch analysis...');
      
      // Validate all files first
      for (const file of files) {
        const validation = predictionService.validateImageFile(file);
        if (!validation.isValid) {
          throw new Error(`${file.name}: ${validation.errors[0]}`);
        }
      }

      setCurrentStep(UPLOAD_STEPS.UPLOADING);
      setProgress(25);

      // Call batch API
      const rawResults = await predictionService.analyzeBatch(files, options, handleProgress);
      
      setCurrentStep(UPLOAD_STEPS.PROCESSING);
      setProgress(75);

      // Transform all results safely
      const safeResults = Array.isArray(rawResults) 
        ? rawResults.map(safePredictionTransform).filter(Boolean)
        : [];

      setCurrentStep(UPLOAD_STEPS.COMPLETED);
      setProgress(100);

      // Update predictions list
      setPredictions(prev => [...safeResults, ...prev]);
      
      console.log('✅ Batch analysis completed successfully');
      return safeResults;

    } catch (err) {
      console.error('❌ Batch analysis error:', err);
      setCurrentStep(UPLOAD_STEPS.ERROR);
      setError(err.message || 'Có lỗi xảy ra khi phân tích batch');
      throw err;
    } finally {
      setTimeout(() => {
        setLoading(false);
        setCurrentStep(null);
        setProgress(0);
      }, 1000);
    }
  }, [handleProgress]);

  // ✅ GET LATEST PREDICTION
  const getLatestPrediction = useCallback(() => {
    return predictions.length > 0 ? predictions[0] : null;
  }, [predictions]);

  // ✅ GET PREDICTION HISTORY
  const getHistory = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await predictionService.getHistory(params);
      
      // Transform history results safely
      const safeHistory = response.data 
        ? response.data.map(safePredictionTransform).filter(Boolean)
        : [];
      
      return {
        ...response,
        data: safeHistory
      };

    } catch (err) {
      console.error('❌ Get history error:', err);
      setError(err.message || 'Không thể tải lịch sử phân tích');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ BACKWARDS COMPATIBILITY
  const uploadBatch = useCallback(async (files, options = {}) => {
    return await analyzeBatch(files, options);
  }, [analyzeBatch]);

  return {
    // State
    predictions,
    loading,
    error,
    progress,
    currentStep,
    
    // Actions
    uploadImage,        // Main function - backwards compatible
    analyzeImage,       // Alias for uploadImage
    analyzeBatch,       // Batch analysis
    uploadBatch,        // Backwards compatible alias
    getHistory,         // Get prediction history
    getLatestPrediction, // Get latest prediction
    clearError,         // Clear error state
    
    // Utils
    UPLOAD_STEPS,
    
    // Debug - only in development
    ...(process.env.NODE_ENV === 'development' && {
      _safePredictionTransform: safePredictionTransform
    })
  };
};

export default usePrediction;