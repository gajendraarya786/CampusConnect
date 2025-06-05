import './App.css'
import React from 'react';
import Sidebar from './components/Sidebar';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar: only visible on md and up */}
      <div className="hidden md:block md:w-72 bg-white border-r">
        <Sidebar />
      </div>
      {/* Main content: always visible, takes full width on mobile */}
      <div className="flex flex-1 flex-col">
        <Navbar />
        <div className="flex-1 overflow-y-auto bg-gray-50 p-4 ">
          <AppRoutes />
        </div>
      </div>
    </div>
  )
}

export default App 