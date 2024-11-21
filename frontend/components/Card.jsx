const Card = ({ children, type, title = null }) => {
  // Define CSS classes for different types
  const cardStyles = {
    page: 'w-full my-6 py-6 px-2 sm:px-4 lg:px-6 ', // Full width for pages
    form: 'w-full my-6 space-y-4 sm:w-3/5 md:w-5/12 py-6 px-3 sm:px-6 ',   // Centered smaller width for forms
    card: 'w-full sm:max-w-md  p-3',    // Compact card layout
  };

  return (
    <div className="flex justify-center ">
      <section
        className={` space-y-2 rounded-lg shadow border border-gray-300 bg-gray-50 ${cardStyles[type]||''}`}
      >
        {title && (
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-semibold">{title}</h1>
          </div>
        )}
        {children}
      </section>
    </div>
  );
};

export default Card;