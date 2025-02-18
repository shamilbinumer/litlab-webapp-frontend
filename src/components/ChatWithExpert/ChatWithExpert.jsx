import React, { useState } from 'react';
import './ChatWithExpert.scss';
import { FaArrowLeft } from 'react-icons/fa';

const ChatWithExpert = () => {
  const [message, setMessage] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    // Handle sending message
    setMessage('');
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        <button className="back-button">
          <span><FaArrowLeft/></span>
        </button>
        <span className="header-title">Chat with Expert</span>
      </header>

      <div className="messages-container">
        <div className="message expert-message">
          Hi... How can I help you today?
        </div>
        <div className="message user-message">
          I need help with...
        </div>
      </div>

      <form className="input-container" onSubmit={handleSend}>
        <img src="/Images/imageIconInput.png" alt="" />
        <div className="input-wrapper">
          <input
            type="text"
            placeholder="Tell me your details..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="button" className="attachment-button">
             <div><img src="/Images/emojibtn.png" alt="" /> </div>
          </button>
       
         
        </div>
        <div  className="send-button">
           <img src="/Images/sendIcon.png" alt="" />
          </div>
      </form>
    </div>
  );
};

export default ChatWithExpert;