import { useEffect, useState } from "react";
import ProgressBar from "@/components/ProgressBar"
import Horizontal_Layout from "@/components/Horizontal_Layout";
import Vertical_Layout from "@/components/Vertical_Layout";
import Block from "@/components/Block";
import ToggleButton from "@/components/buttons/ToggleButton";
import updateWordMemorizationRequest from "@/api/word/UpdateWordMemorization";

import { useCollection } from '@/context/collection/CollectionContext';


const WordStatus = () => {
    const { words,originalWords, memorizedCnt,viewingWordIdx,updateMemorization,id } = useCollection();
    const [memorizedPercentage,setMemorizedPercentage]= useState(0)
    useEffect(() => {
        const wordCnt=Object.keys(originalWords).length;
        // Update memorizedPercentage only when words or memorizedCnt change
        if (wordCnt > 0) {
          setMemorizedPercentage(memorizedCnt / wordCnt);
        } else {
          setMemorizedPercentage(0);
        }
      }, [originalWords, memorizedCnt]);
    const hanldeIsMemorizedClicked=()=>{
        if(words.length===0)return;
        updateWordMemorizationRequest(id,words[viewingWordIdx].id,{is_memorized:!words[viewingWordIdx]?.is_memorized})
        updateMemorization(viewingWordIdx);
    }
    return (
        <Horizontal_Layout extraStyle="px-8 w-full">
            <Vertical_Layout extraStyle="w-full" spacing="space-y-0">
                <Horizontal_Layout justify="between" extraStyle="w-full">
                    <span className="text-sm text-gray-500">{originalWords.length == 0 ? "Empty" : "Memorized"}</span>
                    {originalWords.length != 0 && <span className="text-sm text-gray-500">{memorizedCnt}/{Object.keys(originalWords).length}</span>}
                </Horizontal_Layout>
                <ProgressBar percentage={memorizedPercentage} />
            </Vertical_Layout>
            <Block>
                <h1 className="font-semibold text-xs md:text-md">Memorized</h1>
                <ToggleButton disabled={words.length==0} checked={words[viewingWordIdx]?.is_memorized||false} onChange={hanldeIsMemorizedClicked}/>
            </Block>
        </Horizontal_Layout>

    )
}

export default WordStatus