import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import ServiceDropdown from '../components/ServiceDropdown';

const BookingForm = ({ isloggedIn }) => {
  // State to manage modal visibility and booking confirmation status
  const [modalState, setModalState] = useState({
    isOpen: false,
    isBookingConfirmed: false,
  });

  // State to manage the form data
  const [formData, setFormData] = useState({
    fullName: '',
    contactNumber: '',
    service: '',
    serviceInfo: '',
  });

  // Disable background scrolling when any modal is open
  useEffect(() => {
    const isModalOpen = modalState.isOpen || modalState.isBookingConfirmed;
    document.body.style.overflow = isModalOpen ? 'hidden' : '';

    // Cleanup on component unmount or when modals close
    return () => {
      document.body.style.overflow = '';
    };
  }, [modalState.isOpen, modalState.isBookingConfirmed]);

  // Handler for form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // Validate contact number format
  const isContactNumberValid = (contactNumber) => {
    const phoneRegex = /^[0-9()+\- ]+$/;
    const numericContactNumber = contactNumber.replace(/[^0-9]/g, '');
    return (
      phoneRegex.test(contactNumber) &&
      numericContactNumber.length >= 10 &&
      numericContactNumber.length <= 15
    );
  };

  // Check if the form is valid
  const isFormValid = () => {
    return (
      formData.fullName.trim() !== '' &&
      isContactNumberValid(formData.contactNumber) &&
      formData.service.trim() !== '' &&
      formData.serviceInfo.trim() !== ''
    );
  };

  // Open the confirmation modal
  const handleOpenModal = (e) => {
    e.preventDefault();
    if (isFormValid()) {
      setModalState({ ...modalState, isOpen: true });
    }
  };

  // const [serviceIds, setServiceIds] = useState([]);
  // const [selectedServiceId, setSelectedServiceId] = useState('');

  // Fetch service IDs and set them in state
  // useEffect(() => {
  //   const fetchServiceIds = async () => {
  //     try {
  //       const response = await fetch('http://localhost:8080/api/services');
  //       if (!response.ok) {
  //         throw new Error('Network response was not ok');
  //       }
  //       const services = await response.json();
  //       setServiceIds(services.map(service => service._id));
  //       // setSelectedServiceId(services.filter(service => service.name === formData.service)._id);
  //       // console.log(selectedServiceId);
  //     } catch (error) {
  //       console.error('Error fetching service IDs:', error);
  //     }
  //   };

  //   fetchServiceIds();
  // });

  // Confirm booking and close the first modal
  const handleConfirmBooking = async (event) => {
    setModalState({ isOpen: false, isBookingConfirmed: true });
    event.preventDefault();

    //const url = 'http://localhost:8080/api/booking';

    // const url = "https://autochef-backend.onrender.com";

    const url =`${process.env.REACT_APP_BACKEND_URL}/api/booking` //template literal

    const payload = {
      customerName: formData.fullName,
      contact: formData.contactNumber,
      service: formData.service,
      vehicleInfo: formData.serviceInfo,
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Parse the error response
        console.error('Response status:', response.status);
        console.error('Response status text:', response.statusText);
        console.error('Error details:', errorData);
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      console.log('Success:', data); 
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while processing your request. Please try again later.');
    }
  };

  // Close the first modal
  const handleCloseModal = () => {
    setModalState({ ...modalState, isOpen: false });
  };

  // Close the booking confirmation modal
  const handleCloseConfirmationModal = () => {
    setModalState({ ...modalState, isBookingConfirmed: false });
  };

  // Reusable component to render input fields
  const renderInputField = (label, type, name, placeholder) => (
    <div className="flex-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleInputChange}
        className="mt-1 block w-full border border-gray-300 p-3 rounded-md shadow-sm focus:outline focus:ring-green-500 sm:text-sm"
        placeholder={placeholder}
        required
      />
    </div>
  );

  // Reusable component to render modals
  const renderModal = (isOpen, onRequestClose, title, content, actions) => (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel={title}
      className="bg-white p-8 mx-3 rounded-lg shadow-lg max-w-md md:mx-auto mt-20"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-20 flex justify-center items-center"
    >
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <p className="mb-5">{content}</p>
      <div className="flex justify-end space-x-4">{actions}</div>
    </Modal>
  );

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-4">AutoService</h1>
      <form className="space-y-4">
        {renderInputField('Full Name', 'text', 'fullName', 'Your Name')}
        {renderInputField('Contact Number', 'tel', 'contactNumber', 'Contact Number')}

        <div className="flex-1">
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="service">
            Service
          </label>
          <ServiceDropdown 
            formData={formData} 
            handleInputChange={handleInputChange} 
          />
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How can we help?
          </label>
          <textarea
            className="appearance-none border rounded-lg w-full p-3 border-gray-300 text-gray-700 leading-tight focus:outline focus:shadow-outline"
            name="serviceInfo"
            value={formData.serviceInfo}
            onChange={handleInputChange}
            placeholder="Tell us a little about the request..."
            rows="4"
            required
          ></textarea>
        </div>

        <button
          onClick={handleOpenModal}
          className={`${
            isFormValid()
              ? 'hover:bg-red-600 text-red-700 bg-white hover:text-white border-red-300'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed border-gray-300'
          } border px-5 py-2 rounded-lg w-full`}
          disabled={!isFormValid()}
        >
          Confirm Booking
        </button>
      </form>

      {/* Modal to confirm booking */}
      {renderModal(
        modalState.isOpen,
        handleCloseModal,
        'Confirm Your Booking',
        'Are you sure you want to confirm the booking?',
        <>
          <button
            onClick={handleConfirmBooking}
            className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
          >
            Yes, Confirm
          </button>
          <button
            onClick={handleCloseModal}
            className="bg-gray-300 py-2 px-4 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
        </>
      )}

      {/* Modal to display booking confirmation */}
      {renderModal(
        modalState.isBookingConfirmed,
        handleCloseConfirmationModal,
        'Booking Confirmed',
        'Your booking has been successfully confirmed. Thank you!',
        <button
          onClick={handleCloseConfirmationModal}
          className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
        >
          Close
        </button>
      )}
    </div>
  );
};

export default BookingForm;
