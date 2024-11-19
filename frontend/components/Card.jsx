'use client';

const Card = ({ children, fullWidth = false, maxWidth = 'sm:max-w-md', title = null }) => {
  return (
    <section
      className={`my-6 space-y-4 mx-auto bg-white rounded-lg shadow border border-gray-300 ${
        fullWidth ? 'max-w-full' : maxWidth
      } py-4 px-2 sm:px-4`}
    >
      {title && (
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">{title}</h1>
        </div>
      )}
      {children}
    </section>
  );
};

export default Card;