const Card = ({ children, type, title = null }) => {
  // Define CSS classes for different types
  const cardStyles = {
    page: 'w-full my-10 py-6 px-3 sm:px-4 lg:px-10 space-y-6 ', // Full width for pages
    form: 'w-full my-6 space-y-4  max-w-md  py-6 px-3 sm:px-6',   // Centered smaller width for forms
    card: 'w-full  p-4 md:p-6 space-y-4',    // Compact card layout
  };

  return (
    <div className={`flex justify-center ${type=='page'?'px-2 sm:px-4 lg:px-10':''}`} >
      <section
        className={` flex flex-col rounded-lg shadow border border-gray-300 bg-gray-50 ${cardStyles[type]||''}`}
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