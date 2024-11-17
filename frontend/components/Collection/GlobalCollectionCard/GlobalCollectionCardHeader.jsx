import DropdownMenu from '@/components/DropdownMenu/DropdownMenu';
import DropdownItem from '@/components/DropdownMenu/DropdownItem';
import EditIcon from '@/components/icons/EditIcon';
import DeleteIcon from '@/components/icons/DeleteIcon';
import KebabMenuIcon from '@/components/icons/KebabMenuIcon';

const GlobalCollectionCardHeader = ({ name ,isPublic}) => {
  return (
    <div className="flex justify-between items-center m-4">
      {/* Project Title */}
      <h3 className="flex-1 text-lg font-semibold text-gray-800 truncate w-full">
        {name}
      </h3>

      <div className="flex items-center space-x-2">
        <DropdownMenu 
          button={<KebabMenuIcon size={20} />}
        >
          <DropdownItem href="#" icon={<EditIcon />} label="Edit" />
          <DropdownItem href="#" icon={<DeleteIcon />} label="Delete" />
        </DropdownMenu>
      </div>
    </div>
  );
};

export default GlobalCollectionCardHeader;