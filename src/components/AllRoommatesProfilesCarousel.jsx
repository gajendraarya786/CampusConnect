import React, { useEffect, useState } from 'react';
import { Users, ChevronLeft, ChevronRight, Loader2, Heart, Star } from 'lucide-react';
import { roommateAPI } from '../services/api';
import { Link } from 'react-router-dom';

export default function AllRoommateProfilesCarousel() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    roommateAPI.getAllProfiles()
      .then(data => setProfiles(data.data || data))
      .finally(() => setLoading(false));
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.ceil(profiles.length / getItemsPerSlide()));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.ceil(profiles.length / getItemsPerSlide())) % Math.ceil(profiles.length / getItemsPerSlide()));
  };

  const getItemsPerSlide = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1536) return 4; // 2xl screens
      if (window.innerWidth >= 1280) return 3; // xl screens
      if (window.innerWidth >= 1024) return 2; // lg screens
      if (window.innerWidth >= 640) return 2;  // sm screens
    }
    return 1; // mobile
  };

  if (loading) return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-blue-600 animate-spin mx-auto mb-3 lg:mb-4" />
        <p className="text-lg sm:text-xl font-semibold text-slate-700">Loading profiles...</p>
        <p className="text-sm sm:text-base text-slate-500 mt-1 lg:mt-2">Curating the best matches for you</p>
      </div>
    </div>
  );

  const itemsPerSlide = getItemsPerSlide();
  const totalSlides = Math.ceil(profiles.length / itemsPerSlide);
  const startIndex = currentIndex * itemsPerSlide;
  const visibleProfiles = profiles.slice(startIndex, startIndex + itemsPerSlide);

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
      {/* Header Section */}
      <div className="text-center mb-6 sm:mb-8 lg:mb-12">
        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl lg:rounded-2xl mb-3 sm:mb-4 lg:mb-6 shadow-lg">
          <Users className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-2 sm:mb-3 lg:mb-4">
          Featured Roommates
        </h1>
        <p className="text-sm sm:text-base lg:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed px-4">
          Discover amazing people looking for their perfect roommate match
        </p>
      </div>

      {profiles.length === 0 ? (
        <div className="text-center py-12 sm:py-16">
          <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <Users className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-slate-400" />
          </div>
          <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-slate-700 mb-2">No profiles available</h3>
          <p className="text-sm sm:text-base text-slate-500 max-w-md mx-auto px-4">
            Be the first to create a profile and start connecting with potential roommates.
          </p>
        </div>
      ) : (
        <div className="relative">
          {/* Carousel Container */}
          <div className="overflow-hidden rounded-xl sm:rounded-2xl lg:rounded-3xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 p-2 sm:p-3 lg:p-4">
                    {profiles.slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide).map((profile, idx) => (
                      <div
                        key={profile._id || idx}
                        className="group bg-white/95 backdrop-blur-sm rounded-xl lg:rounded-2xl shadow-lg border border-white/20 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 overflow-hidden"
                      >
                        {/* Profile Header */}
                        <div className="relative p-4 sm:p-5 lg:p-6">
                          <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-red-100 rounded-full flex items-center justify-center group-hover:bg-red-200 transition-colors cursor-pointer">
                              <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                            <div className="relative">
                              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl lg:rounded-2xl flex items-center justify-center text-white font-bold text-sm sm:text-base lg:text-xl shadow-lg">
                                {profile.user?.fullname?.[0]?.toUpperCase() || 'R'}
                              </div>
                              <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                <Star className="w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 text-white" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-slate-800 text-sm sm:text-base lg:text-lg truncate">
                                {profile.user?.fullname || 'Anonymous User'}
                              </h3>
                              <p className="text-xs sm:text-sm text-slate-500 truncate">
                                {profile.user?.email}
                              </p>
                            </div>
                          </div>

                          {/* Profile Stats */}
                          <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
                            <div className="bg-blue-50 rounded-lg p-2 sm:p-3 text-center">
                              <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">Gender</p>
                              <p className="text-xs sm:text-sm font-bold text-blue-800 capitalize truncate">{profile.gender || 'N/A'}</p>
                            </div>
                            <div className="bg-indigo-50 rounded-lg p-2 sm:p-3 text-center">
                              <p className="text-xs text-indigo-600 font-medium uppercase tracking-wide">Course</p>
                              <p className="text-xs sm:text-sm font-bold text-indigo-800 truncate">{profile.course || 'N/A'}</p>
                            </div>
                          </div>

                          {/* Additional Info */}
                          <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-slate-600">
                            {profile.budget?.min && profile.budget?.max && (
                              <div className="flex justify-between items-center">
                                <span className="font-medium">Budget:</span>
                                <span className="font-semibold text-green-600 text-xs sm:text-sm">₹{profile.budget.min} - ₹{profile.budget.max}</span>
                              </div>
                            )}
                            {profile.personalityType && (
                              <div className="flex justify-between items-center">
                                <span className="font-medium">Personality:</span>
                                <span className="font-semibold text-purple-600 text-xs sm:text-sm">{profile.personalityType}</span>
                              </div>
                            )}
                            {profile.hobbies && (
                              <div className="mt-2 sm:mt-3">
                                <p className="font-medium text-slate-700 mb-1">Hobbies:</p>
                                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{profile.hobbies}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="px-4 sm:px-5 lg:px-6 pb-4 sm:pb-5 lg:pb-6">
                          <Link
                            to={`/roommates/${profile._id}`}
                            className="block w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-center py-2.5 sm:py-3 px-4 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 shadow-lg hover:shadow-xl group-hover:scale-[1.02]"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          {totalSlides > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-2 sm:left-3 lg:left-4 top-1/2 transform -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-white/20 flex items-center justify-center hover:bg-white hover:shadow-xl transition-all duration-200 z-10"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-slate-600" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2 sm:right-3 lg:right-4 top-1/2 transform -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-white/20 flex items-center justify-center hover:bg-white hover:shadow-xl transition-all duration-200 z-10"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-slate-600" />
              </button>
            </>
          )}

          {/* Pagination Dots */}
          {totalSlides > 1 && (
            <div className="flex justify-center mt-4 sm:mt-6 lg:mt-8 space-x-1.5 sm:space-x-2">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 sm:h-2.5 lg:h-3 rounded-full transition-all duration-200 ${
                    index === currentIndex 
                      ? 'bg-blue-600 w-5 sm:w-6 lg:w-8' 
                      : 'bg-slate-300 hover:bg-slate-400 w-2 sm:w-2.5 lg:w-3'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}