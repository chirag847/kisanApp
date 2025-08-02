import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  RectangleStackIcon,
  CurrencyRupeeIcon,
  TruckIcon,
  EyeIcon,
  PencilIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

import { useAuth } from '../../contexts/AuthContext';
import { getMyGrains } from '../../services/grainService';
import { getReceivedOrders } from '../../services/orderService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const FarmerDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const [stats, setStats] = useState({
    totalListings: 0,
    activeListings: 0,
    totalOrders: 0,
    totalRevenue: 0
  });
  const [recentGrains, setRecentGrains] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [grainsResponse, ordersResponse] = await Promise.all([
        getMyGrains(),
        getReceivedOrders()
      ]);

      // Calculate stats
      const grains = grainsResponse.data.grains || [];
      const orders = ordersResponse.data.orders || [];
      
      const activeListings = grains.filter(grain => grain.status === 'active').length;
      const totalRevenue = orders
        .filter(order => order.status === 'completed')
        .reduce((sum, order) => sum + (order.totalAmount || 0), 0);

      setStats({
        totalListings: grains.length,
        activeListings,
        totalOrders: orders.length,
        totalRevenue
      });

      setRecentGrains(grains.slice(0, 5));
      setRecentOrders(orders.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    {
      title: t('farmer.dashboard.addGrain'),
      description: t('farmer.dashboard.addGrainDesc'),
      href: '/farmer/add-grain',
      icon: PlusIcon,
      color: 'bg-green-500'
    },
    {
      title: t('farmer.dashboard.viewListings'),
      description: t('farmer.dashboard.viewListingsDesc'),
      href: '/farmer/listings',
      icon: RectangleStackIcon,
      color: 'bg-blue-500'
    },
    {
      title: t('farmer.dashboard.viewOrders'),
      description: t('farmer.dashboard.viewOrdersDesc'),
      href: '/farmer/orders',
      icon: TruckIcon,
      color: 'bg-purple-500'
    }
  ];

  const statCards = [
    {
      title: t('farmer.dashboard.totalListings'),
      value: stats.totalListings,
      icon: RectangleStackIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: t('farmer.dashboard.activeListings'),
      value: stats.activeListings,
      icon: ChartBarIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: t('farmer.dashboard.totalOrders'),
      value: stats.totalOrders,
      icon: TruckIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: t('farmer.dashboard.totalRevenue'),
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: CurrencyRupeeIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('farmer.dashboard.welcome', { name: user?.name })}
          </h1>
          <p className="text-gray-600">
            {t('farmer.dashboard.subtitle')}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex items-center">
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {t('farmer.dashboard.quickActions')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              >
                <Link
                  to={action.href}
                  className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 p-6"
                >
                  <div className="flex items-center mb-4">
                    <div className={`${action.color} p-2 rounded-lg text-white`}>
                      <action.icon className="h-6 w-6" />
                    </div>
                    <h3 className="ml-3 text-lg font-medium text-gray-900">
                      {action.title}
                    </h3>
                  </div>
                  <p className="text-gray-600">{action.description}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Grains */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="bg-white rounded-lg shadow"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  {t('farmer.dashboard.recentListings')}
                </h3>
                <Link
                  to="/farmer/listings"
                  className="text-primary-600 hover:text-primary-500 text-sm font-medium"
                >
                  {t('common.viewAll')}
                </Link>
              </div>
            </div>
            <div className="p-6">
              {recentGrains.length > 0 ? (
                <div className="space-y-4">
                  {recentGrains.map((grain) => (
                    <div key={grain._id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{grain.grainType}</p>
                        <p className="text-sm text-gray-500">
                          {grain.quantity} {t('common.quintals')} • ₹{grain.pricePerQuintal}/{t('common.quintal')}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Link
                          to={`/grains/${grain._id}`}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Link>
                        <Link
                          to={`/farmer/edit-grain/${grain._id}`}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <RectangleStackIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">{t('farmer.dashboard.noListings')}</p>
                  <Link
                    to="/farmer/add-grain"
                    className="text-primary-600 hover:text-primary-500 text-sm font-medium"
                  >
                    {t('farmer.dashboard.addFirstGrain')}
                  </Link>
                </div>
              )}
            </div>
          </motion.div>

          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
            className="bg-white rounded-lg shadow"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  {t('farmer.dashboard.recentOrders')}
                </h3>
                <Link
                  to="/farmer/orders"
                  className="text-primary-600 hover:text-primary-500 text-sm font-medium"
                >
                  {t('common.viewAll')}
                </Link>
              </div>
            </div>
            <div className="p-6">
              {recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order._id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          {order.grain?.grainType}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.quantity} {t('common.quintals')} • {t(`orderStatus.${order.status}`)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          ₹{order.totalAmount?.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <TruckIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">{t('farmer.dashboard.noOrders')}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
