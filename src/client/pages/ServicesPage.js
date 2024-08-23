import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ServicesSection from '../components/ServiceSection';

const ServicesPage = () => {
  // State for storing services data, loading status, and error messages
  const [services, setServices] = useState(() => {
    const cachedServices = localStorage.getItem('services');
    return cachedServices ? JSON.parse(cachedServices) : [];
  });
  const [loading, setLoading] = useState(!services.length); // Show loading if no cached data
  const [error, setError] = useState(null);
  const location = useLocation(); // Hook to get the current location

  useEffect(() => {
    // Function to fetch services data with retry logic
    const fetchServices = async (retryCount = 3) => {
      try {
        const response = await fetch('https://api.example.com/services'); // Replace with your API URL
        if (!response.ok) {
          throw new Error(`Failed to fetch services: ${response.statusText}`);
        }
        const data = await response.json();
        setServices(data);
        localStorage.setItem('services', JSON.stringify(data)); // Cache data in localStorage
      } catch (error) {
        if (retryCount > 0) {
          console.warn(`Retrying fetch services, attempts left: ${retryCount}`);
          fetchServices(retryCount - 1); // Retry the fetch request
        } else {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    // Fetch services if no cached data exists
    if (!services.length) {
      fetchServices();
    }
  }, [services.length]);

  useEffect(() => {
    // Scroll to the section if a hash is present in the URL
    const hash = location.hash.substring(1);
    if (hash) {
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  if (loading) {
    return <div>Loading services...</div>;
  }

  if (error) {
    return (
      <div className="text-center pt-5">
        <p>Error loading services: {error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-center p-2 sm:p-4 md:p-6 lg:p-8 font-semibold items-center">
        Our Services
      </h2>
      {services.map((section, index) => (
        <ServicesSection
          key={index}
          id={section.path} // Use path as section ID for scroll linking
          title={section.title} // Service title
          description={section.description} // Service description
          points={section.points} // List of merged points (title + text)
          image={section.image} // Background image for the section
          icon={section.icon} // Icon representing the service
          alignRight={index % 2 === 0} // Alternating alignment
        />
      ))}
    </div>
  );
};

export default ServicesPage;