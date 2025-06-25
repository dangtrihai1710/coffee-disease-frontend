// ===================================================================
// File: src/services/chatbotService.js - CHATBOT TƯ VẤN BỆNH CÀ PHÊ
// ===================================================================

import apiClient from './apiService';

class ChatbotService {
  constructor() {
    this.hfToken = process.env.NEXT_PUBLIC_HF_WRITE_TOKEN || 'hf_YFARwE1AsUGqAUCCNPqqrvFLkTPUeHtKLe';
    this.baseURL = 'https://api-inference.huggingface.co/models';
    this.conversationHistory = [];
    this.modelName = 'microsoft/DialoGPT-medium';
    this.maxRetries = 3;
    this.retryDelay = 2000;
  }

  /**
   * ✅ Tư vấn bệnh dựa trên kết quả phân tích
   * @param {Object} analysisResult - Kết quả từ predictionService 
   * @param {string} userQuestion - Câu hỏi của user
   */
  async consultDisease(analysisResult, userQuestion) {
    try {
      console.log('🤖 Starting disease consultation...');
      
      // 1. Xây dựng context từ kết quả phân tích
      const context = this.buildDiseaseContext(analysisResult);
      
      // 2. Tạo prompt cho AI
      const prompt = this.createConsultationPrompt(context, userQuestion);
      
      // 3. Gọi Hugging Face API với retry logic
      const aiResponse = await this.callHuggingFaceAPIWithRetry(prompt);
      
      // 4. Lưu conversation history
      await this.saveConversation({
        diseaseAnalysis: analysisResult,
        userQuestion,
        aiResponse,
        timestamp: new Date().toISOString()
      });
      
      // 5. Trả về response đã format
      return this.formatConsultationResponse(aiResponse, analysisResult);
      
    } catch (error) {
      console.error('❌ Consultation error:', error);
      return this.getErrorResponse(error);
    }
  }

  /**
   * ✅ Xây dựng context từ kết quả phân tích bệnh
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
   * ✅ Tạo prompt cho AI consultation
   */
  createConsultationPrompt(context, userQuestion) {
    return `Bạn là chuyên gia tư vấn bệnh cà phê với 20 năm kinh nghiệm. Hãy tư vấn dựa trên thông tin sau:

🔬 KẾT QUẢ PHÂN TÍCH:
- Bệnh: ${context.disease}
- Độ chính xác: ${context.confidence}%
- Mức độ: ${context.severity}
- Mô tả: ${context.description}

💊 PHƯƠNG PHÁP ĐIỀU TRỊ:
${context.treatments.join('\n')}

🛡️ BIỆN PHÁP PHÒNG NGỪA:
${context.prevention.join('\n')}

❓ CÂU HỎI: "${userQuestion}"

Trả lời ngắn gọn (max 300 từ), thân thiện, chuyên nghiệp bằng tiếng Việt. Đưa ra lời khuyên cụ thể về:
1. Xử lý ngay
2. Theo dõi
3. Phòng ngừa
4. Khi nào cần chuyên gia

Trả lời:`;
  }

