import PreviousIcon from './icons/PreviousIcon';
import NextIcon from './icons/NextIcon';
import Background from './Background';
import { useSwipeable } from 'react-swipeable';
import { useState } from 'react';

const Carousel = ({ slides, index, onNext, onPrev ,onClick}) => {
  const [isTapAllowed, setIsTapAllowed] = useState(true);
  
  const TAP_DELAY = 300; // Set a delay (in milliseconds) before allowing another tap
  const WINDOW = 1; // render only index-1, index, index+1
  const visibleSlides = slides
    .map((slide, i) => ({ slide, i }))
    .filter(({ i }) => Math.abs(i - index) <= WINDOW);

    // Use the useSwipeable hook to handle swipes
    const handlers = useSwipeable({
      onSwipedLeft: () => {
        onNext();
      },
      onSwipedRight: () => {
        onPrev();
      },
      onTap:()=>{
        if(isTapAllowed){
          onClick();
        }
        setIsTapAllowed(false);
        setTimeout(() => setIsTapAllowed(true), TAP_DELAY); // Reset tap permission after delay
      },
      trackMouse: true,
      delta: 50,
      preventDefaultTouchmoveEvent:true
    });
  return (
    
    <div className="rounded-3xl relative w-full h-full overflow-hidden">
      {/* Sliding Container for Background and Slides */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div
          className="absolute w-full h-full"
          style={{
            transform: `translateX(-${index * (100 / slides.length)}%)`,
          }}
          
        >
          <Background />
        </div>
      </div>

      {/* Slides Container */}
      <div
        className="relative w-full h-full touch-none overscroll-none"
        {...handlers}
        onTouchStart={(e) => {
          e.preventDefault();
          document.documentElement.style.overflow = 'hidden';
          document.body.style.overflow = 'hidden';
        }}
        onTouchEnd={() => {
          document.documentElement.style.overflow = '';
          document.body.style.overflow = '';
        }}
      >
        {visibleSlides.map(({ slide, i }) => (
          <div
            key={`slide-${i}`}
            className="absolute w-full h-full flex items-center justify-center transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(${(i - index) * 100}%)`,
            }}
          >
            {slide}
          </div>
        ))}
      </div>

      {/* Navigation */}
      {index > 0 && (
        <button
          onClick={onPrev}
          className="absolute z-50 top-1/2 left-2 transform -translate-y-1/2 bg-gray-300 px-2 py-1 rounded opacity-50"
        >
          <PreviousIcon />
        </button>
      )}
      {index < slides.length - 1 && (
        <button
          onClick={onNext}
          className="absolute z-50 top-1/2 right-2 transform -translate-y-1/2 bg-gray-300 px-2 py-1 rounded opacity-50"
        >
          <NextIcon />
        </button>
      )}
    </div>
  );
};

export default Carousel;