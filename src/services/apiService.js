// File: src/services/apiService.js - FIXED VERSION WITH BETTER ERROR HANDLING
class ApiService {
  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:7179';
    this.authToken = null;
    this.defaultOptions = {
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      }
    };
    
    console.log('🔗 API Service initialized with base URL:', this.baseURL);
  }

  // ✅ Set authentication token
  setAuthToken(token) {
    this.authToken = token;
    if (token) {
      console.log('🔐 Auth token set for API requests');
    } else {
      console.log('🔓 Auth token cleared');
    }
  }

  // ✅ Get headers with auth
  getHeaders(customHeaders = {}) {
    const headers = { ...this.defaultOptions.headers, ...customHeaders };
    
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }
    
    return headers;
  }

  // ✅ Enhanced fetch with better error handling
  async fetchWithAuth(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      ...this.defaultOptions,
      ...options,
      headers: this.getHeaders(options.headers)
    };

    console.log(`🚀 API Request: ${options.method || 'GET'} ${url}`);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.timeout);
      
      const response = await fetch(url, {
        ...config,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      console.log(`📡 API Response: ${response.status} ${response.statusText}`);
      
      // Handle different response types
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }
      
      // ✅ SUCCESS RESPONSES
      if (response.ok) {
        console.log('✅ API Success:', { status: response.status, endpoint });
        return data;
      }
      
      // ✅ ERROR RESPONSES
      console.error(`❌ API Error: ${response.status}`, data);
      
      // Format error based on response
      const error = new Error();
      error.status = response.status;
      error.statusText = response.statusText;
      
      if (typeof data === 'object' && data !== null) {
        error.message = data.message || data.title || `HTTP ${response.status}`;
        error.errors = data.errors || [];
        error.details = data;
      } else {
        error.message = data || `HTTP ${response.status}`;
        error.errors = [];
      }
      
      // Handle specific error cases
      if (response.status === 401) {
        console.log('🔄 401 Unauthorized - clearing auth token');
        this.setAuthToken(null);
        
        // Clear localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
        }
        
        error.message = 'Phiên đăng nhập đã hết hạn';
      } else if (response.status === 403) {
        error.message = 'Bạn không có quyền truy cập';
      } else if (response.status === 404) {
        error.message = 'Không tìm thấy tài nguyên';
      } else if (response.status >= 500) {
        error.message = 'Lỗi máy chủ, vui lòng thử lại sau';
      }
      
      throw error;
      
    } catch (err) {
      // Network errors, timeouts, etc.
      if (err.name === 'AbortError') {
        console.error('❌ Request timeout');
        const timeoutError = new Error('Request timeout');
        timeoutError.status = 408;
        throw timeoutError;
      }
      
      if (err.status) {
        // Re-throw API errors
        throw err;
      }
      
      // Network error
      console.error('❌ Network error:', err);
      const networkError = new Error('Không thể kết nối tới máy chủ');
      networkError.status = 0;
      networkError.original = err;
      throw networkError;
    }
  }

  // ✅ GET method
  async get(endpoint, params = null) {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          searchParams.append(key, params[key].toString());
        }
      });
      url += `?${searchParams.toString()}`;
    }

    return await this.fetchWithAuth(url, {
      method: 'GET'
    });
  }

  // ✅ POST method
  async post(endpoint, data = null) {
    return await this.fetchWithAuth(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : null
    });
  }

  // ✅ PUT method
  async put(endpoint, data = null) {
    return await this.fetchWithAuth(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : null
    });
  }

  // ✅ DELETE method
  async delete(endpoint) {
    return await this.fetchWithAuth(endpoint, {
      method: 'DELETE'
    });
  }

  // ✅ PATCH method
  async patch(endpoint, data = null) {
    return await this.fetchWithAuth(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : null
    });
  }

  // ✅ File upload method
  async uploadFile(endpoint, formData, additionalHeaders = {}) {
    return await this.fetchWithAuth(endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData - let browser set it with boundary
        ...additionalHeaders
      }
    });
  }

  // ✅ Upload with progress tracking
  async uploadWithProgress(endpoint, formData, onProgress = null) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const url = `${this.baseURL}${endpoint}`;

      // Setup progress tracking
      if (onProgress) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            onProgress({
              loaded: event.loaded,
              total: event.total,
              percent: percentComplete
            });
          }
        });
      }

      // Setup response handlers
      xhr.addEventListener('load', () => {
        try {
          if (xhr.status >= 200 && xhr.status < 300) {
            const response = JSON.parse(xhr.responseText);
            console.log('✅ Upload successful:', response);
            resolve(response);
          } else {
            const error = new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`);
            error.status = xhr.status;
            
            try {
              const errorData = JSON.parse(xhr.responseText);
              error.message = errorData.message || error.message;
              error.errors = errorData.errors || [];
            } catch (parseError) {
              console.warn('Could not parse error response');
            }
            
            console.error('❌ Upload failed:', error);
            reject(error);
          }
        } catch (parseError) {
          const error = new Error('Upload failed - Invalid response format');
          console.error('❌ Upload parse error:', parseError);
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
      xhr.open('POST', url);
      xhr.timeout = this.defaultOptions.timeout;
      
      // Add auth header if available
      if (this.authToken) {
        xhr.setRequestHeader('Authorization', `Bearer ${this.authToken}`);
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
      if (window.location.pathname !== '/auth/login') {
        console.log('🔄 Redirecting to login due to auth clearance');
        window.location.href = '/auth/login';
      }
    }
  }

  // ✅ Request Interceptor (for adding common headers, logging, etc.)
  setRequestInterceptor(interceptor) {
    this.requestInterceptor = interceptor;
  }

  // ✅ Response Interceptor (for handling global responses)
  setResponseInterceptor(interceptor) {
    this.responseInterceptor = interceptor;
  }

  // ✅ Download file method
  async downloadFile(endpoint, filename = null) {
    try {
      const response = await this.fetchWithAuth(endpoint, {
        method: 'GET',
        headers: {}
      });

      // Create blob and download
      const blob = new Blob([response]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return { success: true, message: 'File downloaded successfully' };
    } catch (error) {
      console.error('❌ Download failed:', error);
      throw error;
    }
  }
}

// Create singleton instance
const apiClient = new ApiService();

// Auto-initialize authentication
if (typeof window !== 'undefined') {
  apiClient.initializeAuth();
}

export default apiClient;