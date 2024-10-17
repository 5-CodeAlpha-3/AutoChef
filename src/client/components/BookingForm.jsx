import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import ServiceDropdown from '../components/ServiceDropdown';

const BookingForm = ({ isloggedIn }) => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    isBookingConfirmed: false,
  });

  const [formData, setFormData] = useState({
    fullName: '',
    contactNumber: '',
    service: '',
    serviceInfo: '',
  });

  useEffect(() => {
    const isModalOpen = modalState.isOpen || modalState.isBookingConfirmed;
    document.body.style.overflow = isModalOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [modalState.isOpen, modalState.isBookingConfirmed]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`${name}: ${value}`);  // Debug log to check form data
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const isContactNumberValid = (contactNumber) => {
    const phoneRegex = /^[0-9()+\- ]+$/;
    const numericContactNumber = contactNumber.replace(/[^0-9]/g, '');
    return (
      phoneRegex.test(contactNumber) &&
      numericContactNumber.length >= 10 &&
      numericContactNumber.length <= 15
    );
  };

  const isFormValid = () => {
    return (
      formData.fullName.trim() !== '' &&  // Ensure fullName is not empty
      isContactNumberValid(formData.contactNumber) &&
      formData.service.trim() !== '' &&
      formData.serviceInfo.trim() !== ''
    );
  };

  const handleOpenModal = (e) => {
    e.preventDefault();
    if (isFormValid()) {
      setModalState({ ...modalState, isOpen: true });
    }
  };

  const handleConfirmBooking = async (event) => {
    event.preventDefault();

    const url = `${process.env.REACT_APP_BACKEND_URL}/api/booking`;

    const payload = {
      customerName: formData.fullName,  // Ensure fullName is sent correctly
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
        const errorData = await response.json();
        console.error('Response status:', response.status);
        console.error('Response status text:', response.statusText);
        console.error('Error details:', errorData);
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Success:', data);

      // Reset form data to initial state after booking confirmation
      setFormData({
        fullName: '',
        contactNumber: '',
        service: '',
        serviceInfo: '',
      });

      setModalState({ isOpen: false, isBookingConfirmed: true });

    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while processing your request. Please try again later.');
    }
  };

  const handleCloseModal = () => {
    setModalState({ ...modalState, isOpen: false });
  };

  const handleCloseConfirmationModal = () => {
    setModalState({ ...modalState, isBookingConfirmed: false });
  };

  const renderInputField = (label, type, fullname, placeholder) => (
    <div className="flex-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        name={fullname}  // Ensure field is named correctly for formData binding
        value={formData[fullname]}  // Binds to formData fullName
        onChange={handleInputChange}
        className="mt-1 block w-full border border-gray-300 p-3 rounded-md shadow-sm focus:outline focus:ring-green-500 sm:text-sm"
        placeholder={placeholder}
        required
      />
    </div>
  );

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
          className={`${isFormValid()
              ? 'hover:bg-red-600 text-red-700 bg-white hover:text-white border-red-300'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed border-gray-300'
            } border px-5 py-2 rounded-lg w-full`}
          disabled={!isFormValid()}
        >
          Confirm Booking
        </button>
      </form>

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
