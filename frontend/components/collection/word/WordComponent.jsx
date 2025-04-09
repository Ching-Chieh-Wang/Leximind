'use client';
import { useState } from "react";
import Image from 'next/image';
import FlipCard from "../../FlipCard";
import SwitcherButton from '../../buttons/SwitcherButton';
import Carousel from '../../Carousel';
import Vertical_Layout from '../../Vertical_Layout';
import Horizontal_Layout from '../../Horizontal_Layout';
import CreateIcon from '../../icons/CreateIcon';
import WordEditComponent from './WordEditComponent';
import ErrorMsg from '../../msg/ErrorMsg';
import WordNav from './WordNav';
import SearchBar from '../../SearchBar';
import WordStatus from './WordStatus';

import { useCollection } from '@/context/collection/CollectionContext';
import { PrivateCollectionStatus } from "@/context/collection/types/status/PrivateCollectionStatus";
import { PrivateCollectionViewingType } from "@/context/collection/types/viewingType/PrivateCollectionViewingType";
import { CollectionStatus } from "@/context/collection/types/status/CollectionStatus";


const WordComponent = () => {
  const { words, viewingWordIdx, status, startCreateWordSession, error, viewingType, viewNext, viewPrev ,searchWords,is_public } = useCollection();
  const [isAlwaysShowDescription, setIsAlwaysShowDescription] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const handlePrevClick = () => {
    setIsFlipped(isAlwaysShowDescription); // Directly set it without function form
    viewPrev();
  };

  const handleNextClick = () => {
    setIsFlipped(isAlwaysShowDescription); // Directly set it without function form
    viewNext();
  };

  const handleAlwaysShowDescriptionClick = () => {
    setIsAlwaysShowDescription((prev) => {
      setIsFlipped(!prev);
      return !prev
    });
  };

  const handleCardClick = () => {
    setIsFlipped((prev) => !prev);
  };


  const handleSearch = async (searchParam) => {
    searchWords(searchParam);
  }

  const frontBody = (word) => (
    <Vertical_Layout spacing="spance-y-6" extraStyle="w-full h-full items-center select-none p-0.5">
      <h1 className="text-4xl">{word.name}</h1>
    </Vertical_Layout>
  );

  const backBody = (word) => (
    <Vertical_Layout spacing="spance-y-6" extraStyle="w-full h-full items-center select-none p-0.5">
      <h1 className="text-4xl">{word.name}</h1>
      <div className='border-gray-200 border-t-2 w-2/3 mb-2 mt-1' />
      <h2 className="text-2xl overflow-y-scroll text-center">{word.description}</h2>
    </Vertical_Layout>
  );

  if (status === CollectionStatus.LOADING) {
    return <h1>Fetching collection</h1>;
  }
  else if (status === CollectionStatus.ERROR) {
    return <ErrorMsg>{error}</ErrorMsg>
  }

  const slides = words.map((word) => (
    <FlipCard
      key={word.id}
      frontBody={frontBody(word)}
      backBody={backBody(word)}
      isFlipped={isFlipped}
    />
  ));

  return (
    <>
      <Horizontal_Layout justify='between'>
        <Horizontal_Layout>
          <h1 className='text-zinc-700-700 font-bold hidden sm:block'>Description: </h1>
          <SwitcherButton
            checked={isAlwaysShowDescription}
            onChange={handleAlwaysShowDescriptionClick}
            onBody={<h1>Show</h1>}
            offBody={<h1>Hide</h1>}
          />
        </Horizontal_Layout>

        <SearchBar handleSearch={handleSearch} />
      </Horizontal_Layout>



      {status === PrivateCollectionStatus.CREATING_WORD || status === PrivateCollectionStatus.CREATE_WORD_SUBMIT || status === PrivateCollectionStatus.UPDATING_WORD ? (
        <WordEditComponent />
      ) : (
        <div className="w-full min-w-64 h-60">
          {words.length === 0 ? (
            viewingType === PrivateCollectionViewingType.BASIC ?
              <button onClick={startCreateWordSession} className="w-full h-full">
                <Vertical_Layout
                  spacing="space-y-1"
                  extraStyle="h-full w-full bg-white items-center border-2 border-dashed hover:border-solid border-blue-300 rounded-lg text-blue-500 hover:text-2xl duration-500"
                >
                  <CreateIcon size={35} />
                  <h1>Add New Word</h1>
                </Vertical_Layout>
              </button>
              :
              <div className="flex flex-col items-center w-full h-full rounded-lg">
                <div className="relative w-56 h-56">
                  <Image
                    src='/assets/images/no content.png'
                    fill
                    alt='no content'
                    className=' rounded-lg'
                  />
                </div>
                <h1 className='font-extrabold mt-4 text-center'>No words found</h1>
              </div>
          ) : (
            <Carousel slides={slides} index={viewingWordIdx} onNext={handleNextClick} onPrev={handlePrevClick} onClick={handleCardClick} />
          )}
        </div>
      )}
      {!is_public && status != PrivateCollectionStatus.CREATING_WORD && status != PrivateCollectionStatus.CREATE_WORD_SUBMIT && status != PrivateCollectionStatus.UPDATING_WORD && <WordStatus />}
      {!is_public && <WordNav />}
    </>
  );
};

export default WordComponent;