import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiPlus, FiDownload, FiMapPin, FiClock, FiUsers, FiEdit, FiEye, FiTrash2, FiX } from 'react-icons/fi';
import { useResources, useCreateResource, useUpdateResource, useDeleteResource, useResourceTypes } from '../../hooks/useApi';
import { useAdminAuth } from '../../context/AdminAuthProvider';
import type { Resource, CreateResourceForm, UpdateResourceForm } from '../../types/admin';

const Resources: React.FC = () => {
  const { } = useAdminAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  
  // Form states
  const [addFormData, setAddFormData] = useState<CreateResourceForm>({
    name: '',
    resourceTypeId: 0
  });
  const [editFormData, setEditFormData] = useState<UpdateResourceForm>({
    name: '',
    resourceTypeId: 0
  });
  
  // Hooks
  const { data: resourcesResponse, isLoading, error } = useResources();
  const { data: resourceTypes } = useResourceTypes();
  const createResourceMutation = useCreateResource();
  const updateResourceMutation = useUpdateResource();
  const deleteResourceMutation = useDeleteResource();
  
  const resources = resourcesResponse?.items || [];

  // Handler functions
  const handleAddResource = () => {
    setAddFormData({ name: '', resourceTypeId: 0 });
    setShowAddModal(true);
  };

  const handleEditResource = (resource: Resource) => {
    setSelectedResource(resource);
    setEditFormData({
      name: resource.name,
      resourceTypeId: resource.resourceTypeId
    });
    setShowEditModal(true);
  };

  const handleViewResource = (resource: Resource) => {
    setSelectedResource(resource);
    setShowViewModal(true);
  };

  const handleDeleteResource = (resource: Resource) => {
    setSelectedResource(resource);
    setShowDeleteModal(true);
  };

  const handleExportResources = () => {
    // TODO: Implement export functionality
    console.log('Export resources');
  };

  const handleAddResourceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createResourceMutation.mutateAsync(addFormData);
      setShowAddModal(false);
      setAddFormData({ name: '', resourceTypeId: 0 });
    } catch (error) {
      console.error('Error creating resource:', error);
    }
  };

  const handleEditResourceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResource) return;
    
    try {
      await updateResourceMutation.mutateAsync({
        id: selectedResource.resourceId,
        resourceData: editFormData
      });
      setShowEditModal(false);
      setSelectedResource(null);
    } catch (error) {
      console.error('Error updating resource:', error);
    }
  };

  const confirmDelete = async () => {
    if (!selectedResource) return;
    
    try {
      await deleteResourceMutation.mutateAsync(selectedResource.resourceId);
      setShowDeleteModal(false);
      setSelectedResource(null);
    } catch (error) {
      console.error('Error deleting resource:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Resources Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage system resources and their availability
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleAddResource}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <FiPlus className="w-4 h-4 mr-2" />
              Add Resource
            </button>
            <button 
              onClick={handleExportResources}
              className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <FiDownload className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
              <FiMapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Resources</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{resources?.length || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 dark:bg-green-900/40 rounded-lg">
              <FiMapPin className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Available</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {resources?.filter(r => !r.isBooked).length || 0}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 dark:bg-red-900/40 rounded-lg">
              <FiClock className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Booked</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {resources?.filter(r => r.isBooked).length || 0}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
              <FiUsers className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {resources?.reduce((sum, r) => sum + (r.totalBookings || 0), 0) || 0}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">All Types</option>
            <option value="Meeting Room">Meeting Room</option>
            <option value="Desk">Desk</option>
            <option value="Conference Room">Conference Room</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">All Status</option>
            <option value="available">Available</option>
            <option value="booked">Booked</option>
          </select>
        </div>
      </motion.div>

      {/* Resources Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {isLoading ? (
          <div className="col-span-full p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading resources...</p>
          </div>
        ) : error ? (
          <div className="col-span-full p-12 text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <p className="text-red-600 dark:text-red-400">Error loading resources: {error.message}</p>
          </div>
        ) : (
          resources?.map((resource) => (
            <motion.div
              key={resource.resourceId}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-lg transition-all duration-200"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${
                    resource.isBooked 
                      ? 'bg-red-100 dark:bg-red-900/40' 
                      : 'bg-green-100 dark:bg-green-900/40'
                  }`}>
                    <FiMapPin className={`w-6 h-6 ${
                      resource.isBooked 
                        ? 'text-red-600 dark:text-red-400' 
                        : 'text-green-600 dark:text-green-400'
                    }`} />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{resource.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{resource.resourceTypeName}</p>
                  </div>
                </div>
                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                  resource.isBooked 
                    ? 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300' 
                    : 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300'
                }`}>
                  {resource.isBooked ? 'Booked' : 'Available'}
                </span>
              </div>
              
              {/* Stats */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <FiUsers className="w-4 h-4 mr-2" />
                    Total Bookings
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {resource.totalBookings || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <FiClock className="w-4 h-4 mr-2" />
                    Active Bookings
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {resource.activeBookings || 0}
                  </span>
                </div>
                {resource.lastBookingDate && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <FiClock className="w-4 h-4 mr-2" />
                      Last Booking
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {new Date(resource.lastBookingDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleEditResource(resource)}
                  className="flex-1 flex items-center justify-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FiEdit className="w-4 h-4 mr-2" />
                  Edit
                </button>
                <button 
                  onClick={() => handleViewResource(resource)}
                  className="flex-1 flex items-center justify-center px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <FiEye className="w-4 h-4 mr-2" />
                  View
                </button>
                <button 
                  onClick={() => handleDeleteResource(resource)}
                  className="flex items-center justify-center px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Add Resource Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add New Resource</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleAddResourceSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Resource Name
                </label>
                <input
                  type="text"
                  value={addFormData.name}
                  onChange={(e) => setAddFormData({ ...addFormData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Resource Type
                </label>
                <select
                  value={addFormData.resourceTypeId}
                  onChange={(e) => setAddFormData({ ...addFormData, resourceTypeId: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value={0}>Select Resource Type</option>
                  {resourceTypes?.map((type) => (
                    <option key={type.resourceTypeId} value={type.resourceTypeId}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createResourceMutation.isPending}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {createResourceMutation.isPending ? 'Adding...' : 'Add Resource'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Resource Modal */}
      {showEditModal && selectedResource && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Resource</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleEditResourceSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Resource Name
                </label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Resource Type
                </label>
                <select
                  value={editFormData.resourceTypeId}
                  onChange={(e) => setEditFormData({ ...editFormData, resourceTypeId: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value={0}>Select Resource Type</option>
                  {resourceTypes?.map((type) => (
                    <option key={type.resourceTypeId} value={type.resourceTypeId}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateResourceMutation.isPending}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {updateResourceMutation.isPending ? 'Updating...' : 'Update Resource'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Resource Modal */}
      {showViewModal && selectedResource && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Resource Details</h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Resource Name
                </label>
                <p className="text-gray-900 dark:text-white">{selectedResource.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Resource Type
                </label>
                <p className="text-gray-900 dark:text-white">{selectedResource.resourceTypeName}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                  selectedResource.isBooked 
                    ? 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300' 
                    : 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300'
                }`}>
                  {selectedResource.isBooked ? 'Booked' : 'Available'}
                </span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Total Bookings
                </label>
                <p className="text-gray-900 dark:text-white">{selectedResource.totalBookings || 0}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Active Bookings
                </label>
                <p className="text-gray-900 dark:text-white">{selectedResource.activeBookings || 0}</p>
              </div>
              
              {selectedResource.lastBookingDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Last Booking Date
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {new Date(selectedResource.lastBookingDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex space-x-3 pt-4">
              <button
                onClick={() => setShowViewModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedResource && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Resource</h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Are you sure you want to delete <strong>{selectedResource.name}</strong>? This action cannot be undone.
              </p>
              <p className="text-sm text-red-600 dark:text-red-400">
                Note: Resources with active bookings cannot be deleted.
              </p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteResourceMutation.isPending}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleteResourceMutation.isPending ? 'Deleting...' : 'Delete Resource'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Resources;