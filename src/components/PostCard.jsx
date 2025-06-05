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
    content: "Just finished my Computer Science project on machine learning! Feeling accomplished! 🎉",
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
    content: "📚 Study Group\n🕐 Tues/Thurs 6-8 PM\n📍 Library Room 204\nCovering calculus and linear algebra. Join us! 💪",
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

  const toggleStateSet = (stateSetter, currentSet, postId) => {
    const newSet = new Set(currentSet);
    newSet.has(postId) ? newSet.delete(postId) : newSet.add(postId);
    stateSetter(newSet);
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* Post Creator */}
      <div className="bg-white p-4 mb-6 rounded-xl shadow border border-gray-200">
        <textarea
          placeholder="What's happening on campus today?"
          className="w-full resize-none text-base min-h-[80px] rounded-xl p-4 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          rows="3"
        />
        <div className="flex items-center justify-between mt-4">
          <div className="flex space-x-2 text-indigo-600">
            {["photo", "event", "emoji"].map((type, idx) => (
              <button key={idx} className="hover:bg-indigo-50 p-2 rounded-full transition">
                <span className="sr-only">{type}</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                </svg>
              </button>
            ))}
          </div>
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-indigo-700">
            Post
          </button>
        </div>
      </div>

      {/* Feed Posts */}
      {samplePosts.map((post) => (
        <article key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="p-4 flex justify-between items-start">
            <div className="flex items-start space-x-3">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${post.user.avatarColor} flex items-center justify-center text-white font-semibold text-lg`}>
                {post.user.avatar}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-lg text-gray-900">{post.user.name}</h3>
                  {post.user.verified && <VerifiedIcon />}
                </div>
                <p className="text-sm text-gray-500">{post.user.username} • {post.timestamp}</p>
              </div>
            </div>
            <button className="text-gray-400 hover:text-gray-600 p-2">
              <DotsIcon />
            </button>
          </div>

          <div className="px-4 pb-3">
            <p className="text-base text-gray-800 whitespace-pre-line">{post.content}</p>
          </div>

          {post.image && (
            <img src={post.image} alt="Post" className="w-full object-cover max-h-96 border-t border-b border-gray-200" />
          )}

          <div className="px-4 py-2 flex justify-between text-sm text-gray-500">
            <span>{post.stats.likes + (likedPosts.has(post.id) ? 1 : 0)} likes</span>
            <span>{post.stats.comments} comments</span>
            <span>{post.stats.shares} shares</span>
          </div>

          <div className="px-4 py-2 border-t border-gray-100 flex justify-between items-center">
            <div className="flex space-x-2">
              <button
                onClick={() => toggleStateSet(setLikedPosts, likedPosts, post.id)}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm font-medium transition ${
                  likedPosts.has(post.id) ? 'text-red-600 bg-red-50' : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                }`}
              >
                <HeartIcon filled={likedPosts.has(post.id)} />
                <span>Like</span>
              </button>

              <button
                onClick={() => toggleStateSet(setShowComments, showComments, post.id)}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50"
              >
                <CommentIcon />
                <span>Comment</span>
              </button>

              <button className="flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm font-medium text-gray-600 hover:text-green-600 hover:bg-green-50">
                <ShareIcon />
                <span>Share</span>
              </button>
            </div>

            <button
              onClick={() => toggleStateSet(setSavedPosts, savedPosts, post.id)}
              className={`p-2 rounded-full ${
                savedPosts.has(post.id) ? 'text-yellow-600 bg-yellow-50' : 'text-gray-600 hover:text-yellow-600 hover:bg-yellow-50'
              }`}
            >
              <BookmarkIcon filled={savedPosts.has(post.id)} />
            </button>
          </div>

          {showComments.has(post.id) && (
            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
              <div className="flex space-x-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
                  You
                </div>
                <input
                  type="text"
                  placeholder="Write a comment..."
                  className="flex-1 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="text-sm text-gray-600">No comments yet. Be the first to comment!</div>
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
