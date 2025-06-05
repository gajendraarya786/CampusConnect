import React, { useState } from "react";
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
  UserPlus
} from 'lucide-react';
import { useNavigate, NavLink } from "react-router-dom";
import profile_pic from "../assets/profile1.jpg";
import logo from "../assets/nav-logo.png";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('Feed');
  const navigate = useNavigate();

  const user_id = 123;
  const navigationItems = [
    { name: 'Feed', icon: Home, path: '/' },
    { name: 'My Profile', icon: User, path: `/profile/${user_id}`},
    { name: 'Messages', icon: MessageSquare, path: '/messages' },
    { name: 'Clubs', icon: Users, path: '/club' },
    { name: 'Events', icon: Calendar, path: '/event' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const NavContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo Section */}
      <div className="p-4 border-b border-gray-100">
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
        <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none text-sm px-2 w-full"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 overflow-y-auto">
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
                    `w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive || activeItem === item.name
                        ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600'
                        : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                    }`
                  }
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Profile and Auth Section */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center space-x-3 mb-4">
          <img
            src={profile_pic}
            alt="profile"
            className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500"
          />
          <div>
            <p className="text-sm font-medium text-gray-900">John Doe</p>
            <p className="text-xs text-gray-500">john@example.com</p>
          </div>
        </div>
        <div className="space-y-2">
          <button
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Log out
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Main Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50 px-4 md:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="text-2xl font-bold text-indigo-600">
            <img src={logo} alt="CampusConnect Logo" className="w-20 h-15 object-contain lg:w-25" />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {/* Search */}
            <div className="flex items-center bg-gray-50 px-3 py-1 rounded-lg">
              <Search className="w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent focus:outline-none text-sm px-2 w-85 h-8 md:w-85 lg:w-150"
              />
            </div>

            {/* Profile */}
            <img
              src={profile_pic}
              alt="profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500 hover:scale-105 transition-transform"
            />

            <button className="bg-blue-800 text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-blue-900 transition">
              Log in
            </button>

            <button
              className="bg-white text-blue-500 text-sm font-semibold px-4 py-2 rounded-full hover:bg-blue-900 hover:text-white transition border-2"
              onClick={() => navigate('/signup')}
            >
              Sign up
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm  z-40 md:hidden"
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
    </>
  );
} 