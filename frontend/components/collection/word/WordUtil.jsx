import { text2Speech } from '@/api/word/Text2Speech';
import Horizontal_Layout from '@/components/Horizontal_Layout'
import AudioIcon from '@/components/icons/AudioIcon';
import CopyIcon from '@/components/icons/CopyIcon';
import { useCollection } from '@/context/collection/CollectionContext';
import { set } from 'date-fns';
import React, { useState } from 'react'

const WordUtil = () => {
    const { words, viewingWordIdx, id } = useCollection();

    const [copied, setCopied] = useState(false);
    const [waitingPronoun, setWaitingPronoun] = useState(false);

    const handlePronunciation = async () => {
        setWaitingPronoun(true);
        const speechUrl = await text2Speech(id, words[viewingWordIdx].id)
        const audio = new Audio(speechUrl);
        audio.play();
        setWaitingPronoun(false);
    }


    const handleCopy = async () => {
        await navigator.clipboard.writeText(words[viewingWordIdx].name);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
    };
    return (
        <Horizontal_Layout extraStyle="text-gray-500">
            <div className='relative'>
                <button
                    onClick={handlePronunciation}
                    className='hover:text-blue-400'
                    disabled={waitingPronoun}
                >
                    <AudioIcon size={18} />
                </button>
                {waitingPronoun && (
                    <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 
                   text-xs bg-black text-white px-2 py-1 rounded 
                   shadow z-50 pointer-events-none whitespace-nowrap">
                        Loading...
                    </span>
                )}
            </div>

            <div className="relative">
                <button onClick={handleCopy} className="hover:text-blue-400">
                    <CopyIcon size={16} />
                </button>
                {copied && (
                    <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 
                   text-xs bg-black text-white px-2 py-1 rounded 
                   shadow z-50 pointer-events-none whitespace-nowrap">
                        Copied
                    </span>
                )}
            </div>
        </Horizontal_Layout>

    )
}

export default WordUtil