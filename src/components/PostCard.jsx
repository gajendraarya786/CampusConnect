import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';

// Custom Icons
const HeartIcon = ({ filled = false }) => (
  <svg className="w-5 h-5" fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const CommentIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const ShareIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
  </svg>
);

const BookmarkIcon = ({ filled = false }) => (
  <svg className="w-5 h-5" fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
  </svg>
);

const DotsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
  </svg>
);

const VerifiedIcon = () => (
  <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CreatePostModal = ({ isOpen, onClose, onPost }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    category: '',
    visibility: 'public',
    images: [],
    videos: []
  });
  const [previewImages, setPreviewImages] = useState([]);
  const [previewVideos, setPreviewVideos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e, type) => {
    const files = Array.from(e.target.files);
    const maxFiles = type === 'images' ? 10 : 5;
    
    if (files.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} ${type}`);
      return;
    }

    setFormData(prev => ({
      ...prev,
      [type]: files
    }));

    // Create previews
    if (type === 'images') {
      const imagePreviews = files.map(file => URL.createObjectURL(file));
      setPreviewImages(imagePreviews);
    } else {
      const videoPreviews = files.map(file => URL.createObjectURL(file));
      setPreviewVideos(videoPreviews);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const postData = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'images' || key === 'videos') {
          formData[key].forEach(file => {
            postData.append(key, file);
          });
        } else {
          postData.append(key, formData[key]);
        }
      });

      const { data } = await api.post('/posts', postData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      onPost(data.data);
      onClose();
      setFormData({
        title: '',
        content: '',
        tags: '',
        category: '',
        visibility: 'public',
        images: [],
        videos: []
      });
      setPreviewImages([]);
      setPreviewVideos([]);
    } catch (error) {
      console.error('Error creating post:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create post. Please try again.';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Create Post</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="title"
              placeholder="Post Title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <textarea
              name="content"
              placeholder="What's on your mind?"
              value={formData.content}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-h-[100px]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                name="tags"
                placeholder="Tags (comma separated)"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <select
                name="visibility"
                value={formData.visibility}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="friends">Friends Only</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Images (max 10)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFileChange(e, 'images')}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            {previewImages.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-2">
                {previewImages.map((preview, index) => (
                  <img key={`image-preview-${index}`} src={preview} alt={`Preview ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Videos (max 5)</label>
            <input
              type="file"
              accept="video/*"
              multiple
              onChange={(e) => handleFileChange(e, 'videos')}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            {previewVideos.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-2">
                {previewVideos.map((preview, index) => (
                  <video key={`video-preview-${index}`} src={preview} className="w-full h-24 object-cover rounded-lg" controls />
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Utility hook for detecting clicks outside an element
function useClickOutside(ref, handler) {
  React.useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
    };
  }, [ref, handler]);
}

function PostCard({
  post,
  displayUser,
  initials,
  savedPosts,
  toggleStateSet,
  setSavedPosts,
  openDropdownId,
  setOpenDropdownId,
  likedPosts,
  setLikedPosts,
  showComments,
  setShowComments,
  commentInputs,
  setCommentInputs,
  comments,
  setComments,
  commentLoading,
  setCommentLoading,
  handleToggleComments,
  handleCommentInput,
  handlePostComment,
  handleShare,
  shareTo,
  userProfile,
  handleDeletePost,
  handleDeleteComment
}) {
  const dropdownRef = useRef(null);
  useClickOutside(dropdownRef, () => {
    if (openDropdownId === post._id) setOpenDropdownId(null);
  });

  return (
    <article key={post._id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-6 sm:mb-8 transform transition-all duration-300 hover:scale-[1.005] hover:shadow-xl">
      <div className="p-4 sm:p-6 flex flex-col gap-2 sm:gap-0">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
            {displayUser.avatar ? (
              <img 
                src={displayUser.avatar}
                alt={displayUser.name}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-indigo-400 shadow-md"
              />
            ) : (
              <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r ${displayUser.avatarColor} flex items-center justify-center text-white font-semibold text-lg sm:text-xl shadow-md`}>
                {initials}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-base sm:text-lg text-gray-900 group-hover:text-indigo-600 transition-colors duration-200 truncate">{displayUser.name}</h3>
                {displayUser.verified && <VerifiedIcon />}
              </div>
              <p className="text-xs sm:text-sm text-gray-500 truncate">{displayUser.username} • {post.timestamp}</p>
            </div>
          </div>
          {/* 3-dots button and dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setOpenDropdownId(openDropdownId === post._id ? null : post._id)}
              aria-label="Post options"
            >
              <DotsIcon />
            </button>
            {openDropdownId === post._id && (
              <div className="absolute right-0 mt-2 z-20 bg-white border border-gray-200 rounded shadow-lg p-2 min-w-[160px]">
                <button
                  onClick={() => {
                    toggleStateSet(setSavedPosts, savedPosts, post._id, 'save');
                    setOpenDropdownId(null);
                  }}
                  className="block w-full text-left px-3 py-1 hover:bg-gray-100 text-sm text-gray-700"
                >
                  {savedPosts.has(post._id) ? 'Unsave Post' : 'Save Post'}
                </button>
                {/* Delete Post option, only for author */}
                {userProfile?._id && (userProfile._id === (post.author?._id || post.author)) && (
                  <button
                    onClick={() => {
                      handleDeletePost(post._id);
                      setOpenDropdownId(null);
                    }}
                    className="block w-full text-left px-3 py-1 hover:bg-gray-100 text-sm text-red-600"
                  >
                    Delete Post
                  </button>
                )}
                {/* Add more menu items here if needed */}
              </div>
            )}
          </div>
        </div>
        <div className="px-4 sm:px-6 pb-3 sm:pb-4">
          <p className="text-sm sm:text-base text-gray-800 whitespace-pre-line leading-relaxed break-words">{post.content}</p>
        </div>
        {/* Handle multiple images */}
        {post.images && post.images.length > 0 && (
          <div className="grid grid-cols-1 gap-1 border-y border-gray-200">
            {post.images.map((image, index) => (
              <img 
                key={image.url || `image-${index}`}
                src={image.url || image}
                alt={`Post image ${index + 1}`}
                className="w-full object-cover max-h-[250px] sm:max-h-[450px] shadow-inner shadow-black/10"
              />
            ))}
          </div>
        )}
        {/* Handle single image (for backward compatibility) */}
        {post.image && !post.images && (
          <img 
            key={post.image}
            src={post.image} 
            alt="Post"
            className="w-full object-cover max-h-[250px] sm:max-h-[450px] border-y border-gray-200 shadow-inner shadow-black/10"
          />
        )}
        {post.video && (
          <video 
            key={post.video}
            src={post.video} 
            controls
            className="w-full object-cover max-h-[250px] sm:max-h-[450px] border-y border-gray-200 shadow-inner shadow-black/10"
          />
        )}
        <div className="px-2 sm:px-4 py-2 sm:py-3 flex flex-row items-center justify-between text-xs sm:text-sm text-gray-600 border-t border-gray-200 gap-4">
          <span>{(post.likes?.length || 0)} likes</span>
          <span>{post.comments?.length || 0} comments</span>
          <span>0 shares</span>
        </div>
        <div className="px-2 sm:px-4 py-2 sm:py-3 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center bg-gray-50 rounded-b-xl gap-2 sm:gap-0">
          <div className="flex space-x-2 w-full sm:w-auto justify-center sm:justify-start">
            <button
              onClick={() => toggleStateSet(setLikedPosts, likedPosts, post._id, 'like')}
              className={`flex items-center space-x-1.5 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${likedPosts.has(post._id) ? 'text-red-500 bg-red-100' : 'text-gray-600 hover:text-red-500 hover:bg-red-50'}`}
            >
              <HeartIcon filled={likedPosts.has(post._id)} />
              <span>Like</span>
            </button>
            <button
              onClick={() => handleToggleComments(post._id)}
              className="flex items-center space-x-1.5 px-2 py-2 rounded-full text-xs sm:text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
            >
              <CommentIcon />
              <span>Comment</span>
            </button>
            <div className="relative group">
              <button
                onClick={() => handleShare(post._id)}
                className="flex items-center space-x-1.5 px-2 py-2 rounded-full text-xs sm:text-sm font-medium text-gray-600 hover:text-green-600 hover:bg-green-50 transition-all duration-200"
              >
                <ShareIcon />
                <span>Share</span>
              </button>
              {/* Share dropdown on hover */}
              <div className="absolute left-0 mt-2 z-10 hidden group-hover:block bg-white border border-gray-200 rounded shadow-lg p-2 min-w-[140px]">
                <button onClick={() => handleShare(post._id)} className="block w-full text-left px-3 py-1 hover:bg-gray-100 text-sm">Copy Link</button>
                <button onClick={() => shareTo('whatsapp', post._id)} className="block w-full text-left px-3 py-1 hover:bg-gray-100 text-sm">WhatsApp</button>
                <button onClick={() => shareTo('twitter', post._id)} className="block w-full text-left px-3 py-1 hover:bg-gray-100 text-sm">Twitter</button>
                <button onClick={() => shareTo('facebook', post._id)} className="block w-full text-left px-3 py-1 hover:bg-gray-100 text-sm">Facebook</button>
              </div>
            </div>
          </div>
          {/* Removed separate bookmark button; now in 3-dots menu */}
        </div>
        {showComments.has(post._id) && (
          <div className="px-3 sm:px-6 py-3 sm:py-4 border-t border-gray-200 bg-gray-100 rounded-b-xl">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-3 sm:mb-4">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-base font-semibold shadow-md">
                You
              </div>
              <input
                type="text"
                placeholder="Write a comment..."
                value={commentInputs[post._id] || ''}
                onChange={e => handleCommentInput(post._id, e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handlePostComment(post._id); }}
                className="flex-1 bg-gray-200 border border-gray-300 rounded-full px-3 sm:px-4 py-2 text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
              />
              <button
                onClick={() => handlePostComment(post._id)}
                className="sm:ml-2 px-3 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition mt-2 sm:mt-0"
              >
                Post
              </button>
            </div>
            {commentLoading[post._id] ? (
              <div className="text-xs sm:text-sm text-gray-500">Loading comments...</div>
            ) : (
              <div className="space-y-2">
                {(comments[post._id] || []).length === 0 ? (
                  <div className="text-xs sm:text-sm text-gray-600">No comments yet. Be the first to comment!</div>
                ) : (
                  comments[post._id].map((c, idx) => (
                    <div key={c._id || idx} className="flex items-start space-x-2 sm:space-x-3">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-semibold shadow-md">
                        {c.user?.fullname?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800 text-xs sm:text-sm">{c.user?.fullname || 'User'}
                         {/* Delete comment button, only for author */}
                         {userProfile?._id && (c.user?._id === userProfile._id) && (
                           <button
                             onClick={() => handleDeleteComment(post._id, c._id)}
                             className="ml-2 text-xs text-red-500 hover:text-red-700"
                             title="Delete comment"
                           >
                             🗑️
                           </button>
                         )}
                        </div>
                        <div className="text-gray-700 text-xs sm:text-sm">{c.content}</div>
                        <div className="text-[10px] sm:text-xs text-gray-400">{new Date(c.createdAt).toLocaleString()}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export default function SocialMediaPostCards() {
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [savedPosts, setSavedPosts] = useState(new Set());
  const [showComments, setShowComments] = useState(new Set());
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [posts, setPosts] = useState([]); // Initialize as empty array
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [comments, setComments] = useState({}); // { postId: [comments] }
  const [commentLoading, setCommentLoading] = useState({});
  const [openDropdownId, setOpenDropdownId] = useState(null);

  // Fetch user profile and posts on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch user profile directly using `api`
        const profileResponse = await api.get('/users/profile');
        setUserProfile(profileResponse.data.data);

        // Fetch posts directly using `api`
        const postsResponse = await api.get('/posts');
        setPosts(postsResponse.data.data);

        // Initialize liked posts based on fetched data and user profile
        if (profileResponse.data.data) {
          const userLikedPostIds = new Set(
            postsResponse.data.data
              .filter(post => post.likes && post.likes.some(like => like.user === profileResponse.data.data._id))
              .map(post => post._id)
          );
          setLikedPosts(userLikedPostIds);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
        if (error.response?.status === 401 || error.message.includes('login')) {
          // Redirect to login if token is missing or invalid
          window.location.href = '/login';
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userProfile?._id]); // Re-run if userProfile changes

  const toggleStateSet = async (stateSetter, currentSet, postId, type) => {
    const newSet = new Set(currentSet);
    const hasInteracted = newSet.has(postId);

    if (type === 'like') {
      try {
        if (hasInteracted) {
          // Unlike post
          await api.delete(`/posts/${postId}/unlike`);
          newSet.delete(postId);
        } else {
          // Like post
          await api.post(`/posts/${postId}/like`);
          newSet.add(postId);
        }
        stateSetter(newSet);

        // Optimistically update the post's like count in the local state
        setPosts(prevPosts =>
          prevPosts.map(post => {
            if (post._id === postId) {
              const updatedLikes = hasInteracted
                ? (post.likes || []).filter(like => like.user !== userProfile._id)
                : [...(post.likes || []), { user: userProfile._id, likedAt: new Date().toISOString() }];
              return {
                ...post,
                likes: updatedLikes
              };
            }
            return post;
          })
        );
      } catch (error) {
        console.error(`Error toggling like for post ${postId}:`, error);
        alert('Failed to update like status. Please try again.');
      }
    } else {
      // For other toggles (e.g., comments, saves)
      hasInteracted ? newSet.delete(postId) : newSet.add(postId);
      stateSetter(newSet);
    }
  };

  const handleNewPost = (newPost) => {
    // Ensure the new post data structure matches what is expected by the rendering logic
    const transformedPost = {
      _id: newPost._id, // Use MongoDB _id consistently
      // Use 'author' to match backend populated field
      author: {
        fullName: userProfile?.fullName || userProfile?.name || "You",
        username: userProfile?.username || "@you",
        avatar: userProfile?.avatar || null,
        verified: userProfile?.verified || false,
      },
      content: newPost.content,
      images: newPost.images?.map(img => img.url || img) || [],
      videos: newPost.videos?.map(vid => vid.url || vid) || [],
      timestamp: "Just now", // This should ideally be derived from actual post creation time
      stats: { likes: 0, comments: 0, shares: 0 }, // Initial stats, will be updated from backend
      type: newPost.images?.length ? "image" : "text"
    };

    setPosts(prevPosts => [transformedPost, ...prevPosts]);
  };

  const fetchComments = async (postId) => {
    setCommentLoading(prev => ({ ...prev, [postId]: true }));
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.get(`/posts/${postId}/comments`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setComments(prev => ({ ...prev, [postId]: response.data.data || [] }));
    } catch (err) {
      setComments(prev => ({ ...prev, [postId]: [] }));
    } finally {
      setCommentLoading(prev => ({ ...prev, [postId]: false }));
    }
  };

  const handleToggleComments = (postId) => {
    if (!showComments.has(postId)) {
      fetchComments(postId);
    }
    setShowComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handleCommentInput = (postId, value) => {
    setCommentInputs(prev => ({ ...prev, [postId]: value }));
  };

  const handlePostComment = async (postId) => {
    const text = commentInputs[postId];
    if (!text?.trim()) return;
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.post(`/${postId}/comments`, { content: text }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), response.data.data]
      }));
      setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    } catch (err) {
      alert('Failed to post comment.');
    }
  };

  const handleShare = (postId) => {
    const url = `${window.location.origin}/posts/${postId}`;
    if (navigator.share) {
      navigator.share({
        title: 'Check out this post!',
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      alert('Post link copied to clipboard!');
    }
  };

  const shareTo = (platform, postId) => {
    const url = encodeURIComponent(`${window.location.origin}/posts/${postId}`);
    const text = encodeURIComponent("Check out this post!");
    let shareUrl = '';
    if (platform === 'whatsapp') shareUrl = `https://wa.me/?text=${text}%20${url}`;
    if (platform === 'twitter') shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    if (platform === 'facebook') shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    window.open(shareUrl, '_blank');
  };

  // Delete Post Handler
  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await api.delete(`/posts/${postId}`);
      setPosts(posts => posts.filter(p => p._id !== postId));
    } catch (err) {
      alert("Failed to delete post");
    }
  };

  // Delete Comment Handler
  const handleDeleteComment = async (postId, commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await api.delete(`/posts/${postId}/comments/${commentId}`);
      setComments(prev => ({
        ...prev,
        [postId]: (prev[postId] || []).filter(c => c._id !== commentId)
      }));
    } catch (err) {
      alert("Failed to delete comment");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-2 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-2 flex items-center justify-center min-h-screen">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4 py-6 sm:py-8 lg:px-8 bg-gray-50 min-h-screen font-sans">
      {/* Post Creator */}
      <div className="bg-white p-4 sm:p-6 mb-6 sm:mb-8 rounded-xl shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-xl">
        <textarea
          placeholder="What's happening on campus today?"
          className="w-full resize-none text-base min-h-[90px] rounded-lg p-3 sm:p-4 bg-gray-100 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
          rows="3"
          onClick={() => setIsCreatePostModalOpen(true)}
          readOnly
        />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 sm:mt-5 gap-3 sm:gap-0">
          <div className="flex space-x-3 text-indigo-600">
            {["photo", "event", "emoji"].map((type, idx) => (
              <button 
                key={`post-creator-button-${idx}`} // Added key prop
                className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-indigo-50 transition-colors duration-200 text-lg"
                onClick={() => setIsCreatePostModalOpen(true)}
                title={`Add ${type}`}
              >
                <span className="sr-only">{type}</span>
                {/* Placeholder Icons - Replace with actual icons if available */}
                {type === "photo" && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L20 20m-6-6l2-2m2-2l2-2M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                {type === "event" && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                {type === "emoji" && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              </button>
            ))}
          </div>
          <button 
            className="bg-indigo-600 text-white px-5 sm:px-7 py-2 sm:py-2.5 rounded-full font-semibold hover:bg-indigo-700 transition-transform duration-200 transform hover:scale-105 shadow-md hover:shadow-lg w-full sm:w-auto"
            onClick={() => setIsCreatePostModalOpen(true)}
          >
            Post
          </button>
        </div>
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreatePostModalOpen}
        onClose={() => setIsCreatePostModalOpen(false)}
        onPost={handleNewPost}
      />

      {/* Feed Posts */}
      {posts.filter(Boolean).map((post) => {
        const authorData = post.author || {};
        const displayUser = {
          name: authorData.fullName || authorData.fullname || 'Unknown User',
          username: authorData.username || '@unknown',
          avatar: authorData.avatar,
          avatarColor: `from-blue-500 to-purple-500`,
          verified: authorData.verified || false,
        };
        const initials = displayUser.name.split(' ').map(n => n[0]).join('').toUpperCase();
        return (
          <PostCard
            key={post._id}
            post={post}
            displayUser={displayUser}
            initials={initials}
            savedPosts={savedPosts}
            toggleStateSet={toggleStateSet}
            setSavedPosts={setSavedPosts}
            openDropdownId={openDropdownId}
            setOpenDropdownId={setOpenDropdownId}
            likedPosts={likedPosts}
            setLikedPosts={setLikedPosts}
            showComments={showComments}
            setShowComments={setShowComments}
            commentInputs={commentInputs}
            setCommentInputs={setCommentInputs}
            comments={comments}
            setComments={setComments}
            commentLoading={commentLoading}
            setCommentLoading={setCommentLoading}
            handleToggleComments={handleToggleComments}
            handleCommentInput={handleCommentInput}
            handlePostComment={handlePostComment}
            handleShare={handleShare}
            shareTo={shareTo}
            userProfile={userProfile}
            handleDeletePost={handleDeletePost}
            handleDeleteComment={handleDeleteComment}
          />
        );
      })}
    </div>
  );
} 