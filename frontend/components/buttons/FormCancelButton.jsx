// components/FormButton.js
export default function FormCancelButton({ children , onclick}) {
  return (
    <button type="button" className="bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded w-full  " onClick={onclick}>
      {children}
    </button>
  );
}