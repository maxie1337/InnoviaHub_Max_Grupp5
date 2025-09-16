import React from 'react';
import { motion } from 'framer-motion';
import StatsCard from './StatsCard';
import { 
  MdPeople, 
  MdEvent, 
  MdBusiness, 
  MdTrendingUp,
  MdCheckCircle,
  MdPending
} from 'react-icons/md';
import type { DashboardStats } from '../../../../types/admin';

interface StatsCardsProps {
  dashboardStats?: DashboardStats;
}

const StatsCards: React.FC<StatsCardsProps> = ({ dashboardStats }) => {
  // Use real data if available, otherwise fallback to mock data
  const stats = [
    {
      title: 'Total Users',
      value: dashboardStats?.totalUsers?.toString() || '1,234',
      change: '+12%',
      changeType: 'positive' as const,
      icon: MdPeople,
      color: 'blue' as const,
      description: 'From last month',
    },
    {
      title: 'Active Bookings',
      value: dashboardStats?.activeBookings?.toString() || '89',
      change: '+5%',
      changeType: 'positive' as const,
      icon: MdEvent,
      color: 'green' as const,
      description: 'Currently active',
    },
    {
      title: 'Total Resources',
      value: dashboardStats?.totalResources?.toString() || '45',
      change: '+2',
      changeType: 'positive' as const,
      icon: MdBusiness,
      color: 'purple' as const,
      description: 'Available resources',
    },
    {
      title: 'System Uptime',
      value: '99.9%',
      change: '+0.1%',
      changeType: 'positive' as const,
      icon: MdTrendingUp,
      color: 'orange' as const,
      description: 'Last 30 days',
    },
    {
      title: 'Completed Bookings',
      value: dashboardStats?.bookingStats?.completedBookings?.toString() || '2,156',
      change: '+18%',
      changeType: 'positive' as const,
      icon: MdCheckCircle,
      color: 'green' as const,
      description: 'This month',
    },
    {
      title: 'Pending Requests',
      value: '23',
      change: '-3',
      changeType: 'negative' as const,
      icon: MdPending,
      color: 'yellow' as const,
      description: 'Awaiting approval',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <StatsCard {...stat} />
        </motion.div>
      ))}
    </div>
  );
};

export default StatsCards;
