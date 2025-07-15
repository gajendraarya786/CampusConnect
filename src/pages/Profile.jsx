import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

// Icons
const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const LocationIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const BookIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const EmailIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
  </div>
);

const ErrorMessage = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
    <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
      <div className="text-red-500 text-6xl mb-4">⚠️</div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Profile</h2>
      <p className="text-gray-600 mb-4">{message}</p>
      <button 
        onClick={onRetry}
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
      >
        Try Again
      </button>
    </div>
  </div>
);

// Utility functions
const getInitials = (name) => {
  if (!name) return 'U';
  return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
};

const formatDate = (dateString) => {
  if (!dateString) return 'Unknown';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long' 
  });
};

// Modal component for image viewing and editing
const Modal = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div
        className="bg-white rounded-lg shadow-lg p-6 relative max-w-lg w-full max-h-[90vh] overflow-y-auto"
      >
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};

// Edit Profile Form
function EditProfileForm({ userData, onClose, onProfileUpdated }) {
  const [form, setForm] = useState({
    fullname: userData.fullname || '',
    bio: userData.bio || '',
    branch: userData.branch || '',
    year: userData.year || '',
    email: userData.email || '',
    mobile: userData.mobile || '',
    linkedIn: userData.linkedIn || '',
    github: userData.github || '',
    leetcode: userData.leetcode || '',
    skills: userData.skills ? userData.skills.join(', ') : '',
    avatar: userData.avatar || '',
    coverImage: userData.coverImage || '',
  });
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(userData.avatar || '');
  const [coverPreview, setCoverPreview] = useState(userData.coverImage || '');

  // Handle text input
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle avatar upload
  const handleAvatarChange = e => {
    const file = e.target.files[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
      setForm({ ...form, avatar: file });
    }
  };

  // Handle cover image upload
  const handleCoverChange = e => {
    const file = e.target.files[0];
    if (file) {
      setCoverPreview(URL.createObjectURL(file));
      setForm({ ...form, coverImage: file });
    }
  };

  // Handle submit
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'skills') {
          formData.append(key, value.split(',').map(s => s.trim()).filter(Boolean).join(','));
        } else {
          formData.append(key, value);
        }
      });
      await axios.patch(
        `http://localhost:8000/api/v1/users/profile`,
        formData,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
      );
      onProfileUpdated();
      onClose();
    } catch (err) {
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold mb-2">Edit Profile</h2>
      <div>
        <label className="block font-medium">Full Name</label>
        <input name="fullname" value={form.fullname} onChange={handleChange} className="input w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block font-medium">Bio</label>
        <textarea name="bio" value={form.bio} onChange={handleChange} className="input w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block font-medium">Branch</label>
        <input name="branch" value={form.branch} onChange={handleChange} className="input w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block font-medium">Year</label>
        <input name="year" value={form.year} onChange={handleChange} className="input w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block font-medium">Email</label>
        <input name="email" value={form.email} onChange={handleChange} className="input w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block font-medium">Mobile</label>
        <input name="mobile" value={form.mobile} onChange={handleChange} className="input w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block font-medium">LinkedIn</label>
        <input name="linkedIn" value={form.linkedIn} onChange={handleChange} className="input w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block font-medium">GitHub</label>
        <input name="github" value={form.github} onChange={handleChange} className="input w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block font-medium">LeetCode</label>
        <input name="leetcode" value={form.leetcode} onChange={handleChange} className="input w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block font-medium">Skills (comma separated)</label>
        <input name="skills" value={form.skills} onChange={handleChange} className="input w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block font-medium">Avatar</label>
        <input type="file" accept="image/*" onChange={handleAvatarChange} className="block mt-1" />
        {avatarPreview && (
          <img src={avatarPreview} alt="Avatar Preview" className="w-16 h-16 rounded-full mt-2" />
        )}
      </div>
      <div>
        <label className="block font-medium">Cover Image</label>
        <input type="file" accept="image/*" onChange={handleCoverChange} className="block mt-1" />
        {coverPreview && (
          <img src={coverPreview} alt="Cover Preview" className="w-full h-24 object-cover mt-2 rounded" />
        )}
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
        <button type="submit" disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">{loading ? 'Saving...' : 'Save'}</button>
      </div>
    </form>
  );
}

