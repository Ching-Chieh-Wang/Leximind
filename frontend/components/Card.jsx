import VerticalLayout from "./VerticalLayout";

const Card = ({ children, type, title = null, extraStyle=""}) => {
  // Define CSS classes for different types
  const cardStyles = {
    page: 'flex-grow  my-10 py-6 px-3 sm:px-4 lg:px-10 space-y-6 box-border', // Full width for pages
    form: 'w-full my-6 space-y-4 max-w-md py-6 px-3 sm:px-6 box-border', // Centered smaller width for forms
    card: 'flex-grow  h-full p-4 md:p-6 space-y-4 box-border overflow-auto', // Compact layout
  };

  return (
    <div
      className={`flex w-full h-full ${extraStyle} ${
        type === 'form' ? 'justify-center items-center' : ''
      }`}
    >
      <section
        className={`rounded-lg shadow border border-gray-300 bg-gray-50 ${cardStyles[type] || ''}`}
      >
        <VerticalLayout>
        {title && (
          <div className={`flex justify-between items-center ${type === 'card' ? '' : 'mb-4'}`}>
            <h1 className="text-xl md:text-2xl font-semibold">{title}</h1>
          </div>
        )}
        {children}
        </VerticalLayout>
      </section>
    </div>
  );
};

export default Card;