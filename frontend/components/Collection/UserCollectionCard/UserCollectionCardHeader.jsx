import { formatDistanceToNow } from 'date-fns';
import DropdownMenu from '@/components/DropdownMenu/DropdownMenu';
import DropdownItem from '@/components/DropdownMenu/DropdownItem';
import EditIcon from '@/components/icons/EditIcon';
import DeleteIcon from '@/components/icons/DeleteIcon';
import KebabMenuIcon from '@/components/icons/KebabMenuIcon';
import { useCollections } from '@/context/CollectionContext';
import { useDialog } from '@/context/DialogContext';
import ViewIcon from '@/components/icons/ViewIcon';
import CreateIcon from '@/components/icons/CreateIcon';

const UserCollectionCardHeader = ({ index }) => {
  const { collections, setEditingIdx, setCollections } = useCollections();
  const { showDialog } = useDialog();
  const { name, id, created_at, last_viewed_at } = collections[index];

  const getFormattedDistance = (date) => {
    const diffInSeconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (diffInSeconds < 60) {
      return "just now";
    } else {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    }
  };

  const handleDelete = () => {
    const setHandleOk = async () => {
      const response = await fetch(`/api/protected/collections/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setCollections((prevCollections) => [
          ...prevCollections.slice(0, index), // Keep elements before the target index
          ...prevCollections.slice(index + 1), // Keep elements after the target index
        ]);
        setEditingIdx(-1);
      } else {
        showDialog('Error', 'Something went wrong. Please try again later.', 'warning');
      }
    };
    showDialog("Warning!", `Deleting ${name}? You will lose all of your words by deleting this. This action cannot be undone.`, 'warning', setHandleOk);

  };

  return (
    <>
      <div className="flex justify-between items-center ">
        {/* Project Title */}
        <h3 className="flex-1 text-lg font-semibold text-gray-800  " style={{ overflowWrap: 'break-word' }}>
          {name}
        </h3>


        <DropdownMenu button={<KebabMenuIcon size={20} />}>
          {
            last_viewed_at && (
              <DropdownItem icon={<ViewIcon />}>
                Last viewed: {getFormattedDistance(last_viewed_at)}
              </DropdownItem>
            )
          }
          <DropdownItem icon={<CreateIcon />}>
            Created at: {getFormattedDistance(created_at)}
          </DropdownItem>
          <hr></hr>
          <DropdownItem onClick={() => setEditingIdx(index)} icon={<EditIcon />} >Edit</DropdownItem>
          <DropdownItem onClick={handleDelete} icon={<DeleteIcon />} >Delete</DropdownItem>
        </DropdownMenu>
      </div>
    </>
  );
};

export default UserCollectionCardHeader;
