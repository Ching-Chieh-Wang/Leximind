import Link from 'next/link';

const DropdownItem = ({ children, href, icon, label, onClick }) => {
  // Define common classes for both Link and button
const commonClasses = `
    flex items-center text-sm font-medium text-gray-600
    rounded-md ${href||onClick? ' hover:bg-gray-100 cursor-pointer':''} px-3 h-9 gap-x-2 w-full whitespace-nowrap
  `;

  if (href) {
    // Render as a navigational Link with appropriate styles
    return (
      <Link href={href} passHref>
        <li className={commonClasses}>
          {children}
          {icon}
          <span>{label}</span>
        </li>
      </Link>
    );
  } else {
    // Render as a button with appropriate styles
    return (
      <li onClick={onClick} className={commonClasses}>
        {children}
        {icon}
        <span>{label}</span>
      </li>
    );
  }
};

export default DropdownItem;