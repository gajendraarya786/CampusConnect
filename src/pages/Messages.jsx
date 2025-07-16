import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useSelector } from "react-redux";
import PersonalChat from "../components/PersonalChat";
import { Search, MessageCircle, Users, Trash2, Menu, X, ArrowLeft } from 'lucide-react';
import { useLocation } from "react-router-dom";

export default function Messages() {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const [users, setUsers] = useState([]);
  const [targetUserId, setTargetUserId] = useState(null);
  const [targetUserName, setTargetUserName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    axiosInstance.get("/users/all", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setUsers(res.data));
  }, [token]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const userId = params.get('userId');
    if (userId) {
      const foundUser = users.find(u => u._id === userId);
      setTargetUserId(userId);
      setTargetUserName(foundUser ? (foundUser.fullname || foundUser.username) : '');
    }
    // eslint-disable-next-line
  }, [location.search, users]);

  const filteredUsers = users
    .filter(u => u._id !== user._id)
    .filter(u =>
      (u.fullname || u.username).toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleUserSelect = (userId, userName) => {
    setTargetUserId(userId);
    setTargetUserName(userName);
  };

  const handleBackToList = () => {
    setTargetUserId(null);
    setTargetUserName('');
  };

  const handleDeleteChat = async (otherUserId) => {
    if (!window.confirm("Are you sure you want to delete this chat? This cannot be undone.")) return;
    try {
      await axiosInstance.delete(`/users/chat-history/${otherUserId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (targetUserId === otherUserId) {
        setTargetUserId(null);
        setTargetUserName('');
      }
    } catch (err) {
      alert("Failed to delete chat");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <MessageCircle className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">Please log in to chat</h2>
          <p className="text-sm sm:text-base text-gray-500">You need to be logged in to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto bg-white shadow-lg md:rounded-lg overflow-hidden">
        <div className="flex h-screen relative">
          {/* Mobile: Show user list or chat based on selection */}
          {isMobile ? (
            <div className="w-full bg-white flex flex-col">
              {/* Show chat if user is selected, otherwise show user list */}
              {targetUserId ? (
                <PersonalChat
                  userId={user._id}
                  otherUserId={targetUserId}
                  otherUserName={targetUserName}
                  token={token}
                  onBack={handleBackToList}
                  onDeleteChat={() => handleDeleteChat(targetUserId)}
                />
              ) : (
                <>
                  {/* Search Bar */}
                  <div className="p-4 pb-2 bg-white border-b border-gray-200">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search conversations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>
                  
                  {/* Users List */}
                  <div className="flex-1 overflow-y-auto">
                    {filteredUsers.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
                        <Users className="w-12 h-12 mb-3 text-gray-300" />
                        <p className="text-sm text-center">No users found</p>
                      </div>
                    ) : (
                      <div className="space-y-1 p-2">
                        {filteredUsers.map(u => (
                          <div key={u._id} className="flex items-center">
                            <button
                              onClick={() => handleUserSelect(u._id, u.fullname || u.username)}
                              className="w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 hover:bg-gray-50 border-l-4 border-transparent"
                            >
                              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-semibold text-sm">
                                  {(u.fullname || u.username).charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="flex-1 text-left min-w-0">
                                <h3 className="font-medium text-gray-900 truncate text-base">
                                  {u.fullname || u.username}
                                </h3>
                                <p className="text-sm text-gray-500 truncate">
                                  @{u.username}
                                </p>
                              </div>
                              <div className="flex flex-col items-end space-y-1 flex-shrink-0">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-xs text-gray-400">now</span>
                              </div>
                            </button>
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                handleDeleteChat(u._id);
                              }}
                              className="ml-2 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete chat"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ) : (
            // Desktop View - Sidebar + Chat
            <>
              {/* Sidebar */}
              <div className="w-80 lg:w-96 bg-white border-r border-gray-200 flex flex-col">
                {/* Search Bar */}
                <div className="p-4 pb-2 bg-white border-b border-gray-200">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search conversations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>
                
                {/* Users List */}
                <div className="flex-1 overflow-y-auto">
                  {filteredUsers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
                      <Users className="w-12 h-12 mb-3 text-gray-300" />
                      <p className="text-sm text-center">No users found</p>
                    </div>
                  ) : (
                    <div className="space-y-1 p-2">
                      {filteredUsers.map(u => (
                        <div key={u._id} className="flex items-center">
                          <button
                            onClick={() => handleUserSelect(u._id, u.fullname || u.username)}
                            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                              targetUserId === u._id
                                ? 'bg-blue-50 border-l-4 border-blue-500'
                                : 'hover:bg-gray-50 border-l-4 border-transparent'
                            }`}
                          >
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-semibold text-sm">
                                {(u.fullname || u.username).charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="flex-1 text-left min-w-0">
                              <h3 className="font-medium text-gray-900 truncate text-sm sm:text-base">
                                {u.fullname || u.username}
                              </h3>
                              <p className="text-xs sm:text-sm text-gray-500 truncate">
                                @{u.username}
                              </p>
                            </div>
                            <div className="flex flex-col items-end space-y-1 flex-shrink-0">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-xs text-gray-400">now</span>
                            </div>
                          </button>
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              handleDeleteChat(u._id);
                            }}
                            className="ml-2 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete chat"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Main Chat Area */}
              <div className="flex-1 flex flex-col">
                {targetUserId ? (
                  <PersonalChat
                    userId={user._id}
                    otherUserId={targetUserId}
                    otherUserName={targetUserName}
                    token={token}
                    onBack={handleBackToList}
                    onDeleteChat={() => handleDeleteChat(targetUserId)}
                  />
                ) : (
                  <div className="flex-1 flex items-center justify-center bg-gray-50 p-4">
                    <div className="text-center max-w-sm">
                      <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageCircle className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
                      </div>
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
                        Select a conversation
                      </h2>
                      <p className="text-sm sm:text-base text-gray-500">
                        Choose a contact from the sidebar to start messaging
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}