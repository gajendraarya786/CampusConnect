import React, { useState } from "react";
import search_icon from "../assets/search_icon.svg";
import profile_pic from "../assets/profile1.jpg";
import logo from "../assets/nav-logo.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 px-4 md:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-bold text-indigo-600">
          <img src={logo} 
               alt="CampusConnect Logo"
               className="w-20 h-15 object-contain lg:w-25"
          >
            
          </img>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {/* Search */}
          <div className="flex items-center bg-white-100 px-3 py-1 rounded-lg shadow-sm">
          <svg
           className="w-4 h-4 text-gray-600"
           fill="none"
           stroke="currentColor"
           strokeWidth="2"
           viewBox="0 0 24 24"
            >

            <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
            />

            </svg>

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

          {/* Logout Button */}
          <button
            id="log-out"
            className="bg-blue-800 text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-blue-900 transition"
          >
            Log out
          </button>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-700 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 space-y-4">
          <div className="flex items-center bg-white-100 px-4 py-2 rounded-lg mx-2 shadow-md">
            <img src={search_icon} alt="search" className="w-4 h-4 opacity-60" />
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent focus:outline-none text-sm px-2 w-full"
            />
          </div>

          <div className="flex items-center justify-between px-4">
            <img
              src={profile_pic}
              alt="profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500"
            />
            <button
              id="log-out"
              className="bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-red-600 transition"
            >
              Log out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
