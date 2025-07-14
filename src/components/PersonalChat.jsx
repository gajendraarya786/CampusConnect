import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:8000', { withCredentials: true }); // Adjust if needed

function PersonalChat({ userId, otherUserId, token }) {
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
      // Only add if relevant
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
    <div style={{ border: '1px solid #ccc', padding: 16, maxWidth: 400 }}>
      <div style={{ height: 300, overflowY: 'auto', marginBottom: 8 }}>
        {messages.map((msg, idx) => (
          <div key={msg._id || idx} style={{ textAlign: msg.from === userId ? 'right' : 'left' }}>
            <span style={{ background: msg.from === userId ? '#dcf8c6' : '#fff', padding: 6, borderRadius: 8, display: 'inline-block', margin: 2 }}>
              {msg.content}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ display: 'flex' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          style={{ flex: 1, marginRight: 8 }}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default PersonalChat; 