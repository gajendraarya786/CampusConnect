import React, { useState } from 'react';

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
  <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// Sample Posts Data
const samplePosts = [
  {
    id: 1,
    user: {
      name: "Sarah Chen",
      username: "@sarahc",
      avatar: "SC",
      verified: true,
      avatarColor: "from-purple-500 to-pink-500"
    },
    content: "Just finished my Computer Science project on machine learning! The algorithm finally works after weeks of debugging. Feeling accomplished! 🎉\n\n#MachineLearning #ComputerScience #StudentLife",
    image: null,
    timestamp: "2 hours ago",
    stats: { likes: 24, comments: 8, shares: 3 },
    type: "text"
  },
  
  {
    id: 2,
    user: {
      name: "Campus Photography",
      username: "@campusphotos",
      avatar: "CP",
      verified: false,
      avatarColor: "from-blue-500 to-teal-500"
    },
    content: "Golden hour at the university quad ✨ Perfect study spot with this amazing view!",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&crop=center",
    timestamp: "4 hours ago",
    stats: { likes: 156, comments: 23, shares: 12 },
    type: "image"
  },
  {
    id: 3,
    user: {
      name: "Study Group Hub",
      username: "@studygroups",
      avatar: "SG",
      verified: true,
      avatarColor: "from-green-500 to-blue-500"
    },
    content: "📚 Advanced Mathematics Study Group\n🕐 Every Tuesday & Thursday 6-8 PM\n📍 Central Library - Room 204\n\nAll levels welcome! We're covering calculus and linear algebra this week. Bring your questions and let's learn together! 💪",
    image: null,
    timestamp: "6 hours ago",
    stats: { likes: 89, comments: 34, shares: 45 },
    type: "announcement"
  }
];

export default function SocialMediaPostCards() {
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [savedPosts, setSavedPosts] = useState(new Set());
  const [showComments, setShowComments] = useState(new Set());

  const handleLike = (postId) => {
    const newLikedPosts = new Set(likedPosts);
    if (newLikedPosts.has(postId)) {
      newLikedPosts.delete(postId);
    } else {
      newLikedPosts.add(postId);
    }
    setLikedPosts(newLikedPosts);
  };

  const handleSave = (postId) => {
    const newSavedPosts = new Set(savedPosts);
    if (newSavedPosts.has(postId)) {
      newSavedPosts.delete(postId);
    } else {
      newSavedPosts.add(postId);
    }
    setSavedPosts(newSavedPosts);
  };

  const toggleComments = (postId) => {
    const newShowComments = new Set(showComments);
    if (newShowComments.has(postId)) {
      newShowComments.delete(postId);
    } else {
      newShowComments.add(postId);
    }
    setShowComments(newShowComments);
  };

  return (
    <>
      {/* Create Post Card */}
      <textarea
        placeholder="What's happening on campus today?"
        className="w-full resize-none border-none focus:outline-none text-lg placeholder-gray-500 min-h-[80px] rounded-xl shadow-sm border border-gray-200 p-6 mb-6 hover:shadow-md transition-shadow"
        rows="3"
      />
      <div className="flex items-center justify-between mb-6 pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4 text-indigo-600">
          <button className="hover:bg-indigo-50 p-2 rounded-full transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
          <button className="hover:bg-indigo-50 p-2 rounded-full transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V3a1 1 0 011 1v12a4 4 0 01-4 4H8a4 4 0 01-4-4V4a1 1 0 011-1m0-1h10" />
            </svg>
          </button>
          <button className="hover:bg-indigo-50 p-2 rounded-full transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
        <button className="bg-indigo-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
          Post
        </button>
      </div>

      {/* Feed Posts */}
      {samplePosts.map((post) => (
        <article
          key={post.id}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow mb-6"
        >
          {/* Post Header */}
          <div className="p-6 pb-4 flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div
                className={`w-12 h-12 rounded-full bg-gradient-to-r ${post.user.avatarColor} flex items-center justify-center flex-shrink-0`}
              >
                <span className="text-white font-semibold text-lg">{post.user.avatar}</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-gray-900 truncate">{post.user.name}</h3>
                  {post.user.verified && <VerifiedIcon />}
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>{post.user.username}</span>
                  <span>•</span>
                  <span>{post.timestamp}</span>
                </div>
              </div>
            </div>
            <button className="text-gray-400 hover:text-gray-600 hover:bg-gray-50 p-2 rounded-full transition">
              <DotsIcon />
            </button>
          </div>

          {/* Post Content */}
          <div className="px-6 pb-4">
            <p className="text-gray-800 leading-relaxed whitespace-pre-line">{post.content}</p>
          </div>

          {/* Post Image */}
          {post.image && (
            <div className="px-6 pb-4">
              <img
                src={post.image}
                alt="Post content"
                className="w-full rounded-xl object-cover max-h-96 border border-gray-200"
              />
            </div>
          )}

          {/* Post Stats */}
          <div className="px-6 pb-3 flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <span>{post.stats.likes + (likedPosts.has(post.id) ? 1 : 0)} likes</span>
              <span>{post.stats.comments} comments</span>
              <span>{post.stats.shares} shares</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 py-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition ${
                    likedPosts.has(post.id)
                      ? 'text-red-600 bg-red-50 hover:bg-red-100'
                      : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                  }`}
                >
                  <HeartIcon filled={likedPosts.has(post.id)} />
                  <span className="font-medium">Like</span>
                </button>

                <button
                  onClick={() => toggleComments(post.id)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition"
                >
                  <CommentIcon />
                  <span className="font-medium">Comment</span>
                </button>

                <button className="flex items-center space-x-2 px-4 py-2 rounded-full text-gray-600 hover:text-green-600 hover:bg-green-50 transition">
                  <ShareIcon />
                  <span className="font-medium">Share</span>
                </button>
              </div>

              <button
                onClick={() => handleSave(post.id)}
                className={`p-2 rounded-full transition ${
                  savedPosts.has(post.id)
                    ? 'text-yellow-600 bg-yellow-50 hover:bg-yellow-100'
                    : 'text-gray-600 hover:text-yellow-600 hover:bg-yellow-50'
                }`}
              >
                <BookmarkIcon filled={savedPosts.has(post.id)} />
              </button>
            </div>
          </div>

          {/* Comments Section */}
          {showComments.has(post.id) && (
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
              <div className="flex space-x-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-xs">You</span>
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    className="w-full bg-white border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Sample Comments */}
              <div className="space-y-3">
                <div className="flex space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold text-xs">JD</span>
                  </div>
                  <div className="flex-1">
                    <div className="bg-white rounded-2xl px-4 py-2 inline-block">
                      <p className="font-semibold text-sm text-gray-900">John Doe</p>
                      <p className="text-sm text-gray-700">Great work! This is really impressive 👏</p>
                    </div>
                    <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                      <button className="hover:underline">Like</button>
                      <button className="hover:underline">Reply</button>
                      <span>1h</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </article>
      ))}
    </>
  );
}
