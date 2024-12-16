'use client';
import { useCollection } from '@/context/CollectionContext';
import { useEffect, useState } from "react";
import FlipCard from "../FlipCard";
import SwitcherButton from '../Buttons/SwitcherButton';
import Carousel from '../Carousel';
import VerticalLayout from '../VerticalLayout';
import HorizontalLayout from '../horizontalLayout';
import Background from '../Background';

const WordComponent = () => {
  const { words, viewingIdx, viewNext, viewPrev } = useCollection();
  const [isAlwaysShowDescription, setIsAlwaysShowDescription] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false)

  const handlePrevClick = () => {
    setIsFlipped(isAlwaysShowDescription);
    viewPrev();
  }

  const handleNextClick = () => {
    setIsFlipped(isAlwaysShowDescription)
    viewNext();
  }

  const handleAlwaysShowDescriptionClick = () => {
    setIsAlwaysShowDescription((prev) => !prev)
    setIsFlipped(!isAlwaysShowDescription);

  }

  const frontBody = (index) => {
    return (
      <VerticalLayout spacing='spance-y-0' extraStyle={"  w-full h-full items-center"}>
        <h1 className='text-4xl '>{words[index].name}</h1>
      </VerticalLayout>

    );
  }


  const backBody = (index) => {
    return (
      <VerticalLayout spacing='spance-y-0' extraStyle={" w-full h-full items-center"}>
        <h1 className='text-4xl'>{words[index].name}</h1>
        <h2 className='text-2xl'>{words[index].description}</h2>
      </VerticalLayout>

    );
  };

  if (!words || words.length === 0) {
    return <div className="text-center mt-4 ">No words available for this collection.</div>;
  }

  const slides = words.map((word, index) => (
    <FlipCard
      key={word.id}
      frontBody={frontBody(index)}
      backBody={backBody(index)}
      isFlipped={isFlipped}
      setIsFlipped={setIsFlipped}
    />
  ));

  return (
    <>
      <HorizontalLayout justify="end">
        <h1 className="text-gray-600">Always show description:</h1>
        <SwitcherButton
          checked={isAlwaysShowDescription}
          onChange={handleAlwaysShowDescriptionClick}
          onBody={<h1>On</h1>}
          offBody={<h1>Off</h1>}
        />
      </HorizontalLayout>

      <div className=' min-w-64 h-60 '>
        <Carousel slides={slides} index={viewingIdx} onNext={handleNextClick} onPrev={handlePrevClick} />
      </div>
    </>
  );
};

export default WordComponent;