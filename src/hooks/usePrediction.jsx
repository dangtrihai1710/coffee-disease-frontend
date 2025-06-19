// ===================================================================
// File: src/hooks/usePrediction.jsx - CẬP NHẬT
// ===================================================================
'use client';

import { useState, useCallback } from 'react';
import { predictionService } from '@/services/predictionService';

export const usePrediction = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const uploadImage = useCallback(async (formData, onProgress = null) => {
    setLoading(true);
    setError(null);
    setProgress(0);
    
    try {
      const result = await predictionService.uploadImage(formData, (percent) => {
        setProgress(percent);
        onProgress?.(percent);
      });
      
      setPredictions(prev => [result, ...prev]);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
      setProgress(0);
    }
  }, []);

  // MỚI THÊM: Upload async
  const uploadImageAsync = useCallback(async (formData, onProgress = null) => {
    setLoading(true);
    setError(null);
    setProgress(0);
    
    try {
      const result = await predictionService.uploadImageAsync(formData, (percent) => {
        setProgress(percent);
        onProgress?.(percent);
      });
      
      // Nếu cần polling status
      if (result.requiresPolling) {
        const finalResult = await predictionService.pollPredictionStatus(result.id);
        setPredictions(prev => [finalResult, ...prev]);
        return finalResult;
      }
      
      setPredictions(prev => [result, ...prev]);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
      setProgress(0);
    }
  }, []);

  // MỚI THÊM: Upload batch
  const uploadBatch = useCallback(async (images, onProgress = null) => {
    setLoading(true);
    setError(null);
    setProgress(0);
    
    try {
      const result = await predictionService.uploadBatch(images, (percent) => {
        setProgress(percent);
        onProgress?.(percent);
      });
      
      // Add all results to predictions
      if (result.predictions) {
        setPredictions(prev => [...result.predictions, ...prev]);
      }
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
      setProgress(0);
    }
  }, []);

  const getHistory = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await predictionService.getHistory(params);
      setPredictions(result.data || []);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // MỚI THÊM: Get prediction detail
  const getPredictionDetail = useCallback(async (predictionId) => {
    try {
      const result = await predictionService.getPredictionDetail(predictionId);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const addFeedback = useCallback(async (predictionId, feedbackData) => {
    try {
      const result = await predictionService.addFeedback({
        predictionId,
        ...feedbackData
      });
      
      // Update local state
      setPredictions(prev => 
        prev.map(p => 
          p.id === predictionId 
            ? { ...p, feedbackRating: feedbackData.rating, hasFeeback: true }
            : p
        )
      );
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  return {
    predictions,
    loading,
    error,
    progress,
    uploadImage,
    uploadImageAsync, // MỚI
    uploadBatch, // MỚI  
    getHistory,
    getPredictionDetail, // MỚI
    addFeedback,
    clearError: () => setError(null),
    clearPredictions: () => setPredictions([])
  };
};