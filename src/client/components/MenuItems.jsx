import { NavLink } from "react-router-dom";
import menuItems from "../data/menuItems";

// MenuItems component to render navigation links
const MenuItems = ({ isHeader = false, className = "" , setIsOpen }) => {
  const handleMenuItemClick = () => {
    if (isHeader) {
      setIsOpen(false);  // Close the menu
    }
  };

  return (
    <ul className={className}>
      {menuItems.map((item, index) => (
        <li key={index} className={isHeader ? "mb-0" : "mb-1"}>
          <NavLink
            to={item.path}
            className={({ isActive }) => 
              `hover:text-[#DE0000]  ${isHeader ? 'block w-fit py-2 md:py-3 lg:py-4 px-4 md:px-0' : '' } transition-colors duration-300 ${(isHeader && isActive) ? 'text-[#DE0000] font-bold' : ''}`
            }
            onClick={handleMenuItemClick}
          >
            {item.label}
          </NavLink>
        </li>
      ))}
    </ul>
  );
};

export default MenuItems;
