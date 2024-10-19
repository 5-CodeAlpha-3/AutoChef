import React, { useContext, useEffect, useState } from 'react';
import Modal from 'react-modal';
import StatusBadge from '../../admin/components/StatusBadge';
import { BookingContext } from '../context/BookingContext';
import RatingPopup from '../components/RatingPopup';

const BookingHistoryModal = ({ isOpen, onClose }) => {
  const { bookings, setBookings } = useContext(BookingContext);
  const [isRatingPopupOpen, setIsRatingPopupOpen] = useState(false);
  const [completedBooking, setCompletedBooking] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      const userId = localStorage.getItem('userId'); // Retrieve userId from local storage

      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/booking/user/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    if (isOpen) {
      fetchBookings();
    }
  }, [isOpen, setBookings]);

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
            <div>Contact</div>
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
                      <div className="md:p-1">{booking.contact}</div>
                      <div className="md:p-1">{booking.service}</div>
                      <div className="text-gray-400 md:text-black md:p-1">{new Date(booking.date).toLocaleDateString()}</div>
                    </div>
                    <div className="p-1 text-right">
                      <StatusBadge status={booking.status} />
                    </div>
                  </div>
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
