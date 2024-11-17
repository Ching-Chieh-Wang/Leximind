// components/Card.jsx

'use client';

const Card = ({ children, fullWidth = false, maxWidth = 'sm:max-w-md', title = null }) => {
  return (
    <section className="flex flex-col items-center mx-2 sm:mx-10 md:mx-20 my-6">
      <div
        className={`w-full bg-white rounded-lg shadow border border-gray-300 ${fullWidth ? 'max-w-full' : maxWidth
          }`}
      >

        <div className=" py-4 px-2 sm:px-5 md:px-10 space-y-4 ">
          {/* Header */}
          {title && <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-semibold">{title}</h1>
          </div>}
          {children}
        </div>
      </div>
    </section>
  );
};

export default Card;