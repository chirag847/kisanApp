import React from 'react';
import { useTranslation } from 'react-i18next';

const componentNames = [
  // Auth pages
  'ForgotPassword',
  'ResetPassword',
  
  // Grain pages
  'Grains', 
  'GrainDetails',
  
  // Profile
  'Profile',
  
  // Farmer pages
  'MyListings',
  'AddGrain', 
  'EditGrain',
  'ReceivedOrders',
  
  // Buyer pages
  'MyOrders',
  'OrderDetails', 
  'PlaceOrder',
  
  // Admin pages
  'ManageUsers',
  'ManageGrains',
  'ManageOrders', 
  'Analytics'
];

// Generate all placeholder components
const createPlaceholderComponent = (name) => {
  return function PlaceholderComponent() {
    const { t } = useTranslation();
    
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            {name}
          </h1>
          <p className="text-gray-600">
            {t('common.comingSoon')}
          </p>
        </div>
      </div>
    );
  };
};

// Export all components
export const ForgotPassword = createPlaceholderComponent('Forgot Password');
export const ResetPassword = createPlaceholderComponent('Reset Password');
export const Grains = createPlaceholderComponent('Browse Grains');
export const GrainDetails = createPlaceholderComponent('Grain Details');
export const Profile = createPlaceholderComponent('Profile');
export const MyListings = createPlaceholderComponent('My Listings');
export const AddGrain = createPlaceholderComponent('Add Grain');
export const EditGrain = createPlaceholderComponent('Edit Grain');
export const ReceivedOrders = createPlaceholderComponent('Received Orders');
export const MyOrders = createPlaceholderComponent('My Orders');
export const OrderDetails = createPlaceholderComponent('Order Details');
export const PlaceOrder = createPlaceholderComponent('Place Order');
export const ManageUsers = createPlaceholderComponent('Manage Users');
export const ManageGrains = createPlaceholderComponent('Manage Grains');
export const ManageOrders = createPlaceholderComponent('Manage Orders');
export const Analytics = createPlaceholderComponent('Analytics');
