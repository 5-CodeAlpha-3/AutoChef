import React from 'react';
import BookedServiceRow from './BookedServiceRow';
import { useLocation } from 'react-router-dom';

const BookedServicesTable = ({ bookedServices, onSelectService }) => {
  const location = useLocation();
  const isBookedServices = location.pathname === '/admin/booked-services';

  // Render the table rows using the BookedServiceRow component
  const renderTableRows = () =>
    bookedServices.map((service) => (
      <BookedServiceRow 
        key={service.id} 
        service={service} 
        onSelectService={onSelectService} // Pass onSelectService to handle row selection
      />
    ));

  return (
    <div className="bg-white pt-4">
      <table className="min-w-full bg-white table-auto">
        <thead>
          <tr>
            {/* Customer Name column */}
            <th className={`bg-[#F5F6F8] ${!isBookedServices && 'rounded-tl-none text-center md:pr-2'} py-2 px-2 md:px-4 font-semibold text-left rounded-tl-xl xl:rounded-tl-none`}>
              Customer Name
            </th>

            {/* Service column - hidden on smaller screens if not booked services page */}
            <th className={`hidden ${!isBookedServices && 'sm:table-cell text-center'} md:table-cell bg-[#F5F6F8] py-2 px-2 md:px-4 font-semibold text-left`}>
              Service
            </th>

            {/* Date column - hidden on smaller screens if not booked services page */}
            <th className={`hidden ${!isBookedServices && 'sm:table-cell text-center'} sm:table-cell bg-[#F5F6F8] py-2 px-2 md:px-4 font-semibold text-left`}>
              Date
            </th>

            {/* Status column */}
            <th className="bg-[#F5F6F8] py-2 px-2 md:px-4 font-semibold md:text-center">
              Status
            </th>

            {/* Conditionally render the Actions column */}
            {isBookedServices && (
              <th className="bg-[#F5F6F8] py-2 px-2 md:px-4 font-semibold text-center rounded-tr-xl">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>{renderTableRows()}</tbody>
      </table>
    </div>
  );
};

export default BookedServicesTable;
