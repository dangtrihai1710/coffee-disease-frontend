// ===================================================================
// File: src/services/chatbotService.js - MISTRAL API INTEGRATION (NO BACKEND DEPENDENCY)
// ===================================================================

// ✅ REMOVED: import apiClient from './apiService'; - Not needed anymore

class ChatbotService {
  constructor() {
    // ✅ MISTRAL API Configuration
    this.mistralToken = process.env.NEXT_PUBLIC_MISTRAL_API_KEY || 'ZLdairtPiF5mfKuI0zRQGf8yiiGf0vk3';
    this.baseURL = 'https://api.mistral.ai/v1/chat/completions';
    this.modelName = 'mistral-tiny'; // Cost-effective model
    this.conversationHistory = [];
    this.maxRetries = 3;
    this.retryDelay = 2000;
    
    console.log('🔮 Mistral ChatBot Service Initialized:', {
      hasToken: !!this.mistralToken,
      tokenPrefix: this.mistralToken?.substring(0, 10) + '...',
      baseURL: this.baseURL,
      model: this.modelName
    });
    
    // ✅ FIXED: Load conversation history from localStorage
    this.loadConversationHistory();
    
    // Validate token format
    if (!this.mistralToken || this.mistralToken.length < 20) {
      console.error('❌ Invalid Mistral API token');
    }
  }

  /**
   * ✅ Tư vấn bệnh sử dụng Mistral AI
   */
  async consultDisease(analysisResult, userQuestion) {
    try {
      console.log('🔮 Starting Mistral disease consultation...');
      
      if (!userQuestion || userQuestion.trim().length === 0) {
        throw new Error('Vui lòng nhập câu hỏi');
      }
      
      // 1. Xây dựng context từ kết quả phân tích
      const context = this.buildDiseaseContext(analysisResult);
      
      // 2. Tạo messages cho Mistral API
      const messages = this.createMistralMessages(context, userQuestion);
      
      // 3. Gọi Mistral API
      const aiResponse = await this.callMistralAPIWithRetry(messages);
      
      // 4. Lưu conversation history
      await this.saveConversation({
        diseaseAnalysis: analysisResult,
        userQuestion,
        aiResponse,
        timestamp: new Date().toISOString(),
        provider: 'mistral'
      });
      
      // 5. Trả về response đã format
      return this.formatConsultationResponse(aiResponse, analysisResult);
      
    } catch (error) {
      console.error('❌ Mistral consultation error:', error);
      return this.getErrorResponse(error);
    }
  }

  /**
   * ✅ FIXED: Tạo messages format cho Mistral API - Shorter prompt
   */
  createMistralMessages(context, userQuestion) {
    // ✅ FIXED: Much shorter and more focused prompt
    const systemPrompt = `Bạn là chuyên gia bệnh cà phê. Trả lời ngắn gọn, cụ thể bằng tiếng Việt (tối đa 150 từ).

PHONG CÁCH: Thân thiện, chuyên nghiệp, dễ hiểu.
YÊU CẦU: Đưa lời khuyên thực tế, cụ thể cho nông dân.`;

    // ✅ FIXED: Shorter user prompt
    const userContent = `Phân tích bệnh: ${context.disease} (${context.confidence}% tin cậy).
Mức độ: ${context.severity}

Câu hỏi: "${userQuestion}"

Tư vấn ngắn gọn về điều trị và phòng ngừa.`;

    return [
      {
        role: "system",
        content: systemPrompt
      },
      {
        role: "user", 
        content: userContent
      }
    ];
  }

