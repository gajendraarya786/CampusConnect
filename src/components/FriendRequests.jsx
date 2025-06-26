import React, { useState, useEffect } from 'react';
import { friendRequestAPI } from '../services/api.js';

const FriendRequests = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFriendRequests = async () => {
    try {
      setLoading(true);
      const response = await friendRequestAPI.getCurrentUser();
      const requests = response.data.friendRequests || [];
      
      // Filter only pending requests
      const pendingRequests = requests.filter(req => req.status === 'pending');
      setFriendRequests(pendingRequests);
    } catch (err) {
      setError('Failed to load friend requests');
      console.error('Error fetching friend requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRespondToRequest = async (fromUserId, action) => {
    try {
      await friendRequestAPI.respondToRequest(fromUserId, action);
      
      // Remove the request from the list
      setFriendRequests(prev => 
        prev.filter(req => req.from !== fromUserId)
      );
      
      // Show success message
      const actionText = action === 'accept' ? 'accepted' : 'declined';
      console.log(`Friend request ${actionText} successfully`);
    } catch (err) {
      setError(`Failed to ${action} friend request`);
      console.error(`Error ${action}ing friend request:`, err);
    }
  };

  useEffect(() => {
    fetchFriendRequests();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Friend Requests</h2>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading friend requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Friend Requests</h2>
        <div className="text-center py-8">
          <p className="text-red-500">{error}</p>
          <button 
            onClick={fetchFriendRequests}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Friend Requests</h2>
      
      {friendRequests.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 text-6xl mb-4">👥</div>
          <p className="text-gray-500">No pending friend requests</p>
        </div>
      ) : (
        <div className="space-y-4">
          {friendRequests.map((request) => (
            <div 
              key={request._id || request.from} 
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-lg">
                    {request.fromUser?.fullname?.charAt(0) || 'U'}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {request.fromUser?.fullname || 'Unknown User'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {request.fromUser?.email || 'No email available'}
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleRespondToRequest(request.from, 'accept')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleRespondToRequest(request.from, 'decline')}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition"
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendRequests; 