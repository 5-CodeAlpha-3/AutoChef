import React from 'react';
import PropTypes from 'prop-types';
import { useService } from '../context/ServiceContext';
import Button from './BookButton';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react/dist/iconify.js';

// Text animation variants for titles, descriptions, and points
const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } },
};

// ServicesSection Component
const ServicesSection = ({
  id,
  title,
  description,
  points,
  image,
  icon,
  alignRight,
}) => {
  const { setSelectedService } = useService();
  const navigate = useNavigate();

  // Conditionally apply alignment classes
  const containerAlignmentClass = alignRight ? 'ml-auto' : 'mr-auto';

  // Inline style for background image and font family
  const sectionStyle = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.5)), url(${image})`,
    fontFamily: 'Inter',
  };

  return (
    <section
      id={id}
      className="relative flex items-center justify-center bg-black text-white bg-cover bg-center p-3 md:p-10"
      style={sectionStyle}
    >
      <div
        className={`relative z-10 p-8 sm:p-12 md:p-16 lg:w-2/3 xl:w-7/12 rounded-lg ${containerAlignmentClass}`}
      >
        {/* Animated title */}
        <motion.h2
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl pb-4 md:pb-6 lg:pb-8 font-bold mb-4 flex italic items-center"
          variants={textVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {title}
          <Icon
            icon={icon}
            alt="service icon"
            className="ml-2 h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 lg:h-20 lg:w-20"
          />
        </motion.h2>

        {/* Animated description */}
        <motion.p
          className="mb-4 text-base sm:text-lg"
          variants={textVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {description}
        </motion.p>

        {/* List of service points */}
        <ul className="list-disc list-inside mb-8 text-base sm:text-lg">
          {points.map((point, index) => (
            <motion.li
              key={index}
              className="mb-2 md:mb-4"
              variants={textVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <span>{point}</span>
            </motion.li>
          ))}
        </ul>

        {/* Animated button */}
        <motion.div
          className="mb-2 md:mb-4"
          variants={textVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <Button
            styleProp="bg-white hover:bg-red-700 text-red-700 hover:text-white text-base py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            textProp="Book A Service"
            onClick={() => {
              setSelectedService(title);
              navigate('/booking');
            }}
          />
        </motion.div>
      </div>
    </section>
  );
};

// Define prop types for type checking
ServicesSection.propTypes = {
  id: PropTypes.string.isRequired,               // Unique ID for the section
  title: PropTypes.string.isRequired,            // Service title
  description: PropTypes.string.isRequired,      // Service description
  points: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,        // Title of the service point
      text: PropTypes.string.isRequired,         // Description of the service point
    })
  ).isRequired,
  image: PropTypes.string.isRequired,            // Background image URL
  icon: PropTypes.string.isRequired,             // Icon for the service
  alignRight: PropTypes.bool.isRequired,         // Alignment of the container
};

export default ServicesSection;
