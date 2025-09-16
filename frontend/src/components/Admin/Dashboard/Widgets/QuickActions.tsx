import React from 'react';
import { motion } from 'framer-motion';
import { 
  MdPersonAdd, 
  MdEvent, 
  MdBusiness, 
  MdDownload,
  MdUpload,
  MdSettings
} from 'react-icons/md';

const QuickActions: React.FC = () => {
  const actions = [
    {
      id: 'create-user',
      icon: MdPersonAdd,
      title: 'Create User',
      description: 'Add a new user to the system',
      color: 'blue',
      href: '/admin/users/create',
    },
    {
      id: 'create-booking',
      icon: MdEvent,
      title: 'Create Booking',
      description: 'Make a new booking',
      color: 'green',
      href: '/admin/bookings/create',
    },
    {
      id: 'add-resource',
      icon: MdBusiness,
      title: 'Add Resource',
      description: 'Add a new resource',
      color: 'purple',
      href: '/admin/resources/create',
    },
    {
      id: 'export-data',
      icon: MdDownload,
      title: 'Export Data',
      description: 'Download system data',
      color: 'orange',
      href: '/admin/export',
    },
    {
      id: 'import-data',
      icon: MdUpload,
      title: 'Import Data',
      description: 'Upload data to system',
      color: 'yellow',
      href: '/admin/import',
    },
    {
      id: 'system-settings',
      icon: MdSettings,
      title: 'System Settings',
      description: 'Configure system options',
      color: 'gray',
      href: '/admin/settings',
    },
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 border-blue-200 dark:border-blue-800',
      green: 'bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 border-green-200 dark:border-green-800',
      purple: 'bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 border-purple-200 dark:border-purple-800',
      orange: 'bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/20 dark:hover:bg-orange-900/30 border-orange-200 dark:border-orange-800',
      yellow: 'bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:hover:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800',
      gray: 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-900/20 dark:hover:bg-gray-900/30 border-gray-200 dark:border-gray-800',
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.gray;
  };

  const getIconColor = (color: string) => {
    const colorMap = {
      blue: 'text-blue-600 dark:text-blue-400',
      green: 'text-green-600 dark:text-green-400',
      purple: 'text-purple-600 dark:text-purple-400',
      orange: 'text-orange-600 dark:text-orange-400',
      yellow: 'text-yellow-600 dark:text-yellow-400',
      gray: 'text-gray-600 dark:text-gray-400',
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.gray;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Quick Actions
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <motion.a
            key={action.id}
            href={action.href}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-4 rounded-lg border transition-all duration-200 ${getColorClasses(action.color)}`}
          >
            <div className="flex flex-col items-center text-center">
              <action.icon className={`w-6 h-6 mb-2 ${getIconColor(action.color)}`} />
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                {action.title}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {action.description}
              </p>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;





