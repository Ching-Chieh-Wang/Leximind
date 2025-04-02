const FormOKButton = ({ children, onClick, color }) => {
  const colorClasses = {
    red: 'bg-red-200 hover:bg-red-500 text-red-700',
    green: 'bg-green-200 hover:bg-green-500 text-green-700',
    blue: 'bg-blue-200 hover:bg-blue-500 text-blue-700',
    // Add more colors as needed
  };

  return (
    <button
      type="button"
      className={`  ${
        colorClasses[color] || ' bg-gray-200 hover:bg-gray-500 text-gray-700'
      } flex-grow font-semibold hover:text-white py-1.5 px-2 border hover:border-transparent rounded-lg w-full`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default FormOKButton;