  /**
   * ✅ Gọi Mistral API với retry logic
   */
  async callMistralAPIWithRetry(messages, retryCount = 0) {
    try {
      console.log(`🔮 Calling Mistral API (attempt ${retryCount + 1}/${this.maxRetries + 1})`);
      
      // Validate token
      if (!this.mistralToken) {
        throw new Error('Missing Mistral API token');
      }

      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.mistralToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          model: this.modelName,
          messages: messages,
          max_tokens: 300, // ✅ FIXED: Increased from 400
          temperature: 0.7,
          top_p: 1,
          stream: false
        })
      });

      console.log(`📡 Mistral Response: ${response.status} ${response.statusText}`);

      // Handle errors
      if (!response.ok) {
        const errorData = await response.text();
        console.error(`❌ Mistral API Error ${response.status}:`, errorData);
        
        if (response.status === 401) {
          throw new Error('Invalid Mistral API token - please check your credentials');
        } else if (response.status === 429) {
          throw new Error('Rate limit exceeded - please wait and try again');
        } else if (response.status === 500 && retryCount < this.maxRetries) {
          console.warn(`⏳ Server error, retrying in ${this.retryDelay}ms...`);
          await this.sleep(this.retryDelay);
          return this.callMistralAPIWithRetry(messages, retryCount + 1);
        }
        
        throw new Error(`Mistral API Error ${response.status}: ${errorData}`);
      }

      const result = await response.json();
      console.log('✅ Mistral API response received:', result);
      
      // Extract content from Mistral response
      if (result.choices && result.choices.length > 0) {
        const content = result.choices[0].message?.content;
        if (content) {
          return this.cleanMistralResponse(content);
        }
      }
      
      throw new Error('Invalid response format from Mistral API');
      
    } catch (error) {
      console.error(`❌ Mistral API Error (attempt ${retryCount + 1}):`, error);
      
      if (retryCount < this.maxRetries && !error.message.includes('Invalid') && !error.message.includes('token')) {
        console.warn(`⚠️ Retry ${retryCount + 1}/${this.maxRetries}: ${error.message}`);
        await this.sleep(this.retryDelay);
        return this.callMistralAPIWithRetry(messages, retryCount + 1);
      }
      throw error;
    }
  }

  /**
   * ✅ FIXED: Clean Mistral response - Better handling
   */
  cleanMistralResponse(content) {
    if (!content) return 'Tôi cần thêm thông tin để tư vấn tốt hơn.';
    
    // ✅ FIXED: Remove truncation indicators and clean up
    let cleaned = content.trim();
    
    // Remove common truncation indicators
    cleaned = cleaned.replace(/\.\.\.$/, '');
    cleaned = cleaned.replace(/…$/, '');
    cleaned = cleaned.replace(/\[.*?\]$/, ''); // Remove [continued] etc
    
    // Ensure it ends properly
    if (!cleaned.match(/[.!?]$/)) {
      // Find last complete sentence
      const lastSentence = cleaned.lastIndexOf('.');
      const lastExclamation = cleaned.lastIndexOf('!');
      const lastQuestion = cleaned.lastIndexOf('?');
      
      const lastPunctuation = Math.max(lastSentence, lastExclamation, lastQuestion);
      
      if (lastPunctuation > 0 && lastPunctuation > cleaned.length * 0.7) {
        cleaned = cleaned.substring(0, lastPunctuation + 1);
      } else {
        cleaned += '.';
      }
    }
    
    // ✅ FIXED: Reasonable length limit
    if (cleaned.length > 600) {
      // Find last complete sentence within limit
      const truncated = cleaned.substring(0, 600);
      const lastPunct = Math.max(
        truncated.lastIndexOf('.'),
        truncated.lastIndexOf('!'),
        truncated.lastIndexOf('?')
      );
      
      if (lastPunct > 300) {
        cleaned = truncated.substring(0, lastPunct + 1);
      } else {
        cleaned = truncated + '...';
      }
    }
    
    return cleaned || 'Tôi sẽ tư vấn chi tiết hơn. Vui lòng hỏi cụ thể về điều trị hoặc phòng ngừa.';
  }

  /**
   * ✅ FIXED: Test Mistral API connection - Shorter test
   */
  async testMistralConnection() {
    try {
      console.log('🧪 Testing Mistral API connection...');
      
      const testMessages = [
        {
          role: "system",
          content: "Trả lời ngắn gọn bằng tiếng Việt."
        },
        {
          role: "user",
          content: "Chào bạn, bạn có thể giúp tư vấn bệnh cà phê không?"
        }
      ];
      
      const response = await this.callMistralAPIWithRetry(testMessages);
      console.log('✅ Mistral Test Success:', response);
      return { success: true, response };
      
    } catch (error) {
      console.error('❌ Mistral Test Failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * ✅ Validate Mistral API token
   */
  async validateMistralToken() {
    try {
      console.log('🔐 Validating Mistral token...');
      
      const response = await fetch('https://api.mistral.ai/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.mistralToken}`,
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        const models = await response.json();
        console.log('✅ Mistral Token Valid. Available models:', models.data?.length || 0);
        return { valid: true, models: models.data };
      } else {
        console.error('❌ Mistral Token Invalid:', response.status);
        const errorText = await response.text();
        return { valid: false, status: response.status, error: errorText };
      }
    } catch (error) {
      console.error('❌ Mistral token validation error:', error);
      return { valid: false, error: error.message };
    }
  }

  /**
   * ✅ Build disease context (same as before)
   */
  buildDiseaseContext(analysisResult) {
    if (!analysisResult) {
      return {
        disease: 'Không xác định',
        confidence: 0,
        severity: 'unknown',
        description: 'Chưa có kết quả phân tích',
        treatments: ['Vui lòng phân tích ảnh lá cà phê trước'],
        prevention: ['Không có thông tin']
      };
    }

    const { diseaseName, confidence, severityLevel, description } = analysisResult;
    
    return {
      disease: diseaseName || 'Không xác định',
      confidence: Math.round((confidence || 0) * 100),
      severity: severityLevel || 'unknown',
      description: description || '',
      treatments: this.getTreatmentSuggestions(diseaseName),
      prevention: this.getPreventionTips(diseaseName)
    };
  }

  /**
   * ✅ Get treatment suggestions
   */
  getTreatmentSuggestions(diseaseName) {
    const treatments = {
      'Bệnh rỉ sắt': [
        '• Phun fungicide chứa đồng (Copper oxychloride) 2-3 lần/tháng',
        '• Cải thiện thông gió bằng cách tỉa cành',
        '• Loại bỏ và đốt lá bệnh ngay lập tức',
        '• Bón phân NPK cân đối để tăng sức đề kháng'
      ],
      'Bệnh đốm nâu Cercospora': [
        '• Phun Mancozeb hoặc Chlorothalonil 7-10 ngày/lần',
        '• Tỉa bớt cành để tăng thông gió',
        '• Tránh tưới nước lên lá, chỉ tưới gốc',
        '• Loại bỏ lá bệnh và vệ sinh vườn'
      ],
      'Bệnh đốm đen Phoma': [
        '• Sử dụng thuốc Propiconazole 0.1%',
        '• Cắt tỉa lá bệnh ngay khi phát hiện',
        '• Cải thiện hệ thống thoát nước',
        '• Giảm độ ẩm trong vườn'
      ],
      'Sâu đục lá': [
        '• Sử dụng thuốc trừ sâu sinh học Bt',
        '• Thả thiên địch (ong ký sinh Diglyphus)',
        '• Loại bỏ lá có đường hầm sâu đục',
        '• Sử dụng bẫy dính màu vàng'
      ],
      'Lá khỏe mạnh': [
        '• Duy trì chế độ chăm sóc hiện tại',
        '• Tiếp tục theo dõi định kỳ',
        '• Bón phân đúng chu kỳ'
      ]
    };
    
    return treatments[diseaseName] || [
      '• Liên hệ chuyên gia để được tư vấn cụ thể',
      '• Theo dõi sát tình trạng cây',
      '• Cải thiện điều kiện chăm sóc cơ bản'
    ];
  }

  /**
   * ✅ Get prevention tips
   */
  getPreventionTips(diseaseName) {
    const commonTips = [
      '• Duy trì vệ sinh vườn, dọn lá rụng thường xuyên',
      '• Tưới nước vào buổi sáng sớm (6-7h)',
      '• Đảm bảo khoảng cách trồng 2-3m giữa các cây',
      '• Bón phân cân đối NPK theo lịch',
      '• Kiểm tra và theo dõi định kỳ hàng tuần'
    ];

    const specificTips = {
      'Bệnh rỉ sắt': [
        '• Tăng cường ánh sáng cho vườn cà phê',
        '• Tránh trồng quá dày, đảm bảo thông gió'
      ],
      'Bệnh đốm nâu Cercospora': [
        '• Kiểm soát độ ẩm không khí',
        '• Tránh tưới nước lên lá'
      ],
      'Sâu đục lá': [
        '• Loại bỏ cỏ dại quanh gốc cây',
        '• Sử dụng bẫy dính để monitor'
      ]
    };

    return [...commonTips, ...(specificTips[diseaseName] || [])];
  }

  /**
   * ✅ Format consultation response
   */
  formatConsultationResponse(aiResponse, analysisResult) {
    return {
      consultation: aiResponse,
      diseaseInfo: {
        name: analysisResult?.diseaseName || 'Không xác định',
        confidence: Math.round((analysisResult?.confidence || 0) * 100),
        severity: analysisResult?.severityLevel || 'unknown'
      },
      quickReplies: [
        'Tôi cần điều trị ngay không?',
        'Làm sao để phòng ngừa hiệu quả?',
        'Khi nào cần gọi chuyên gia?',
        'Chi phí điều trị khoảng bao nhiêu?'
      ],
      quickActions: [
        { icon: '💊', title: 'Điều trị ngay', action: 'treatment' },
        { icon: '🛡️', title: 'Phòng ngừa', action: 'prevention' },
        { icon: '📞', title: 'Liên hệ chuyên gia', action: 'contact' },
        { icon: '📋', title: 'Lưu kết quả', action: 'save' }
      ],
      timestamp: new Date().toISOString(),
      provider: 'mistral',
      isError: false
    };
  }

  /**
   * ✅ Enhanced error response for Mistral
   */
  getErrorResponse(error) {
    let message = 'Xin lỗi, tôi gặp sự cố kỹ thuật với Mistral AI.';
    let actions = [];
    
    if (error.message.includes('Invalid') && error.message.includes('token')) {
      message = 'Lỗi xác thực Mistral API. Vui lòng kiểm tra token.';
      actions = [
        { icon: '🔑', title: 'Kiểm tra Token', action: 'check-token' },
        { icon: '📞', title: 'Liên hệ Admin', action: 'support' }
      ];
    } else if (error.message.includes('Rate limit')) {
      message = 'Đã vượt quá giới hạn API. Vui lòng đợi và thử lại.';
      actions = [
        { icon: '⏰', title: 'Đợi 1 phút', action: 'wait' },
        { icon: '🔄', title: 'Thử lại', action: 'retry' }
      ];
    } else if (error.message.includes('network') || error.message.includes('fetch')) {
      message = 'Lỗi kết nối tới Mistral AI. Vui lòng kiểm tra mạng.';
      actions = [
        { icon: '🔄', title: 'Thử lại', action: 'retry' },
        { icon: '📶', title: 'Kiểm tra mạng', action: 'network' }
      ];
    } else {
      actions = [
        { icon: '🔄', title: 'Thử lại', action: 'retry' },
        { icon: '📞', title: 'Liên hệ hỗ trợ', action: 'support' }
      ];
    }

    return {
      consultation: `😔 ${message}\n\nTrong thời gian chờ đợi, bạn có thể:\n• Liên hệ chuyên gia qua hotline: **1900-xxxx**\n• Tham khảo hướng dẫn cơ bản\n• Thử lại sau vài phút`,
      diseaseInfo: {
        name: 'Lỗi Mistral AI',
        confidence: 0,
        severity: 'error'
      },
      quickActions: actions,
      timestamp: new Date().toISOString(),
      provider: 'mistral',
      isError: true
    };
  }

  // ✅ Utility methods - FIXED: Remove backend API dependency + Server-safe
  async saveConversation(data) {
    try {
      // ✅ FIXED: Only save to local storage, no backend API call
      this.conversationHistory.push(data);
      if (this.conversationHistory.length > 50) {
        this.conversationHistory = this.conversationHistory.slice(-30);
      }
      
      // ✅ FIXED: Save to localStorage instead of backend - Server-safe
      try {
        // ✅ FIXED: Check if we're in browser environment
        if (typeof window !== 'undefined') {
          const conversationData = {
            history: this.conversationHistory,
            lastUpdate: new Date().toISOString()
          };
          localStorage.setItem('mistral_conversation_history', JSON.stringify(conversationData));
          console.log('✅ Mistral conversation saved to localStorage');
        } else {
          console.log('🔄 Server-side: Skipping localStorage save');
        }
      } catch (localError) {
        console.warn('⚠️ Could not save to localStorage:', localError.message);
      }
      
    } catch (error) {
      console.warn('⚠️ Save conversation error:', error.message);
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getConversationHistory() {
    return this.conversationHistory;
  }

  clearHistory() {
    this.conversationHistory = [];
    
    // ✅ FIXED: Server-safe localStorage clear
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mistral_conversation_history');
    }
    
    console.log('🧹 Mistral conversation history cleared');
  }

  // ✅ NEW: Load conversation history from localStorage - Server-safe
  loadConversationHistory() {
    try {
      // ✅ FIXED: Check if we're in browser environment
      if (typeof window === 'undefined') {
        console.log('🔄 Server-side: Skipping localStorage load');
        return;
      }
      
      const saved = localStorage.getItem('mistral_conversation_history');
      if (saved) {
        const data = JSON.parse(saved);
        this.conversationHistory = data.history || [];
        console.log(`📂 Loaded ${this.conversationHistory.length} conversation items from storage`);
      }
    } catch (error) {
      console.warn('⚠️ Could not load conversation history:', error.message);
      this.conversationHistory = [];
    }
  }

  async checkAPIHealth() {
    return await this.validateMistralToken();
  }
}

// Export singleton instance
const chatbotService = new ChatbotService();
export default chatbotService;

// ✅ FIXED: DEBUG FUNCTIONS for Mistral - Server-safe
if (typeof window !== 'undefined') {
  window.debugMistral = {
    testConnection: () => chatbotService.testMistralConnection(),
    validateToken: () => chatbotService.validateMistralToken(),
    checkService: () => console.log(chatbotService)
  };
}