import React, { useState, useEffect } from 'react';
import { roommateAPI } from '../services/api';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';

const defaultProfile = {
  gender: '',
  email: '',
  phone: '',
  course: '',
  currentLocation: '',
  preferredLocation: '',
  preferredGender: '',
  prefferedAccomodationType: '',
  preferredRoomType: '',
  budget: { min: '', max: '' },
  sleepSchedule: '',
  cleanliness: '',
  diet: '',
  smoking: '',
  alcohol: '',
  personalityType: '',
  hobbies: '',
  talkativeness: '',
  noiseTolerance: '',
  socialWithRoommate: false,
  socialLinks: { linkedin: '', instagram: '' },
  additionalNotes: '',
};

export default function RoommateProfilePage() {
  const [profile, setProfile] = useState(defaultProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    setLoading(true);
    roommateAPI.getMyProfile()
      .then(data => {
        if (data && data.data) setProfile({ ...defaultProfile, ...data.data });
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setError('No profile found. Please create your roommate profile.');
        setEditMode(true);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('budget.')) {
      setProfile(prev => ({
        ...prev,
        budget: { ...prev.budget, [name.split('.')[1]]: value }
      }));
    } else if (name.startsWith('socialLinks.')) {
      setProfile(prev => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, [name.split('.')[1]]: value }
      }));
    } else if (type === 'checkbox') {
      setProfile(prev => ({ ...prev, [name]: checked }));
    } else {
      setProfile(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');
    try {
      await roommateAPI.saveProfile(profile);
      setMessage('Profile saved!');
      setEditMode(false);
    } catch (err) {
      setError('Error saving profile');
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your roommate profile?')) return;
    setDeleting(true);
    setError('');
    setMessage('');
    try {
      await roommateAPI.deleteProfile();
      setProfile(defaultProfile);
      setMessage('Profile deleted.');
      setEditMode(true);
    } catch (err) {
      setError('Error deleting profile');
    }
    setDeleting(false);
  };

  if (loading) return <div className="text-center py-10 text-lg font-semibold text-slate-500 animate-pulse">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-gradient-to-br from-white via-slate-50 to-slate-100 p-8 rounded-3xl shadow-2xl border border-slate-200 mt-12">
      <h2 className="text-3xl font-extrabold mb-6 text-center bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent drop-shadow-lg">My Roommate Profile</h2>
      {message && (
        <div className="mb-4 flex items-center justify-center bg-green-100 text-green-700 rounded-lg px-4 py-2 shadow">
          <CheckCircleIcon className="w-5 h-5 mr-2" />
          {message}
        </div>
      )}
      {error && (
        <div className="mb-4 flex items-center justify-center bg-red-100 text-red-700 rounded-lg px-4 py-2 shadow">
          <ExclamationCircleIcon className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}
      {editMode ? (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-slate-700 mb-3 border-b pb-1">Contact Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Gender*</label>
                <select name="gender" value={profile.gender} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition">
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Email*</label>
                <input name="email" value={profile.email} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition placeholder-slate-400" placeholder="Email" />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Phone*</label>
                <input name="phone" value={profile.phone} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition placeholder-slate-400" placeholder="Phone" />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Course*</label>
                <input name="course" value={profile.course} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition placeholder-slate-400" placeholder="Course" />
              </div>
            </div>
          </div>

          {/* Location & Preferences */}
          <div>
            <h3 className="text-lg font-semibold text-slate-700 mb-3 border-b pb-1">Location & Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Current Location*</label>
                <select name="currentLocation" value={profile.currentLocation} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition">
                  <option value="">Select</option>
                  <option value="InCampus">InCampus</option>
                  <option value="OffCampus">OffCampus</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Preferred Location*</label>
                <select name="preferredLocation" value={profile.preferredLocation} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition">
                  <option value="">Select</option>
                  <option value="InCampus">InCampus</option>
                  <option value="OffCampus">OffCampus</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Preferred Gender*</label>
                <select name="preferredGender" value={profile.preferredGender} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition">
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Any">Any</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Preferred Accommodation Type</label>
                <select name="prefferedAccomodationType" value={profile.prefferedAccomodationType} onChange={handleChange} className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition">
                  <option value="">Select</option>
                  <option value="Hostel">Hostel</option>
                  <option value="Pg">PG</option>
                  <option value="Flat">Flat</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Preferred Room Type*</label>
                <select name="preferredRoomType" value={profile.preferredRoomType} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition">
                  <option value="">Select</option>
                  <option value="Double Sharing">Double Sharing</option>
                  <option value="Triple Sharing">Triple Sharing</option>
                </select>
              </div>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-slate-700 font-medium mb-1">Budget Min*</label>
                  <input name="budget.min" value={profile.budget.min} onChange={handleChange} type="number" required className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition placeholder-slate-400" placeholder="Min" />
                </div>
                <div className="w-1/2">
                  <label className="block text-slate-700 font-medium mb-1">Budget Max*</label>
                  <input name="budget.max" value={profile.budget.max} onChange={handleChange} type="number" required className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition placeholder-slate-400" placeholder="Max" />
                </div>
              </div>
            </div>
          </div>

          {/* Lifestyle & Personality */}
          <div>
            <h3 className="text-lg font-semibold text-slate-700 mb-3 border-b pb-1">Lifestyle & Personality</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Sleep Schedule*</label>
                <select name="sleepSchedule" value={profile.sleepSchedule} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition">
                  <option value="">Select</option>
                  <option value="Early Bird">Early Bird</option>
                  <option value="Night Owl">Night Owl</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Cleanliness*</label>
                <select name="cleanliness" value={profile.cleanliness} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition">
                  <option value="">Select</option>
                  <option value="Messy">Messy</option>
                  <option value="Average">Average</option>
                  <option value="Very Tidy">Very Tidy</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Diet</label>
                <select name="diet" value={profile.diet} onChange={handleChange} className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition">
                  <option value="">Select</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Non-Vegetarian">Non-Vegetarian</option>
                  <option value="Eggetarian">Eggetarian</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Any">Any</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Smoking</label>
                <select name="smoking" value={profile.smoking} onChange={handleChange} className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition">
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                  <option value="Occasionally">Occasionally</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Alcohol</label>
                <select name="alcohol" value={profile.alcohol} onChange={handleChange} className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition">
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                  <option value="Occasionally">Occasionally</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Personality Type</label>
                <select name="personalityType" value={profile.personalityType} onChange={handleChange} className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition">
                  <option value="">Select</option>
                  <option value="Introvert">Introvert</option>
                  <option value="Extrovert">Extrovert</option>
                  <option value="Ambivert">Ambivert</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Hobbies</label>
                <input name="hobbies" value={profile.hobbies} onChange={handleChange} className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition placeholder-slate-400" placeholder="Comma separated" />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Talkativeness</label>
                <select name="talkativeness" value={profile.talkativeness} onChange={handleChange} className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition">
                  <option value="">Select</option>
                  <option value="Talkative">Talkative</option>
                  <option value="Quiet">Quiet</option>
                  <option value="In-between">In-between</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Noise Tolerance</label>
                <select name="noiseTolerance" value={profile.noiseTolerance} onChange={handleChange} className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition">
                  <option value="">Select</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div className="flex items-center mt-2">
                <input type="checkbox" name="socialWithRoommate" checked={profile.socialWithRoommate} onChange={handleChange} className="mr-2 accent-blue-600 w-5 h-5" />
                <label className="text-slate-700 font-medium">Social with Roommate</label>
              </div>
            </div>
          </div>

          {/* Social & Notes */}
          <div>
            <h3 className="text-lg font-semibold text-slate-700 mb-3 border-b pb-1">Social & Additional Notes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-slate-700 font-medium mb-1">LinkedIn</label>
                <input name="socialLinks.linkedin" value={profile.socialLinks.linkedin} onChange={handleChange} className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition placeholder-slate-400" placeholder="LinkedIn URL" />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Instagram</label>
                <input name="socialLinks.instagram" value={profile.socialLinks.instagram} onChange={handleChange} className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition placeholder-slate-400" placeholder="Instagram URL" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-slate-700 font-medium mb-1">Additional Notes</label>
                <textarea name="additionalNotes" value={profile.additionalNotes} onChange={handleChange} className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition placeholder-slate-400 min-h-[60px]" placeholder="Anything else you'd like to add?" />
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mt-6">
            <button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 shadow-lg text-white px-6 py-2 rounded-xl font-semibold transition flex-1" disabled={saving}>
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
            <button type="button" className="bg-gray-200 hover:bg-gray-300 text-slate-700 px-6 py-2 rounded-xl font-semibold transition flex-1" onClick={() => setEditMode(false)}>
              Cancel
            </button>
            <button type="button" className="bg-gradient-to-r from-red-600 to-pink-500 hover:from-red-700 hover:to-pink-600 shadow-lg text-white px-6 py-2 rounded-xl font-semibold transition flex-1" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Deleting...' : 'Delete Profile'}
            </button>
          </div>
        </form>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-700">
            <div><span className="font-semibold">Gender:</span> {profile.gender}</div>
            <div><span className="font-semibold">Email:</span> {profile.email}</div>
            <div><span className="font-semibold">Phone:</span> {profile.phone}</div>
            <div><span className="font-semibold">Course:</span> {profile.course}</div>
            <div><span className="font-semibold">Current Location:</span> {profile.currentLocation}</div>
            <div><span className="font-semibold">Preferred Location:</span> {profile.preferredLocation}</div>
            <div><span className="font-semibold">Preferred Gender:</span> {profile.preferredGender}</div>
            <div><span className="font-semibold">Preferred Accommodation Type:</span> {profile.prefferedAccomodationType}</div>
            <div><span className="font-semibold">Preferred Room Type:</span> {profile.preferredRoomType}</div>
            <div><span className="font-semibold">Budget:</span> {profile.budget.min} - {profile.budget.max}</div>
            <div><span className="font-semibold">Sleep Schedule:</span> {profile.sleepSchedule}</div>
            <div><span className="font-semibold">Cleanliness:</span> {profile.cleanliness}</div>
            <div><span className="font-semibold">Diet:</span> {profile.diet}</div>
            <div><span className="font-semibold">Smoking:</span> {profile.smoking}</div>
            <div><span className="font-semibold">Alcohol:</span> {profile.alcohol}</div>
            <div><span className="font-semibold">Personality Type:</span> {profile.personalityType}</div>
            <div><span className="font-semibold">Hobbies:</span> {profile.hobbies}</div>
            <div><span className="font-semibold">Talkativeness:</span> {profile.talkativeness}</div>
            <div><span className="font-semibold">Noise Tolerance:</span> {profile.noiseTolerance}</div>
            <div><span className="font-semibold">Social with Roommate:</span> {profile.socialWithRoommate ? 'Yes' : 'No'}</div>
            <div><span className="font-semibold">LinkedIn:</span> {profile.socialLinks.linkedin}</div>
            <div><span className="font-semibold">Instagram:</span> {profile.socialLinks.instagram}</div>
            <div className="md:col-span-2"><span className="font-semibold">Additional Notes:</span> {profile.additionalNotes}</div>
          </div>
          <div className="flex flex-col md:flex-row gap-4 mt-8">
            <button className="bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 shadow-lg text-white px-6 py-2 rounded-xl font-semibold transition flex-1" onClick={() => setEditMode(true)}>
              Edit Profile
            </button>
            <button className="bg-gradient-to-r from-red-600 to-pink-500 hover:from-red-700 hover:to-pink-600 shadow-lg text-white px-6 py-2 rounded-xl font-semibold transition flex-1" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Deleting...' : 'Delete Profile'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
