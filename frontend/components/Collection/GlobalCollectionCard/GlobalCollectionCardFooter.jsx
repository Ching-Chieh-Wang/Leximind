// components/CollectionCardFooter.jsx
import { formatDistanceToNow } from 'date-fns';
import Button from "@/components/buttons/Button";

const GlobalCollectionCardFooter = ({ lastViewTime }) => {
  return (
    <div className="relative p-4">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-purple-400 to-sky-400 blur-xl overflow-hidden opacity-40 z-0 rounded-lg"></div>

      {/* Last Seen */}
      <div className="relative z-10 text-sm text-gray-500 mb-4 text-center">
        {lastViewTime && <p>Last viewed: {formatDistanceToNow(new Date(lastViewTime), { addSuffix: true })}</p>}
      </div>

      {/* Buttons */}
      <div className="relative z-10 flex justify-center space-x-2">
        <Button className="text-xs sm:text-sm md:text-base">View All</Button>
        <Button className="text-xs sm:text-sm md:text-base">View Unmemorized</Button>
      </div>
    </div>
  );
};

export default GlobalCollectionCardFooter;