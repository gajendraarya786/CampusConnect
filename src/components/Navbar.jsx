import React, { useState, useEffect } from "react";
import { 
  Home, 
  User, 
  MessageSquare, 
  Users,
  Calendar,
  Menu,
  X,
  Search,
  LogOut,
  LogIn,
  UserPlus,
  Bell,
  Settings
} from 'lucide-react';
import { useNavigate, NavLink } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import logo from "../assets/nav-logo.png";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('Feed');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const response = await axiosInstance.get('/users/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setUser(response.data.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('accessToken');
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
    navigate('/login');
  };

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.trim().length === 0) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }
    try {
      const token = localStorage.getItem('accessToken');
      const res = await axiosInstance.get(`/users?search=${value}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSearchResults(res.data.data || []);
      setShowSearchDropdown(true);
    } catch (err) {
      setSearchResults([]);
      setShowSearchDropdown(false);
    }
  };

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
    setSearchTerm('');
    setSearchResults([]);
    setShowSearchDropdown(false);
  };

  const navigationItems = [
    { name: 'Feed', icon: Home, path: '/' },
    { name: 'My Profile', icon: User, path: `/profile/${user?._id}`},
    { name: 'Friends', icon: Users, path: '/friends' },
    { name: 'Roommates', icon: Users, path: '/roommates' },
    { name: 'Messages', icon: MessageSquare, path: '/messages' },
    { name: 'Projects', icon: MessageSquare, path: '/projects'},
    { name: 'Clubs', icon: Users, path: '/clubs' },
    { name: 'Events', icon: Calendar, path: '/event' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Get user initials for avatar fallback
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const NavContent = () => (
    <div className="flex flex-col h-full bg-white">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <img src={logo} alt="CampusConnect Logo" className="w-20 h-15 object-contain" />
          <div>
            <h1 className="text-lg font-bold text-indigo-600">CampusConnect</h1>
            <p className="text-xs text-gray-500">Make campus friends</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b border-gray-100">
        <div className="relative flex items-center bg-gray-50 px-3 py-2 rounded-lg">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => searchResults.length > 0 && setShowSearchDropdown(true)}
            className="bg-transparent focus:outline-none text-sm px-3 w-full text-gray-800 placeholder-gray-500"
          />
          {showSearchDropdown && searchResults.length > 0 && (
            <div className="absolute left-0 top-12 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
              {searchResults.map(u => (
                <div
                  key={u._id}
                  className="flex items-center px-4 py-2 hover:bg-indigo-50 cursor-pointer"
                  onClick={() => handleUserClick(u._id)}
                >
                  <img
                    src={u.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(u.fullname)}
                    alt={u.fullname}
                    className="w-8 h-8 rounded-full object-cover mr-3"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{u.fullname}</div>
                    <div className="text-xs text-gray-500">{u.email}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  onClick={() => {
                    setActiveItem(item.name);
                    closeMobileMenu();
                  }}
                  className={({ isActive }) =>
                    `w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive || activeItem === item.name
                        ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600'
                        : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                    }`
                  }
                >
                  <div className="flex items-center">
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </div>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Profile and Auth Section */}
      {user ? (
        <div className="px-6 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <button
              onClick={() => navigate(`/profile/${user._id}`)}
              className="focus:outline-none"
              title="My Profile"
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.fullname}
                  className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500 hover:scale-105 transition-transform shadow-md"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center border-2 border-indigo-500 hover:scale-105 transition-transform shadow-md">
                  <span className="text-white font-semibold text-sm">
                    {getInitials(user.fullname)}
                  </span>
                </div>
              )}
            </button>
            <div>
              <p className="text-sm font-medium text-gray-900">{user.fullname}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
          <div className="space-y-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Log out
            </button>
            <button
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200"
              title="Notifications"
            >
              <Bell className="w-5 h-5 mr-3" />
              Notifications
            </button>
            <button
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200"
              title="Settings"
              onClick={() => setSettingsOpen(true)}
            >
              <Settings className="w-5 h-5 mr-3" />
              Settings
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 border-t border-gray-100">
          <div className="space-y-2">
            <button
              onClick={() => {
                navigate('/login');
                closeMobileMenu();
              }}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200"
            >
              <LogIn className="w-5 h-5 mr-3" />
              Log in
            </button>
            <button
              onClick={() => {
                navigate('/signup');
                closeMobileMenu();
              }}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200"
            >
              <UserPlus className="w-5 h-5 mr-3" />
              Sign up
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Main Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50 px-4 md:px-8 py-3 border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img src={logo} alt="CampusConnect Logo" className="w-20 h-15 object-contain" />
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-indigo-600">CampusConnect</h1>
              <p className="text-xs text-gray-500">Make campus friends</p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => searchResults.length > 0 && setShowSearchDropdown(true)}
                className="w-72 pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
              />
              {showSearchDropdown && searchResults.length > 0 && (
                <div className="absolute left-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                  {searchResults.map(u => (
                    <div
                      key={u._id}
                      className="flex items-center px-4 py-2 hover:bg-indigo-50 cursor-pointer"
                      onClick={() => handleUserClick(u._id)}
                    >
                      <img
                        src={u.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(u.fullname)}
                        alt={u.fullname}
                        className="w-8 h-8 rounded-full object-cover mr-3"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{u.fullname}</div>
                        <div className="text-xs text-gray-500">{u.email}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {user ? (
              <>
                <button
                  className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                </button>
                <button
                  className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
                  title="Settings"
                  onClick={() => setSettingsOpen(true)}
                >
                  <Settings className="w-5 h-5" />
                </button>
                {/* Profile */}
                <button
                  onClick={() => navigate(`/profile/${user._id}`)}
                  className="focus:outline-none"
                  title="My Profile"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.fullname}
                      className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500 hover:scale-105 transition-transform shadow-md"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center border-2 border-indigo-500 hover:scale-105 transition-transform shadow-md">
                      <span className="text-white font-semibold text-sm">
                        {getInitials(user.fullname)}
                      </span>
                    </div>
                  )}
                </button>
                <button 
                  onClick={handleLogout}
                  className="bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-red-600 transition-colors duration-200"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <button 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2 rounded-full transition-colors duration-200"
                  onClick={() => navigate('/login')}
                >
                  Log in
                </button>
                <button
                  className="bg-white text-indigo-600 border border-indigo-600 font-semibold px-5 py-2 rounded-full hover:bg-indigo-50 transition-colors duration-200"
                  onClick={() => navigate('/signup')}
                >
                  Sign up
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-200"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:hidden ${ 
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <NavContent />
      </div>

      {/* Settings Modal */}
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
} 

function SettingsModal({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold mb-4">Settings</h2>
        <p className="text-gray-500">Settings content goes here...</p>
      </div>
    </div>
  );
}