import React from 'react';
import { motion } from 'framer-motion';
import LineChart from './LineChart';
import BarChart from './BarChart';
import PieChart from './PieChart';
import type { DashboardStats } from '../../../../types/admin';

interface ChartsSectionProps {
  dashboardStats?: DashboardStats;
}

const ChartsSection: React.FC<ChartsSectionProps> = ({ dashboardStats }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Bookings Over Time */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm"
      >
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Bookings Over Time
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Track booking trends over the last 30 days
          </p>
        </div>
        <LineChart dashboardStats={dashboardStats} />
      </motion.div>

      {/* Resource Usage */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm"
      >
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Resource Usage
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Most popular resources this month
          </p>
        </div>
        <BarChart dashboardStats={dashboardStats} />
      </motion.div>

      {/* Booking Status Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm"
      >
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Booking Status
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Distribution of booking statuses
          </p>
        </div>
        <PieChart dashboardStats={dashboardStats} />
      </motion.div>

      {/* User Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm"
      >
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            User Activity
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Active users by role
          </p>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">Admin</span>
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">5</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">Member</span>
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">1,229</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">Guest</span>
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">156</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ChartsSection;
