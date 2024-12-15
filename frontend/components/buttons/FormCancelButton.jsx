// components/FormButton.js
export default function FormCancelButton({ children , onClick}) {
  return (
    <button type="button" className=" bg-gray-200 hover:bg-gray-500 text-gray-700 font-semibold hover:text-white py-2 px-2 sm:px-4 border  hover:border-transparent rounded-lg w-full  " onClick={onClick}>
      {children}
    </button>
  );
}