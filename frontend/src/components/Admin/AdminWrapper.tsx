import React from 'react';
import { AdminAuthProvider } from '../../context/AdminAuthProvider';

interface AdminWrapperProps {
  children: React.ReactNode;
}

const AdminWrapper: React.FC<AdminWrapperProps> = ({ children }) => {
  return (
    <AdminAuthProvider>
      {children}
    </AdminAuthProvider>
  );
};

export default AdminWrapper;




