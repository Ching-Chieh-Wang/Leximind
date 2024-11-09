// components/Card.jsx

'use client';

const Card = ({ children, fullWidth = false, maxWidth = 'sm:max-w-md' }) => {
  return (
    <section className="flex flex-col items-center mx-4 sm:mx-10 md:mx-20 my-6">
      <div
        className={`w-full bg-white rounded-lg shadow border border-gray-300 ${
          fullWidth ? 'max-w-full' : maxWidth
        }`}
      >
        <div className="p-5 space-y-6">{children}</div>
      </div>
    </section>
  );
};

export default Card;