  /**
   * ✅ Gọi Hugging Face API với retry logic
   */
  async callHuggingFaceAPIWithRetry(prompt, retryCount = 0) {
    try {
      console.log(`🔄 Calling HF API (attempt ${retryCount + 1})`);
      
      const response = await fetch(`${this.baseURL}/${this.modelName}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.hfToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 300,
            temperature: 0.7,
            do_sample: true,
            top_p: 0.9,
            repetition_penalty: 1.1
          },
          options: {
            wait_for_model: true,
            use_cache: false
          }
        })
      });

      if (!response.ok) {
        if (response.status === 503 && retryCount < this.maxRetries) {
          console.warn(`⏳ Model loading, retrying in ${this.retryDelay}ms...`);
          await this.sleep(this.retryDelay);
          return this.callHuggingFaceAPIWithRetry(prompt, retryCount + 1);
        }
        
        const errorText = await response.text();
        throw new Error(`HF API Error ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ HF API response received');
      
      // Extract generated text
      if (Array.isArray(result) && result[0]?.generated_text) {
        return this.cleanResponse(result[0].generated_text, prompt);
      }
      
      return 'Xin lỗi, tôi không thể tư vấn lúc này. Vui lòng thử lại.';
      
    } catch (error) {
      if (retryCount < this.maxRetries) {
        console.warn(`⚠️ Retry ${retryCount + 1}/${this.maxRetries}:`, error.message);
        await this.sleep(this.retryDelay);
        return this.callHuggingFaceAPIWithRetry(prompt, retryCount + 1);
      }
      throw error;
    }
  }

  /**
   * ✅ Clean và format response từ AI
   */
  cleanResponse(fullResponse, originalPrompt) {
    // Remove the original prompt from response
    let cleanedResponse = fullResponse.replace(originalPrompt, '').trim();
    
    // Remove common unwanted prefixes
    cleanedResponse = cleanedResponse.replace(/^(Trả lời:|Response:|Answer:)/i, '').trim();
    
    // Limit length
    if (cleanedResponse.length > 1000) {
      cleanedResponse = cleanedResponse.substring(0, 1000) + '...';
    }
    
    return cleanedResponse || 'Tôi sẽ tư vấn chi tiết hơn. Vui lòng hỏi cụ thể về điều trị hoặc phòng ngừa.';
  }

  /**
   * ✅ Lưu conversation history
   */
  async saveConversation(conversationData) {
    try {
      // Lưu local storage
      this.conversationHistory.push(conversationData);
      
      // Giới hạn history size
      if (this.conversationHistory.length > 50) {
        this.conversationHistory = this.conversationHistory.slice(-30);
      }
      
      // Lưu vào database nếu có API
      try {
        await apiClient.post('/api/Chatbot/conversation', conversationData);
        console.log('✅ Conversation saved to database');
      } catch (dbError) {
        console.warn('⚠️ Could not save to database:', dbError.message);
      }
      
    } catch (error) {
      console.warn('⚠️ Could not save conversation:', error.message);
    }
  }

  /**
   * ✅ Lấy gợi ý điều trị theo bệnh
   */
  getTreatmentSuggestions(diseaseName) {
    const treatments = {
      'Bệnh rỉ sắt': [
        '• Phun fungicide chứa đồng (Copper oxychloride) 2-3 lần/tháng',
        '• Cải thiện thông gió bằng cách tỉa cành',
        '• Loại bỏ và đốt lá bệnh ngay lập tức',
        '• Bón phân NPK cân đối để tăng sức đề kháng',
        '• Sử dụng thuốc Mancozeb 0.2% khi thời tiết ẩm ướt'
      ],
      'Bệnh đốm nâu Cercospora': [
        '• Phun Mancozeb hoặc Chlorothalonil 7-10 ngày/lần',
        '• Tỉa bớt cành để tăng thông gió',
        '• Tránh tưới nước lên lá, chỉ tưới gốc',
        '• Bón phân cân đối NPK theo chu kỳ',
        '• Loại bỏ lá bệnh và vệ sinh vườn'
      ],
      'Bệnh đốm đen Phoma': [
        '• Sử dụng thuốc Propiconazole 0.1%',
        '• Cắt tỉa lá bệnh ngay khi phát hiện',
        '• Cải thiện hệ thống thoát nước',
        '• Giảm độ ẩm trong vườn',
        '• Phun thuốc vào buổi chiều muộn'
      ],
      'Sâu đục lá': [
        '• Sử dụng thuốc trừ sâu sinh học Bt',
        '• Thả thiên địch (ong ký sinh Diglyphus)',
        '• Loại bỏ lá có đường hầm sâu đục',
        '• Theo dõi và kiểm tra hàng tuần',
        '• Sử dụng bẫy dính màu vàng'
      ],
      'Lá khỏe mạnh': [
        '• Duy trì chế độ chăm sóc hiện tại',
        '• Tiếp tục theo dõi định kỳ',
        '• Bón phân đúng chu kỳ',
        '• Đảm bảo tưới nước đủ ẩm'
      ]
    };
    
    return treatments[diseaseName] || [
      '• Liên hệ chuyên gia để được tư vấn cụ thể',
      '• Theo dõi sát tình trạng cây',
      '• Cải thiện điều kiện chăm sóc cơ bản'
    ];
  }

  /**
   * ✅ Lấy tips phòng ngừa
   */
  getPreventionTips(diseaseName) {
    const commonTips = [
      '• Duy trì vệ sinh vườn, dọn lá rụng thường xuyên',
      '• Tưới nước vào buổi sáng sớm (6-7h)',
      '• Đảm bảo khoảng cách trồng 2-3m giữa các cây',
      '• Bón phân cân đối NPK theo lịch',
      '• Kiểm tra và theo dõi định kỳ hàng tuần',
      '• Sử dụng giống cà phê kháng bệnh',
      '• Tránh làm vườn khi trời mưa ẩm ướt'
    ];

    const specificTips = {
      'Bệnh rỉ sắt': [
        '• Tăng cường ánh sáng cho vườn cà phê',
        '• Tránh trồng quá dày, đảm bảo thông gió',
        '• Phun thuốc phòng ngừa vào mùa mưa'
      ],
      'Bệnh đốm nâu Cercospora': [
        '• Kiểm soát độ ẩm không khí',
        '• Tránh tưới nước lên lá',
        '• Cắt tỉa định kỳ để thông gió'
      ],
      'Sâu đục lá': [
        '• Loại bỏ cỏ dại quanh gốc cây',
        '• Sử dụng bẫy dính để monitor',
        '• Thả thiên địch vào đầu mùa khô'
      ]
    };

    return [...commonTips, ...(specificTips[diseaseName] || [])];
  }

  /**
   * ✅ Format response cuối cùng
   */
  formatConsultationResponse(aiResponse, analysisResult) {
    return {
      consultation: aiResponse,
      diseaseInfo: {
        name: analysisResult?.diseaseName || 'Không xác định',
        confidence: analysisResult?.confidence || 0,
        severity: analysisResult?.severityLevel || 'unknown'
      },
      quickActions: [
        {
          icon: '💊',
          title: 'Điều trị ngay',
          action: 'treatment'
        },
        {
          icon: '🛡️',
          title: 'Phòng ngừa',
          action: 'prevention'
        },
        {
          icon: '📞',
          title: 'Liên hệ chuyên gia',
          action: 'contact'
        },
        {
          icon: '📋',
          title: 'Lưu kết quả',
          action: 'save'
        }
      ],
      timestamp: new Date().toISOString()
    };
  }

  /**
   * ✅ Xử lý lỗi và trả về response phù hợp
   */
  getErrorResponse(error) {
    let message = 'Xin lỗi, tôi gặp sự cố kỹ thuật.';
    
    if (error.message.includes('503')) {
      message = 'AI đang tải model. Vui lòng đợi 30 giây và thử lại.';
    } else if (error.message.includes('network') || error.message.includes('fetch')) {
      message = 'Lỗi kết nối. Vui lòng kiểm tra internet và thử lại.';
    } else if (error.message.includes('token')) {
      message = 'Lỗi xác thực. Vui lòng liên hệ admin.';
    }

    return {
      consultation: `😔 ${message}\n\nTrong thời gian chờ đợi, bạn có thể:\n• Liên hệ chuyên gia qua hotline\n• Tham khảo hướng dẫn cơ bản\n• Thử lại sau 1-2 phút`,
      diseaseInfo: {
        name: 'Lỗi hệ thống',
        confidence: 0,
        severity: 'error'
      },
      quickActions: [
        {
          icon: '🔄',
          title: 'Thử lại',
          action: 'retry'
        },
        {
          icon: '📞',
          title: 'Liên hệ hỗ trợ',
          action: 'support'
        }
      ],
      timestamp: new Date().toISOString(),
      isError: true
    };
  }

  /**
   * ✅ Utility: Sleep function
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * ✅ Lấy conversation history
   */
  getConversationHistory() {
    return this.conversationHistory;
  }

  /**
   * ✅ Clear conversation history
   */
  clearHistory() {
    this.conversationHistory = [];
    console.log('🧹 Conversation history cleared');
  }

  /**
   * ✅ Kiểm tra trạng thái HF API
   */
  async checkAPIHealth() {
    try {
      const response = await fetch(`${this.baseURL}/${this.modelName}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.hfToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: 'test',
          parameters: { max_new_tokens: 1 }
        })
      });
      
      return response.ok;
    } catch (error) {
      console.error('❌ API Health check failed:', error);
      return false;
    }
  }
}

// Export singleton instance
const chatbotService = new ChatbotService();
export default chatbotService;