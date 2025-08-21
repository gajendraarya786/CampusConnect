// store/postsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../api/axiosInstance';

// Async thunks for API calls
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (_, { rejectWithValue, getState }) => {
    try {
      // Check if we have fresh data (less than 5 minutes old)
      const { posts } = getState();
      const now = Date.now();
      const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
      
      if (posts.data.length > 0 && posts.lastFetched && (now - posts.lastFetched) < CACHE_DURATION) {
        // Return cached data without making API call
        return { data: posts.data, cached: true };
      }

      const response = await axiosInstance.get('/posts');
      return { data: response.data.data, cached: false, timestamp: now };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch posts');
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'posts/fetchUserProfile',
  async (_, { rejectWithValue, getState }) => {
    try {
      // Check cache first
      const { posts } = getState();
      const now = Date.now();
      const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes for user profile
      
      if (posts.userProfile && posts.userProfileLastFetched && (now - posts.userProfileLastFetched) < CACHE_DURATION) {
        return { data: posts.userProfile, cached: true };
      }

      const response = await axiosInstance.get('/users/profile');
      return { data: response.data.data, cached: false, timestamp: now };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

export const likePost = createAsyncThunk(
  'posts/likePost',
  async (postId, { rejectWithValue, getState }) => {
    try {
      const { posts } = getState();
      const isLiked = posts.likedPosts.has(postId);
      
      if (isLiked) {
        await axiosInstance.delete(`/posts/${postId}/unlike`);
      } else {
        await axiosInstance.post(`/posts/${postId}/like`);
      }
      
      return { postId, isLiked };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle like');
    }
  }
);

export const createPost = createAsyncThunk(
  'posts/createPost',
  async (postData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      Object.keys(postData).forEach(key => {
        if (key === 'images' || key === 'videos') {
          postData[key].forEach(file => {
            formData.append(key, file);
          });
        } else {
          formData.append(key, postData[key]);
        }
      });

      const response = await axiosInstance.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create post');
    }
  }
);

export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (postId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/posts/${postId}`);
      return postId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete post');
    }
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    data: [],
    userProfile: null,
    likedPosts: new Set(),
    savedPosts: new Set(),
    comments: {},
    loading: false,
    error: null,
    lastFetched: null,
    userProfileLastFetched: null,
    initialized: false
  },
  reducers: {
    toggleSavePost: (state, action) => {
      const postId = action.payload;
      const newSavedPosts = new Set(state.savedPosts);
      if (newSavedPosts.has(postId)) {
        newSavedPosts.delete(postId);
      } else {
        newSavedPosts.add(postId);
      }
      state.savedPosts = newSavedPosts;
    },
    setComments: (state, action) => {
      const { postId, comments } = action.payload;
      state.comments[postId] = comments;
    },
    addComment: (state, action) => {
      const { postId, comment } = action.payload;
      if (!state.comments[postId]) {
        state.comments[postId] = [];
      }
      state.comments[postId].push(comment);
    },
    deleteComment: (state, action) => {
      const { postId, commentId } = action.payload;
      if (state.comments[postId]) {
        state.comments[postId] = state.comments[postId].filter(c => c._id !== commentId);
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    // Reset state when user logs out
    resetPostsState: (state) => {
      state.data = [];
      state.userProfile = null;
      state.likedPosts = new Set();
      state.savedPosts = new Set();
      state.comments = {};
      state.loading = false;
      state.error = null;
      state.lastFetched = null;
      state.userProfileLastFetched = null;
      state.initialized = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Posts
      .addCase(fetchPosts.pending, (state) => {
        if (state.data.length === 0) {
          state.loading = true;
        }
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        if (!action.payload.cached) {
          state.data = action.payload.data;
          state.lastFetched = action.payload.timestamp;
        }
        state.initialized = true;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch User Profile
      .addCase(fetchUserProfile.pending, (state) => {
        // Don't show loading if we have cached profile
        if (!state.userProfile) {
          state.loading = true;
        }
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        if (!action.payload.cached) {
          state.userProfile = action.payload.data;
          state.userProfileLastFetched = action.payload.timestamp;
        }
        
        // Initialize liked posts based on user profile and posts
        if (state.data.length > 0 && state.userProfile) {
          const userLikedPostIds = new Set(
            state.data
              .filter(post => post.likes && post.likes.some(like => like.user === state.userProfile._id))
              .map(post => post._id)
          );
          state.likedPosts = userLikedPostIds;
        }
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Like Post
      .addCase(likePost.fulfilled, (state, action) => {
        const { postId, isLiked } = action.payload;
        const newLikedPosts = new Set(state.likedPosts);
        
        if (isLiked) {
          newLikedPosts.delete(postId);
        } else {
          newLikedPosts.add(postId);
        }
        state.likedPosts = newLikedPosts;
        
        // Update post likes in the data array
        const post = state.data.find(p => p._id === postId);
        if (post) {
          if (isLiked) {
            post.likes = (post.likes || []).filter(like => like.user !== state.userProfile._id);
          } else {
            post.likes = [...(post.likes || []), { user: state.userProfile._id, likedAt: new Date().toISOString() }];
          }
        }
      })
      .addCase(likePost.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // Create Post
      .addCase(createPost.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        // Add new post to the beginning of the array
        state.data.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete Post
      .addCase(deletePost.fulfilled, (state, action) => {
        const postId = action.payload;
        state.data = state.data.filter(post => post._id !== postId);
        // Clean up related state
        state.likedPosts.delete(postId);
        state.savedPosts.delete(postId);
        delete state.comments[postId];
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const { 
  toggleSavePost, 
  setComments, 
  addComment, 
  deleteComment, 
  clearError,
  resetPostsState
} = postsSlice.actions;

export default postsSlice.reducer;
