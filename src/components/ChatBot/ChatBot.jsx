// ===================================================================
// File: src/components/ChatBot/ChatBot.jsx - FIXED VERSION
// ===================================================================

'use client';

import { useState, useEffect, useRef } from 'react';
// ✅ FIXED: Removed lucide-react dependency - using emoji icons instead
import chatbotService from '@/services/chatbotService';

export default function ChatBot({ analysisResult, isOpen, onToggle }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // ✅ FIXED: Initialize with welcome message for Mistral
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = {
        id: 'welcome',
        content: analysisResult 
          ? `Xin chào! Tôi là AI Mistral chuyên tư vấn bệnh cà phê. 🔮\n\nTôi đã nhận kết quả phân tích: **${analysisResult.diseaseName}** với độ tin cậy ${Math.round((analysisResult.confidence || 0) * 100)}%.\n\nHãy hỏi tôi về điều trị, phòng ngừa, hoặc chăm sóc cây cà phê!`
          : 'Xin chào! Tôi là AI Mistral chuyên về bệnh cà phê. 🔮\n\nHãy upload ảnh lá cà phê để tôi phân tích và tư vấn chi tiết cho bạn!',
        type: 'bot',
        timestamp: new Date(),
        quickReplies: analysisResult ? [
          'Tôi cần điều trị như thế nào?',
          'Nguyên nhân gây bệnh là gì?',
          'Cách phòng ngừa hiệu quả?',
          'Khi nào cần gọi chuyên gia?'
        ] : [
          'Hướng dẫn chụp ảnh đúng cách',
          'Các loại bệnh cà phê phổ biến',
          'Tôi có thể giúp gì?'
        ]
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, analysisResult]);

  // Auto scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // ✅ FIXED: Enhanced send message with better error handling
  const sendMessage = async (customMessage = null) => {
    const messageText = customMessage || inputMessage.trim();
    
    if (!messageText && !customMessage) return;
    
    setIsLoading(true);
    setIsTyping(true);
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      content: messageText,
      type: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    try {
      console.log('🔮 Sending message to Mistral chatbot service...');
      
      // ✅ FIXED: Better error handling for consultation
      const response = await chatbotService.consultDisease(
        analysisResult, 
        messageText
      );
      
      console.log('✅ Mistral response received:', response);
      
      // ✅ FIXED: Handle both success and error responses properly
      if (response && !response.isError) {
        const botMessage = {
          id: Date.now() + 1,
          content: response.consultation,
          type: 'bot',
          timestamp: new Date(),
          quickReplies: response.quickReplies || [],
          quickActions: response.quickActions || [],
          diseaseInfo: response.diseaseInfo,
          isError: false
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        // ✅ FIXED: Handle error responses from service
        const errorContent = response?.consultation || 'Đã có lỗi xảy ra. Vui lòng thử lại.';
        const errorMessage = {
          id: Date.now() + 1,
          content: errorContent,
          type: 'bot',
          timestamp: new Date(),
          isError: true,
          quickActions: response?.quickActions || [
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
          ]
        };
        setMessages(prev => [...prev, errorMessage]);
      }
      
    } catch (error) {
      console.error('❌ ChatBot send message error:', error);
      
      // ✅ FIXED: Better user-friendly error messages
      let errorMessage = 'Đã có lỗi xảy ra. Vui lòng thử lại.';
      let actions = [];
      
      if (error.message?.includes('Invalid') && error.message?.includes('token')) {
        errorMessage = 'Lỗi cấu hình API. Vui lòng liên hệ admin.';
        actions = [
          { icon: '📞', title: 'Liên hệ Admin', action: 'support' }
        ];
      } else if (error.message?.includes('503')) {
        errorMessage = 'AI đang tải model. Vui lòng đợi 30 giây và thử lại.';
        actions = [
          { icon: '🔄', title: 'Thử lại', action: 'retry' },
          { icon: '⏰', title: 'Đợi 30s', action: 'wait' }
        ];
      } else if (error.message?.includes('429')) {
        errorMessage = 'Quá nhiều yêu cầu. Vui lòng đợi 1 phút và thử lại.';
        actions = [
          { icon: '⏰', title: 'Đợi 1 phút', action: 'wait' },
          { icon: '📞', title: 'Liên hệ hỗ trợ', action: 'support' }
        ];
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        errorMessage = 'Lỗi kết nối. Vui lòng kiểm tra internet và thử lại.';
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

      const errorBotMessage = {
        id: Date.now() + 1,
        content: `😔 ${errorMessage}\n\nTrong thời gian chờ đợi, bạn có thể:\n• Liên hệ chuyên gia qua hotline: **1900-xxxx**\n• Tham khảo hướng dẫn cơ bản\n• Thử lại sau 1-2 phút`,
        type: 'bot',
        timestamp: new Date(),
        isError: true,
        quickActions: actions
      };
      
      setMessages(prev => [...prev, errorBotMessage]);
    }

    setIsLoading(false);
    setIsTyping(false);
  };

  // ✅ FIXED: Enhanced quick reply handler
  const handleQuickReply = (reply) => {
    console.log('Quick reply clicked:', reply);
    sendMessage(reply);
  };

  // ✅ FIXED: Enhanced quick action handler
  const handleQuickAction = async (action) => {
    console.log('Quick action clicked:', action);
    
    switch (action) {
      case 'treatment':
        sendMessage('Hướng dẫn cách điều trị chi tiết cho bệnh này');
        break;
      case 'prevention':
        sendMessage('Biện pháp phòng ngừa hiệu quả và lâu dài');
        break;
      case 'contact':
        window.open('tel:1900xxxx', '_blank');
        break;
      case 'support':
        window.open('mailto:support@coffee-analysis.com?subject=Cần hỗ trợ ChatBot', '_blank');
        break;
      case 'save':
        // ✅ FIXED: Implement save functionality
        try {
          const conversationData = {
            messages: messages,
            analysisResult: analysisResult,
            timestamp: new Date().toISOString()
          };
          localStorage.setItem('chatbot_conversation', JSON.stringify(conversationData));
          alert('✅ Đã lưu cuộc trò chuyện vào bộ nhớ local');
        } catch (error) {
          console.error('Save error:', error);
          alert('❌ Không thể lưu cuộc trò chuyện');
        }
        break;
      case 'retry':
        const lastUserMessage = messages.filter(m => m.type === 'user').pop();
        if (lastUserMessage) {
          sendMessage(lastUserMessage.content);
        }
        break;
      case 'wait':
        alert('⏰ Vui lòng đợi một chút rồi thử lại. Cảm ơn bạn đã kiên nhẫn!');
        break;
      case 'network':
        alert('📶 Vui lòng kiểm tra kết nối internet và thử lại');
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  // ✅ FIXED: Better key press handling
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && inputMessage.trim()) {
        sendMessage();
      }
    }
  };

  // ✅ FIXED: Enhanced message content formatting
  const formatMessageContent = (content) => {
    if (!content) return '';
    
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br/>');
  };

  // ✅ FIXED: Mistral API Health check on mount
  useEffect(() => {
    const checkMistralHealth = async () => {
      if (isOpen) {
        console.log('🔮 Checking Mistral API health...');
        const healthResult = await chatbotService.checkAPIHealth();
        console.log('🏥 Mistral API Health:', healthResult);
        
        if (!healthResult.valid) {
          const healthWarning = {
            id: 'mistral-health-warning',
            content: '⚠️ **Cảnh báo**: Kết nối đến chúng tôi có vấn đề. Vui lòng kiểm tra token hoặc thử lại sau.\n\nBạn có thể sử dụng debug tools để kiểm tra chi tiết.',
            type: 'bot',
            timestamp: new Date(),
            isWarning: true,
            quickActions: [
              { icon: '🔧', title: 'Debug Mistral', action: 'debug' },
              { icon: '🔑', title: 'Kiểm tra Token', action: 'check-token' },
              { icon: '📞', title: 'Liên hệ hỗ trợ', action: 'support' }
            ]
          };
          setMessages(prev => [healthWarning, ...prev]);
        } else {
          console.log('✅ Mistral API connection OK');
        }
      }
    };
    
    checkMistralHealth();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50">
      {/* ✅ FIXED: Enhanced Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <span className="text-lg">🔮</span>
          <div>
            <h3 className="font-semibold">ChatBot Tư Vấn Cà Phê</h3>
            <p className="text-xs opacity-90">
              {analysisResult ? `Đang tư vấn: ${analysisResult.diseaseName}` : 'Tôi sẵn sàng hỗ trợ'}
            </p>
          </div>
        </div>
        <button
          onClick={onToggle}
          className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* ✅ FIXED: Enhanced Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.type === 'user'
                  ? 'bg-green-600 text-white ml-4'
                  : message.isError
                  ? 'bg-red-50 border border-red-200 text-red-800 mr-4'
                  : message.isWarning
                  ? 'bg-yellow-50 border border-yellow-200 text-yellow-800 mr-4'
                  : 'bg-gray-100 text-gray-800 mr-4'
              }`}
            >
              {/* Message Icon */}
              <div className="flex items-start gap-2">
                {message.type === 'bot' && (
                  <span className={`text-sm ${
                    message.isError ? 'text-red-600' : 
                    message.isWarning ? 'text-yellow-600' : 'text-purple-600'
                  }`}>🔮</span>
                )}
                
                <div className="flex-1">
                  {/* Message Content */}
                  <div 
                    className="text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ 
                      __html: formatMessageContent(message.content) 
                    }}
                  />
                  
                  {/* Disease Info */}
                  {message.diseaseInfo && !message.isError && (
                    <div className="mt-2 p-2 bg-white/50 rounded text-xs">
                      <div className="font-medium">{message.diseaseInfo.name}</div>
                      <div>Độ tin cậy: {message.diseaseInfo.confidence}%</div>
                    </div>
                  )}
                  
                  {/* Quick Replies */}
                  {message.quickReplies && message.quickReplies.length > 0 && (
                    <div className="mt-3 space-y-1">
                      <div className="text-xs font-medium opacity-70">Câu hỏi gợi ý:</div>
                      {message.quickReplies.map((reply, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickReply(reply)}
                          className="block w-full text-left text-xs p-2 bg-white/50 hover:bg-white/70 rounded border transition-colors"
                          disabled={isLoading}
                        >
                          💭 {reply}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Quick Actions */}
                  {message.quickActions && message.quickActions.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {message.quickActions.map((action, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickAction(action.action)}
                          className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${
                            message.isError
                              ? 'bg-red-100 hover:bg-red-200 text-red-700' 
                              : 'bg-white/50 hover:bg-white/70 text-gray-700'
                          }`}
                          disabled={isLoading}
                        >
                          <span>{action.icon}</span>
                          <span>{action.title}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Timestamp */}
                  <div className={`text-xs mt-2 opacity-70 ${
                    message.type === 'user' ? 'text-white/70' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* ✅ FIXED: Enhanced Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3 mr-4 flex items-center gap-2">
              <span className="text-purple-600">🔮</span>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-xs text-gray-500">Tôi đang suy nghĩ...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* ✅ FIXED: Enhanced Input Area */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-end gap-2">
          <div className="flex-1">
<textarea
  value={inputMessage}
  onChange={(e) => setInputMessage(e.target.value)}
  onKeyPress={handleKeyPress}
  placeholder={
    isLoading 
      ? "Tôi đang xử lý..." 
      : analysisResult 
      ? "Hỏi Tôi về điều trị, phòng ngừa, chăm sóc..."
      : "Tôi có thể giúp gì cho bạn?"
  }
  className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-500"
  style={{ color: '#111827 !important' }}
  rows="2"
  disabled={isLoading}
/>
          </div>
          <button
            onClick={() => sendMessage()}
            disabled={isLoading || !inputMessage.trim()}
            className={`p-3 rounded-lg transition-colors ${
              isLoading || !inputMessage.trim()
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            {isLoading ? (
              <span className="animate-spin">🔄</span>
            ) : (
              <span>📤</span>
            )}
          </button>
        </div>
        
        {/* ✅ FIXED: Status indicator */}
        <div className="mt-2 text-xs text-gray-500 flex items-center justify-between">
          <span>
            {isLoading ? (
              <span className="flex items-center gap-1">
                <span className="animate-spin">🔄</span>
                Mistral đang xử lý...
              </span>
            ) : (
              'Nhấn Enter để gửi tin nhắn đến cho chúng tôi'
            )}
          </span>
          {analysisResult && (
            <span className="text-purple-600 font-medium">
              Mistral tin cậy: {Math.round((analysisResult.confidence || 0) * 100)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}