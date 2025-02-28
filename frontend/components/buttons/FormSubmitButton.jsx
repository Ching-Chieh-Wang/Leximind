import Horizontal_Layout from "../Horizontal_Layout";
import LoadingIcon from "../icons/LoadingIcon";

export default function FormSubmitButton({  isLoading, loadingText = 'Loading...', children }) {
  return (
    <button
      type="submit"
      className={`flex-grow w-full text-white bg-teal-600 py-1.5 px-2  rounded-lg font-bold ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
      disabled={isLoading} // Also disables button in loading state
    >
      {isLoading ? (
        <Horizontal_Layout>
          <LoadingIcon/>
          {loadingText}
        </Horizontal_Layout>
      ) : (
        children
      )}
    </button>
  );
}