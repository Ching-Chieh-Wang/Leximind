import React, { useState, useRef, useEffect } from 'react';
import Horizontal_Layout from '@/components/Horizontal_Layout';
import { useCollection } from '@/context/collection/CollectionContext';

const WordGo = () => {
  const { words, setViewingWordIdx, viewingWordIdx } = useCollection();

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(viewingWordIdx + 1);
  const timeoutRef = useRef(null);
  const containerRef = useRef(null);
  const justOpenedRef = useRef(false);

  const totalWords = words.length;

  // Update index handler
  const goToIndex = (idx) => {
    const newIdx = Math.min(Math.max(parseInt(idx) - 1, 0), totalWords - 1);
    setEditValue(newIdx + 1);
    setViewingWordIdx(newIdx);
  };

  // Outside click detection with justOpenedRef and touch support
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (justOpenedRef.current) {
        justOpenedRef.current = false;
        return;
      }
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setTimeout(() => setIsEditing(false), 1000);
      }
    };
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Handlers
  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsEditing(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsEditing(false), 1300);
  };

  const handleClick = (e) => {
    e.stopPropagation();
    justOpenedRef.current = true;
    setIsEditing(true);
  };

  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Synchronize editValue with viewingWordIdx changes from outside
  useEffect(() => {
    setEditValue(viewingWordIdx + 1);
  }, [viewingWordIdx]);

  if (totalWords === 0) {
    return (
      <div className="text-md text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 drop-shadow-sm">
        -- / --
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative p-[2px] rounded-full bg-gradient-to-r from-blue-400 to-purple-500 ">
      <div
        className="bg-white rounded-full pl-4 h-7 flex items-center  "
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onTouchStart={handleClick}
      >
        {isEditing ? (
            <form
            onSubmit={(e) => {
                e.preventDefault();
                goToIndex(editValue);
            }}
            className="flex items-center h-full overflow-hidden rounded-full  border-purple-300 bg-white"
            >
            <input
                ref={inputRef}
                type="number"
                min="1"
                max={totalWords}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-12 text-center text-purple-600 focus:outline-none focus:ring-0 appearance-none h-full leading-none "
            />
            <span className="text-md px-1  leading-none">/ {totalWords}</span>
            <button
                type="submit"
                className="px-4 ml-2 bg-gradient-to-r from-purple-500 to-blue-400 text-white text-xs font-medium tracking-wide h-full leading-none flex items-center justify-center"
            >
                Go
            </button>
            </form>
        ) : (
          <h3 className="text-md pr-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 drop-shadow-sm">
            {` ${viewingWordIdx + 1} / ${totalWords}`}
          </h3>
        )}
      </div>
    </div>
  );
};

export default WordGo;