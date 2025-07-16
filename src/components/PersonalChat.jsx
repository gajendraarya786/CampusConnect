import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import axiosInstance from '../api/axiosInstance';
import { Send, MoreVertical, ArrowLeft, Trash2 } from 'lucide-react';

function formatTime(ts) {
  if (!ts) return '';
  const date = new Date(ts);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function PersonalChat({ userId, otherUserId, token, otherUserName, onBack, onDeleteChat }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  // Fetch chat history on mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        console.log('Fetching chat history for:', { userId, otherUserId });
        const res = await axiosInstance.get(
          `/users/chat-history`,
          {
            params: { userId, otherUserId },
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        console.log('Chat history fetched:', res.data);
        setMessages(res.data);
      } catch (err) {
        console.error('Failed to fetch chat history', err);
        setConnectionError('Failed to load chat history');
      }
    };
    
    if (userId && otherUserId && token) {
      fetchHistory();
    }
  }, [userId, otherUserId, token]);

  // Setup socket connection and listeners
  useEffect(() => {
    if (!userId || !otherUserId) {
      console.error('Missing userId or otherUserId');
      return;
    }

    const socketUrl = import.meta.env.VITE_SOCKET_URL;
    console.log('Connecting to socket:', socketUrl);

    // Create socket connection with proper configuration
    socketRef.current = io(socketUrl, { 
      withCredentials: true,
      transports: ['websocket', 'polling'], // Fallback options
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
      // Add authentication if needed
      auth: {
        token: token
      }
    });

    // Connection event listeners
    socketRef.current.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
      setConnectionError(null);
    });

    socketRef.current.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setConnectionError('Failed to connect to chat server');
      setIsConnected(false);
    });

    // Join the chat room
    socketRef.current.emit('joinRoom', { userId, otherUserId });
    console.log('Joined room:', { userId, otherUserId });

    // Listen for incoming messages
    const handleReceive = (msg) => {
      console.log('Received message:', msg);
      
      setMessages((prev) => {
        // If this is a confirmation of a sent message, replace the temp message
        if (msg.tempId) {
          return prev.map(existingMsg => 
            existingMsg._id === msg.tempId 
              ? { ...msg, isTemp: false }
              : existingMsg
          );
        }
        
        // For incoming messages from other users
        if (msg.from === otherUserId && msg.to === userId) {
          // Check if message already exists to prevent duplicates
          const exists = prev.some(existingMsg => 
            existingMsg._id === msg._id || 
            (existingMsg.content === msg.content && 
             existingMsg.from === msg.from && 
             Math.abs(new Date(existingMsg.timestamp) - new Date(msg.timestamp)) < 1000)
          );
          if (!exists) {
            return [...prev, msg];
          }
        }
        
        return prev;
      });
    };
    socketRef.current.on('receiveMessage', handleReceive);

    // Listen for message sent confirmation
    socketRef.current.on('messageSent', (msg) => {
      console.log('Message sent confirmation:', msg);
    });

    // Listen for errors
    socketRef.current.on('error', (error) => {
      console.error('Socket error:', error);
      setConnectionError('Chat error occurred');
    });

    // Cleanup on unmount
    return () => {
      console.log('Cleaning up socket connection');
      socketRef.current.off('receiveMessage', handleReceive);
      socketRef.current.off('connect');
      socketRef.current.off('disconnect');
      socketRef.current.off('connect_error');
      socketRef.current.off('messageSent');
      socketRef.current.off('error');
      socketRef.current.disconnect();
    };
  }, [userId, otherUserId]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) {
      console.warn('Cannot send empty message');
      return;
    }

    if (!socketRef.current || !isConnected) {
      console.error('Socket not connected');
      setConnectionError('Not connected to chat server');
      return;
    }

    console.log('Sending message:', { from: userId, to: otherUserId, content: trimmedInput });
    
    try {
      // Create a temporary message with unique ID
      const tempId = `temp_${Date.now()}_${Math.random()}`;
      const tempMessage = {
        _id: tempId,
        from: userId,
        to: otherUserId,
        content: trimmedInput,
        timestamp: new Date().toISOString(),
        isTemp: true // Mark as temporary
      };
      
      // Add optimistic message
      setMessages(prev => [...prev, tempMessage]);
      
      socketRef.current.emit('sendMessage', { 
        from: userId, 
        to: otherUserId, 
        content: trimmedInput,
        tempId: tempId // Send temp ID to replace later
      });
      
      setInput('');
      
    } catch (error) {
      console.error('Error sending message:', error);
      setConnectionError('Failed to send message');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-3 sm:p-4 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center space-x-2 sm:space-x-3">
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
            <p className={`text-xs sm:text-sm ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
              {isConnected ? 'Online' : 'Offline'}
            </p>
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

      {/* Connection Error Banner */}
      {connectionError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 text-sm">
          {connectionError}
        </div>
      )}

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
              placeholder={isConnected ? "Type a message..." : "Connecting..."}
              rows="1"
              disabled={!isConnected}
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
            disabled={!input.trim() || !isConnected}
            title={!isConnected ? "Not connected" : "Send message"}
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default PersonalChat;