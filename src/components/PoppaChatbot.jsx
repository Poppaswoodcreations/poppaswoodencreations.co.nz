import React, { useState, useRef, useEffect } from 'react';
import './PoppaChatbot.css';

const PoppaChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Kia ora! Welcome to Poppa's Wooden Creations. I'm here to help you find the perfect heirloom-quality wooden piece. Are you looking for a special toy for a little one, or perhaps some beautiful kitchenware?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const generateResponse = async (userMessage) => {
    try {
      const response = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            ...messages.slice(-6).map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            {
              role: 'user',
              content: userMessage
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      return data.message;
    } catch (error) {
      console.error('Error calling chat API:', error);
      return "I apologize, but I'm having trouble connecting right now. Please try again in a moment, or feel free to contact us directly through our website contact form. We'd love to help you!";
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const responseText = await generateResponse(inputValue);
      
      const assistantMessage = {
        role: 'assistant',
        content: responseText,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = {
        role: 'assistant',
        content: "I apologize, but I'm having trouble right now. Please try again or contact us directly!",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickQuestions = [
    "What makes your toys safe for babies?",
    "Tell me about your wood types",
    "First birthday gift ideas?",
    "How do I care for wooden toys?",
    "Why choose wooden over plastic?"
  ];

  const handleQuickQuestion = (question) => {
    setInputValue(question);
    setTimeout(() => {
      handleSend();
    }, 100);
  };

  return (
    <>
      {!isOpen && (
        <button
          className="poppa-chat-button"
          onClick={() => setIsOpen(true)}
          aria-label="Open chat"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z" fill="currentColor"/>
            <path d="M7 9H17V11H7V9ZM7 12H14V14H7V12ZM7 6H17V8H7V6Z" fill="currentColor"/>
          </svg>
          <span className="poppa-chat-badge">Chat with us!</span>
        </button>
      )}

      {isOpen && (
        <div className="poppa-chat-window">
          <div className="poppa-chat-header">
            <div className="poppa-chat-header-info">
              <div className="poppa-chat-avatar">
                🌳
              </div>
              <div>
                <div className="poppa-chat-title">Poppa's Assistant</div>
                <div className="poppa-chat-status">
                  <span className="poppa-status-dot"></span>
                  Online
                </div>
              </div>
            </div>
            <button
              className="poppa-chat-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
              </svg>
            </button>
          </div>

          <div className="poppa-chat-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`poppa-message ${message.role === 'user' ? 'poppa-message-user' : 'poppa-message-assistant'}`}
              >
                {message.role === 'assistant' && (
                  <div className="poppa-message-avatar">
                    🌳
                  </div>
                )}
                <div className="poppa-message-content">
                  {message.content}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="poppa-message poppa-message-assistant">
                <div className="poppa-message-avatar">
                  🌳
                </div>
                <div className="poppa-message-content">
                  <div className="poppa-typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {messages.length === 1 && (
            <div className="poppa-quick-questions">
              <div className="poppa-quick-title">Quick questions:</div>
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  className="poppa-quick-button"
                  onClick={() => handleQuickQuestion(question)}
                >
                  {question}
                </button>
              ))}
            </div>
          )}

          <div className="poppa-chat-input-container">
            <input
              ref={inputRef}
              type="text"
              className="poppa-chat-input"
              placeholder="Ask about our wooden creations..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <button
              className="poppa-send-button"
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              aria-label="Send message"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="currentColor"/>
              </svg>
            </button>
          </div>

          <div className="poppa-chat-footer">
            Powered by Poppa's AI Assistant
          </div>
        </div>
      )}
    </>
  );
};

export default PoppaChatbot;
