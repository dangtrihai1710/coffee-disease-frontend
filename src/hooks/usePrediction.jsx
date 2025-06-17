// File: src/hooks/usePrediction.jsx
'use client';

import { useState, useEffect } from 'react';
import { predictionService } from '@/services/predictionService';

export const usePrediction = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const uploadImage = async (formData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await predictionService.uploadImage(formData);
      setPredictions(prev => [result, ...prev]);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const uploadImageAsync = async (formData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await predictionService.uploadImageAsync(formData);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getHistory = async (params = {}) => {
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
  };

  const addFeedback = async (predictionId, feedbackData) => {
    try {
      const result = await predictionService.addFeedback({
        predictionId,
        ...feedbackData
      });
      
      // Update local state
      setPredictions(prev => 
        prev.map(p => 
          p.id === predictionId 
            ? { ...p, feedbackRating: feedbackData.rating }
            : p
        )
      );
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    predictions,
    loading,
    error,
    uploadImage,
    uploadImageAsync,
    getHistory,
    addFeedback,
    clearError: () => setError(null)
  };
};