export default function Profile() {
  const { id } = useParams(); // Get the id from URL parameters
  const navigate = useNavigate(); // Initialize useNavigate
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showCoverModal, setShowCoverModal] = useState(false);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('accessToken');
      let endpoint = '';
      let config = {};

      if (id && id !== '') {
        // If id is provided and not empty, fetch that user's profile (public view)
        endpoint = `/users/${id}`;
        if (token) {
          config.headers = { Authorization: `Bearer ${token}` };
        }
      } else {
        // If id is undefined or an empty string (i.e., path is /profile)
        // Try to fetch logged-in user's profile
        endpoint = '/users/profile';
        if (!token) {
          // If no token for own profile, display message or redirect
          setLoading(false);
          setUserData(null); // Clear previous data
          setError("Please log in to view your profile.");
          return;
        }
        config.headers = { Authorization: `Bearer ${token}` };
      }

      // Debug logs
      console.log('Profile.jsx: id from useParams', id);
      console.log('Profile.jsx: Constructed endpoint', endpoint);
      console.log('Profile.jsx: Axios config headers', config.headers);

      const response = await axios.get(`http://localhost:8000/api/v1${endpoint}`, config);

      setUserData(response.data.data);
    } catch (err) {
      // Handle 404 for public profiles gracefully without redirecting to login
      if (err.response?.status === 404 && id) {
        setError("User not found.");
      } else if (err.response?.status === 401 && !id) {
        // If 401 for own profile, redirect to login
        setError("Unauthorized. Please login.");
        navigate('/login', { replace: true });
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to fetch profile');
        console.error('Error fetching profile:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [id]); // Re-fetch when id changes

  const handleRetry = () => {
    fetchUserProfile();
  };

  // Determine if the current profile is the logged-in user's own profile
  const getLoggedInUserId = () => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const loggedInUser = JSON.parse(userStr);
        return loggedInUser._id;
      }
    } catch (e) {
      console.error("Failed to parse user from localStorage:", e);
    }
    return null;
  };

  const loggedInUserId = getLoggedInUserId();
  const isOwnProfile = !id || (id === loggedInUserId);
  const isAuthenticated = !!localStorage.getItem('accessToken');

  const handleEditClick = () => {
    if (isAuthenticated && isOwnProfile) {
      setIsEditing(!isEditing);
    } else {
      navigate('/login', { replace: true });
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={handleRetry} />;
  }

  // If userData is null and no error, it means user is not found or not logged in for own profile
  if (!userData && !error) {
    return <ErrorMessage message="User profile not found or requires login." onRetry={handleRetry} />;
  }

  // Extract user data with fallbacks
  const {
    fullname = userData.fullname || 'Unknown User',
    username = userData.username || '',
    bio = userData.bio || 'No bio available',
    avatar = userData.avatar || '',
    coverImage = userData.coverImage || '',
    branch = userData.branch || '',
    year = userData.year || '',
    email = userData.email || '',
    mobile = userData.mobile || '',
    skills = userData.skills || [],
    createdAt = userData.createdAt,
    linkedIn = userData.linkedIn || '',
    github = userData.github || '',
    leetcode = userData.leetcode || ''
  } = userData;

  // Generate avatar initials if no avatar image
  const avatarInitials = getInitials(fullname);
  const joinDate = formatDate(createdAt);

  // Default cover image
  const defaultCoverImage = "https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=400&fit=crop";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Photo & Profile Header */}
      <div className="relative">
        {/* Cover Image */}
        <div className="h-64 bg-gradient-to-r from-blue-500 to-purple-600 relative overflow-hidden">
          <img 
            src={coverImage || defaultCoverImage} 
            alt="Cover" 
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => setShowCoverModal(true)}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>

        {/* Profile Info */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-16 sm:-mt-20">
            <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6">
              {/* Avatar */}
              <div className="relative">
                {avatar ? (
                  <img
                    src={avatar}
                    alt={fullname}
                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover cursor-pointer"
                    onClick={() => setShowAvatarModal(true)}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className={`w-32 h-32 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg ${avatar ? 'hidden' : ''}`}
                >
                  <span className="text-white font-bold text-4xl">{avatarInitials}</span>
                </div>
                {isOwnProfile && isAuthenticated && (
                  <button 
                    onClick={handleEditClick}
                    className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition"
                  >
                    <EditIcon />
                  </button>
                )}
              </div>

              {/* Name and Actions */}
              <div className="flex-1 mt-6 sm:mt-0 sm:pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{fullname}</h1>
                    <p className="text-gray-600">
                      {username.startsWith('@') ? username : `@${username}`}
                    </p>
                  </div>
                  {isOwnProfile && isAuthenticated && (
                    <button
                      onClick={() => setShowEditModal(true)}
                      className="mt-4 sm:mt-0 px-6 py-2 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition flex items-center space-x-2"
                    >
                      <EditIcon />
                      <span>Edit Profile</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Profile Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">About</h2>
              <p className="text-gray-700 mb-4">{bio}</p>
              
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <CalendarIcon />
                  <span className="ml-2 text-sm">Joined {joinDate}</span>
                </div>
                {(branch || year) && (
                  <div className="flex items-center text-gray-600">
                    <BookIcon />
                    <span className="ml-2 text-sm">
                      {branch} {year && `• ${year}`}
                    </span>
                  </div>
                )}
                {email && (
                  <div className="flex items-center text-gray-600">
                    <EmailIcon />
                    <span className="ml-2 text-sm">{email}</span>
                  </div>
                )}
                {mobile && (
                  <div className="flex items-center text-gray-600">
                    <PhoneIcon />
                    <span className="ml-2 text-sm">{mobile}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Social Links</h2>
              <div className="space-y-3">
                {linkedIn && (
                  <a 
                    href={linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-600 hover:text-indigo-600 transition"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                    <span className="text-sm">LinkedIn</span>
                  </a>
                )}
                {github && (
                  <a 
                    href={github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-600 hover:text-indigo-600 transition"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    <span className="text-sm">GitHub</span>
                  </a>
                )}
                {leetcode && (
                  <a 
                    href={leetcode}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-600 hover:text-indigo-600 transition"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a1.653 1.653 0 0 0 0 2.226 1.653 1.653 0 0 0 2.226 0l2.939-3.141 2.939 3.141a1.653 1.653 0 0 0 2.226 0 1.653 1.653 0 0 0 0-2.226l-3.854-4.126 5.406-5.788A1.374 1.374 0 0 0 13.483 0zm-2.866 12.041a1.653 1.653 0 0 0-2.226 0l-2.939 3.141-2.939-3.141a1.653 1.653 0 0 0-2.226 0 1.653 1.653 0 0 0 0 2.226l3.854 4.126-5.406 5.788a1.374 1.374 0 0 0 .961 2.438h10.966a1.374 1.374 0 0 0 .961-.438l5.406-5.788-3.854-4.126a1.653 1.653 0 0 0-2.226 0z"/>
                    </svg>
                    <span className="text-sm">LeetCode</span>
                  </a>
                )}
              </div>
            </div>

            {/* Skills */}
            {skills && skills.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Content - Posts */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📝</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No recent activity</h3>
                <p className="text-gray-600">Your activity will appear here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal open={showAvatarModal} onClose={() => setShowAvatarModal(false)}>
        <img src={avatar || defaultCoverImage} alt="Profile" className="w-full h-auto rounded-lg" />
      </Modal>
      <Modal open={showCoverModal} onClose={() => setShowCoverModal(false)}>
        <img src={coverImage || defaultCoverImage} alt="Cover" className="w-full h-auto rounded-lg" />
      </Modal>
      <Modal open={showEditModal} onClose={() => setShowEditModal(false)}>
        <EditProfileForm
          userData={userData}
          onClose={() => setShowEditModal(false)}
          onProfileUpdated={fetchUserProfile}
        />
      </Modal>
    </div>
  );
} 