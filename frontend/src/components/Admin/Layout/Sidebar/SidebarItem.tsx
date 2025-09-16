import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { IconType } from 'react-icons';

interface SidebarItemProps {
  item: {
    id: string;
    label: string;
    icon: string;
    path: string;
    badge?: number;
  };
  icon: IconType;
  isActive: boolean;
  collapsed: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  icon: Icon,
  collapsed,
  onClick,
}) => {
  return (
    <NavLink
      to={item.path}
      onClick={onClick}
      className={({ isActive }: { isActive: boolean }) =>
        `group relative flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
          isActive
            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
        }`
      }
    >
      {({ isActive }: { isActive: boolean }) => (
        <>
          {/* Active indicator */}
          {isActive && (
            <motion.div
              layoutId="activeIndicator"
              className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-full"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}

          {/* Icon */}
          <div className="flex-shrink-0">
            <Icon
              className={`w-5 h-5 transition-colors duration-200 ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200'
              }`}
            />
          </div>

          {/* Label */}
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="ml-3 flex-1"
            >
              {item.label}
            </motion.span>
          )}

          {/* Badge */}
          {item.badge && item.badge > 0 && !collapsed && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
            >
              {item.badge > 99 ? '99+' : item.badge}
            </motion.span>
          )}

          {/* Tooltip for collapsed state */}
          {collapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              {item.label}
              {item.badge && item.badge > 0 && (
                <span className="ml-1 px-1 py-0.5 bg-red-500 text-white text-xs rounded">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </div>
          )}
        </>
      )}
    </NavLink>
  );
};

export default SidebarItem;
