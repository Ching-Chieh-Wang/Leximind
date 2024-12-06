'use client'
import Button from "@/components/buttons/Button";
import DownloadIcon from "@/components/icons/DownloadIcon";
import ViewIcon from "@/components/icons/ViewIcon";
import WordIcon from "@/components/icons/WordIcon";
import { useCollections } from '@/context/CollectionContext';

const GlobalCollectionCardFooter = ({ index }) => {
  if(index==undefined){console.error("index must provide")}  const{collections}=useCollections();
  const{id,word_cnt,view_cnt, save_cnt}=collections[index];
  return (
    <div className="relative flex justify-between items-center">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-purple-400 to-sky-400 blur-xl overflow-hidden opacity-40 z-0 rounded-lg"></div>

      {/* Last Seen */}
      <div className="inline-flex justify-center items-center text-md text-gray-500  text-center space-x-5">
        <WordIcon/><p>{word_cnt} words</p>
        <ViewIcon/><p>{view_cnt} views</p>
        <DownloadIcon/><p>{save_cnt} saves</p>
      </div>

        <Button className="text-xs sm:text-sm md:text-base">View All</Button>
    </div>
  );
};

export default GlobalCollectionCardFooter;