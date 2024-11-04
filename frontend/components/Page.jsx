'use client';

const Page = ({ children }) => {
  return (
    <section className="flex flex-col items-center justify-center px-6 py-4">
    <div className="w-full bg-white rounded-lg shadow sm:max-w-md">
      <div className="p-6 space-y-6">
        {children}
      </div>
    </div>
    </section>
  );
};

export default Page;