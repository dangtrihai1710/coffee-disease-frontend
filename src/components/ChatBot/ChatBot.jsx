// ===================================================================
// File: src/components/ChatBot/ChatBot.jsx - CHATBOT UI COMPONENT
// ===================================================================

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  ChatBubbleLeftRightIcon, 
  PaperAirplaneIcon, 
  XMarkIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  PhoneIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';
import chatbotService from '@/services/chatbotService';

const ChatBot = ({ analysisResult, isOpen, onToggle, className = '' }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Initialize with greeting when analysis result is available
  useEffect(() => {
    if (analysisResult && messages.length === 0) {
      const confidence = Math.round((analysisResult.confidence || 0) * 100);
      const diseaseIcon = getDiseaseIcon(analysisResult.diseaseName);
      
      const greeting = {
        id: Date.now(),
        type: 'bot',
        content: `${diseaseIcon} **Kết quả phân tích hoàn tất!**

Tôi đã phát hiện **${analysisResult.diseaseName}** với độ tin cậy **${confidence}%**.

🤔 **Bạn muốn tôi tư vấn gì?**
• Cách điều trị hiệu quả
• Biện pháp phòng ngừa
• Lịch trình theo dõi
• Khi nào cần chuyên gia

Hãy hỏi tôi bất cứ điều gì! 💬`,
        timestamp: new Date(),
        quickReplies: [
          'Làm sao để điều trị?',
          'Cách phòng ngừa?',
          'Mức độ nghiêm trọng?',
          'Cần làm gì ngay?'
        ]
      };
      setMessages([greeting]);
    }
  }, [analysisResult]);

  // Get disease icon
  const getDiseaseIcon = (diseaseName) => {
    const icons = {
      'Bệnh rỉ sắt': '🦠',
      'Bệnh đốm nâu Cercospora': '🍂',
      'Bệnh đốm đen Phoma': '⚫',
      'Sâu đục lá': '🐛',
      'Lá khỏe mạnh': '🌿'
    };
    return icons[diseaseName] || '🔬';
  };

  // Send message to chatbot
  const sendMessage = async (message = null) => {
    const messageText = message || inputMessage.trim();
    if (!messageText || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Simulate typing delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Call chatbot service
      const response = await chatbotService.consultDisease(analysisResult, messageText);
      
      setIsTyping(false);
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.consultation,
        timestamp: new Date(),
        quickActions: response.quickActions,
        isError: response.isError
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Show success feedback
      if (!response.isError) {
        console.log('✅ Consultation completed successfully');
      }
      
    } catch (error) {
      console.error('❌ Chatbot error:', error);
      setIsTyping(false);
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: '😔 Xin lỗi, tôi gặp sự cố kỹ thuật. Vui lòng thử lại sau hoặc liên hệ chuyên gia.\n\n📞 **Hotline hỗ trợ**: 1900-xxxx\n📧 **Email**: support@coffee-analysis.com',
        timestamp: new Date(),
        isError: true,
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
        ]
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  // Handle quick reply click
  const handleQuickReply = (reply) => {
    sendMessage(reply);
  };

  // Handle quick action click
  const handleQuickAction = (action) => {
    switch (action) {
      case 'treatment':
        sendMessage('Hướng dẫn cách điều trị chi tiết');
        break;
      case 'prevention':
        sendMessage('Biện pháp phòng ngừa hiệu quả');
        break;
      case 'contact':
        window.open('tel:1900xxxx', '_blank');
        break;
      case 'save':
        // Implement save functionality
        alert('Tính năng lưu kết quả đang được phát triển');
        break;
      case 'retry':
        sendMessage('Tư vấn lại về kết quả phân tích');
        break;
      case 'support':
        window.open('mailto:support@coffee-analysis.com', '_blank');
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Format message content (support markdown-like formatting)
  const formatMessageContent = (content) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br />');
  };

  // Floating chat button when closed
  if (!isOpen) {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <button
          onClick={onToggle}
          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 transform hover:-translate-y-1 group"
          title="Mở chatbot tư vấn"
        >
          <ChatBubbleLeftRightIcon className="w-6 h-6" />
          <SparklesIcon className="w-3 h-3 absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
          
          {/* Notification badge if has analysis result */}
          {analysisResult && (
            <div className="absolute -top-2 -left-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
              1
            </div>
          )}
        </button>
        
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 bg-black text-white text-sm rounded-lg py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          Tư vấn bệnh cà phê AI
          <div className="absolute top-full right-4 border-4 border-transparent border-t-black"></div>
        </div>
      </div>
    );
  }

  // Main chat interface
  return (
    <div className={`fixed bottom-6 right-6 w-96 h-[500px] bg-white border border-gray-200 rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="bg-green-500 p-2 rounded-full">
            <SparklesIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Tư vấn AI</h3>
            <p className="text-xs text-green-100">Chuyên gia bệnh cà phê</p>
          </div>
        </div>
        <button 
          onClick={onToggle} 
          className="hover:bg-green-700 p-2 rounded-full transition-colors"
          title="Đóng chat"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Analysis Summary Bar */}
      {analysisResult && (
        <div className="bg-gray-50 border-b border-gray-200 p-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Kết quả:</span>
              <span className="font-medium text-gray-900">{analysisResult.diseaseName}</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${
                analysisResult.confidence > 0.8 ? 'bg-green-500' : 
                analysisResult.confidence > 0.6 ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
              <span className="text-xs text-gray-500">
                {Math.round(analysisResult.confidence * 100)}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] ${
                message.type === 'user'
                  ? 'bg-green-600 text-white rounded-2xl rounded-br-md'
                  : `${message.isError ? 'bg-red-50 border border-red-200' : 'bg-white border border-gray-200'} text-gray-800 rounded-2xl rounded-bl-md shadow-sm`
              } p-3`}
            >
              {/* Message Content */}
              <div 
                className="text-sm leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: formatMessageContent(message.content)
                }}
              />
              
              {/* Quick Replies (for bot messages) */}
              {message.quickReplies && message.quickReplies.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {message.quickReplies.map((reply, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickReply(reply)}
                      className="bg-green-100 hover:bg-green-200 text-green-700 text-xs px-3 py-1 rounded-full transition-colors"
                      disabled={isLoading}
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              )}
              
              {/* Quick Actions */}
              {message.quickActions && message.quickActions.length > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {message.quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickAction(action.action)}
                      className={`flex items-center space-x-2 p-2 rounded-lg text-xs transition-colors ${
                        message.isError 
                          ? 'bg-red-100 hover:bg-red-200 text-red-700' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
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
                message.type === 'user' ? 'text-green-100' : 'text-gray-500'
              }`}>
                {message.timestamp.toLocaleTimeString('vi-VN', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          </div>
        ))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-md shadow-sm">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span className="text-xs text-gray-500">AI đang suy nghĩ...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex space-x-3">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Hỏi về cách điều trị, phòng ngừa..."
              className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
              disabled={isLoading}
              maxLength={500}
            />
            
            {/* Character counter */}
            {inputMessage.length > 400 && (
              <div className="absolute -top-6 right-2 text-xs text-gray-500">
                {inputMessage.length}/500
              </div>
            )}
          </div>
          
          <button
            onClick={() => sendMessage()}
            disabled={isLoading || !inputMessage.trim()}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white p-2 rounded-full transition-colors flex-shrink-0 disabled:cursor-not-allowed"
            title="Gửi tin nhắn"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <PaperAirplaneIcon className="w-5 h-5" />
            )}
          </button>
        </div>
        
        {/* Helper text */}
        <div className="mt-2 text-xs text-gray-500 text-center">
          💡 Hỏi cụ thể để được tư vấn tốt hất • Powered by AI
        </div>
      </div>
    </div>
  );
};

export default ChatBot;