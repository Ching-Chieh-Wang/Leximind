// components/FormButton.js
export default function FormCancelButton({ children , onClick}) {
  return (
    <button type="button" className="flex-grow bg-gray-200 hover:bg-gray-500 text-gray-700  hover:text-white py-1.5  px-2  rounded-lg font-bold  hover:border-transparent  " onClick={onClick}>
      {children}
    </button>
  );
}