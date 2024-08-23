import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import Modal from 'react-modal';

const ServiceFormModal = ({ isOpen, onClose, onSaveService, editingService }) => {
  // Initialize service state with default or editingService values
  const [service, setService] = useState({
    title: '',
    description: '',
    features: ['', '', ''], // Assume 3 features initially
  });

  // Update service state when editingService changes
  useEffect(() => {
    if (editingService) {
      setService({
        title: editingService.title,
        description: editingService.description,
        features: editingService.points.map(point => point.title), // Map points to feature titles
      });
    }
  }, [editingService]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle input changes for both service details and features
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('feature')) {
      // Update the corresponding feature based on index
      const index = parseInt(name.replace('feature', '')) - 1;
      setService(prevService => {
        const updatedFeatures = [...prevService.features];
        updatedFeatures[index] = value;
        return { ...prevService, features: updatedFeatures };
      });
    } else {
      setService(prevService => ({ ...prevService, [name]: value }));
    }
  };

  // Handle form submission to save the service
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate that features are unique and not empty
    const nonEmptyFeatures = service.features.filter(f => f.trim() !== '');
    const featureSet = new Set(nonEmptyFeatures);

    if (featureSet.size < nonEmptyFeatures.length) {
      alert("Features must be unique and not empty.");
      return;
    }

    // Prepare service data for saving
    const updatedService = {
      title: service.title,
      description: service.description,
      points: nonEmptyFeatures.map(feature => ({ title: feature })), // Convert features back to points
    };

    // Save the service and close the modal
    onSaveService(updatedService);
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen}
      onRequestClose={onClose}
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 sm:p-0"
      className="bg-white p-4 sm:py-7 sm:px-11 rounded-lg shadow-lg w-full sm:max-w-lg relative"
    >
      <h2 className='text-center text-xl font-semibold mb-4'>
        {editingService ? 'Edit' : 'Add A'} Service
      </h2>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
      >
        <Icon icon='iconamoon:close' className='h-5 w-5' />
      </button>
      <form onSubmit={handleSubmit}>
        <div className='max-h-[480px] overflow-y-auto px-1'>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Name:</label>
            <input
              type="text"
              name="title"
              value={service.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Description:</label>
            <textarea
              name="description"
              value={service.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            ></textarea>
          </div>
          {service.features.map((feature, index) => (
            <div className="mb-3" key={index}>
              <label className="block text-gray-700 mb-2">Feature {index + 1}:</label>
              <input
                type="text"
                name={`feature${index + 1}`}
                value={feature}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
          ))}
        </div>
        <button type="submit" className="bg-red-600 text-white py-2 px-4 rounded-lg w-full">
          {editingService ? 'Update Service' : 'Add Service'}
        </button>
      </form>
    </Modal>
  );
}

export default ServiceFormModal;
