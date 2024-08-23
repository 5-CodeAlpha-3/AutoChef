import { Link } from 'react-router-dom';
import serviceData from '../data/serviceData';
import { Icon } from '@iconify/react/dist/iconify.js';

const ServicesHomeSection = ({ image }) => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">
          We Are Specialists In Following Services
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:p-16">
          {serviceData.map((service) => (
            <Link
              to={`/services#${service.path}`}
              key={service.title}
              className="relative hover:outline outline-red-60 bg-white p-6 rounded-xl border hover:border-none border-gray-300 overflow-hidden  hover:scale-[1.01] md:hover:scale-[1.03] transition duration-300"
            >
              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-2xl font-semibold mb-4 pt-10 text-black">
                  {service.title}
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-end text-[#DE0000]">
                    <span>Book now</span>
                    <Icon
                      icon="flowbite:arrow-right-outline"
                      className="h-4 w-5"
                    />
                  </div>
                  <Icon
                    icon={service.icon}
                    alt="service icon"
                    className="h-20 w-20 text-[#DE0000] "
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesHomeSection;
