import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import PersonalChat from "../components/PersonalChat";
import { Search, MessageCircle, Users, Menu, X } from 'lucide-react';

export default function Messages() {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const [users, setUsers] = useState([]);
  const [targetUserId, setTargetUserId] = useState(null);
  const [targetUserName, setTargetUserName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    axios.get("http://localhost:8000/api/v1/users/all", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setUsers(res.data));
  }, [token]);

  const filteredUsers = users
    .filter(u => u._id !== user._id)
    .filter(u => 
      (u.fullname || u.username).toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleUserSelect = (userId, userName) => {
    setTargetUserId(userId);
    setTargetUserName(userName);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const handleBackToList = () => {
    setTargetUserId(null);
    setTargetUserName('');
    if (isMobile) {
      setIsSidebarOpen(true);
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
          {/* Mobile Header */}
          <div className="md:hidden absolute top-0 left-0 right-0 z-20 bg-white border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-900">Messages</h1>
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Sidebar - User List */}
          <div className={`
            ${isMobile ? 'fixed inset-y-0 left-0 z-10' : 'relative'}
            ${isMobile && !isSidebarOpen ? '-translate-x-full' : 'translate-x-0'}
            ${isMobile ? 'w-full' : 'w-80 lg:w-96'}
            bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out
            ${isMobile ? 'pt-20' : ''}
          `}>
            {/* Desktop Header */}
            <div className="hidden md:block p-4 bg-white border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold text-gray-900">Messages</h1>
                <div className="flex items-center space-x-1 text-gray-600">
                  <Users className="w-5 h-5" />
                  <span className="text-sm">{filteredUsers.length}</span>
                </div>
              </div>
              
              {/* Search */}
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

            {/* Mobile Search */}
            <div className="md:hidden p-4 bg-white border-b border-gray-200">
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
                    <button
                      key={u._id}
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
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Overlay for mobile */}
          {isMobile && isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-5"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Main Chat Area */}
          <div className={`
            flex-1 flex flex-col
            ${isMobile ? 'pt-20' : ''}
            ${isMobile && !targetUserId ? 'hidden' : 'flex'}
          `}>
            {targetUserId ? (
              <PersonalChat
                userId={user._id}
                otherUserId={targetUserId}
                otherUserName={targetUserName}
                token={token}
                onBack={isMobile ? handleBackToList : null}
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
        </div>
      </div>
    </div>
  );
}