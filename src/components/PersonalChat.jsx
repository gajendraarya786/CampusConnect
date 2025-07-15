import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { Send, MoreVertical, ArrowLeft, Trash2 } from 'lucide-react';

const socket = io('http://localhost:8000', { withCredentials: true });

function formatTime(ts) {
  if (!ts) return '';
  const date = new Date(ts);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function PersonalChat({ userId, otherUserId, token, otherUserName, onBack, onDeleteChat }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  // Fetch chat history on mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/v1/users/chat-history`,
          {
            params: { userId, otherUserId },
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setMessages(res.data);
      } catch (err) {
        console.error('Failed to fetch chat history', err);
      }
    };
    fetchHistory();
  }, [userId, otherUserId, token]);

  // Join room and listen for messages
  useEffect(() => {
    socket.emit('joinRoom', { userId, otherUserId });
    const handleReceive = (msg) => {
      if (
        (msg.from === userId && msg.to === otherUserId) ||
        (msg.from === otherUserId && msg.to === userId)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    };
    socket.on('receiveMessage', handleReceive);
    return () => {
      socket.off('receiveMessage', handleReceive);
    };
  }, [userId, otherUserId]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    socket.emit('sendMessage', { from: userId, to: otherUserId, content: input });
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-3 sm:p-4 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Back button for mobile */}
          {onBack && (
            <button 
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors md:hidden"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
          )}
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-semibold text-xs sm:text-sm">
              {otherUserName?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
              {otherUserName || 'User'}
            </h3>
            <p className="text-xs sm:text-sm text-green-500">Online</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {onDeleteChat && (
            <button
              onClick={onDeleteChat}
              className="p-2 hover:bg-red-100 rounded-full transition-colors flex-shrink-0"
              title="Delete chat"
            >
              <Trash2 className="w-5 h-5 text-red-500" />
            </button>
          )}
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0">
            <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-2 sm:space-y-4 bg-gray-50">
        {messages.map((msg, idx) => (
          <div key={msg._id || idx} className={`flex ${msg.from === userId ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] sm:max-w-xs lg:max-w-md xl:max-w-lg ${msg.from === userId ? 'order-2' : 'order-1'}`}>
              <div className={`px-3 py-2 sm:px-4 sm:py-3 rounded-2xl break-words ${
                msg.from === userId 
                  ? 'bg-blue-500 text-white rounded-br-md' 
                  : 'bg-white text-gray-800 rounded-bl-md shadow-sm border border-gray-200'
              }`}>
                <p className="text-sm sm:text-base leading-relaxed">{msg.content}</p>
              </div>
              <div className={`flex items-center mt-1 space-x-1 ${
                msg.from === userId ? 'justify-end' : 'justify-start'
              }`}>
                <span className="text-xs text-gray-500">
                  {formatTime(msg.timestamp || msg.createdAt)}
                </span>
                {msg.from === userId && (
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-2 sm:p-4 bg-white border-t border-gray-200">
        <div className="flex items-end space-x-2 sm:space-x-3">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-100 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none min-h-[40px] max-h-32 text-sm sm:text-base"
              placeholder="Type a message..."
              rows="1"
              style={{
                height: 'auto',
                minHeight: '40px'
              }}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
              }}
            />
          </div>
          <button 
            onClick={sendMessage}
            className="p-2 sm:p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50 flex-shrink-0"
            disabled={!input.trim()}
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default PersonalChat; 