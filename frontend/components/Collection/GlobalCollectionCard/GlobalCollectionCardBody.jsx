'use client'
import React from 'react'
import UserCollectionCardBody from '../UserCollectionCard/UserCollectionCardBody'
import { useCollections } from '@/context/CollectionContext'
import Link from 'next/link';
import Image from 'next/image';

const GlobalCollectionCardBody = ({index}) => {
    if(index==undefined){console.error("index must provide")}    
    const {collections}=useCollections();
    const {username,user_image,user_id}=collections[index];
  return (
    <>

    <UserCollectionCardBody index={index}/>
    <Link href="#" className="flex items-center gap-x-4 justify-end p-3">
        <h1>Created by {username}</h1>
        <Image
            src={user_image || '/assets/images/logo.jpg'}
            width={40}
            height={40}
            className="w-10 h-10 rounded-full cursor-pointer"
            alt="Profile"
        />
    </Link>
    </>
  )
}

export default GlobalCollectionCardBody