const SwitcherButton = ({ onBody, offBody, checked, onChange }) => {
  return (
    <div data-keep-open="true" className=" select-none flex-shrink-0 ">
      <div className="inline-block">
        {/* Checkbox */}
        <input
          id="toggle"
          type="checkbox"
          className="hidden"
          checked={checked}
          onChange={onChange}
        />
        {/* Label */}
        <label
          htmlFor="toggle" 
          className="relative grid grid-cols-2 w-fit border-2 border-[#343434] rounded-full bg-[#343434] font-bold text-[#343434] cursor-pointer gap-x-2 px-1 text-xs md:text-md "
        >
          {/* Off state */}
          <div
            className={`p-1 text-center z-10 transition-colors duration-300 ${
              checked ? 'text-white' : 'text-black'
            }`}
          >
            {offBody}
          </div>
          {/* On state */}
          <div
            className={`p-1 text-center z-10 transition-colors duration-300 ${
              checked ? 'text-black' : 'text-white'
            }`}
          >
            {onBody}
          </div>
          {/* Sliding toggle */}
          <span
            className={`absolute w-1/2 h-full rounded-full bg-white transition-all duration-300 ${
              checked ? 'left-1/2' : 'left-0'
            }`}
          />
        </label>
      </div>
    </div>
  );
};

export default SwitcherButton;