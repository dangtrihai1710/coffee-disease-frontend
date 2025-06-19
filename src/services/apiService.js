// File: src/services/apiService.js - IMPROVED WITH AUTH TOKEN SUPPORT
import { API_BASE_URL, ERROR_MESSAGES } from '@/lib/constants';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
    this.authToken = null;
  }

  // ✅ NEW: Set authentication token
  setAuthToken(token) {
    this.authToken = token;
    console.log('🔐 Auth token updated:', token ? 'Set' : 'Cleared');
  }

  // ✅ IMPROVED: Get authentication token
  getAuthToken() {
    // Ưu tiên token được set trực tiếp, fallback về localStorage
    return this.authToken || localStorage.getItem('authToken');
  }

  // ✅ IMPROVED: Get headers with authentication
  getHeaders(additionalHeaders = {}) {
    const token = this.getAuthToken();
    return {
      ...this.defaultHeaders,
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...additionalHeaders
    };
  }

  // ✅ IMPROVED: Handle API response
  async handleResponse(response) {
    console.log('📡 API Response:', {
      url: response.url,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.Message || errorData.error || errorMessage;
      } catch (e) {
        console.warn('Could not parse error response as JSON');
      }

      // Handle specific status codes
      switch (response.status) {
        case 401:
          // Clear token on unauthorized
          this.setAuthToken(null);
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          throw new Error(ERROR_MESSAGES.UNAUTHORIZED || 'Phiên đăng nhập đã hết hạn');
        case 403:
          throw new Error(ERROR_MESSAGES.FORBIDDEN || 'Bạn không có quyền truy cập');
        case 404:
          throw new Error('Endpoint không tồn tại');
        case 500:
          throw new Error(ERROR_MESSAGES.SERVER_ERROR || 'Lỗi server nội bộ');
        default:
          throw new Error(errorMessage);
      }
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    
    return response.text();
  }

  // ✅ IMPROVED: Build URL with query parameters
  buildUrl(endpoint, params = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    if (Object.keys(params).length === 0) {
      return url;
    }

    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });

    return `${url}?${searchParams.toString()}`;
  }

  // ✅ IMPROVED: Generic request method
  async request(method, endpoint, options = {}) {
    const { params, body, headers: customHeaders, ...fetchOptions } = options;
    
    const url = this.buildUrl(endpoint, params);
    const headers = this.getHeaders(customHeaders);

    console.log('🔗 API Request:', {
      method,
      url,
      headers: { ...headers, Authorization: headers.Authorization ? '[HIDDEN]' : undefined },
      body: body ? JSON.stringify(body) : null
    });

    try {
      const response = await fetch(url, {
        method,
        headers,
        ...(body && { body: JSON.stringify(body) }),
        ...fetchOptions
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('❌ API Request failed:', {
        method,
        url,
        error: error.message,
        stack: error.stack
      });

      // Handle network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error(ERROR_MESSAGES.NETWORK_ERROR || 'Lỗi kết nối mạng');
      }

      // Re-throw API errors as-is
      throw error;
    }
  }

  // ✅ HTTP Methods
  async get(endpoint, options = {}) {
    return this.request('GET', endpoint, options);
  }

  async post(endpoint, body = null, options = {}) {
    return this.request('POST', endpoint, { ...options, body });
  }

  async put(endpoint, body = null, options = {}) {
    return this.request('PUT', endpoint, { ...options, body });
  }

  async patch(endpoint, body = null, options = {}) {
    return this.request('PATCH', endpoint, { ...options, body });
  }

  async delete(endpoint, options = {}) {
    return this.request('DELETE', endpoint, options);
  }

  // ✅ IMPROVED: File upload method
  async uploadFile(endpoint, file, additionalData = {}) {
    const token = this.getAuthToken();
    const formData = new FormData();
    
    formData.append('file', file);
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    console.log('📤 File Upload:', {
      endpoint,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      additionalData,
      hasToken: !!token
    });

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` })
          // Don't set Content-Type for FormData - browser will set it with boundary
        },
        body: formData
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('❌ File upload failed:', error);
      throw error;
    }
  }

  // ✅ NEW: Upload with progress tracking
  async uploadWithProgress(endpoint, formData, onProgress) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const token = this.getAuthToken();

      // Setup progress tracking
      if (onProgress) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            onProgress(progress);
          }
        });
      }

      // Setup response handling
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (e) {
            resolve(xhr.responseText);
          }
        } else {
          reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });

      // Setup request
      xhr.open('POST', `${this.baseURL}${endpoint}`);
      
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      // Send request
      xhr.send(formData);
    });
  }

  // ✅ IMPROVED: Health check
  async healthCheck() {
    try {
      const response = await this.get('/health');
      return { healthy: true, data: response };
    } catch (error) {
      return { healthy: false, error: error.message };
    }
  }

  // ✅ NEW: Initialize authentication
  initializeAuth() {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.setAuthToken(token);
    }
  }

  // ✅ NEW: Clear authentication
  clearAuth() {
    this.setAuthToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }
}

// Create and export singleton instance
const apiClient = new ApiService();

// Auto-initialize auth on startup
if (typeof window !== 'undefined') {
  apiClient.initializeAuth();
}

export default apiClient;

// ✅ Named exports for convenience
export const {
  get,
  post,
  put,
  patch,
  delete: del,
  uploadFile,
  uploadWithProgress,
  healthCheck,
  setAuthToken,
  clearAuth
} = apiClient;