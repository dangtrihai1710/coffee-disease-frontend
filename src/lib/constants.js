// File: src/lib/constants.js
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7179/api';

export const DISEASE_TYPES = [
  'Cercospora',
  'Healthy', 
  'Miner',
  'Phoma',
  'Rust'
];

export const SEVERITY_LEVELS = {
  'Nhẹ': 'text-green-600 bg-green-100',
  'Trung bình': 'text-yellow-600 bg-yellow-100', 
  'Nặng': 'text-red-600 bg-red-100',
  'Không rõ': 'text-gray-600 bg-gray-100'
};

export const IMAGE_ACCEPT_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png']
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB