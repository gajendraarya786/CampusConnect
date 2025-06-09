import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/LoginForm';
import SignupForm from '../pages/SignupForm';
import Feed from '../pages/Feed';
import Profile from '../pages/Profile';
import Messages from '../pages/Messages';
import Clubs from '../pages/Clubs';
import Events from '../pages/Events';
import NotFound from '../pages/NotFound';
import FriendList from '../pages/FriendList';
// import { useAuth } from '../context/AuthContext'; // This line should be removed or commented out

// Protected Route component (only for pages requiring auth to view/edit)
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Public Route component (redirects to home if already logged in)
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken');

  if (token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes for general viewing */}
      <Route path="/" element={<Feed />} />
      <Route path="/profile/:id" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/friends" element={<ProtectedRoute><FriendList /></ProtectedRoute>} />
      <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
      <Route path="/clubs" element={<Clubs />} />
      <Route path="/event" element={<Events />} />

      {/* Public Routes - login/signup (redirect if logged in) */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignupForm />
          </PublicRoute>
        }
      />

      {/* Catch all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
} 