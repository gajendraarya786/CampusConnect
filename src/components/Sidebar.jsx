import React, { useState } from 'react';
import { 
  Home, 
  User, 
  MessageSquare, 
  Users,
  Calendar,
  Search
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import profile_pic from "../assets/profile1.jpg";
import logo from "../assets/nav-logo.png";

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState('Feed');

  const user_id = 123;
  const navigationItems = [
    { name: 'Feed', icon: Home, path: '/' },
    { name: 'My Profile', icon: User, path: `/profile/${user_id}`},
    { name: 'Messages', icon: MessageSquare, path: '/messages' },
    { name: 'Clubs', icon: Users, path: '/club' },
    { name: 'Events', icon: Calendar, path: '/event' },
  ];

  return (
    <div className="hidden md:flex w-72 bg-white shadow-lg flex-col border-r border-gray-200 h-screen sticky top-0">
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
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  onClick={() => setActiveItem(item.name)}
                  className={({ isActive }) =>
                    `w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
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

      {/* Profile Section */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center space-x-3">
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
      </div>
    </div>
  );
} 