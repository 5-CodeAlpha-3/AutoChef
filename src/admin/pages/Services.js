import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import { Icon } from '@iconify/react/dist/iconify.js';
import ServiceFormModal from '../components/ServiceFormModal';

const Services = () => {
  const [services, setServices] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [error, setError] = useState(null);

  const API_URL = 'https://api.example.com/services'; // Replace with your actual API URL

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`Failed to fetch services: ${response.statusText}`);
        }
        const data = await response.json();
        setServices(data); // Set the fetched services data
      } catch (error) {
        setError(error.message); // Handle any errors that occur during fetch
      }
    };

    fetchServices(); // Fetch services when the component mounts
  }, []);

  const saveService = async (newService) => {
    try {
      if (editingService) {
        // Update an existing service
        const response = await fetch(`${API_URL}/${editingService.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newService),
        });
        if (!response.ok) {
          throw new Error(`Failed to update service: ${response.statusText}`);
        }
        const updatedService = await response.json();
        setServices(services.map(service => 
          service.id === editingService.id ? updatedService : service
        ));
      } else {
        // Add a new service
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newService),
        });
        if (!response.ok) {
          throw new Error(`Failed to add service: ${response.statusText}`);
        }
        const addedService = await response.json();
        setServices([...services, addedService]);
      }
      setEditingService(null); // Reset editing state
      setModalOpen(false); // Close the modal after save
    } catch (error) {
      setError(error.message); // Handle any errors during save
    }
  };

  const deleteService = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Failed to delete service: ${response.statusText}`);
      }
      setServices(services.filter(service => service.id !== id)); // Remove the deleted service from state
    } catch (error) {
      setError(error.message); // Handle any errors during deletion
    }
  };

  const openModal = () => {
    setEditingService(null); // Reset editing state for a new service
    setModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setModalOpen(false); // Close the modal without saving
  };

  const handleEdit = (service) => {
    setEditingService(service); // Set the service to be edited
    setModalOpen(true); // Open the modal for editing
  };

  return (
    <div className="flex flex-col min-h-screen mx-4 sm:mx-8 lg:mx-16 mt-4">
      {error && (
        <div className="bg-red-100 flex justify-between text-red-700 p-4 rounded mb-4">
          <p>Error: {error}</p>
          <button onClick={() => setError(null)} className="text-sm underline">
            Dismiss
          </button>
        </div>
      )}
      <PageHeader openModal={openModal} />

      <ServiceFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSaveService={saveService}
        editingService={editingService}
      />

      <div className="overflow-x-auto bg-white py-4 px-4 sm:px-6 lg:px-8">
        <table className="min-w-full bg-white">
          <thead>
            <tr className='text-left border-b'>
              <th className="py-2 px-4 bg-[#F5F6F8] font-semibold rounded-tl-xl">Name</th>
              <th className="py-2 px-4 bg-[#F5F6F8] font-semibold text-center">Description</th>
              <th className="py-2 px-5 bg-[#F5F6F8] font-semibold">Features</th>
              <th className="py-2 px-4 bg-[#F5F6F8] font-semibold rounded-tr-xl text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service, index) => (
              <tr key={index} className='border-b'>
                <td className="py-2 px-4 font-semibold min-w-48">{service.title}</td>
                <td className="py-4 px-4 text-center">{service.description}</td>
                <td className="py-2 px-5">
                  <ul className="list-disc list-inside">
                    {service.points.map((feature, i) => (
                      <li key={i} className='max-w-56 truncate'>{feature.title}</li>
                    ))}
                  </ul>
                </td>
                <td className="py-2 px-4 text-center min-w-36">
                  <button className="text-blue-500 hover:text-blue-600 mr-2" onClick={() => handleEdit(service)}>
                    <Icon icon='tabler:edit' className='h-6 w-6' />
                  </button>
                  <button className="text-red-500 hover:text-red-600" onClick={() => deleteService(service.id)}>
                    <Icon icon='material-symbols:delete-outline' className='h-6 w-6' />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Services;