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
import ProjectCollaboration from '../pages/ProjectCollaboration';
import RoommateDashboard from '../pages/RoommateDashboard';
import RoommateProfileDetails from '../components/RoommateProfileDetails';
import Homepage from '../pages/CollegeHomepage'; // Import your new homepage component

// Protected Route component (redirects to homepage if not authenticated)
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    return <Navigate to="/homepage" replace />;
  }
  return children;
};

// Public Route component (redirects to feed if already logged in)
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken');

  if (token) {
    return <Navigate to="/feed" replace />;
  }
  return children;
};

export default function AppRoutes() {
  const token = localStorage.getItem('accessToken');

  return (
    <Routes>
      {/* Root route - redirect based on authentication */}
      <Route 
        path="/" 
        element={
          token ? <Navigate to="/feed" replace /> : <Navigate to="/homepage" replace />
        } 
      />

      {/* Public Homepage (for non-logged-in users) */}
      <Route path="/homepage" element={<Homepage />} />

      {/* Protected Routes (require authentication) */}
      <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
      <Route path="/profile/:id" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/friends" element={<ProtectedRoute><FriendList /></ProtectedRoute>} />
      <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
      <Route path="/projects" element={<ProtectedRoute><ProjectCollaboration/></ProtectedRoute>} />
      <Route path="/roommates" element = {<ProtectedRoute><RoommateDashboard/></ProtectedRoute>} />
      <Route path="/roommates/:id" element = {<ProtectedRoute><RoommateProfileDetails/></ProtectedRoute>} />
      
      {/* Semi-public routes (viewable by all, but enhanced for logged-in users) */}
      <Route path="/clubs" element={<Clubs />} />
      <Route path="/events" element={<Events />} />

      {/* Authentication Routes (redirect to feed if already logged in) */}
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