import React, { useState, useEffect } from 'react';
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

export default function SocialMediaPostCards() {
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [savedPosts, setSavedPosts] = useState(new Set());
  const [showComments, setShowComments] = useState(new Set());
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [posts, setPosts] = useState([]); // Initialize as empty array
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

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
    <div className="py-8 bg-gray-50 min-h-screen font-sans">
      {/* Post Creator */}
      <div className="bg-white py-6 px-0 md:px-10 mb-8 rounded-xl shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-xl">
        <textarea
          placeholder="What's happening on campus today?"
          className="w-full resize-none text-base min-h-[90px] rounded-lg p-4 bg-gray-100 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
          rows="3"
          onClick={() => setIsCreatePostModalOpen(true)}
          readOnly
        />
        <div className="flex items-center justify-between mt-5">
          <div className="flex space-x-3 text-indigo-600">
            {["photo", "event", "emoji"].map((type, idx) => (
              <button 
                key={`post-creator-button-${idx}`}
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
            className="bg-indigo-600 text-white px-7 py-2.5 rounded-full font-semibold hover:bg-indigo-700 transition-transform duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
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
      <div className="grid grid-cols-1 gap-6 px-0 md:px-10">
        {posts.filter(Boolean).map((post) => {
          // Ensure post.author is an object, if not, provide a default
          const authorData = post.author || {};
          console.log('post:', post);
          console.log('authorData:', authorData);


          const displayUser = {
            name: authorData.fullName || authorData.fullname || authorData.name|| 'Unknown User',
            username: authorData.username || '@unknown',
            avatar: authorData.avatar,
            avatarColor: `from-blue-500 to-purple-500`, // Default color if not provided
            verified: authorData.verified || false,
          };

          const initials = displayUser.name.split(' ').map(n => n[0]).join('').toUpperCase();

          return (
            <article key={post._id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-8 transform transition-all duration-300 hover:scale-[1.005] hover:shadow-xl">
              <div className="p-6 flex justify-between items-start">
                <div className="flex items-start space-x-4">
                  {displayUser.avatar ? (
                    <img 
                      src={displayUser.avatar}
                      alt={displayUser.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-indigo-400 shadow-md flex-shrink-0" // Added flex-shrink-0
                    />
                  ) : (
                    <div className={`w-14 h-14 rounded-full bg-gradient-to-r ${displayUser.avatarColor} flex items-center justify-center text-white font-semibold text-xl shadow-md flex-shrink-0`}>
                      {initials}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">{displayUser.name}</h3>
                      {displayUser.verified && <VerifiedIcon />}
                    </div>
                    <p className="text-sm text-gray-500">{displayUser.username} • {post.timestamp}</p>
                  </div>
                </div>
                <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
                  <DotsIcon />
                </button>
              </div>

              <div className="px-6 pb-4">
                <p className="text-base text-gray-800 whitespace-pre-line leading-relaxed">{post.content}</p>
              </div>

              {/* Handle multiple images */}
              {post.images && post.images.length > 0 && (
                <div className="grid grid-cols-1 gap-1 border-y border-gray-200">
                  {post.images.map((image, index) => (
                    <img 
                      key={image.url || `image-${index}`}
                      src={image.url || image}
                      alt={`Post image ${index + 1}`}
                      className="w-full object-contain h-auto max-h-[450px] shadow-inner shadow-black/10"
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
                  className="w-full object-contain h-auto max-h-[450px] border-y border-gray-200 shadow-inner shadow-black/10"
                />
              )}

              {post.video && (
                <video 
                  key={post.video} // Use video URL as key
                  src={post.video} 
                  controls
                  className="w-full object-cover max-h-[450px] border-y border-gray-200 shadow-inner shadow-black/10"
                />
              )}

              <div className="px-6 py-3 flex justify-between text-sm text-gray-600 border-t border-gray-200">
                <span>{(post.likes?.length || 0)} likes</span>
                <span>{post.comments?.length || 0} comments</span>
                <span>0 shares</span>
              </div>

              <div className="px-4 py-3 border-t border-gray-200 flex justify-between items-center bg-gray-50 rounded-b-xl">
                <div className="flex flex-wrap space-x-2">
                  <button
                    onClick={() => toggleStateSet(setLikedPosts, likedPosts, post._id, 'like')}
                    className={`flex items-center space-x-1.5 px-2 py-2 rounded-full text-sm font-medium transition-all duration-200 ${likedPosts.has(post._id) ? 'text-red-500 bg-red-100' : 'text-gray-600 hover:text-red-500 hover:bg-red-50'}`}
                  >
                    <HeartIcon filled={likedPosts.has(post._id)} />
                    <span>Like</span>
                  </button>

                  <button
                    onClick={() => toggleStateSet(setShowComments, showComments, post._id, 'comment')}
                    className="flex items-center space-x-1.5 px-2 py-2 rounded-full text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                  >
                    <CommentIcon />
                    <span>Comment</span>
                  </button>

                  <button className="flex items-center space-x-1.5 px-2 py-2 rounded-full text-sm font-medium text-gray-600 hover:text-green-600 hover:bg-green-50 transition-all duration-200">
                    <ShareIcon />
                  <span>Share</span>
                  </button>
                </div>

                <button
                  onClick={() => toggleStateSet(setSavedPosts, savedPosts, post._id, 'save')}
                  className={`p-2 rounded-full transition-all duration-200 ${savedPosts.has(post._id) ? 'text-yellow-500 bg-yellow-100' : 'text-gray-600 hover:text-yellow-500 hover:bg-yellow-50'}`}
                >
                  <BookmarkIcon filled={savedPosts.has(post._id)} />
                </button>
              </div>

              {showComments.has(post._id) && (
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-100 rounded-b-xl">
                  <div className="flex space-x-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-base font-semibold shadow-md">
                      You
                    </div>
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      className="flex-1 bg-gray-200 border border-gray-300 rounded-full px-4 py-2.5 text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                    />
                  </div>
                  <div className="text-sm text-gray-600">No comments yet. Be the first to comment!</div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
