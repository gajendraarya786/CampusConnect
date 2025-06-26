import React, { useEffect, useState } from 'react';
import { Heart, Users, AlertCircle, Loader2, Star, MessageCircle, Trophy } from 'lucide-react';
import { roommateAPI } from '../services/api';

export default function RoommateMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    roommateAPI.getMatches()
      .then(data => setMatches(data))
      .finally(() => setLoading(false));
  }, []);

  const getMatchColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 75) return 'text-blue-600 bg-blue-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getMatchLabel = (score) => {
    if (score >= 90) return 'Perfect Match';
    if (score >= 75) return 'Great Match';
    if (score >= 60) return 'Good Match';
    return 'Fair Match';
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
        <p className="text-xl font-semibold text-slate-700">Finding your matches...</p>
        <p className="text-slate-500 mt-2">Analyzing compatibility scores</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl mb-6 shadow-lg">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-slate-800 via-pink-800 to-rose-800 bg-clip-text text-transparent mb-4">
            Your Perfect Matches
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Discover roommates with the highest compatibility scores based on your preferences
          </p>
        </div>

        {matches.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-12 h-12 text-orange-500" />
            </div>
            <h3 className="text-2xl font-semibold text-slate-700 mb-4">No matches found yet</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-6">
              Complete your profile and set your preferences to discover compatible roommates.
            </p>
            <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl">
              Update Profile
            </button>
          </div>
        ) : (
          <>
            {/* Match Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-slate-800">{matches.length}</p>
                <p className="text-slate-600 font-medium">Total Matches</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Trophy className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-slate-800">
                  {matches.filter(m => m.matchScore >= 75).length}
                </p>
                <p className="text-slate-600 font-medium">Great Matches</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-slate-800">
                  {Math.round(matches.reduce((acc, m) => acc + m.matchScore, 0) / matches.length)}%
                </p>
                <p className="text-slate-600 font-medium">Avg. Score</p>
              </div>
            </div>

            {/* Matches Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {matches.map(({ profile, matchScore }, idx) => (
                <div
                  key={profile._id || idx}
                  className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 overflow-hidden"
                >
                  {/* Match Score Badge */}
                  <div className="relative">
                    <div className="absolute top-4 right-4 z-10">
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${getMatchColor(matchScore)}`}>
                        {matchScore}% Match
                      </div>
                    </div>
                    <div className="absolute top-4 left-4 z-10">
                      <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-slate-700">
                        {getMatchLabel(matchScore)}
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Profile Header */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                          {profile.user?.fullname?.[0]?.toUpperCase() || 'R'}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-800 text-xl truncate">
                          {profile.user?.fullname || 'Anonymous User'}
                        </h3>
                        <p className="text-sm text-slate-500 truncate">
                          {profile.user?.email}
                        </p>
                      </div>
                    </div>

                    {/* Profile Details Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-slate-50 rounded-xl p-3">
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">Gender</p>
                        <p className="font-semibold text-slate-800 capitalize">{profile.gender || 'N/A'}</p>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-3">
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">Course</p>
                        <p className="font-semibold text-slate-800 truncate">{profile.course || 'N/A'}</p>
                      </div>
                      {profile.budget?.min && profile.budget?.max && (
                        <div className="bg-green-50 rounded-xl p-3 col-span-2">
                          <p className="text-xs text-green-600 font-medium uppercase tracking-wide mb-1">Budget Range</p>
                          <p className="font-semibold text-green-800">₹{profile.budget.min} - ₹{profile.budget.max}</p>
                        </div>
                      )}
                    </div>

                    {/* Compatibility Indicators */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-slate-700 mb-3">Compatibility Highlights</h4>
                      <div className="flex flex-wrap gap-2">
                        {profile.personalityType && (
                          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                            {profile.personalityType}
                          </span>
                        )}
                        {profile.sleepSchedule && (
                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                            {profile.sleepSchedule}
                          </span>
                        )}
                        {profile.cleanliness && (
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                            {profile.cleanliness}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        Connect
                      </button>
                      <button className="w-12 h-12 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl transition-all duration-200 flex items-center justify-center">
                        <Heart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}