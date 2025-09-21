import React, { useState } from 'react';
import { Search, Filter, MapPin, Star, Users, DollarSign, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { institutions } from '../data/mockData';
import { Institution } from '../types';

const Institutions: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredInstitutions = institutions.filter(institution => {
    const matchesSearch = institution.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         institution.courses.some(course => course.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLocation = !locationFilter || institution.location.includes(locationFilter);
    const matchesType = !typeFilter || institution.type === typeFilter;
    const matchesRating = !ratingFilter || institution.rating >= parseFloat(ratingFilter);

    return matchesSearch && matchesLocation && matchesType && matchesRating;
  });

  const locations = [...new Set(institutions.map(inst => inst.location))];
  const types = [...new Set(institutions.map(inst => inst.type))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Find Your Perfect Institution
          </h1>
          <p className="text-xl text-gray-600">
            Explore top educational institutions across India
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search institutions or courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex justify-between items-center">
            <p className="text-gray-600">
              Showing {filteredInstitutions.length} of {institutions.length} institutions
            </p>
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </motion.button>
          </div>

          {/* Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Locations</option>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Types</option>
                  {types.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Rating
                </label>
                <select
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Any Rating</option>
                  <option value="8">8.0+</option>
                  <option value="8.5">8.5+</option>
                  <option value="9">9.0+</option>
                </select>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Institutions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInstitutions.map((institution, index) => (
            <motion.div
              key={institution.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              whileHover={{ y: -5 }}
            >
              {/* Institution Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={institution.image}
                  alt={institution.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {institution.type}
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>{institution.rating}</span>
                </div>
              </div>

              <div className="p-6">
                {/* Institution Info */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {institution.name}
                  </h3>
                  <div className="flex items-center space-x-1 text-gray-600 mb-2">
                    <MapPin className="h-4 w-4" />
                    <span>{institution.location}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center space-x-1 text-gray-600 mb-1">
                      <Users className="h-4 w-4" />
                      <span>Placement</span>
                    </div>
                    <div className="font-semibold text-green-600">
                      {institution.placementRate}%
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center space-x-1 text-gray-600 mb-1">
                      <DollarSign className="h-4 w-4" />
                      <span>Annual Fees</span>
                    </div>
                    <div className="font-semibold text-blue-600">
                      ₹{(institution.fees / 100000).toFixed(1)}L
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="mb-4">
                  <div className="flex items-center space-x-1 text-gray-600 text-sm mb-2">
                    <Calendar className="h-4 w-4" />
                    <span>Established {institution.established}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Admission Rate:</span> {institution.admissionRate}%
                  </div>
                </div>

                {/* Courses */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Available Courses:</h4>
                  <div className="flex flex-wrap gap-2">
                    {institution.courses.slice(0, 2).map((course, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                      >
                        {course}
                      </span>
                    ))}
                    {institution.courses.length > 2 && (
                      <span className="text-xs text-gray-500">
                        +{institution.courses.length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <motion.button
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg font-medium text-sm hover:shadow-lg transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    View Details
                  </motion.button>
                  <motion.button
                    className="border border-blue-600 text-blue-600 py-2 px-4 rounded-lg font-medium text-sm hover:bg-blue-50 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Compare
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredInstitutions.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No institutions found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or filters
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Institutions;