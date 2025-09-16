import React from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiUsers, FiCalendar, FiBarChart, FiPieChart, FiActivity } from 'react-icons/fi';
import { useDashboardStats } from '../../hooks/useApi';
import { useAdminAuth } from '../../context/AdminAuthProvider';

const Analytics: React.FC = () => {
  const { } = useAdminAuth();
  const { data: dashboardStats, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Failed to load analytics
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error instanceof Error ? error.message : 'An error occurred'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Analytics & Reports
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Comprehensive insights into system usage and performance
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <FiActivity className="w-4 h-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm"
        >
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
              <FiUsers className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardStats?.totalUsers || 0}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm"
        >
          <div className="flex items-center">
            <div className="p-3 bg-green-100 dark:bg-green-900/40 rounded-lg">
              <FiCalendar className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardStats?.totalBookings || 0}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm"
        >
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
              <FiBarChart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Bookings</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardStats?.activeBookings || 0}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm"
        >
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/40 rounded-lg">
              <FiTrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Resources</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardStats?.totalResources || 0}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Booking Trends</h3>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
              <FiBarChart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
            <div className="text-center">
              <FiBarChart className="w-12 h-12 text-blue-400 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400">Monthly booking trends chart</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">Chart visualization coming soon</p>
            </div>
          </div>
        </motion.div>

        {/* Resource Usage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Resource Usage</h3>
            <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg">
              <FiPieChart className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="h-64 flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
            <div className="text-center">
              <FiPieChart className="w-12 h-12 text-green-400 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400">Resource utilization chart</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">Chart visualization coming soon</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Detailed Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Detailed Statistics</h3>
          <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
            <FiActivity className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Booking Statistics</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Completed:</span>
                <span className="font-medium text-gray-900 dark:text-white">{dashboardStats?.bookingStats?.completedBookings || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Cancelled:</span>
                <span className="font-medium text-gray-900 dark:text-white">{dashboardStats?.bookingStats?.cancelledBookings || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Avg Duration:</span>
                <span className="font-medium text-gray-900 dark:text-white">{dashboardStats?.bookingStats?.averageBookingDuration || 0} min</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">User Statistics</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Active Users:</span>
                <span className="font-medium text-gray-900 dark:text-white">{dashboardStats?.activeUsers || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Users:</span>
                <span className="font-medium text-gray-900 dark:text-white">{dashboardStats?.totalUsers || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Active Rate:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {dashboardStats?.totalUsers 
                    ? Math.round((dashboardStats.activeUsers / dashboardStats.totalUsers) * 100)
                    : 0}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Resource Statistics</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Available:</span>
                <span className="font-medium text-gray-900 dark:text-white">{dashboardStats?.availableResources || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Resources:</span>
                <span className="font-medium text-gray-900 dark:text-white">{dashboardStats?.totalResources || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Utilization:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {dashboardStats?.totalResources 
                    ? Math.round(((dashboardStats.totalResources - dashboardStats.availableResources) / dashboardStats.totalResources) * 100)
                    : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;