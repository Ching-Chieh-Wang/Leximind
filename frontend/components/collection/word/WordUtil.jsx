import { text2Speech } from '@/api/word/Text2Speech';
import Horizontal_Layout from '@/components/Horizontal_Layout'
import AudioIcon from '@/components/icons/AudioIcon';
import CopyIcon from '@/components/icons/CopyIcon';
import { useCollection } from '@/context/collection/CollectionContext';
import React from 'react'

const WordUtil = () => {
    const { words, viewingWordIdx, id } = useCollection();

    const handlePronunciation = async () => {
        const speechUrl = await text2Speech(id, words[viewingWordIdx].id)
        const audio = new Audio(speechUrl);
        audio.play();
    }


    const handleCopy = async () => {
        await navigator.clipboard.writeText(words[viewingWordIdx].name);
    };
    return (
        <Horizontal_Layout extraStyle="text-gray-500">
            <button
                onClick={handlePronunciation}
                className='hover:text-blue-400'
            >
                <AudioIcon size={18} />
            </button>
            <button onClick={handleCopy} className='hover:text-blue-400'>
                <CopyIcon size={16} />
            </button>
        </Horizontal_Layout>

    )
}

export default WordUtil