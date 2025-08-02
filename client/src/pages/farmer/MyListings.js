import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  PlusIcon, 
  EyeIcon, 
  PencilIcon, 
  TrashIcon,
  ClockIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline';
import { getMyGrains, deleteGrain } from '../../services/grainService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const MyListings = () => {
  const { t } = useTranslation();
  const [grains, setGrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchMyGrains();
  }, []);

  const fetchMyGrains = async () => {
    try {
      setLoading(true);
      const response = await getMyGrains();
      setGrains(response.data?.grains || []);
    } catch (error) {
      console.error('Error fetching grains:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (grainId) => {
    if (window.confirm('Are you sure you want to delete this grain listing?')) {
      try {
        await deleteGrain(grainId);
        setGrains(grains.filter(grain => grain._id !== grainId));
      } catch (error) {
        console.error('Error deleting grain:', error);
        alert('Failed to delete grain. Please try again.');
      }
    }
  };

  const filteredGrains = grains.filter(grain => {
    if (filter === 'all') return true;
    return grain.status === filter;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', icon: CheckCircleIcon },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon },
      sold: { color: 'bg-gray-100 text-gray-800', icon: CheckCircleIcon }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Grain Listings</h1>
            <p className="text-gray-600 mt-2">
              Manage your grain listings and track their performance
            </p>
          </div>
          <Link
            to="/farmer/add-grain"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add New Grain
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'all', label: 'All Listings' },
                { key: 'active', label: 'Active' },
                { key: 'pending', label: 'Pending' },
                { key: 'sold', label: 'Sold' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    filter === tab.key
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                    {tab.key === 'all' ? grains.length : grains.filter(g => g.status === tab.key).length}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Grains Grid */}
        {filteredGrains.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🌾</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'all' ? 'No grain listings found' : `No ${filter} listings found`}
            </h3>
            <p className="text-gray-600 mb-4">
              {filter === 'all' 
                ? "Start by adding your first grain listing to reach potential buyers."
                : `You don't have any ${filter} grain listings at the moment.`
              }
            </p>
            {filter === 'all' && (
              <Link
                to="/farmer/add-grain"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Add Your First Grain
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGrains.map((grain, index) => (
              <motion.div
                key={grain._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* Grain Image */}
                <div className="h-48 bg-gradient-to-br from-green-100 to-yellow-100 flex items-center justify-center">
                  {grain.images && grain.images.length > 0 ? (
                    <img 
                      src={grain.images[0]} 
                      alt={grain.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-4xl">🌾</div>
                  )}
                </div>

                {/* Grain Info */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg">{grain.title}</h3>
                    {getStatusBadge(grain.status || 'pending')}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2 capitalize">
                    {grain.grainType} • {grain.variety || 'Standard'}
                  </p>
                  
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-lg font-bold text-green-600">
                      ₹{grain.pricePerQuintal}/quintal
                    </span>
                    <span className="text-sm text-gray-500">
                      {grain.quantity} quintals available
                    </span>
                  </div>

                  <div className="text-sm text-gray-600 mb-4">
                    📅 Listed: {new Date(grain.createdAt).toLocaleDateString()}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Link
                      to={`/grains/${grain._id}`}
                      className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <EyeIcon className="w-4 h-4 mr-1" />
                      View
                    </Link>
                    <Link
                      to={`/farmer/edit-grain/${grain._id}`}
                      className="flex-1 flex items-center justify-center px-3 py-2 border border-green-600 text-green-600 rounded-md text-sm hover:bg-green-50"
                    >
                      <PencilIcon className="w-4 h-4 mr-1" />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(grain._id)}
                      className="px-3 py-2 border border-red-600 text-red-600 rounded-md text-sm hover:bg-red-50"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyListings;
