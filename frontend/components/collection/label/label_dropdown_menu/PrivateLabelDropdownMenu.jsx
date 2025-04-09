
import DropdownItem from "@/components/dropdown_menu/DropdownItem";
import WordIcon from "@/components/icons/WordIcon";
import EditIcon from "@/components/icons/EditIcon";
import DeleteIcon from "@/components/icons/DeleteIcon";
import { removeLabelReqest } from "@/api/label/RemoveLabel";
import { useCollection } from '@/context/collection/CollectionContext';

const PrivateLabelDropdownMenu = ({labelId}) => {
    const { labels, id, showWordsByLabel } = useCollection();

    const handleDelete = () => {
        const labelName = labels[labelId].name;
        showDialog({
            title: "Warning!",
            description: `Deleting ${labelName}? This action cannot be undone.`,
            type: "warning",
            onOk: () => {
                removeLabelReqest(id, labelId)
                removeLabel(labelId);
            },
            onCancel: () => { },
        });
    };


    const handleViewWords = () => {
        showWordsByLabel(labels[labelId]);
    }

    return (
        <>
            <DropdownItem icon={<WordIcon />} onClick={handleViewWords}>
                View Words
            </DropdownItem>
            <DropdownItem icon={<EditIcon />} onClick={() => startUpdateLabelSession(labelId)}>
                Edit
            </DropdownItem>
            <DropdownItem extraStyle='text-red-400' icon={<DeleteIcon />} onClick={handleDelete}>
                Delete
            </DropdownItem>
        </>

    )
}

export default PrivateLabelDropdownMenu