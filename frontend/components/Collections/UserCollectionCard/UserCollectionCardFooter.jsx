import Button from "@/components/Buttons/Button";
import HorizontalLayout from "@/components/horizontalLayout";
import { useCollections } from '@/context/CollectionsContext';

const UserCollectionCardFooter = ({index}) => {
  if(index==undefined){console.error("index must provide")}  const { collections } = useCollections();
  const {id}=collections[index];

  return (
    
      <div className="relative ">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-purple-400 to-sky-400 blur-md overflow-hidden opacity-40 z-0 rounded-2xl"></div>

        {/* Buttons */}
        <HorizontalLayout>
          <Button className="text-xs sm:text-sm md:text-base">View All</Button>
          <Button href={`/protected/collections/${id}`} className="text-xs sm:text-sm md:text-base">View Unmemorized</Button>
        </HorizontalLayout>
      </div>
  );
};

export default UserCollectionCardFooter;