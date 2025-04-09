import { useEffect, useState } from "react";
import DropdownMenu from "@/components/dropdown_menu/DropdownMenu"; 
import KebabMenuIcon from "@/components/icons/KebabMenuIcon"; 
import { useCollection } from '@/context/collection/CollectionContext';
import { updateWordLabelRequest } from "@/api/label/UpdateWordLabel";
import { PrivateCollectionStatus } from "@/context/collection/types/status/PrivateCollectionStatus";
import PublicLabelDropdownMenu from "./label_dropdown_menu/PublicLabelDropdownMenu";
import PrivateLabelDropdownMenu from "./label_dropdown_menu/PrivateLabelDropdownMenu";

const LabelRow = ({ labelId }) => {
    const { words, labels, id, viewingWordIdx,viewingType ,status, updateWordLabel, is_public, viewingName} = useCollection();
    const [labelChecked, setLabelChecked] = useState(false)

    useEffect(() => {
        if (words.length === 0) {
            setLabelChecked(false);
        }
        else {
            setLabelChecked(words[viewingWordIdx].label_ids.has(labelId))
        }
    }, [viewingWordIdx,viewingType,viewingName])

    const handleLabelCheckedChange = async () => {
        if(is_public) return;
        if (words.length === 0) return;;
        setLabelChecked((prev) => !prev);
        updateWordLabel(viewingWordIdx,labelId,!labelChecked);
        updateWordLabelRequest(id,labelId,words[viewingWordIdx].id, !labelChecked);
    }

    return (
        <>
            {/* Checkbox Column */}
            <td className="px-2 xl:px6 py-2 align-middle">
                <input
                    type="checkbox"
                    className="w-4 h-4 accent-teal-600 "
                    checked={labelChecked}
                    onChange={ handleLabelCheckedChange}
                    disabled={ words.length === 0 || status===PrivateCollectionStatus.CREATING_WORD || status ===PrivateCollectionStatus.CREATE_WORD_SUBMIT} 
                />
            </td>

            {/* Label Column */}
            <td
                scope="row"
                className="px-2 xl:px6 py-2 font-medium text-gray-900 whitespace-nowrap align-middle"
            >
                {labels[labelId].name}
            </td>

            {/* Actions Column */}
            <td className="px-2 xl:px6 py-2 text-right align-middle">
                <DropdownMenu button={<KebabMenuIcon />}>
                    {is_public ? <PublicLabelDropdownMenu labelId={labelId}/> : <PrivateLabelDropdownMenu labelId={labelId}/>}
                </DropdownMenu>
            </td>
        </>
    );
};

export default LabelRow;