import React, { useState } from 'react';
import { 
  Home, 
  User, 
  MessageSquare, 
  Users,
  Calendar
} from 'lucide-react';

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState('Feed');

  const navigationItems = [
    { name: 'Feed', icon: Home },
    { name: 'My Profile', icon: User },
    { name: 'Messages', icon: MessageSquare },
    { name: 'Clubs', icon: Users },
    { name: 'Events', icon: Calendar },
  ];

  return (
    <div className="w-80 bg-white shadow-lg flex flex-col border-r border-gray-200 h-screen">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">CC</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-indigo-600">CampusConnect</h1>
            <p className="text-xs text-gray-500">Make campus friends</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <button
                  onClick={() => setActiveItem(item.name)}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeItem === item.name
                      ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600'
                      : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}