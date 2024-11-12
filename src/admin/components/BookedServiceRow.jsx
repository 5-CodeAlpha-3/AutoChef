import React, { useState, useMemo, useEffect, useRef, useContext } from 'react';
import StatusBadge from './StatusBadge';
import { Icon } from '@iconify/react';
import { useLocation } from 'react-router-dom';
import { BookingContext } from '../../client/context/BookingContext';

const BookedServiceRow = ({ service, onSelectService }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { updateBookingStatus } = useContext(BookingContext);

  const location = useLocation();
  const isBookedServices = location.pathname === '/admin/booked-services';

  // Toggles the dropdown visibility
  const toggleDropdown = (event) => {
    event.stopPropagation(); // Prevent triggering other click events
    setIsDropdownOpen(prevState => !prevState);
  };

  // Handles action click inside the dropdown
  const handleActionClick = (event, action) => {
    event.stopPropagation(); // Prevent triggering other click events
    updateBookingStatus(service.id, action); // Use `service.id` or another unique identifier instead of `invoiceNumber`
    setIsDropdownOpen(false);
  };

  // Closes dropdown if clicked outside
  const closeDropdownOnClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  // Attaches event listener to handle clicks outside the dropdown
  useEffect(() => {
    document.addEventListener('mousedown', closeDropdownOnClickOutside);
    return () => {
      document.removeEventListener('mousedown', closeDropdownOnClickOutside);
    };
  }, []);

  // Memoizes available actions based on the current status
  const actions = useMemo(() => {
    switch (service.status.toLowerCase()) {
      case 'requested':
        return [{ label: 'Accept', action: 'Pending' }];
      case 'pending':
        return [
          { label: 'Cancel', action: 'Cancelled' },
          { label: 'Complete', action: 'Completed' },
        ];
      default:
        return [];
    }
  }, [service.status]);

  return (
    <tr 
      className="border-t hover:bg-gray-50 relative"
      onClick={() => isBookedServices && onSelectService(service)} // Trigger service selection on row click
    >
      {/* Customer Name Column */}
      <td className={`flex flex-col ${!isBookedServices ? 'sm:table-cell text-center' : ''} md:table-cell py-2 px-2 md:px-4 text-sm md:text-base text-gray-700 whitespace-nowrap`}>
        <span>{service.customerName}</span>
        {/* Display service name below customer name on smaller screens */}
        <span className="text-gray-400 sm:hidden mt-1">{service.serviceName}</span>
      </td>

      {/* Service Name Column */}
      <td className={`hidden ${!isBookedServices ? 'sm:table-cell text-center' : ''} md:table-cell py-2 px-2 md:px-4 text-sm md:text-base text-gray-700`}>
        {service.serviceName}
      </td>

      {/* Date Column */}
      <td className={`hidden ${!isBookedServices ? 'sm:table-cell text-center' : ''} sm:table-cell py-2 px-2 md:px-4 text-[#6E7786] whitespace-nowrap`}>
        {service.date}
      </td>

      {/* Status Column */}
      <td className="py-2 px-2 md:px-4 ml">
        <StatusBadge status={service.status} />
      </td>

      {/* Actions Column - Visible only on the booked services page */}
      {isBookedServices && (
        <td className="py-2 px-2 md:px-4 text-center relative" ref={dropdownRef}>
          {/* Show dropdown if actions are available */}
          {actions.length > 0 ? (
            <>
              <button className="inline-flex items-center justify-center focus:outline-none" onClick={toggleDropdown}>
                <Icon icon="solar:menu-dots-bold" className="w-5 h-5" />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 -mt-1 w-40 bg-white border border-gray-200 rounded shadow-lg z-10">
                  <ul className="py-1">
                    {actions.map(({ label, action }) => (
                      <li key={action}>
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={(e) => handleActionClick(e, action)}
                        >
                          {label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <div className="inline-flex items-center justify-center text-gray-400 cursor-not-allowed">
              <Icon icon="solar:menu-dots-bold" className="w-5 h-5" />
            </div>
          )}
        </td>
      )}
    </tr>
  );
};

export default BookedServiceRow;
