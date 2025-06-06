import './App.css';
import React from 'react';
import Sidebar from './components/Sidebar';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar visible only on medium and up */}
      <div className="hidden md:block md:w-72 bg-white border-r">
        <Sidebar />
      </div>

      {/* Main content area */}
      <div className="flex flex-1 flex-col w-full">
        <Navbar />
        <div className="flex-1 overflow-y-auto bg-gray-50 p-0">
          <AppRoutes />
        </div>
      </div>
    </div>
  );
}

export default App;
