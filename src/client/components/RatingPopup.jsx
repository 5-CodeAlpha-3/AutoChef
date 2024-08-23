import React, { useState, useEffect } from 'react';

const RatingPopup = ({ isOpen, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  // Enable or disable the submit button based on rating and comment inputs
  useEffect(() => {
    setIsSubmitDisabled(rating === 0 || comment.trim() === '');
  }, [rating, comment]);

  // Handle star rating change
  const handleRatingChange = (value) => {
    setRating(value);
  };

  // Handle form submission
  const handleSubmit = async () => {
    const payload = { rating, comment };

    try {
      const response = await fetch('https://your-api-endpoint.com/rating', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to submit rating');
      }

      const data = await response.json();
      console.log('Rating submitted successfully:', data);

      onSubmit(payload); // Callback to parent component after successful submission

    } catch (error) {
      console.error('Error submitting rating:', error);
    } finally {
      onClose(); // Close the popup after submission or error
    }
  };

  if (!isOpen) return null; // Do not render the popup if it's not open

  return (
    <div className="fixed bottom-0 right-0 m-4 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-500 p-6 sm:p-8 rounded-lg shadow-lg w-full sm:w-96 max-w-xs sm:max-w-none z-50">
      <h2 className="text-lg sm:text-xl font-semibold text-center text-gray-800 dark:text-white">Rate Our Service</h2>
      
      <div className="flex justify-center mt-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRatingChange(star)}
            className={`text-2xl sm:text-3xl ${star <= rating ? 'text-yellow-400' : 'text-gray-400'}`}
          >
            &#9733;
          </button>
        ))}
      </div>
      
      <textarea
        className="w-full mt-4 p-2 rounded text-gray-700 border border-gray-300 dark:border-stone-500 dark:bg-stone-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-gray-400"
        placeholder="Leave a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <div className="mt-6 flex justify-between">
        <button
          onClick={onClose}
          className="px-3 sm:px-4 py-2 bg-gray-300 dark:bg-stone-600 text-gray-700 dark:text-white rounded hover:bg-stone-400"
        >
          Not Now
        </button>
        <button
          onClick={handleSubmit}
          className={`px-3 sm:px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300 ${isSubmitDisabled ? 'cursor-not-allowed opacity-50' : ''}`}
          disabled={isSubmitDisabled}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default RatingPopup;
