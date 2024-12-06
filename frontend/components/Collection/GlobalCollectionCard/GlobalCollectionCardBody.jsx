'use client'
import React from 'react'
import UserCollectionCardBody from '../UserCollectionCard/UserCollectionCardBody'
import { useCollections } from '@/context/CollectionContext'
import Link from 'next/link';
import Image from 'next/image';

const GlobalCollectionCardBody = ({index}) => {
    if(index==undefined){console.error("index must provide")}    const {collections}=useCollections();
    const {username,userImage,userId}=collections[index];
  return (
    <>

    <UserCollectionCardBody/>
    <Link className="flex items-center gap-x-4">
        <h1>Created by {username}</h1>
        <Image
            src={user.image || '/assets/images/logo.jpg'}
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