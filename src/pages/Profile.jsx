import React, { useState } from 'react';
import profile from '../assets/profile1.jpg'

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

const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

const ImageIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

// Sample user data
const userData = {
  name: "Alex Johnson",
  username: "@alexjohnson",
  bio: "Computer Science student at Stanford University. Passionate about AI, web development, and photography. Always eager to learn and connect with fellow students!",
  avatar: "AJ",
  coverImage: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=500&h=300&fit=crop",
  location: "Stanford, CA",
  joinDate: "September 2022",
  major: "Computer Science",
  year: "Junior",
  email: "alex.johnson@stanford.edu",
  phone: "+1 (555) 123-4567",
  followers: 324,
  following: 189,
  posts: 87,
  interests: ["AI/ML", "Web Development", "Photography", "Gaming", "Basketball"]
};


// Sample posts data
const userPosts = [
  {
    id: 1,
    content: "Just finished my machine learning project on neural networks! The results are better than expected. Excited to present it next week! 🤖",
    timestamp: "2 hours ago",
    likes: 15,
    comments: 4,
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=500&h=300&fit=crop"
  },
  {
    id: 2,
    content: "Beautiful sunset from the campus today! Perfect weather for studying outside with friends. 📚☀️",
    timestamp: "1 day ago",
    likes: 28,
    comments: 8,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop"
  },
  {
    id: 3,
    content: "Anyone interested in joining our study group for Advanced Algorithms? We meet every Tuesday at the library. DM me if you're interested!",
    timestamp: "2 days ago",
    likes: 12,
    comments: 6,
    image: null
  },
  {
    id: 4,
    content: "Attending the tech conference was amazing! So many insights about the future of technology. Grateful for these learning opportunities! 💻",
    timestamp: "1 week ago",
    likes: 35,
    comments: 12,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=300&fit=crop"
  }
];

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState('posts');
  const [isEditing, setIsEditing] = useState(false);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [isFollowing, setIsFollowing] = useState(false);

  const handleLike = (postId) => {
    const newLikedPosts = new Set(likedPosts);
    if (newLikedPosts.has(postId)) {
      newLikedPosts.delete(postId);
    } else {
      newLikedPosts.add(postId);
    }
    setLikedPosts(newLikedPosts);
  };

  return (
    <div className="min-h-screen bg-gray-50 ">
      {/* Cover Photo & Profile Header */}
      <div className="relative">
        {/* Cover Image */}
        <div className="h-64 bg-gradient-to-r from-blue-500 to-purple-600 relative overflow-hidden">
          <img 
            src={userData.coverImage} 
            alt="Cover" 
            className="w-full h-full object-cover"
          />

        </div>

        {/* Profile Info */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-16 sm:-mt-20">
            <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  <span className="text-white font-bold text-4xl">{userData.avatar}</span>
                </div>
                <button className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition">
                  <EditIcon />
                </button>
              </div>

              {/* Name and Actions */}
              <div className="flex-1 mt-6 sm:mt-0 sm:pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{userData.name}</h1>
                    <p className="text-gray-600">{userData.username}</p>
                  </div>
                  <div className="flex space-x-3 mt-4 sm:mt-0">
                    <button
                      onClick={() => setIsFollowing(!isFollowing)}
                      className={`px-6 py-2 rounded-lg font-medium transition ${
                        isFollowing 
                          ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      {isFollowing ? 'Following' : 'Follow'}
                    </button>
                    <button className="px-6 py-2 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition">
                      Message
                    </button>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
                    >
                      <EditIcon />
                    </button>
                  </div>
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
              <p className="text-gray-700 mb-4">{userData.bio}</p>
              
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <LocationIcon />
                  <span className="ml-2 text-sm">{userData.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <CalendarIcon />
                  <span className="ml-2 text-sm">Joined {userData.joinDate}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <BookIcon />
                  <span className="ml-2 text-sm">{userData.major} • {userData.year}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <EmailIcon />
                  <span className="ml-2 text-sm">{userData.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <PhoneIcon />
                  <span className="ml-2 text-sm">{userData.phone}</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Stats</h2>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-indigo-600">{userData.posts}</div>
                  <div className="text-sm text-gray-600">Posts</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-indigo-600">{userData.followers}</div>
                  <div className="text-sm text-gray-600">Followers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-indigo-600">{userData.following}</div>
                  <div className="text-sm text-gray-600">Following</div>
                </div>
              </div>
            </div>

            {/* Interests */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Interests</h2>
              <div className="flex flex-wrap gap-2">
                {userData.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Content - Posts */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  <button
                    onClick={() => setActiveTab('posts')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'posts'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Posts
                  </button>
                  <button
                    onClick={() => setActiveTab('photos')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'photos'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Photos
                  </button>
                  <button
                    onClick={() => setActiveTab('about')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'about'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    About
                  </button>
                </nav>
              </div>
            </div>

            {/* Create Post (if own profile) */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">{userData.avatar}</span>
                </div>
                <input
                  type="text"
                  placeholder="What's on your mind, Alex?"
                  className="flex-1 bg-gray-100 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition">
                    <ImageIcon />
                    <span className="text-sm">Photo</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition">
                    <PlusIcon />
                    <span className="text-sm">More</span>
                  </button>
                </div>
                <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">
                  Post
                </button>
              </div>
            </div>

            {/* Posts Feed */}
            {activeTab === 'posts' && (
              <div className="space-y-6">
                {userPosts.map((post) => (
                  <div key={post.id} className="bg-white rounded-lg shadow-sm p-6">
                    {/* Post Header */}
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">{userData.avatar}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{userData.name}</h3>
                        <p className="text-sm text-gray-500">{post.timestamp}</p>
                      </div>
                    </div>

                    {/* Post Content */}
                    <p className="text-gray-800 mb-4">{post.content}</p>

                    {/* Post Image */}
                    {post.image && (
                      <img
                        src={post.image}
                        alt="Post content"
                        className="w-full rounded-lg mb-4 max-h-96 object-cover"
                      />
                    )}

                    {/* Post Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-6">
                        <button
                          onClick={() => handleLike(post.id)}
                          className={`flex items-center space-x-2 ${
                            likedPosts.has(post.id) ? 'text-red-500' : 'text-gray-600'
                          } hover:text-red-500 transition`}
                        >
                          <HeartIcon filled={likedPosts.has(post.id)} />
                          <span className="text-sm">
                            {post.likes + (likedPosts.has(post.id) ? 1 : 0)}
                          </span>
                        </button>

                        <button className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition">
                          <CommentIcon />
                          <span className="text-sm">{post.comments}</span>
                        </button>

                        <button className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition">
                          <ShareIcon />
                          <span className="text-sm">Share</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Photos Tab */}
            {activeTab === 'photos' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {userPosts.filter(post => post.image).map((post) => (
                    <div key={post.id} className="aspect-square rounded-lg overflow-hidden">
                      <img
                        src={post.image}
                        alt="User photo"
                        className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* About Tab */}
            {activeTab === 'about' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">About {userData.name}</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Bio</h3>
                    <p className="text-gray-700">{userData.bio}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Education</h3>
                    <p className="text-gray-700">{userData.major} at Stanford University</p>
                    <p className="text-gray-600 text-sm">Class of 2025 • {userData.year}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Contact Information</h3>
                    <div className="space-y-2">
                      <p className="text-gray-700">{userData.email}</p>
                      <p className="text-gray-700">{userData.phone}</p>
                      <p className="text-gray-700">{userData.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}