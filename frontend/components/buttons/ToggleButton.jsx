const ToggleButton = ({ checked = false, onChange = () => {}, disabled = false }) => {
  return (
    <label
      className={`relative flex items-center ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
    >
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked} // Bind checked state
        onChange={onChange} // Handle state changes
        disabled={disabled}
      />
      <div
        className="peer h-5 w-9 rounded-full bg-gray-400 after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-orange-400 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-200"
      ></div>
    </label>
  );
};

export default ToggleButton;