import React from 'react';
import { motion } from 'framer-motion';
import { 
  MdPersonAdd, 
  MdEvent, 
  MdBusiness, 
  MdSettings,
  MdCheckCircle,
  MdError
} from 'react-icons/md';
import type { DashboardStats, User, Booking } from '../../../../types/admin';

interface RecentActivityProps {
  dashboardStats?: DashboardStats;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ dashboardStats }) => {
  // Generate activities from real data
  const generateActivities = () => {
    const activities: any[] = [];
    
    // Recent users
    if (dashboardStats?.recentUsers) {
      dashboardStats.recentUsers.slice(0, 2).forEach((user: User) => {
        activities.push({
          id: `user-${user.id}`,
          type: 'user_created',
          icon: MdPersonAdd,
          title: 'New user registered',
          description: `${user.firstName} ${user.lastName} created an account`,
          time: new Date(user.createdAt).toLocaleString(),
          color: 'green',
        });
      });
    }
    
    // Recent bookings
    if (dashboardStats?.recentBookings) {
      dashboardStats.recentBookings.slice(0, 2).forEach((booking: Booking) => {
        activities.push({
          id: `booking-${booking.bookingId}`,
          type: 'booking_created',
          icon: MdEvent,
          title: 'New booking created',
          description: `${booking.resourceName} booked by ${booking.userName}`,
          time: new Date(booking.createdAt).toLocaleString(),
          color: 'blue',
        });
      });
    }
    
    // Fallback to mock data if no real data
    if (activities.length === 0) {
      return [
        {
          id: 1,
          type: 'user_created',
          icon: MdPersonAdd,
          title: 'New user registered',
          description: 'John Doe created an account',
          time: '2 minutes ago',
          color: 'green',
        },
        {
          id: 2,
          type: 'booking_created',
          icon: MdEvent,
          title: 'New booking created',
          description: 'Meeting Room A booked for tomorrow',
          time: '15 minutes ago',
          color: 'blue',
        },
        {
          id: 3,
          type: 'resource_updated',
          icon: MdBusiness,
          title: 'Resource updated',
          description: 'Desk #5 availability changed',
          time: '1 hour ago',
          color: 'purple',
        },
        {
          id: 4,
          type: 'system_maintenance',
          icon: MdSettings,
          title: 'System maintenance',
          description: 'Scheduled maintenance completed',
          time: '2 hours ago',
          color: 'orange',
        },
        {
          id: 5,
          type: 'booking_completed',
          icon: MdCheckCircle,
          title: 'Booking completed',
          description: 'Conference Hall booking finished',
          time: '3 hours ago',
          color: 'green',
        },
        {
          id: 6,
          type: 'error_resolved',
          icon: MdError,
          title: 'Error resolved',
          description: 'Database connection issue fixed',
          time: '4 hours ago',
          color: 'red',
        },
      ];
    }
    
    return activities;
  };

  const activities = generateActivities();

  const getColorClasses = (color: string) => {
    const colorMap = {
      green: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
      blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
      purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
      orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
      red: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400',
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Activity
        </h3>
        <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
          View all
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
          >
            {/* Icon */}
            <div className={`p-2 rounded-lg ${getColorClasses(activity.color)}`}>
              <activity.icon className="w-4 h-4" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {activity.title}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {activity.description}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {activity.time}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
