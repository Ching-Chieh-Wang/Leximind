'use client'
import React from 'react'
import UserCollectionCardBody from '../UserCollectionCard/UserCollectionCardBody'
import { useCollections } from '@/context/CollectionsContext'
import DownloadIcon from "@/components/icons/DownloadIcon";
import ViewIcon from "@/components/icons/ViewIcon";
import WordIcon from "@/components/icons/WordIcon";
import HorizontalLayout from '@/components/horizontalLayout';


const GlobalCollectionCardBody = ({index}) => {
    if(index==undefined){console.error("index must provide")}    
    const {collections}=useCollections();
    const { id, word_cnt, view_cnt, save_cnt } = collections[index];

  return (
    <>
    <UserCollectionCardBody index={index}/>

    <HorizontalLayout extraStyle={"justify-evenly text-gray-600"}>
        <HorizontalLayout spaceing='space-x-1.5'>
          <WordIcon />
          <p>{word_cnt} words</p>
        </HorizontalLayout>
        <div className="flex items-center space-x-1">
          <ViewIcon />
          <p>{view_cnt} views</p>
        </div>
        <div className="flex items-center space-x-1">
          <DownloadIcon />
          <p>{save_cnt} saves</p>
        </div>
      </HorizontalLayout>
    
    </>
  )
}

export default GlobalCollectionCardBody