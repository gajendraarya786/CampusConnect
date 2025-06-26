import React, { useState } from 'react';
import RoommateProfilePage from '../components/RoommateProfilePage';
import RoommateMatches from '../components/RoommateMatches';
import AllRoommateProfilesCarousel from '../components/AllRoommatesProfilesCarousel';
import { User, Users, Search, Menu, X } from 'lucide-react';

const TABS = [
  { key: 'profile', label: 'My Profile', icon: User },
  { key: 'matches', label: 'Matches', icon: Users },
  { key: 'browse', label: 'Browse All', icon: Search },
];

export default function RoommateDashboard() {
  const [tab, setTab] = useState('profile');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row max-w-7xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden min-h-[90vh] relative text-sm">
      {/* Mobile Header */}
      <div className="lg:hidden bg-gradient-to-r from-blue-600 to-purple-600 p-3 flex items-center justify-between">
        <h1 className="text-base font-bold text-white">Roommate Finder</h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white p-2 rounded-lg hover:bg-white/20 transition-colors"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:relative absolute inset-y-0 left-0 z-50
        w-72 lg:w-1/4 bg-gradient-to-b from-blue-100 via-purple-50 to-pink-50 
        p-4 lg:p-6 flex flex-col gap-4 border-r border-gray-200
        transition-transform duration-300 ease-in-out
      `}>
        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <div className="relative z-50 bg-gradient-to-b from-blue-100 via-purple-50 to-pink-50 p-4 lg:p-0">
          <h2 className="text-lg lg:text-xl font-extrabold mb-4 text-blue-800 tracking-tight">
            Roommate Finder
          </h2>
          <nav className="flex flex-col gap-2">
            {TABS.map(t => {
              const IconComponent = t.icon;
              return (
                <button
                  key={t.key}
                  onClick={() => {
                    setTab(t.key);
                    setSidebarOpen(false);
                  }}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm 
                    transition-all duration-200 transform hover:scale-105
                    ${tab === t.key
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'bg-white text-blue-700 hover:bg-blue-50 border border-blue-100 hover:border-blue-200'
                    }
                  `}
                >
                  <IconComponent size={16} />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gradient-to-br from-gray-50 to-blue-50 min-h-[70vh] lg:min-h-[600px] overflow-y-auto">
        <div className="p-3 sm:p-4 lg:p-6 h-full text-sm">
          {tab === 'profile' && <RoommateProfilePage />}
          {tab === 'matches' && <RoommateMatches />}
          {tab === 'browse' && <AllRoommateProfilesCarousel />}
        </div>
      </div>
    </div>
  );
}
