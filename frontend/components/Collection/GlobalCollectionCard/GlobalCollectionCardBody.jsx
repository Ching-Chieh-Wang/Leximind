'use client'
import React from 'react'
import UserCollectionCardBody from '../UserCollectionCard/UserCollectionCardBody'
import { useCollections } from '@/context/CollectionsContext'
import DownloadIcon from "@/components/icons/DownloadIcon";
import ViewIcon from "@/components/icons/ViewIcon";
import WordIcon from "@/components/icons/WordIcon";


const GlobalCollectionCardBody = ({index}) => {
    if(index==undefined){console.error("index must provide")}    
    const {collections}=useCollections();
    const { id, word_cnt, view_cnt, save_cnt } = collections[index];

  return (
    <>
    <UserCollectionCardBody index={index}/>

    <div className="inline-flex justify-center items-center text-md text-gray-600 text-center gap-x-4 gap-y-2 pl-2 md:pl-6">
        <div className="flex items-center space-x-1">
          <WordIcon />
          <p>{word_cnt} words</p>
        </div>
        <div className="flex items-center space-x-1">
          <ViewIcon />
          <p>{view_cnt} views</p>
        </div>
        <div className="flex items-center space-x-1">
          <DownloadIcon />
          <p>{save_cnt} saves</p>
        </div>
      </div>
    
    </>
  )
}

export default GlobalCollectionCardBody