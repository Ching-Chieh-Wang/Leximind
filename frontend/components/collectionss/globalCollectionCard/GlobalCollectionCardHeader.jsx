import DropdownMenu from '@/components/dropdown_menuu/DropdownMenu';
import DropdownItem from '@/components/dropdown_menuu/DropdownItem';
import KebabMenuIcon from '@/components/icons/KebabMenuIcon';
import { useCollections } from '@/context/CollectionsContext';
import DownloadIcon from '@/components/icons/DownloadIcon';
import Horizontal_Layout from '@/components/Horizontal_Layout';

const GlobalCollectionCardHeader = ({ index}) => {
  if(index==undefined){console.error("index must provide")}
  const {collections}=useCollections();
  const {name, id}=collections[index];
  return (
    <Horizontal_Layout extraStyle={"justify-between"}>
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
    </Horizontal_Layout>
  );
};

export default GlobalCollectionCardHeader;