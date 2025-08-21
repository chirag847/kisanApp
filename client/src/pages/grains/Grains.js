import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import GrainImage from '../../components/common/GrainImage';

const Grains = () => {
  const [grains, setGrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  useEffect(() => {
    fetchGrains();
  }, []);

  const fetchGrains = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/grains`);
      const data = await response.json();
      
      if (data.success) {
        setGrains(data.data.grains || []);
      }
    } catch (error) {
      console.error('Error fetching grains:', error);
      setGrains([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredGrains = grains.filter(grain => {
    // Safely access properties with fallbacks
    const title = grain.title || '';
    const grainType = grain.grainType || '';
    const variety = grain.variety || '';
    
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         grainType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         variety.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || grainType === selectedCategory;
    const matchesPrice = (!priceRange.min || grain.pricePerQuintal >= parseInt(priceRange.min)) &&
                        (!priceRange.max || grain.pricePerQuintal <= parseInt(priceRange.max));
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const grainCategories = ['all', ...new Set(grains.map(grain => grain.grainType || '').filter(type => type))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Browse Grains
          </h1>
          <p className="text-gray-600">
            Fresh grains directly from farmers across India
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search grains..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {grainCategories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Min ₹"
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              />
              <input
                type="number"
                placeholder="Max ₹"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>

            {/* Reset Filters */}
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setPriceRange({ min: '', max: '' });
              }}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-800"
            >
              Reset
            </button>
          </div>
        </motion.div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-gray-600">
            {filteredGrains.length} grain{filteredGrains.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Grains Grid */}
        {filteredGrains.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 text-6xl mb-4">🌾</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No grains found</h3>
            <p className="text-gray-600 mb-4">
              {grains.length === 0 
                ? "No grains are currently listed. Farmers can add their grains to get started!"
                : "Try adjusting your search criteria to find more grains."
              }
            </p>
            {grains.length === 0 && (
              <button
                onClick={() => window.location.href = '/register'}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Become a Farmer
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredGrains.map((grain, index) => (
              <motion.div
                key={grain._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* Grain Image */}
                                {/* Grain Image */}
                <div className="h-48 overflow-hidden">
                  <GrainImage grain={grain} className="h-48" />
                </div>

                {/* Grain Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{grain.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 capitalize">{grain.grainType} - {grain.variety}</p>
                  
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">
                      ₹{Math.round(grain.pricePerQuintal / 100)}/kg
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {grain.availableQuantity} quintals
                    </span>
                  </div>

                  <div className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    📍 {grain.location?.city || 'Location not specified'}
                  </div>

                  <div className="flex space-x-2">
                    <Link
                      to={`/grains/${grain._id}`}
                      className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors text-center"
                    >
                      View Details
                    </Link>
                    <button className="flex-1 px-3 py-2 border border-green-600 dark:border-green-500 text-green-600 dark:text-green-400 text-sm rounded-md hover:bg-green-50 dark:hover:bg-green-900 transition-colors">
                      Contact Farmer
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Grains;
