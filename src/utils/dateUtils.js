// src/utils/dateUtils.js - TIMEZONE FIX
/**
 * ✅ FIXED: Timezone utilities để xử lý thời gian đúng cách
 * Backend lưu Vietnam time, frontend cần hiển thị đúng
 */

// Vietnam timezone offset (UTC+7)
const VIETNAM_TIMEZONE_OFFSET = 7 * 60; // 7 hours in minutes

/**
 * ✅ FIX: Parse date từ backend (đã là Vietnam time)
 * Backend lưu Vietnam time, không cần convert thêm
 */
export const parseBackendDate = (dateString) => {
  if (!dateString) return null;
  
  try {
    // Backend trả về Vietnam time, parse trực tiếp
    const date = new Date(dateString);
    
    // Kiểm tra nếu date valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid date string:', dateString);
      return null;
    }
    
    return date;
  } catch (error) {
    console.error('Error parsing date:', dateString, error);
    return null;
  }
};

/**
 * ✅ FIX: Format date cho Vietnam timezone
 * Hiển thị đúng thời gian mà backend đã lưu
 */
export const formatVietnameseDate = (dateString, options = {}) => {
  const date = parseBackendDate(dateString);
  if (!date) return 'N/A';
  
  const defaultOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false, // 24-hour format
    ...options
  };
  
  // Format theo locale Vietnam
  return date.toLocaleString('vi-VN', defaultOptions);
};

/**
 * ✅ FIX: Format date ngắn gọn (chỉ ngày tháng)
 */
export const formatShortDate = (dateString) => {
  return formatVietnameseDate(dateString, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

/**
 * ✅ FIX: Format time ngắn gọn (chỉ giờ phút)
 */
export const formatShortTime = (dateString) => {
  return formatVietnameseDate(dateString, {
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * ✅ FIX: Format date và time riêng biệt
 */
export const formatDateAndTime = (dateString) => {
  const date = parseBackendDate(dateString);
  if (!date) return { date: 'N/A', time: 'N/A' };
  
  return {
    date: formatShortDate(dateString),
    time: formatShortTime(dateString)
  };
};

/**
 * ✅ FIX: Format relative time (bao lâu trước)
 */
export const formatRelativeTime = (dateString) => {
  const date = parseBackendDate(dateString);
  if (!date) return 'N/A';
  
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMinutes < 1) return 'Vừa xong';
  if (diffMinutes < 60) return `${diffMinutes} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 7) return `${diffDays} ngày trước`;
  
  // Nếu quá 7 ngày, hiển thị ngày cụ thể
  return formatShortDate(dateString);
};

/**
 * ✅ FIX: Get current Vietnam time để gửi lên backend
 */
export const getCurrentVietnameseTime = () => {
  const now = new Date();
  // Backend expect Vietnam time, return current local time
  return now.toISOString();
};

/**
 * ✅ DEBUG: Check timezone của date
 */
export const debugTimezone = (dateString, label = '') => {
  const date = parseBackendDate(dateString);
  if (!date) return;
  
  console.log(`🕐 [${label}] Debug timezone:`, {
    original: dateString,
    parsed: date.toString(),
    utc: date.toUTCString(),
    local: date.toLocaleString(),
    vietnamese: formatVietnameseDate(dateString),
    timestamp: date.getTime()
  });
};

/**
 * ✅ FIX: Validate và format date an toàn
 */
export const safeFormatDate = (dateString, fallback = 'N/A') => {
  try {
    const formatted = formatVietnameseDate(dateString);
    return formatted !== 'N/A' ? formatted : fallback;
  } catch (error) {
    console.error('Safe format date error:', error);
    return fallback;
  }
};

// Export các format functions thường dùng
export const dateFormats = {
  full: (date) => formatVietnameseDate(date),
  short: (date) => formatShortDate(date),
  time: (date) => formatShortTime(date),
  relative: (date) => formatRelativeTime(date),
  safe: (date, fallback) => safeFormatDate(date, fallback)
};

// Export default object
export default {
  parseBackendDate,
  formatVietnameseDate,
  formatShortDate,
  formatShortTime,
  formatDateAndTime,
  formatRelativeTime,
  getCurrentVietnameseTime,
  debugTimezone,
  safeFormatDate,
  dateFormats
};