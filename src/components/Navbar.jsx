import React, { useState, useEffect, useRef } from "react";
import {
  Home, User, MessageSquare, Users, Calendar, Menu, X, Search,
  LogOut, LogIn, UserPlus, Bell, Settings
} from 'lucide-react';
import { useNavigate, NavLink } from "react-router-dom";
import axios from 'axios';
import logo from "../assets/nav-logo.png";
import { useSelector } from "react-redux";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('Feed');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);
  const token = useSelector((state) => state.auth.token);
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
      const response = await axios.get('http://localhost:8000/api/v1/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data.data);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('accessToken');
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  // Search handler
  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearch(value);
    if (value.length > 1 && token) {
      try {
        const res = await axios.get("http://localhost:8000/api/v1/users/search", {
          params: { q: value },
          headers: { Authorization: `Bearer ${token}` }
        });
        setResults(res.data);
        setShowDropdown(true);
      } catch (err) {
        setResults([]);
        setShowDropdown(false);
      }
    } else {
      setResults([]);
      setShowDropdown(false);
    }
  };

  // Hide dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
    navigate('/login');
  };

  const navigationItems = [
    { name: 'Feed', icon: Home, path: '/' },
    { name: 'My Profile', icon: User, path: `/profile/${user?._id}` },
    { name: 'Friends', icon: Users, path: '/friends' },
    { name: 'Roommates', icon: Users, path: '/roommates' },
    { name: 'Messages', icon: MessageSquare, path: '/messages' },
    { name: 'Projects', icon: MessageSquare, path: '/projects' },
    { name: 'Clubs', icon: Users, path: '/clubs' },
    { name: 'Events', icon: Calendar, path: '/event' },
  ];

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

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

      {/* Search Bar for Mobile */}
      <div className="p-4 border-b border-gray-100" ref={searchRef}>
        <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg relative">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search users..."
            className="bg-transparent focus:outline-none text-sm px-2 w-full text-gray-700"
            value={search}
            onChange={handleSearch}
            onFocus={() => setShowDropdown(results.length > 0)}
          />
          {showDropdown && results.length > 0 && (
            <ul className="absolute left-0 top-10 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
              {results.map((u) => (
                <li key={u._id} className="hover:bg-indigo-50">
                  <button
                    className="flex items-center w-full px-4 py-2 text-left"
                    onClick={() => {
                      setSearch("");
                      setShowDropdown(false);
                      closeMobileMenu();
                      navigate(`/profile/${u._id}`);
                      // To start chat instead, use:
                      // navigate(`/messages?user=${u._id}`);
                    }}
                  >
                    <img
                      src={u.avatar}
                      alt={u.fullname}
                      className="w-7 h-7 rounded-full object-cover mr-3"
                      style={{ background: "#eee" }}
                    />
                    <span className="font-medium">{u.fullname || u.username}</span>
                    <span className="ml-2 text-xs text-gray-500">{u.username}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Main Navigation Items */}
      <div className="flex-1 p-4">
        <ul className="space-y-4">
          {navigationItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                onClick={closeMobileMenu}
                className={`flex items-center p-3 rounded-lg text-gray-700 hover:bg-indigo-50 transition-colors duration-200 ${
                  activeItem === item.name ? 'bg-indigo-100 font-medium' : ''
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* User Info and Logout */}
      <div className="p-4 border-t border-gray-100">
        {user ? (
          <>
            <div className="flex items-center mb-3">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.fullname}
                  className="w-10 h-10 rounded-full object-cover mr-3"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : (
                <div
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center border-2 border-indigo-500"
                >
                  <span className="text-white font-semibold text-sm">
                    {getInitials(user.fullname)}
                  </span>
                </div>
              )}
              <div>
                <p className="font-medium">{user.fullname}</p>
                <p className="text-xs text-gray-500">{user.username}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-red-600 transition-colors duration-200"
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <button
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-full transition-colors duration-200"
              onClick={() => navigate('/login')}
            >
              Log in
            </button>
            <button
              className="w-full bg-white text-indigo-600 border border-indigo-600 font-semibold px-4 py-2 rounded-full hover:bg-indigo-50 transition-colors duration-200"
              onClick={() => navigate('/signup')}
            >
              Sign up
            </button>
          </>
        )}
      </div>
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
            <div className="relative" ref={searchRef}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search users..."
                className="w-72 pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                value={search}
                onChange={handleSearch}
                onFocus={() => setShowDropdown(results.length > 0)}
              />
              {showDropdown && results.length > 0 && (
                <ul className="absolute left-0 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
                  {results.map((u) => (
                    <li key={u._id} className="hover:bg-indigo-50">
                      <button
                        className="flex items-center w-full px-4 py-2 text-left"
                        onClick={() => {
                          setSearch("");
                          setShowDropdown(false);
                          navigate(`/profile/${u._id}`);
                          // To start chat instead, use:
                          // navigate(`/messages?user=${u._id}`);
                        }}
                      >
                        <img
                          src={u.avatar}
                          alt={u.fullname}
                          className="w-7 h-7 rounded-full object-cover mr-3"
                          style={{ background: "#eee" }}
                        />
                        <span className="font-medium">{u.fullname || u.username}</span>
                        <span className="ml-2 text-xs text-gray-500">{u.username}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* ...rest of your menu... */}
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
                >
                  <Settings className="w-5 h-5" />
                </button>
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
                ) : null}
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center border-2 border-indigo-500 hover:scale-105 transition-transform shadow-md ${user.avatar ? 'hidden' : ''}`}
                >
                  <span className="text-white font-semibold text-sm">
                    {getInitials(user.fullname)}
                  </span>
                </div>
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
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={closeMobileMenu}></div>
          <NavContent />
        </div>
      )}
    </>
  );
} 