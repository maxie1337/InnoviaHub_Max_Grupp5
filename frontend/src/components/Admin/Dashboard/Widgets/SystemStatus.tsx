import React from 'react';
import { motion } from 'framer-motion';
import { 
  MdCheckCircle, 
  MdError, 
  MdWarning, 
  MdInfo,
  MdComputer,
  MdStorage,
  MdSpeed,
  MdSecurity
} from 'react-icons/md';

const SystemStatus: React.FC = () => {
  const statusItems = [
    {
      id: 'server',
      icon: MdComputer,
      title: 'Server Status',
      status: 'online',
      value: '99.9%',
      description: 'Uptime',
    },
    {
      id: 'database',
      icon: MdStorage,
      title: 'Database',
      status: 'online',
      value: '45ms',
      description: 'Response time',
    },
    {
      id: 'performance',
      icon: MdSpeed,
      title: 'Performance',
      status: 'good',
      value: '2.1s',
      description: 'Average load time',
    },
    {
      id: 'security',
      icon: MdSecurity,
      title: 'Security',
      status: 'secure',
      value: 'A+',
      description: 'Security rating',
    },
  ];

  const getStatusColor = (status: string) => {
    const statusMap = {
      online: 'text-green-600 dark:text-green-400',
      good: 'text-green-600 dark:text-green-400',
      secure: 'text-green-600 dark:text-green-400',
      warning: 'text-yellow-600 dark:text-yellow-400',
      error: 'text-red-600 dark:text-red-400',
      offline: 'text-red-600 dark:text-red-400',
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.online;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
      case 'good':
      case 'secure':
        return <MdCheckCircle className="w-4 h-4" />;
      case 'warning':
        return <MdWarning className="w-4 h-4" />;
      case 'error':
      case 'offline':
        return <MdError className="w-4 h-4" />;
      default:
        return <MdInfo className="w-4 h-4" />;
    }
  };

  const getStatusBg = (status: string) => {
    const statusMap = {
      online: 'bg-green-50 dark:bg-green-900/20',
      good: 'bg-green-50 dark:bg-green-900/20',
      secure: 'bg-green-50 dark:bg-green-900/20',
      warning: 'bg-yellow-50 dark:bg-yellow-900/20',
      error: 'bg-red-50 dark:bg-red-900/20',
      offline: 'bg-red-50 dark:bg-red-900/20',
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.online;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        System Status
      </h3>

      <div className="space-y-4">
        {statusItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`p-4 rounded-lg ${getStatusBg(item.status)}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <item.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {item.description}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {item.value}
                </span>
                <div className={`${getStatusColor(item.status)}`}>
                  {getStatusIcon(item.status)}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Overall Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MdCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <div>
              <h4 className="text-sm font-medium text-green-900 dark:text-green-100">
                All Systems Operational
              </h4>
              <p className="text-xs text-green-700 dark:text-green-300">
                Everything is running smoothly
              </p>
            </div>
          </div>
          <div className="text-green-600 dark:text-green-400">
            <MdCheckCircle className="w-6 h-6" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SystemStatus;
