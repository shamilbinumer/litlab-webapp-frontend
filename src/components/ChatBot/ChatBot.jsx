import React, { useState } from 'react';
import { ArrowLeft, Image, Send, Smile } from 'lucide-react';
import './ChatBot.scss';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi...How can I help you today?", isBot: true },
    { id: 2, text: "I need help with...", isBot: false },
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (inputText.trim()) {
      // Add user message
      setMessages([
        ...messages,
        { id: messages.length + 1, text: inputText, isBot: false }
      ]);
      
      // Simulate bot response
      setTimeout(() => {
        const botResponses = [
          "I'd be happy to help you with that!",
          "Could you please provide more details?",
          "Let me look into that for you.",
          "I understand your concern. Here's what we can do...",
          "Is there anything specific you'd like to know?",
          "Let me guide you through this process."
        ];
        const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
        setMessages(prev => [...prev, { id: prev.length + 1, text: randomResponse, isBot: true }]);
      }, 1000);

      setInputText('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="chat-expert-wrapper">
        <div className="chat-expert-button" onClick={toggleChat}>
          <div className="chat-title">Chat with Expert</div>
          <img src="/Images/chatexpert.png" alt="chat expert" />
        </div>
      </div>

      <div className={`chatbot-container ${isOpen ? 'active' : ''}`}>
        <div className="header">
          <ArrowLeft className="back-arrow" size={24} onClick={toggleChat} />
          <span className="title">Chat with Expert</span>
        </div>

        <div className="messages-container">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.isBot ? 'bot' : 'user'}`}
            >
              <div className="message-bubble">
                {message.text}
              </div>
            </div>
          ))}
        </div>

        <div className="input-area">
          <div className="input-container">
            <Image className="icon" size={24} />
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tell me your doubts..."
            />
            <Smile className="icon" size={24} />
            <Send className="send-button" size={24} onClick={handleSend} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatBot;