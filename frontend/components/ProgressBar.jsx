const ProgressBar = ({ percentage }) => {
  // Determine the color based on the percentage
  let colorClass = 'bg-red-600'; // Default to red
  let roundClass = 'rounded-l';

  if (!isNaN(percentage)) {
    if (percentage >= 1) {
      colorClass = 'bg-green-700';
      roundClass = 'rounded-full';
      percentage=1;
    } else if (percentage >= 0.5) {
      colorClass = 'bg-sky-300'; // Tailwind CSS v3+ includes 'sky' color
    } else if (percentage >= 0.25) {
      colorClass = 'bg-yellow-300';
    } else if(percentage<0){
      percentage=0;
    }
  }

  return (
    <div className=" bg-gray-200 rounded-full h-1.5">
      {!isNaN(percentage) && (
        <div
          className={`${colorClass} h-1.5 ${roundClass}`}
          style={{ width: `${percentage*100}%` }}
        />
      )}
    </div>
  );
};

export default ProgressBar;