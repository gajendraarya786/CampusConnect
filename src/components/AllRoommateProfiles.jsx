import React, { useEffect, useState } from 'react';
import { Users, Search, Filter, MapPin, GraduationCap, DollarSign, Loader2 } from 'lucide-react';
import { roommateAPI } from '../services/api';
import { Link } from 'react-router-dom';

export default function AllRoommateProfiles() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGender, setFilterGender] = useState('');

  useEffect(() => {
    roommateAPI.getAllProfiles()
      .then(data => setProfiles(data.data || data))
      .finally(() => setLoading(false));
  }, []);

  const filteredProfiles = profiles.filter(profile => {
    const matchesSearch = profile.user?.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profile.course?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGender = !filterGender || profile.gender === filterGender;
    return matchesSearch && matchesGender;
  });

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
        <p className="text-xl font-semibold text-slate-700">Loading profiles...</p>
        <p className="text-slate-500 mt-2">Finding your perfect roommate matches</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-lg">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-4">
            Discover Roommates
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Connect with like-minded individuals and find your perfect living companion
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name or course..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-slate-700 placeholder-slate-400"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <select
                value={filterGender}
                onChange={(e) => setFilterGender(e.target.value)}
                className="pl-12 pr-8 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-slate-700 min-w-[160px]"
              >
                <option value="">All Genders</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-slate-600 font-medium">
            {filteredProfiles.length} {filteredProfiles.length === 1 ? 'profile' : 'profiles'} found
          </p>
        </div>

        {/* Profiles Grid */}
        {filteredProfiles.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-semibold text-slate-700 mb-2">No profiles found</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              Try adjusting your search criteria or check back later for new profiles.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProfiles.map((profile, idx) => (
              <div
                key={profile._id || idx}
                className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 overflow-hidden"
              >
                {/* Profile Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {profile.user?.fullname?.[0]?.toUpperCase() || 'R'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-800 text-lg truncate">
                        {profile.user?.fullname || 'Anonymous User'}
                      </h3>
                      <p className="text-sm text-slate-500 truncate">
                        {profile.user?.email}
                      </p>
                    </div>
                  </div>

                  {/* Profile Details */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="font-medium">Gender:</span>
                      <span className="capitalize">{profile.gender || 'Not specified'}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <GraduationCap className="w-4 h-4 text-indigo-500" />
                      <span className="font-medium">Course:</span>
                      <span className="truncate">{profile.course || 'Not specified'}</span>
                    </div>

                    {profile.budget?.min && profile.budget?.max && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <DollarSign className="w-4 h-4 text-green-500" />
                        <span className="font-medium">Budget:</span>
                        <span>₹{profile.budget.min} - ₹{profile.budget.max}</span>
                      </div>
                    )}

                    {profile.preferredLocation && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPin className="w-4 h-4 text-red-500" />
                        <span className="font-medium">Location:</span>
                        <span>{profile.preferredLocation}</span>
                      </div>
                    )}

                    {profile.personalityType && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <span className="font-medium">Personality:</span>
                        <span>{profile.personalityType}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <div className="px-6 pb-6">
                  <Link
                    to={`/roommates/${profile._id}`}
                    className="block w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-center py-3 px-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl group-hover:scale-[1.02]"
                  >
                    View Full Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}