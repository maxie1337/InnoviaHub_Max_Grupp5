import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import SidebarItem from './SidebarItem';
import { NAV_ITEMS } from '../../../../utils/constants';
import { 
  MdDashboard, 
  MdPeople, 
  MdEvent, 
  MdBusiness, 
  MdAnalytics, 
  MdSettings 
} from 'react-icons/md';

interface SidebarProps {
  collapsed: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onClose }) => {
  const location = useLocation();

  // Icon mapping
  const iconMap = {
    MdDashboard,
    MdPeople,
    MdEvent,
    MdBusiness,
    MdAnalytics,
    MdSettings,
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200 dark:border-gray-700">
        <motion.div
          initial={false}
          animate={{ scale: collapsed ? 0.8 : 1 }}
          transition={{ duration: 0.2 }}
          className="flex items-center space-x-3"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">IH</span>
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                InnoviaHub
              </h1>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {NAV_ITEMS.map((item, index) => {
          const IconComponent = iconMap[item.icon as keyof typeof iconMap];
          const isActive = location.pathname === item.path;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.1 }}
            >
              <SidebarItem
                item={item}
                icon={IconComponent}
                isActive={isActive}
                collapsed={collapsed}
                onClick={onClose}
              />
            </motion.div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Admin Dashboard v1.0
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
