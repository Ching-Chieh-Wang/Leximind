'use client'
import Button from "@/components/buttons/Button";
import Link from 'next/link';
import Image from 'next/image';
import { useCollections } from '@/context/CollectionsContext';

const GlobalCollectionCardFooter = ({ index }) => {
  if (index == undefined) { console.error("index must provide") } const { collections } = useCollections();
  const {username,user_image}=collections[index];

  return (
    <div className="relative flex justify-between items-center">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-purple-400 to-sky-400 blur-xl overflow-hidden opacity-40 z-0 rounded-lg"></div>

      <Link href="#" className="flex items-center gap-x-4 justify-end p-3">
        <h1 className='text-gray-500'>Created by {username}</h1>
        <Image
            unoptimized
            src={user_image || '/assets/images/logo.jpg'}
            width={40}
            height={40}
            className="w-10 h-10 rounded-full cursor-pointer"
            alt="Profile"
        />
    </Link>

      <Button className="text-xs sm:text-sm md:text-base" href={`/collections/${collections[index].id}`}>View All</Button>
    </div>
  );
};

export default GlobalCollectionCardFooter;