'use client'
import { useState } from "react";

const FlipCard = ({ frontBody, backBody ,isFlipped}) => {



  return (

    <div
      className={`relative  w-full h-full  transition-all duration-500 [transform-style:preserve-3d] ${isFlipped ? "[transform:rotateY(180deg)]" : ""
        }`}
    >
      {/* Front Side */}
      <div className="absolute w-full h-full inset-0  [backface-visibility:hidden]">
        {frontBody}
      </div>
      {/* Back Side */}
      <div className="absolute w-full h-full inset-0   [backface-visibility:hidden] [transform:rotateY(180deg)] ">
        {backBody}
      </div>
    </div>
  );
};

export default FlipCard;