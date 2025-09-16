import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MdSettings, 
  MdHelp, 
  MdLogout,
  MdPerson,
  MdSecurity,
  MdNotifications
} from 'react-icons/md';
import { useAdminAuth } from '../../../../context/AdminAuthProvider';

interface UserMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAdminAuth();
  const menuItems = [
    {
      icon: MdPerson,
      label: 'Profile',
      href: '/admin/profile',
    },
    {
      icon: MdSettings,
      label: 'Settings',
      href: '/admin/settings',
    },
    {
      icon: MdSecurity,
      label: 'Security',
      href: '/admin/security',
    },
    {
      icon: MdNotifications,
      label: 'Notifications',
      href: '/admin/notifications',
    },
    {
      icon: MdHelp,
      label: 'Help & Support',
      href: '/admin/help',
    },
  ];

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            onClick={onClose}
          />

          {/* User Menu Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
          >
            {/* User Info */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">AU</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {menuItems.map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  onClick={onClose}
                >
                  <item.icon className="w-5 h-5 mr-3 text-gray-400" />
                  {item.label}
                </motion.a>
              ))}
            </div>

            {/* Logout */}
            <div className="border-t border-gray-200 dark:border-gray-700 py-2">
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: menuItems.length * 0.05 }}
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
              >
                <MdLogout className="w-5 h-5 mr-3" />
                Sign out
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default UserMenu;
