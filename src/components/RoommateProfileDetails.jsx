import React, { use, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  GraduationCap, 
  MapPin, 
  DollarSign, 
  Clock, 
  Sparkles,
  Coffee,
  Cigarette,
  Wine,
  MessageCircle,
  Heart,
  Share2,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Linkedin,
  Instagram
} from 'lucide-react';
import { roommateAPI } from '../services/api';

export default function RoommateProfileDetails() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    roommateAPI.getProfileById(id)
      .then(data => setProfile(data.data || data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
        <p className="text-xl font-semibold text-slate-700">Loading profile...</p>
        <p className="text-slate-500 mt-2">Getting all the details</p>
      </div>
    </div>
  );

  if (!profile) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-12 h-12 text-red-500" />
        </div>
        <h3 className="text-2xl font-semibold text-slate-700 mb-2">Profile not found</h3>
        <p className="text-slate-500 max-w-md mx-auto">
          The profile you're looking for doesn't exist or has been removed.
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button 
          onClick={() => window.history.back()}
          className="mb-6 flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to profiles</span>
        </button>

        {/* Profile Header */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden mb-8">
          <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white">
            <div className="absolute top-4 right-4 flex gap-2">
              <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                <Heart className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl font-bold shadow-lg">
                {profile.user?.fullname?.[0]?.toUpperCase() || 'R'}
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                  {profile.user?.fullname || 'Anonymous User'}
                </h1>
                <p className="text-blue-100 text-lg">
                  {profile.user?.email || 'No email provided'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="p-6 border-b border-slate-100">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-sm text-slate-500 font-medium">Gender</p>
                <p className="font-semibold text-slate-800 capitalize">{profile.gender || 'N/A'}</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <GraduationCap className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-sm text-slate-500 font-medium">Course</p>
                <p className="font-semibold text-slate-800">{profile.course || 'N/A'}</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-sm text-slate-500 font-medium">Location</p>
                <p className="font-semibold text-slate-800">{profile.preferredLocation || 'N/A'}</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <DollarSign className="w-6 h-6 text-yellow-600" />
                </div>
                <p className="text-sm text-slate-500 font-medium">Budget</p>
                <p className="font-semibold text-slate-800">
                  {profile.budget?.min && profile.budget?.max 
                    ? `₹${profile.budget.min} - ₹${profile.budget.max}`
                    : 'N/A'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Contact Actions */}
          <div className="p-6">
            <div className="flex gap-4">
              <button 
                onClick={() => navigate(`/messages?userId=${profile.user?._id}`)}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Send Message
              </button>
              <button className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2">
                <Phone className="w-5 h-5" />
                Call
              </button>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Information */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <User className="w-6 h-6 text-blue-600" />
              Personal Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <Phone className="w-5 h-5 text-slate-500" />
                <div>
                  <p className="text-sm text-slate-500 font-medium">Phone</p>
                  <p className="font-semibold text-slate-800">{profile.phone || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <Mail className="w-5 h-5 text-slate-500" />
                <div>
                  <p className="text-sm text-slate-500 font-medium">Email</p>
                  <p className="font-semibold text-slate-800">{profile.user?.email || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <MapPin className="w-5 h-5 text-slate-500" />
                <div>
                  <p className="text-sm text-slate-500 font-medium">Current Location</p>
                  <p className="font-semibold text-slate-800">{profile.currentLocation || 'Not specified'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-purple-600" />
              Preferences
            </h2>
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-sm text-slate-500 font-medium mb-1">Preferred Gender</p>
                <p className="font-semibold text-slate-800">{profile.preferredGender || 'Any'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-sm text-slate-500 font-medium mb-1">Accommodation Type</p>
                <p className="font-semibold text-slate-800">{profile.prefferedAccomodationType || 'Not specified'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-sm text-slate-500 font-medium mb-1">Room Type</p>
                <p className="font-semibold text-slate-800">{profile.preferredRoomType || 'Not specified'}</p>
              </div>
            </div>
          </div>

          {/* Lifestyle */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <Clock className="w-6 h-6 text-green-600" />
              Lifestyle
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-xl text-center">
                <Clock className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Sleep Schedule</p>
                <p className="font-semibold text-slate-800 text-sm">{profile.sleepSchedule || 'N/A'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl text-center">
                <Sparkles className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Cleanliness</p>
                <p className="font-semibold text-slate-800 text-sm">{profile.cleanliness || 'N/A'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl text-center">
                <Coffee className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Diet</p>
                <p className="font-semibold text-slate-800 text-sm">{profile.diet || 'N/A'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl text-center">
                <Cigarette className="w-6 h-6 text-red-500 mx-auto mb-2" />
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Smoking</p>
                <p className="font-semibold text-slate-800 text-sm">{profile.smoking || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Personality & Social */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <Heart className="w-6 h-6 text-pink-600" />
              Personality & Social
            </h2>
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-sm text-slate-500 font-medium mb-1">Personality Type</p>
                <p className="font-semibold text-slate-800">{profile.personalityType || 'Not specified'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-sm text-slate-500 font-medium mb-1">Talkativeness</p>
                <p className="font-semibold text-slate-800">{profile.talkativeness || 'Not specified'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-sm text-slate-500 font-medium mb-1">Social with Roommate</p>
                <p className="font-semibold text-slate-800">{profile.socialWithRoommate ? 'Yes' : 'No'}</p>
              </div>
              {profile.hobbies && (
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-500 font-medium mb-1">Hobbies</p>
                  <p className="font-semibold text-slate-800">{profile.hobbies}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Social Links & Additional Notes */}
        {(profile.socialLinks?.linkedin || profile.socialLinks?.instagram || profile.additionalNotes) && (
          <div className="mt-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Additional Information</h2>
            
            {(profile.socialLinks?.linkedin || profile.socialLinks?.instagram) && (
              <div className="mb-6">
                <h3 className="font-semibold text-slate-700 mb-3">Social Links</h3>
                <div className="flex gap-4">
                  {profile.socialLinks?.linkedin && (
                    <a 
                      href={profile.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-xl transition-colors"
                    >
                      <Linkedin className="w-4 h-4" />
                      LinkedIn
                    </a>
                  )}
                  {profile.socialLinks?.instagram && (
                    <a 
                      href={profile.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-pink-100 hover:bg-pink-200 text-pink-700 px-4 py-2 rounded-xl transition-colors"
                    >
                      <Instagram className="w-4 h-4" />
                      Instagram
                    </a>
                  )}
                </div>
              </div>
            )}

            {profile.additionalNotes && (
              <div>
                <h3 className="font-semibold text-slate-700 mb-3">Additional Notes</h3>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-slate-700 leading-relaxed">{profile.additionalNotes}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}