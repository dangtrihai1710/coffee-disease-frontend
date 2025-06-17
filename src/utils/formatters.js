// File: src/utils/formatters.js
import { format, formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

export const formatDate = (date, formatString = 'dd/MM/yyyy HH:mm') => {
  return format(new Date(date), formatString, { locale: vi });
};

export const formatRelativeTime = (date) => {
  return formatDistanceToNow(new Date(date), { 
    addSuffix: true, 
    locale: vi 
  });
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatConfidence = (confidence) => {
  return `${(confidence * 100).toFixed(1)}%`;
};

export const formatNumber = (number) => {
  return new Intl.NumberFormat('vi-VN').format(number);
};

export const getDiseaseColor = (diseaseName) => {
  const colors = {
    'Healthy': 'text-green-600 bg-green-100',
    'Cercospora': 'text-red-600 bg-red-100',
    'Rust': 'text-orange-600 bg-orange-100', 
    'Miner': 'text-yellow-600 bg-yellow-100',
    'Phoma': 'text-purple-600 bg-purple-100'
  };
  
  return colors[diseaseName] || 'text-gray-600 bg-gray-100';
};

export const getSeverityColor = (severity) => {
  const colors = {
    'Nhẹ': 'text-green-600 bg-green-100',
    'Trung bình': 'text-yellow-600 bg-yellow-100',
    'Nặng': 'text-red-600 bg-red-100',
    'Không rõ': 'text-gray-600 bg-gray-100'
  };
  
  return colors[severity] || 'text-gray-600 bg-gray-100';
};