import { useEffect, useState } from "react";
import DropdownMenu from "@/components/dropdown_menu/DropdownMenu"; // Ensure this import exists
import DropdownItem from "@/components/dropdown_menu/DropdownItem"; // Ensure this import exists
import KebabMenuIcon from "@/components/icons/KebabMenuIcon"; // Ensure this import exists
import WordIcon from "@/components/icons/WordIcon"; // Ensure this import exists
import EditIcon from "@/components/icons/EditIcon"; // Ensure this import exists
import DeleteIcon from "@/components/icons/DeleteIcon"; // Ensure this import exists

import { useCollection } from '@/context/collection/CollectionContext';
import { updateWordLabelRequest } from "@/api/label/UpdateWordLabel"; // Import the new function
import { useDialog } from "@/context/DialogContext";
import { removeLabelReqest } from "@/api/label/RemoveLabel";
import { PrivateCollectionStatus } from "@/context/collection/types/status/PrivateCollectionStatus";

const LabelRow = ({ labelId }) => {
    const { words, labels, id, viewingWordIdx, startUpdateLabelSession, removeLabel, showWordsByLabel,viewingType ,status, updateWordLabel } = useCollection();
    const { showDialog } = useDialog();
    const [labelChecked, setLabelChecked] = useState(false)

    useEffect(() => {
        if (words.length === 0) {
            setLabelChecked(false);
        }
        else {
            setLabelChecked(words[viewingWordIdx].label_ids.has(labelId))
        }
    }, [viewingWordIdx,viewingType])

    const handleLabelCheckedChange = async () => {
        if (words.length === 0) return;;
        setLabelChecked((prev) => !prev);
        updateWordLabel(viewingWordIdx,labelId,!labelChecked);
        updateWordLabelRequest(id,labelId,words[viewingWordIdx].id, !labelChecked);
    }

    const handleViewWords = ()=>{
        showWordsByLabel(labels[labelId]);
    }

    const handleDelete = () => {
        const labelName = labels[labelId].name;
        showDialog({
            title: "Warning!",
            description: `Deleting ${labelName}? This action cannot be undone.`,
            type: "warning",
            onOk: () => {
                removeLabelReqest(id,labelId)
                removeLabel(labelId);
            },
            onCancel: () => {},
        });
    };

    return (
        <>
            {/* Checkbox Column */}
            <td className="px-2 xl:px6 py-2 align-middle">
                <input
                    type="checkbox"
                    className="w-4 h-4 accent-teal-600"
                    checked={labelChecked}
                    onChange={handleLabelCheckedChange}
                    disabled={words.length === 0 || status===PrivateCollectionStatus.CREATING_WORD || status ===PrivateCollectionStatus.CREATE_WORD_SUBMIT} // Disable checkbox when words.length === 0
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
                    <DropdownItem icon={<WordIcon />} onClick={handleViewWords}>
                        View Words
                    </DropdownItem>
                    <DropdownItem
                        icon={<EditIcon />}
                        onClick={() => startUpdateLabelSession(labelId)}
                    >
                        Edit
                    </DropdownItem>
                    <DropdownItem extraStyle='text-red-400' icon={<DeleteIcon />} onClick={handleDelete}>
                        Delete
                    </DropdownItem>
                </DropdownMenu>
            </td>
        </>
    );
};

export default LabelRow;