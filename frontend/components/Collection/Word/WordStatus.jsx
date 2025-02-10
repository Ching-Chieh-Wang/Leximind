import ProgressBar from "@/components/ProgressBar"
import { useEffect, useState } from "react";
import { useCollection } from "@/context/CollectionContext"
import Horizontal_Layout from "@/components/Horizontal_Layout";
import Vertical_Layout from "@/components/Vertical_Layout";
import Block from "@/components/Block";
import ToggleButton from "@/components/Buttons/ToggleButton";

const WordStatus = () => {
    const { words,originalWords, memorizedCnt,viewingWordIdx,updateMemorization,id,status } = useCollection();
    const [memorizedPercentage,setMemorizedPercentage]= useState(0)
    useEffect(() => {
        // Update memorizedPercentage only when words or memorizedCnt change
        if (originalWords.length > 0) {
          setMemorizedPercentage(memorizedCnt / originalWords.length);
        } else {
          setMemorizedPercentage(0);
        }
      }, [originalWords, memorizedCnt]);
    const hanldeIsMemorizedClicked=()=>{
        updateMemorization(`/api/protected/collections/${id}/words/${words[viewingWordIdx].id}/memorize`,viewingWordIdx)
    }
    return (
        <Horizontal_Layout extraStyle="px-8">
            <Vertical_Layout extraStyle="w-full" spacing="space-y-0">
                <Horizontal_Layout justify="between" extraStyle="w-full">
                    <span className="text-sm text-gray-500">{originalWords.length == 0 ? "Empty" : "Memorized"}</span>
                    {originalWords.length != 0 && <span className="text-sm text-gray-500">{memorizedCnt}/{originalWords.length}</span>}
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