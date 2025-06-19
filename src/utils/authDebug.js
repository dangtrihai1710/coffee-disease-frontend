// File: src/utils/authDebug.js
// Thêm script này để debug authentication

export const debugAuth = () => {
  console.log('🔍 DEBUG AUTHENTICATION');
  
  // Check localStorage
  const token = localStorage.getItem('authToken');
  const userData = localStorage.getItem('user');
  
  console.log('📦 LocalStorage:', {
    token: token ? `${token.substring(0, 20)}...` : 'null',
    tokenLength: token?.length || 0,
    userData: userData ? JSON.parse(userData) : null
  });
  
  // Check cookies
  const cookies = document.cookie;
  console.log('🍪 Cookies:', cookies);
  
  // Check API base URL
  console.log('🔗 API Base URL:', process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:7179/api');
  
  // Test token validation
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('🎫 Token Payload:', {
        exp: new Date(payload.exp * 1000),
        isExpired: payload.exp * 1000 < Date.now(),
        role: payload.role || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
      });
    } catch (e) {
      console.error('❌ Invalid token format:', e);
    }
  }
};

// Gọi function này trong console: debugAuth()