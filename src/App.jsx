import './App.css'
import React from 'react';
import Sidebar from './components/Sidebar';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/Navbar';

function App() {
  

  return (
    <>
    <div className="flex h-screen">
      <div className="w-64 bg-white border-r">
        <Sidebar/>
      </div>
      <div className="flex flex-1 flex-col">
        <Navbar/>
          <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
          <AppRoutes />
        </div>
      </div>
    </div>
    </>
  )
}

export default App
