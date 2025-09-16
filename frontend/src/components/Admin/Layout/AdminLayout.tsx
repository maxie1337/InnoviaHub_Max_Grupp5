import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar/Sidebar';
import Header from './Header/Header';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../../hooks/useTheme';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { theme } = useTheme();

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true);
        setSidebarOpen(false);
      } else {
        setSidebarCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const closeSidebar = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ${theme}`}>
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={closeSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{
          x: sidebarOpen ? 0 : window.innerWidth < 1024 ? -280 : 0,
          width: sidebarCollapsed && window.innerWidth >= 1024 ? 80 : 280,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed inset-y-0 left-0 z-50 w-70 bg-white dark:bg-gray-800 shadow-lg border-r border-gray-200 dark:border-gray-700"
      >
        <Sidebar
          collapsed={sidebarCollapsed}
          onClose={closeSidebar}
        />
      </motion.div>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          sidebarCollapsed && window.innerWidth >= 1024
            ? 'lg:ml-20'
            : 'lg:ml-70'
        }`}
      >
        {/* Header */}
        <Header
          onToggleSidebar={toggleSidebar}
          sidebarCollapsed={sidebarCollapsed}
        />

        {/* Page Content */}
        <main className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-7xl mx-auto"
          >
            {children || <Outlet />}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;




