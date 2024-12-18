import React, { useEffect, useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import FilterSection from '../components/FilterSection';
import StatisticsSection from '../components/StatisticsSection';
import HeaderSection from '../components/HeaderSection';
import PageHeader from '../components/PageHeader';
import Pagination from '../../client/components/Pagination';
import BookedServicesTable from '../components/BookedServicesTable';
import ServiceDetailsModal from '../components/ServiceDetailsModal';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const BookedServices = () => {
  const location = useLocation();
  const filterStatus = location.state?.filterStatus || ''; // Retrieve initial filter status from navigation state

  const [bookedServices, setBookedServices] = useState([]); // Empty array for booked services data
  const [currentPage, setCurrentPage] = useState(1); // Current page in pagination
  const [itemsPerPage, setItemsPerPage] = useState(5); // Items per page based on screen size
  const [filters, setFilters] = useState({
    customerName: '',
    status: filterStatus, // Initialize with filterStatus from navigation
    service: '',
    date: ''
  });
  const [selectedService, setSelectedService] = useState(null); // For service details modal

  // Fetch booked services data from the server
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/booking`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setBookedServices(data);
      } catch (error) {
        console.error('Error fetching booked services:', error);
      }
    };

    fetchBookings();
  }, []);

  // Adjust items per page based on window size
  useEffect(() => {
    const updateItemsPerPage = () => {
      const width = window.innerWidth;
      if (width >= 3840) setItemsPerPage(15);
      else if (width >= 3160) setItemsPerPage(12);
      else if (width >= 2560) setItemsPerPage(10);
      else if (width >= 2000) setItemsPerPage(7);
      else if (width >= 1536) setItemsPerPage(6);
      else setItemsPerPage(5);
    };

    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  // Memoize the filtered services to avoid unnecessary recalculations
  const filteredServices = useMemo(() => {
    return bookedServices.filter((service) => {
      const { customerName, status, service, date } = filters;
      return (
        (!customerName || service.customerName.toLowerCase().includes(customerName.toLowerCase())) &&
        (!status || service.status === status) &&
        (!service || service.service.includes(service)) &&
        (!date || service.date === date)
      );
    });
  }, [filters, bookedServices]);

  // Handle page changes in pagination
  const handlePageChange = (page) => {
    if (page > 0 && page <= Math.ceil(filteredServices.length / itemsPerPage)) {
      setCurrentPage(page);
    }
  };

  // Calculate paginated services
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedServices = useMemo(() => {
    return filteredServices.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredServices, startIndex, itemsPerPage]);
  
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);

  // Handle export to PDF or Excel
  const handleExport = (format) => {
    if (format === 'pdf') {
      const doc = new jsPDF();
      doc.text('Booked Services', 20, 10);
      doc.autoTable({
        head: [['Customer', 'Service', 'Date', 'Status']],
        body: filteredServices.map(service => [
          service.customerName,
          service.service,
          service.date,
          service.status,
        ]),
      });
      doc.save('booked_services.pdf');
    } else if (format === 'excel') {
      const worksheet = XLSX.utils.json_to_sheet(
        filteredServices.map(service => ({
          Customer: service.customerName,
          Service: service.service,
          Date: service.date,
          Status: service.status,
        }))
      );
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Booked Services');
      XLSX.writeFile(workbook, 'booked_services.xlsx');
    }
  };

  // Update filters when they change
  const handleFilterChange = (name, value) => {
    setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
    setCurrentPage(1); // Reset to the first page when filters change
  };

  // Handle selection of a service to view details
  const handleSelectService = (service) => {
    setSelectedService(service);
  };

  // Close the service details modal
  const handleCloseModal = () => {
    setSelectedService(null);
  };

  // Add keypress event for pagination navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowRight') {
        handlePageChange(currentPage + 1);
      } else if (event.key === 'ArrowLeft') {
        handlePageChange(currentPage - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage]);

  return (
    <div className="flex flex-col min-h-screen mx-4 sm:mx-8 lg:mx-16 mt-4">
      <div className="flex-grow">
        <PageHeader onSearch={query => handleFilterChange('customerName', query)} />
        <StatisticsSection onFilter={status => handleFilterChange('status', status)} />
        <div className="bg-white py-4 px-4 sm:px-6 lg:px-8">
          <FilterSection onFilterChange={handleFilterChange} />
          <HeaderSection onExport={handleExport} />
          <BookedServicesTable 
            bookedServices={paginatedServices}
            onSelectService={handleSelectService}
          />
        </div>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      <ServiceDetailsModal 
        service={selectedService}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default BookedServices;
