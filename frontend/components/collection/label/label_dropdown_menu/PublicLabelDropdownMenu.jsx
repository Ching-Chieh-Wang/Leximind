import DropdownItem from "@/components/dropdown_menu/DropdownItem"; 
import WordIcon from "@/components/icons/WordIcon"; 
import { useCollection } from '@/context/collection/CollectionContext';




const PublicLabelDropdownMenu = ({labelId}) => {
    const { labels, showWordsByLabel } = useCollection();

    const handleViewWords = ()=>{
        showWordsByLabel(labels[labelId]);
    }

    return (
        <DropdownItem icon={<WordIcon />} onClick={handleViewWords}>
            View Words
        </DropdownItem>
    )
}

export default PublicLabelDropdownMenu