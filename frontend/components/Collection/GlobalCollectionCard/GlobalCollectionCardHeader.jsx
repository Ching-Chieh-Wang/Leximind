import DropdownMenu from '@/components/DropdownMenu/DropdownMenu';
import DropdownItem from '@/components/DropdownMenu/DropdownItem';
import EditIcon from '@/components/icons/EditIcon';
import DeleteIcon from '@/components/icons/DeleteIcon';
import KebabMenuIcon from '@/components/icons/KebabMenuIcon';
import { useCollections } from '@/context/CollectionContext';
import DownloadIcon from '@/components/icons/DownloadIcon';
import ReportIcon from '@/components/icons/ReportIcon';

const GlobalCollectionCardHeader = ({ index}) => {
  const {collections}=useCollections();
  const {name, id}=collections[index];
  return (
    <div className="flex justify-between items-center m-4">
      {/* Project Title */}
      <h3 className="flex-1 text-xl md:text-2xl font-semibold text-gray-800 truncate w-full">
        {name}
      </h3>

      <div className="flex items-center space-x-2">
        <DropdownMenu button={<KebabMenuIcon size={20} />}>
          {/* <DropdownItem href="#" icon={<ReportIcon />}  >Report</DropdownItem> */}
          <DropdownItem href="#" icon={<DownloadIcon/>} >Import to my collection</DropdownItem>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default GlobalCollectionCardHeader;