import Link from 'next/link';

const Button = ({ children, href, onClick, type = 'button' }) => {
  const buttonContent = (
    <div className="relative inline-flex group">
      <div className="absolute transition-all opacity-50 -inset-px bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 rounded-full blur-lg group-hover:opacity-100"></div>
      <div className="relative inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-white bg-gray-900 rounded-full">
        <div className="flex items-center gap-2">
          {children}
        </div>
      </div>
    </div>
  );

  // If href is provided, render as a Link (for navigation)
  if (href) {
    return (
      <Link href={href}>
         {buttonContent}
      </Link>
    );
  }

  // Otherwise, render as a button (for onClick handlers)
  return (
    <button type={type} onClick={onClick}>
      {buttonContent}
    </button>
  );
};

export default Button;