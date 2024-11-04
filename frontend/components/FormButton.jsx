// components/FormButton.js
export default function FormButton({ href, isLoading, loadingText = 'Loading...', children }) {
    return (
        <button
            href={isLoading ? '#' : href} // Prevents navigation if loading
              type="submit"
              className="text-white bg-teal-600  py-1.5 px-4 rounded font-bold w-full"
            >
              {isLoading ? loadingText : children}
        </button>
    );
  }