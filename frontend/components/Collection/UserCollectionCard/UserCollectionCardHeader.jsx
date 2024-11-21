'use client'
import DropdownMenu from '@/components/DropdownMenu/DropdownMenu';
import DropdownItem from '@/components/DropdownMenu/DropdownItem';
import EditIcon from '@/components/icons/EditIcon';
import DeleteIcon from '@/components/icons/DeleteIcon';
import KebabMenuIcon from '@/components/icons/KebabMenuIcon';
import { useCollections } from '@/context/CollectionContext';
import { useWarning } from '@/context/WarningContext';

const UserCollectionCardHeader = ({index}) => {
  const { collections,setEditingIdx, editingIdx} = useCollections();
  const { showWarning } = useWarning();
  const collection = collections[index];

  const handleDelete= ()=>{
    showWarning("you are deleting ")
  }

  return (
    <div className="flex justify-between items-center m-4">
      {/* Project Title */}
      <h3 className="flex-1 text-lg font-semibold text-gray-800 truncate w-full">
        {collection.name}
      </h3>

      <div className="flex items-center space-x-2">
        <DropdownMenu 
          button={<KebabMenuIcon size={20} />}
        >
          <DropdownItem onClick={()=>{setEditingIdx(index), console.log(editingIdx)}} icon={<EditIcon />} label="Edit" />
          <DropdownItem onClick={handleDelete} icon={<DeleteIcon />} label="Delete" />
        </DropdownMenu>
      </div>
    </div>
  );
};

export default UserCollectionCardHeader;