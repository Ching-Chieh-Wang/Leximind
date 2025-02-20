'use client'
import React from 'react'
import UserCollectionCardBody from '../userCollectionCard/UserCollectionCardBody'
import { useCollections } from '@/context/CollectionsContext'
import DownloadIcon from "@/components/icons/DownloadIcon";
import ViewIcon from "@/components/icons/ViewIcon";
import WordIcon from "@/components/icons/WordIcon";
import Horizontal_Layout from '@/components/Horizontal_Layout';


const GlobalCollectionCardBody = ({ index }) => {
  if (index == undefined) { console.error("index must provide") }
  const { collections } = useCollections();
  const { id, word_cnt, view_cnt, save_cnt } = collections[index];

  return (
    <>
      <UserCollectionCardBody index={index} />

      <Horizontal_Layout justify="evenly" extraStyle={" text-gray-600"}>
        <Horizontal_Layout spaceing='space-x-1.5'>
          <WordIcon />
          <p>{word_cnt} words</p>
        </Horizontal_Layout>
        <Horizontal_Layout spaceing='space-x-1.5'>
          <ViewIcon />
          <p>{view_cnt} views</p>
        </Horizontal_Layout>
        <Horizontal_Layout spaceing='space-x-1.5'>
          <DownloadIcon />
          <p>{save_cnt} saves</p>
        </Horizontal_Layout>
      </Horizontal_Layout>

    </>
  )
}

export default GlobalCollectionCardBody