
import axiosInstance from '../api/axiosInstance';

// Add request interceptor to add auth token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear tokens and redirect to login
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    const errorMessage = error.response?.data?.message || 'Something went wrong';
    console.error('API Error:', errorMessage);
    return Promise.reject(error);
  }
);

export const roommateAPI = {
  // Get all roommate profiles
  getAllProfiles: async () => {
    const res = await axiosInstance.get('/roommates/');
    return res.data;
  },
  // Create or update my roommate profile
  saveProfile: async (profile) => {
    const res = await axiosInstance.post('/roommates/profile', profile);
    return res.data;
  },
  // Get my roommate profile
  getMyProfile: async () => {
    const res = await axiosInstance.get('/roommates/profile');
    return res.data;
  },
  // Get matches
  getMatches: async () => {
    const res = await axiosInstance.get('/roommates/matches');
    return res.data;
  },
  // Get roommate profile by ID
  getProfileById: async (id) => {
    const res = await axiosInstance.get(`/roommates/${id}`);
    return res.data;
  },
  // Delete my roommate profile
  deleteProfile: async () => {
    const res = await axiosInstance.delete('/roommates/profile');
    return res.data;
  }
};

export default axiosInstance;