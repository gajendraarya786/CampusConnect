import React, { useState, useEffect } from 'react';
import { friendRequestAPI } from '../services/api.js';

const FriendRequestButton = ({ targetUserId, currentUserId, initialStatus = 'none' }) => {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if this is the current user's own profile
  const isOwnProfile = currentUserId === targetUserId;

  useEffect(() => {
    setStatus(initialStatus);
  }, [initialStatus]);

  const handleSendRequest = async () => {
    if (isOwnProfile) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await friendRequestAPI.sendRequest(targetUserId);
      setStatus('pending');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send friend request');
    } finally {
      setLoading(false);
    }
  };

  const handleRespondToRequest = async (action) => {
    setLoading(true);
    setError(null);
    
    try {
      await friendRequestAPI.respondToRequest(targetUserId, action);
      setStatus(action === 'accept' ? 'friends' : 'none');
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${action} request`);
    } finally {
      setLoading(false);
    }
  };

  if (isOwnProfile) {
    return (
      <button 
        className="px-6 py-2 bg-gray-400 text-white rounded-lg font-semibold cursor-not-allowed"
        disabled
      >
        Your Profile
      </button>
    );
  }

  const getButtonContent = () => {
    switch (status) {
      case 'none':
        return {
          text: 'Add Friend',
          className: 'px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition',
          onClick: handleSendRequest
        };
      case 'pending':
        return {
          text: 'Request Sent',
          className: 'px-6 py-2 bg-gray-500 text-white rounded-lg font-semibold cursor-not-allowed',
          onClick: null
        };
      case 'received':
        return {
          text: 'Respond to Request',
          className: 'px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition',
          onClick: null
        };
      case 'friends':
        return {
          text: 'Friends',
          className: 'px-6 py-2 bg-green-500 text-white rounded-lg font-semibold cursor-not-allowed',
          onClick: null
        };
      default:
        return {
          text: 'Add Friend',
          className: 'px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition',
          onClick: handleSendRequest
        };
    }
  };

  const buttonContent = getButtonContent();

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        className={`${buttonContent.className} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={buttonContent.onClick}
        disabled={loading || !buttonContent.onClick}
      >
        {loading ? 'Loading...' : buttonContent.text}
      </button>
      
      {status === 'received' && (
        <div className="flex gap-2">
          <button
            className="px-4 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition"
            onClick={() => handleRespondToRequest('accept')}
            disabled={loading}
          >
            Accept
          </button>
          <button
            className="px-4 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition"
            onClick={() => handleRespondToRequest('decline')}
            disabled={loading}
          >
            Decline
          </button>
        </div>
      )}
      
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default FriendRequestButton; 