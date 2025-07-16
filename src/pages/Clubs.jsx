import React, { useEffect, useState, useMemo } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Users, MapPin, Tag, Loader2, AlertCircle, Search, Filter } from 'lucide-react';

const categoryColors = {
  'Technical': 'bg-blue-100 text-blue-800 border-blue-200',
  'Cultural': 'bg-purple-100 text-purple-800 border-purple-200',
  'Sports': 'bg-green-100 text-green-800 border-green-200',
  'Social': 'bg-orange-100 text-orange-800 border-orange-200',
  'Academic': 'bg-indigo-100 text-indigo-800 border-indigo-200',
  'Arts': 'bg-pink-100 text-pink-800 border-pink-200',
  'Business': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'Community': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'default': 'bg-gray-100 text-gray-800 border-gray-200'
};

const Clubs = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Memoize categories to prevent re-computation on every render
  const categories = useMemo(() => {
    const uniqueCategories = new Set(clubs.map(club => club.category));
    return ['All', ...Array.from(uniqueCategories)];
  }, [clubs]);

  const filteredClubs = clubs.filter(club => {
    const matchesSearch = club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         club.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || club.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category) => {
    return categoryColors[category] || categoryColors.default;
  };

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.get('/clubs');
        console.log(response.data);
        setClubs(response.data || []);
      } catch (error) {
        console.error("Error fetching clubs:", error);
        setError("Failed to load clubs. Please try again later.");
        setClubs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-3" />
          <p className="text-base text-gray-600 font-medium">Loading amazing clubs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              UPES <span className="text-blue-600">Clubs</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Discover and join amazing communities that match your interests. From tech enthusiasts to creative minds, 
              find your tribe and make lasting connections.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search clubs by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700"
              />
            </div>
            
            {/* Category Filter */}
            <div className="relative min-w-44">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 appearance-none bg-white"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category} {category === 'All' ? 'Categories' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {searchTerm || selectedCategory !== 'All' ? (
            <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
              <span>Showing {filteredClubs.length} of {clubs.length} clubs</span>
              {(searchTerm || selectedCategory !== 'All') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                  }}
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : null}
        </div>

        {/* Clubs Grid */}
        {filteredClubs.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No clubs found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {searchTerm || selectedCategory !== 'All' 
                ? "Try adjusting your search or filter criteria." 
                : "No clubs are available at the moment. Check back later!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
            {filteredClubs.map((club) => (
              <div 
                key={club._id} 
                className="group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 hover:-translate-y-1"
              >
                {/* Club Image */}
                <div className="relative overflow-hidden h-32">
                  <img 
                    src={club.imageUrl} 
                    alt={club.name}
                    className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = `https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=200&fit=crop&crop=center`;
                    }}
                  />
                  
                  {/* Category Badge */}
                  <div className="absolute top-2 left-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(club.category)}`}>
                      <Tag className="w-2.5 h-2.5" />
                      {club.category}
                    </span>
                  </div>
                </div>

                {/* Club Content */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 mb-1 line-clamp-1">
                    {club.name}
                  </h3>

                  <p className="text-xs text-gray-600 leading-relaxed mb-2 line-clamp-2">
                    {club.description}
                  </p>

                  {/* Club Stats */}
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    {club.memberCount && (
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{club.memberCount} members</span>
                      </div>
                    )}
                    {club.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{club.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <button className="w-full bg-gradient-to-r from-blue-700 to-indigo-800 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500">
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Clubs;
