import './App.css';
import React from 'react';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/Navbar';
import { Provider } from 'react-redux';
import { store } from './store/store'; // Adjust path if needed

function App() {
  return (
    <Provider store={store}>
      <div className="flex flex-col md:flex-row h-screen bg-gray-50 overflow-hidden">
        {/* Sidebar - hidden on mobile, visible on md and up */}
        <div className="hidden md:block w-72 border-r border-gray-200 flex-shrink-0 h-full">
          <Sidebar />
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col h-full w-full overflow-y-auto">
          <Navbar />
          <main className="flex-1 overflow-y-auto bg-gray-50">
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
    </Provider>
  );
}

export default App; 
