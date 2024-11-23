import Button from "@/components/buttons/Button";
import { useCollections } from '@/context/CollectionContext';

const UserCollectionCardFooter = ({index}) => {
  const { collections } = useCollections();
  const {id}=collections[index];

  return (
    
      <div className="relative ">
        {/* Gradient Background */}
        <div className="absolute inset-0   h-12 bg-gradient-to-r from-indigo-400 via-purple-400 to-sky-400 blur-md overflow-hidden opacity-40 z-0 rounded-2xl"></div>

        {/* Buttons */}
        <div className="relative z-10 flex justify-center space-x-2">
          <Button className="text-xs sm:text-sm md:text-base">View All</Button>
          <Button className="text-xs sm:text-sm md:text-base">View Unmemorized</Button>
        </div>
      </div>
  );
};

export default UserCollectionCardFooter;