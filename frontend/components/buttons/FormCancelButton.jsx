// components/FormButton.js
export default function FormCancelButton({ children , onclick}) {
  return (
    <button type="button" className="text-white bg-red-600 py-1.5 px-4 rounded font-bold w-full  " onClick={onclick}>
      {children}
    </button>
  );
}