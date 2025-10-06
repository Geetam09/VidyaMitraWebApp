import React, { useState, useRef, useEffect } from 'react';
import { apiService } from '../services/apiService'; // Adjust the import path as needed
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI Teaching Assistant. I'm here to help you with lesson planning, student management, and educational strategies.",
      sender: 'bot'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && event.target.closest('.chatbot-modal') === null) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const getAuthToken = () => {
    // Get token from your authentication context, localStorage, or wherever you store it
    return localStorage.getItem('authToken'); // Adjust this based on your auth implementation
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;

    // Add user message to chat
    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication required. Please log in.');
      }

      // Use the apiService method instead of direct fetch
      const response = await apiService.getChatResponse(token, inputMessage);

      // Add bot response to chat
      const botMessage = {
        id: messages.length + 2,
        text: response,
        sender: 'bot'
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error fetching response from chatbot:', error);

      // Add error message
      const errorMessage = {
        id: messages.length + 2,
        text: error.message || "Sorry, I'm having trouble connecting right now. Please try again later.",
        sender: 'bot'
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

    return (
        <>
        {/* Chatbot toggle button - Fixed position */}
        {!isOpen && (
            <button
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-110 backdrop-blur-sm border border-white/20"
            aria-label="Open AI Assistant"
            >
            <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            </button>
        )}

        {/* Chatbot Modal - Centered on screen with glassmorphism effect */}
        {isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
            <div className="chatbot-modal w-full max-w-4xl h-[85vh] bg-white/95 rounded-2xl shadow-2xl flex flex-col border border-white/20 overflow-hidden backdrop-blur-md">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-500/90 to-purple-500/90 text-white p-4 flex justify-between items-center backdrop-blur-sm">
                <div className="flex items-center">
                    <div className="bg-white/20 p-2 rounded-full mr-3 backdrop-blur-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c极0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    </div>
                    <div>
                    <h3 className="font-bold text-lg">AI Teaching Assistant</h3>
                    <p className="text-xs opacity-90">Always ready to help educators</p>
                    </div>
                </div>
                <button 
                    onClick={() => setIsOpen(false)}
                    className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors backdrop-blur-sm"
                    aria-label="Close chat"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 极24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                </div>

                {/* Messages container */}
                <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-white/50 to-gray-50/50">
                {messages.map((message) => (
                    <div
                    key={message.id}
                    className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                    <div
                        className={`max-w-[85%] rounded-2xl p-3 backdrop-blur-sm ${
                        message.sender === 'user'
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md shadow-lg'
                            : 'bg-white/80 text-gray-800 rounded-bl-md shadow-lg border border-white/30'
                        }`}
                    >
                        <div className="flex items-start">
                        {message.sender === 'bot' && (
                            <div className="bg-blue-100/50 p-1 rounded-full mr-2 flex-shrink-0 backdrop-blur-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            </div>
                        )}
                        <p className="text-sm leading-relaxed">{message.text}</p>
                        </div>
                    </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start mb-4">
                    <div className="bg-white/80 text-gray-800 rounded-2xl rounded-bl-md p-3 border border-white/30 shadow-lg max-w-[85%] backdrop-blur-sm">
                        <div className="flex items-center">
                        <div className="bg-blue-100/50 p-1 rounded-full mr-2 backdrop-blur-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        <div className="flex space-x-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-blue极400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        </div>
                    </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
                </div>

                {/* Input area */}
                <div className="p-4 border-t border-white/20 bg-white/60 backdrop-blur-sm">
                <div className="flex items-center space-x-2">
                    <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about teaching..."
                    className="flex-1 border border-white/30 rounded-xl py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent bg-white/80 backdrop-blur-sm placeholder-gray-500"
                    disabled={isLoading}
                    />
                    <button
                    onClick={handleSendMessage}
                    disabled={isLoading || inputMessage.trim() === ''}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl px-4 py-2.5 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center backdrop-blur-sm border border-white/20"
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5极7 7-7 7" />
                    </svg>
                    </button>
                </div>
                </div>
            </div>
            </div>
        )}
        </>
    );
    };

export default FloatingChatbot;