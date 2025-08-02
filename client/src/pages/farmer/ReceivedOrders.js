import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../../contexts/AuthContext';
import { getReceivedOrders, updateOrderStatus } from '../../services/orderService';
import { toast } from 'react-toastify';

const ReceivedOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchReceivedOrders();
  }, [user]);

  const fetchReceivedOrders = async () => {
    try {
      const response = await getReceivedOrders();
      setOrders(response.orders || []);
    } catch (error) {
      console.error('Error fetching received orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status?.toLowerCase() === filter;
  });

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdating(true);
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
      toast.success('Order status updated successfully');
      setShowModal(false);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error(error.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const getOrderStats = () => {
    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      confirmed: orders.filter(o => o.status === 'confirmed').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length
    };
    return stats;
  };

  const stats = getOrderStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Received Orders</h1>
          <p className="text-gray-600 mt-1">Manage orders from buyers</p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-6">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-blue-800">Total Orders</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-sm text-yellow-800">Pending</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.confirmed}</div>
              <div className="text-sm text-blue-800">Confirmed</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.shipped}</div>
              <div className="text-sm text-purple-800">Shipped</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
              <div className="text-sm text-green-800">Delivered</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
              <div className="text-sm text-red-800">Cancelled</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-wrap gap-2">
            {['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                  filter === status
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status} ({status === 'all' ? stats.total : stats[status] || 0})
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {filteredOrders.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 text-6xl mb-4">📦</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {filter === 'all' ? 'No orders found' : `No ${filter} orders`}
              </h3>
              <p className="text-gray-600">
                {filter === 'all' 
                  ? 'Orders from buyers will appear here'
                  : `You don't have any ${filter} orders at the moment`
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Buyer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grain
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <motion.tr
                      key={order._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            #{order._id.slice(-8)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString('en-IN')}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {order.buyer?.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.buyer?.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {order.grain?.type}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.grain?.variety}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.quantity} quintals
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        ₹{order.totalAmount?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                          {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => openOrderDetails(order)}
                          className="text-green-600 hover:text-green-900 mr-3"
                        >
                          View Details
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-green-600 text-white p-6 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">Order Details</h2>
                <p className="text-green-100">#{selectedOrder._id}</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Date:</span>
                      <span>{new Date(selectedOrder.createdAt).toLocaleDateString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status?.charAt(0).toUpperCase() + selectedOrder.status?.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="uppercase">{selectedOrder.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Type:</span>
                      <span className="capitalize">{selectedOrder.deliveryType}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Buyer Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span>{selectedOrder.buyer?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span>{selectedOrder.buyer?.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span>{selectedOrder.buyer?.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grain Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Grain Details</h3>
                <div className="border rounded-lg p-4">
                  <div className="flex space-x-4">
                    {selectedOrder.grain?.images && selectedOrder.grain.images.length > 0 && (
                      <img
                        src={selectedOrder.grain.images[0]}
                        alt={selectedOrder.grain.type}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{selectedOrder.grain?.type}</h4>
                      <p className="text-sm text-gray-600">{selectedOrder.grain?.variety}</p>
                      <p className="text-sm text-gray-600">Quantity: {selectedOrder.quantity} quintals</p>
                      <p className="text-sm text-gray-600">Price: ₹{selectedOrder.pricePerQuintal}/quintal</p>
                      <p className="text-lg font-semibold text-green-600 mt-2">
                        Total: ₹{selectedOrder.totalAmount?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              {selectedOrder.deliveryType === 'delivery' && selectedOrder.deliveryAddress && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Delivery Address</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p>{selectedOrder.deliveryAddress.street}</p>
                    <p>{selectedOrder.deliveryAddress.city}, {selectedOrder.deliveryAddress.state} - {selectedOrder.deliveryAddress.pincode}</p>
                    {selectedOrder.deliveryAddress.landmark && (
                      <p className="text-gray-600">Near: {selectedOrder.deliveryAddress.landmark}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Special Instructions */}
              {selectedOrder.specialInstructions && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Special Instructions</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p>{selectedOrder.specialInstructions}</p>
                  </div>
                </div>
              )}

              {/* Status Update Actions */}
              {selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'delivered' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Update Order Status</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedOrder.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(selectedOrder._id, 'confirmed')}
                          disabled={updating}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                          {updating ? 'Updating...' : 'Confirm Order'}
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(selectedOrder._id, 'cancelled')}
                          disabled={updating}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                        >
                          {updating ? 'Updating...' : 'Cancel Order'}
                        </button>
                      </>
                    )}
                    {selectedOrder.status === 'confirmed' && (
                      <button
                        onClick={() => handleStatusUpdate(selectedOrder._id, 'shipped')}
                        disabled={updating}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
                      >
                        {updating ? 'Updating...' : 'Mark as Shipped'}
                      </button>
                    )}
                    {selectedOrder.status === 'shipped' && (
                      <button
                        onClick={() => handleStatusUpdate(selectedOrder._id, 'delivered')}
                        disabled={updating}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                      >
                        {updating ? 'Updating...' : 'Mark as Delivered'}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceivedOrders;
