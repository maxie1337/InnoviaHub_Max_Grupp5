import React from 'react';
import { motion } from 'framer-motion';
import type { IconType } from 'react-icons';
import { MdTrendingUp, MdTrendingDown } from 'react-icons/md';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: IconType;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'yellow' | 'red';
  description: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  color,
  description,
}) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      icon: 'text-blue-600 dark:text-blue-400',
      iconBg: 'bg-blue-100 dark:bg-blue-900/40',
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      icon: 'text-green-600 dark:text-green-400',
      iconBg: 'bg-green-100 dark:bg-green-900/40',
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      icon: 'text-purple-600 dark:text-purple-400',
      iconBg: 'bg-purple-100 dark:bg-purple-900/40',
    },
    orange: {
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      icon: 'text-orange-600 dark:text-orange-400',
      iconBg: 'bg-orange-100 dark:bg-orange-900/40',
    },
    yellow: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      icon: 'text-yellow-600 dark:text-yellow-400',
      iconBg: 'bg-yellow-100 dark:bg-yellow-900/40',
    },
    red: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      icon: 'text-red-600 dark:text-red-400',
      iconBg: 'bg-red-100 dark:bg-red-900/40',
    },
  };

  const changeColorClasses = {
    positive: 'text-green-600 dark:text-green-400',
    negative: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-600 dark:text-gray-400',
  };

  const colors = colorClasses[color];

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={`relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm hover:shadow-md transition-shadow duration-200`}
    >
      {/* Background Pattern */}
      <div className={`absolute top-0 right-0 w-20 h-20 ${colors.bg} rounded-full -translate-y-10 translate-x-10 opacity-20`} />
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg ${colors.iconBg}`}>
            <Icon className={`w-6 h-6 ${colors.icon}`} />
          </div>
          
          {/* Change Indicator */}
          <div className={`flex items-center space-x-1 text-sm font-medium ${changeColorClasses[changeType]}`}>
            {changeType === 'positive' && <MdTrendingUp className="w-4 h-4" />}
            {changeType === 'negative' && <MdTrendingDown className="w-4 h-4" />}
            <span>{change}</span>
          </div>
        </div>

        {/* Content */}
        <div>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {value}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            {description}
          </p>
        </div>
      </div>

      {/* Hover Effect */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.3 }}
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 origin-left"
      />
    </motion.div>
  );
};

export default StatsCard;
