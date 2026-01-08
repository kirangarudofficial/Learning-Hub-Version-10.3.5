import React, { useState } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      message: "Hi! I'm your AI learning assistant. How can I help you find the perfect course today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const quickActions = [
    "Find courses for beginners",
    "Career change guidance",
    "Technical support",
    "Pricing information"
  ];

  const handleSendMessage = (messageToSend: string) => {
    if (!messageToSend.trim()) return;

    const newMessage = {
      id: Date.now(),
      type: 'user',
      message: messageToSend,
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1, // Ensure unique key
        type: 'bot',
        message: getBotResponse(messageToSend),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const getBotResponse = (userMessage: string) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('course') || message.includes('learn')) {
      return "Great! I can help you find the perfect course. What subject are you interested in? We have courses in Development, Business, Design, Marketing, and more!";
    } else if (message.includes('price') || message.includes('cost')) {
      return "We offer flexible pricing options: Free courses, LearnHub Plus at $19/month (annual), and Enterprise plans. Would you like to see our full pricing details?";
    } else if (message.includes('certificate')) {
      return "Yes! We offer professional certificates and specializations from top companies like Google, IBM, and Meta. These are industry-recognized credentials that can boost your career.";
    } else if (message.includes('help') || message.includes('support')) {
      return "I'm here to help! You can also reach our support team via live chat, email, or phone. What specific issue are you facing?";
    } else {
      return "I understand you're looking for information. Could you tell me more about what you'd like to learn or what questions you have about our platform?";
    }
  };

  const handleQuickAction = (action: string) => {
    // Pass the action directly to avoid state closure issues
    handleSendMessage(action);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-2xl transform hover:scale-110 transition-all duration-200 flex items-center space-x-2 group"
        >
          <MessageCircle className="w-6 h-6" />
          <Sparkles className="w-4 h-4 group-hover:animate-pulse" />
          <span className="absolute -top-2 -left-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
            AI
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-96 h-[500px] flex flex-col border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-full">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold">AI Learning Assistant</h3>
              <p className="text-xs text-blue-100">Online • Powered by AI</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="hover:bg-white/20 p-1 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-2 max-w-[80%] ${
                message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`p-3 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white rounded-br-sm'
                    : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                }`}>
                  <p className="text-sm">{message.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        {messages.length === 1 && (
          <div className="px-4 pb-2">
            <p className="text-xs text-gray-500 mb-2">Quick actions:</p>
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs transition-colors"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage(inputMessage);
                  setInputMessage('');
                }
              }}
              placeholder="Ask me anything about courses..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <button
              onClick={() => { handleSendMessage(inputMessage); setInputMessage(''); }}
              disabled={!inputMessage.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}