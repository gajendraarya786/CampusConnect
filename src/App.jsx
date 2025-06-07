import './App.css';
import React from 'react';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - hidden on mobile, visible on md and up */}
      <div className="hidden md:block md:w-72 bg-white border-r border-gray-200">
        <Sidebar />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 overflow-y-auto">
          <AppRoutes />
        </main>
      </div>

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 2000,
            theme: {
              primary: '#4aed88',
            },
          },
          error: {
            duration: 3000,
            theme: {
              primary: '#ff4b4b',
            },
          },
        }}
      />
    </div>
  );
}

export default App; 