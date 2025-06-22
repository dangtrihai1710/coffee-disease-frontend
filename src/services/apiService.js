// ===================================================================
// File: src/services/apiService.js - VERSION HOÀN CHỈNH CHO API MỚI
// ===================================================================
import { API_BASE_URL, HTTP_STATUS, ERROR_MESSAGES, DEFAULT_API_OPTIONS } from '@/lib/constants';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = null;
    this.defaultOptions = DEFAULT_API_OPTIONS;
  }

  // ✅ Auth Token Management
  setAuthToken(token) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('authToken', token);
      } else {
        localStorage.removeItem('authToken');
      }
    }
  }

  getAuthToken() {
    if (this.token) return this.token;
    
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('authToken');
    }
    
    return this.token;
  }

  // ✅ Request Headers Builder
  getHeaders(isFormData = false) {
    const headers = {};
    
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    
    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  // ✅ Response Handler
  async handleResponse(response) {
    const contentType = response.headers.get('content-type');
    let data;
    
    try {
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }
    } catch (parseError) {
      console.error('❌ Failed to parse response:', parseError);
      data = null;
    }

    if (response.ok) {
      return data;
    }

    // Handle HTTP errors
    let errorMessage = ERROR_MESSAGES.SERVER_ERROR;
    
    switch (response.status) {
      case HTTP_STATUS.BAD_REQUEST:
        errorMessage = data?.message || ERROR_MESSAGES.REQUIRED_FIELDS;
        break;
      case HTTP_STATUS.UNAUTHORIZED:
        errorMessage = ERROR_MESSAGES.UNAUTHORIZED;
        this.clearAuth(); // Auto logout on 401
        break;
      case HTTP_STATUS.FORBIDDEN:
        errorMessage = ERROR_MESSAGES.FORBIDDEN;
        break;
      case HTTP_STATUS.NOT_FOUND:
        errorMessage = 'Không tìm thấy tài nguyên yêu cầu';
        break;
      case HTTP_STATUS.PAYLOAD_TOO_LARGE:
        errorMessage = ERROR_MESSAGES.FILE_TOO_LARGE;
        break;
      case HTTP_STATUS.UNSUPPORTED_MEDIA_TYPE:
        errorMessage = ERROR_MESSAGES.INVALID_FILE_TYPE;
        break;
      case HTTP_STATUS.SERVICE_UNAVAILABLE:
        errorMessage = ERROR_MESSAGES.AI_MODEL_UNAVAILABLE;
        break;
      default:
        errorMessage = data?.message || ERROR_MESSAGES.SERVER_ERROR;
    }

    const error = new Error(errorMessage);
    error.response = { status: response.status, data };
    error.status = response.status;
    
    throw error;
  }

  // ✅ Core Request Method with Retry Logic
  async request(method, endpoint, options = {}) {
    const { body, params, fetchOptions, retries = this.defaultOptions.retries } = options;
    
    let url = `${this.baseURL}${endpoint}`;
    
    // Add query parameters
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          searchParams.append(key, value);
        }
      });
      
      if (searchParams.toString()) {
        url += `?${searchParams.toString()}`;
      }
    }

    const headers = this.getHeaders(false);

    console.log(`🚀 API Request: ${method} ${url}`, {
      headers: { ...headers, Authorization: headers.Authorization ? '[HIDDEN]' : undefined },
      body: body ? 'Present' : undefined
    });

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url, {
          method,
          headers,
          ...(body && { body: JSON.stringify(body) }),
          signal: AbortSignal.timeout(this.defaultOptions.timeout),
          ...fetchOptions
        });

        return await this.handleResponse(response);
      } catch (error) {
        console.error(`❌ API Request failed (attempt ${attempt}/${retries}):`, {
          method,
          url,
          error: error.message,
          status: error.status
        });

        // Don't retry on certain errors
        if (error.status === HTTP_STATUS.UNAUTHORIZED || 
            error.status === HTTP_STATUS.FORBIDDEN ||
            error.status === HTTP_STATUS.BAD_REQUEST ||
            attempt === retries) {
          throw error;
        }

        // Wait before retry
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, this.defaultOptions.retryDelay * attempt));
        }
      }
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

  // ✅ File Upload Method (for multipart/form-data)
  async uploadFile(endpoint, formDataOrFile, additionalData = {}) {
    const token = this.getAuthToken();
    let formData;

    // Handle different input types
    if (formDataOrFile instanceof FormData) {
      formData = formDataOrFile;
      // Add additional data to existing FormData
      Object.entries(additionalData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });
    } else if (formDataOrFile instanceof File) {
      formData = new FormData();
      formData.append('Image', formDataOrFile); // Backend expects 'Image' field
      Object.entries(additionalData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });
    } else {
      throw new Error('uploadFile expects FormData or File object');
    }

    console.log('📤 File Upload:', {
      endpoint,
      hasFile: formData.has('Image') || formData.has('Images'),
      hasToken: !!token,
      formDataKeys: Array.from(formData.keys())
    });

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` })
          // Don't set Content-Type for FormData - browser will set it with boundary
        },
        body: formData,
        signal: AbortSignal.timeout(this.defaultOptions.timeout)
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('❌ File upload failed:', error);
      throw error;
    }
  }

  // ✅ Upload with Progress Tracking (using XMLHttpRequest)
  async uploadWithProgress(endpoint, formData, onProgress) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const token = this.getAuthToken();

      // Setup progress tracking
      if (onProgress && typeof onProgress === 'function') {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            onProgress(progress);
          }
        });
      }

      // Setup response handling
      xhr.addEventListener('load', async () => {
        try {
          if (xhr.status >= 200 && xhr.status < 300) {
            const contentType = xhr.getResponseHeader('content-type');
            let response;
            
            if (contentType && contentType.includes('application/json')) {
              response = JSON.parse(xhr.responseText);
            } else {
              response = xhr.responseText;
            }
            
            console.log('✅ Upload with progress completed:', response);
            resolve(response);
          } else {
            // Handle HTTP errors
            let errorMessage = ERROR_MESSAGES.SERVER_ERROR;
            let errorData = null;
            
            try {
              errorData = JSON.parse(xhr.responseText);
              errorMessage = errorData.message || errorMessage;
            } catch (e) {
              // Response is not JSON
            }
            
            const error = new Error(errorMessage);
            error.status = xhr.status;
            error.response = { status: xhr.status, data: errorData };
            reject(error);
          }
        } catch (error) {
          console.error('❌ Error processing upload response:', error);
          reject(error);
        }
      });

      xhr.addEventListener('error', () => {
        const error = new Error('Upload failed - Network error');
        console.error('❌ Upload network error:', error);
        reject(error);
      });

      xhr.addEventListener('timeout', () => {
        const error = new Error('Upload failed - Request timeout');
        console.error('❌ Upload timeout:', error);
        reject(error);
      });

      // Setup request
      xhr.open('POST', `${this.baseURL}${endpoint}`);
      xhr.timeout = this.defaultOptions.timeout;
      
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      console.log('🚀 Starting upload with progress tracking...');
      
      // Send request
      xhr.send(formData);
    });
  }

  // ✅ Health Check
  async healthCheck() {
    try {
      const response = await this.get('/api/Health');
      return { healthy: true, data: response };
    } catch (error) {
      console.error('❌ Health check failed:', error);
      return { healthy: false, error: error.message, status: error.status };
    }
  }

  // ✅ Detailed Health Check
  async detailedHealthCheck() {
    try {
      const responses = await Promise.allSettled([
        this.get('/api/Health/status'),
        this.get('/api/Health/ready'),
        this.get('/api/Health/database'),
        this.get('/api/Health/ai-model')
      ]);

      return {
        overall: responses.every(r => r.status === 'fulfilled'),
        details: {
          status: responses[0].status === 'fulfilled' ? responses[0].value : responses[0].reason,
          ready: responses[1].status === 'fulfilled' ? responses[1].value : responses[1].reason,
          database: responses[2].status === 'fulfilled' ? responses[2].value : responses[2].reason,
          aiModel: responses[3].status === 'fulfilled' ? responses[3].value : responses[3].reason
        }
      };
    } catch (error) {
      return { overall: false, error: error.message };
    }
  }

  // ✅ Initialize Authentication
  initializeAuth() {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        this.setAuthToken(token);
      }
    }
  }

  // ✅ Clear Authentication
  clearAuth() {
    this.setAuthToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      // Optionally redirect to login
      if (window.location.pathname !== '/login') {
        console.log('🔄 Redirecting to login due to auth clearance');
        window.location.href = '/login';
      }
    }
  }

  // ✅ Request Interceptor (for adding common headers, logging, etc.)
  addRequestInterceptor(interceptor) {
    this.requestInterceptors = this.requestInterceptors || [];
    this.requestInterceptors.push(interceptor);
  }

  // ✅ Response Interceptor
  addResponseInterceptor(interceptor) {
    this.responseInterceptors = this.responseInterceptors || [];
    this.responseInterceptors.push(interceptor);
  }

  // ✅ Test Connection
  async testConnection() {
    try {
      console.log('🔗 Testing server connection...');
      
      const response = await fetch(`${this.baseURL}/api/Health/ping`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000) // 5 second timeout for connection test
      });
      
      if (response.ok) {
        console.log('✅ Server connection successful');
        return { success: true, status: response.status };
      } else {
        console.log('❌ Server responded with error:', response.status);
        return { 
          success: false, 
          status: response.status,
          suggestion: 'Server trả về lỗi. Kiểm tra server logs.'
        };
      }
    } catch (error) {
      console.error('❌ Connection test failed:', error);
      return { 
        success: false, 
        error: error.message,
        suggestion: this.getConnectionErrorSuggestion(error)
      };
    }
  }

  // ✅ Connection Error Suggestions
  getConnectionErrorSuggestion(error) {
    if (error.name === 'TimeoutError') {
      return 'Kết nối timeout. Kiểm tra server có đang chạy không.';
    }
    if (error.message?.includes('ECONNREFUSED')) {
      return 'Backend chưa khởi động. Chạy: dotnet run';
    }
    if (error.message?.includes('ENOTFOUND')) {
      return 'Sai cấu hình URL API. Kiểm tra NEXT_PUBLIC_API_BASE_URL';
    }
    if (error.message?.includes('CORS')) {
      return 'Lỗi CORS policy. Kiểm tra CORS config trong backend';
    }
    if (error.message?.includes('SSL') || error.message?.includes('certificate')) {
      return 'Lỗi SSL certificate. Accept certificate trong browser';
    }
    if (error.message?.includes('Failed to fetch')) {
      return 'Không thể kết nối đến server. Kiểm tra URL và server status.';
    }
    return 'Lỗi network không xác định. Kiểm tra kết nối internet và server.';
  }

  // ✅ Debug Information
  getDebugInfo() {
    return {
      baseURL: this.baseURL,
      hasToken: !!this.getAuthToken(),
      tokenLength: this.getAuthToken()?.length || 0,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Server',
      timestamp: new Date().toISOString()
    };
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
  detailedHealthCheck,
  setAuthToken,
  getAuthToken,
  clearAuth,
  testConnection,
  getDebugInfo
} = apiClient;