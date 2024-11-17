const ProgressBar = ({ percentage }) => {
  // Determine the color based on the percentage
  let colorClass = 'bg-red-600'; // Default to red
  let roundClass = 'rounded-l';

  if (!isNaN(percentage)) {
    if (percentage >= 100) {
      colorClass = 'bg-green-700';
      roundClass = 'rounded-full';
    } else if (percentage >= 50) {
      colorClass = 'bg-sky-300'; // Tailwind CSS v3+ includes 'sky' color
    } else if (percentage >= 25) {
      colorClass = 'bg-yellow-300';
    }
  }

  return (
    <div className="w-full bg-gray-200 rounded-full h-1.5">
      {!isNaN(percentage) && (
        <div
          className={`${colorClass} h-1.5 ${roundClass}`}
          style={{ width: `${percentage}%` }}
        />
      )}
    </div>
  );
};

export default ProgressBar;