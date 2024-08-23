import React, { useContext, useEffect, useState } from 'react';
import Modal from 'react-modal';
import StatusBadge from '../../admin/components/StatusBadge';
import { BookingContext } from '../context/BookingContext';
import RatingPopup from '../components/RatingPopup'; // Import the RatingPopup component

const BookingHistoryModal = ({ isOpen, onClose, customerId }) => {
  const { bookings, setBookings } = useContext(BookingContext);
  const [isRatingPopupOpen, setIsRatingPopupOpen] = useState(false);
  const [completedBooking, setCompletedBooking] = useState(null); // Track the booking that was completed

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // Fetch data from API
        const response = await fetch(`/api/customers/${customerId}/bookings`);

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);

        // Fallback to hardcoded data if API fails
        const fallbackData = [
          { service: 'Full Body Spray', date: '19th August, 2024', status: 'Pending', invoiceNumber: 'INV001' },
          { service: 'Full Body Spray', date: '19th August, 2024', status: 'Requested', invoiceNumber: 'INV002' },
          { service: 'Full Body Spray', date: '18th August, 2024', status: 'Cancelled', invoiceNumber: 'INV003' },
          { service: 'Full Body Spray', date: '17th August, 2024', status: 'Completed', invoiceNumber: 'INV004' },
          { service: 'Full Body Spray', date: '16th August, 2024', status: 'Pending', invoiceNumber: 'INV005' },
        ];
        setBookings(fallbackData);
      }
    };

    if (isOpen && customerId) {
      fetchBookings();
    }
  }, [isOpen, customerId, setBookings]);

  // Detect when a booking is marked as "Completed"
  useEffect(() => {
    const completed = bookings.find((booking) => booking.status === 'Completed');
    if (completed) {
      setCompletedBooking(completed);
      setIsRatingPopupOpen(true);
    }
  }, [bookings]);

  const handleRatingSubmit = ({ rating, comment }) => {
    console.log('Rating:', rating);
    console.log('Comment:', comment);
    setIsRatingPopupOpen(false);
  };

  const handleCancel = (invoiceNumber) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      updateBookingStatus(invoiceNumber, 'Cancelled');
    }
  };

  const handleDelete = async (invoiceNumber) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        const response = await fetch(`/api/customers/${customerId}/bookings/${invoiceNumber}`, { method: 'DELETE' });

        if (!response.ok) {
          throw new Error('Failed to delete booking');
        }

        setBookings((prevBookings) =>
          prevBookings.filter((booking) => booking.invoiceNumber !== invoiceNumber)
        );
      } catch (error) {
        console.error('Error deleting booking:', error);
        alert('An error occurred while deleting the booking. Please try again.');
      }
    }
  };

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

  const updateBookingStatus = async (invoiceNumber, newStatus) => {
    try {
      const response = await fetch(`/api/customers/${customerId}/bookings/${invoiceNumber}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update booking status');
      }

      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.invoiceNumber === invoiceNumber ? { ...booking, status: newStatus } : booking
        )
      );
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('An error occurred while updating the booking status. Please try again.');
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        contentLabel="Booking History"
        className="relative w-full mx-[2px] max-w-lg max-h-[95%] bg-[#F9FAFC] text-black rounded-xl shadow-md p-5 md:p-7 md:mx-auto outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-5 text-gray-600 text-2xl"
        >
          &times;
        </button>
        <h2 className="text-center text-xl md:text-2xl font-semibold mb-4">Booking History</h2>
        <div className="bg-white w-full border border-[#E8E9ED] rounded-xl p-4">
          <div className="flex justify-between border-b bg-[#F5F6F8] p-3">
            <div>Service</div>
            <div className="hidden md:block">Date</div>
            <div>Status</div>
          </div>
          <div className="px-4 overflow-y-auto max-h-[500px]">
            {bookings.length === 0 ? (
              <div className="text-center p-4 text-gray-600">
                No services booked.
              </div>
            ) : (
              bookings.map((booking, index) => (
                <div key={index} className="border-b">
                  <div className="flex justify-between text-sm md:text-base pt-2 items-center">
                    <div className="block md:flex md:gap-6 p-1 md:p-0">
                      <div className="md:p-1">{booking.service}</div>
                      <div className="text-gray-400 md:text-black md:p-1">{booking.date}</div>
                    </div>
                    <div className="p-1 text-right">
                      <StatusBadge status={booking.status} />
                    </div>
                  </div>
                  <button
                    className={`bg-[rgba(110,119,134,0.2)] text-[#6E7786] p-1 md:p-[6px] my-3 w-full rounded-lg ${
                      booking.status === 'Pending'
                        ? 'cursor-not-allowed'
                        : 'hover:bg-[#d04343] active:bg-[#DE0000] hover:text-white active:text-white'
                    }`}
                    disabled={booking.status === 'Pending'}
                    onClick={() =>
                      booking.status === 'Requested'
                        ? handleCancel(booking.invoiceNumber)
                        : handleDelete(booking.invoiceNumber)
                    }
                  >
                    {booking.status === 'Requested' ? 'Cancel' : 'Delete'}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </Modal>
      {completedBooking && (
        <RatingPopup 
          isOpen={isRatingPopupOpen} 
          onClose={() => setIsRatingPopupOpen(false)} 
          onSubmit={handleRatingSubmit} 
        />
      )}
    </>
  );
};

export default BookingHistoryModal;