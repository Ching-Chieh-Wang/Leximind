'use client'
import { formatDistanceToNow } from 'date-fns';
import DropdownMenu from '@/components/DropdownMenu/DropdownMenu';
import DropdownItem from '@/components/DropdownMenu/DropdownItem';
import EditIcon from '@/components/icons/EditIcon';
import DeleteIcon from '@/components/icons/DeleteIcon';
import KebabMenuIcon from '@/components/icons/KebabMenuIcon';
import { useCollections } from '@/context/CollectionContext';
import { useDialog } from '@/context/DialogContext';
import { useState } from 'react';
import ViewIcon from '@/components/icons/ViewIcon';
import CreateIcon from '@/components/icons/CreateIcon';
import SwitcherButton from '@/components/buttons/SwitcherButton';
import GlobalIcon from '@/components/icons/GlobalIcon';
import LockIcon from '@/components/icons/LockIcon';
import DownloadIcon from '@/components/icons/DownloadIcon';
import ShareIcon from '@/components/icons/ShareIcon';

const UserCollectionCardHeader = ({ index }) => {
  const { collections, setEditingIdx, setCollections } = useCollections();
  const [isPublic, setIsPublic] = useState(collections[index].is_public)
  const { showDialog } = useDialog();
  const { name, id, created_at, last_viewed_at, view_cnt, save_cnt } = collections[index];

  const getFormattedDistance = (date) => {
    const diffInSeconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (diffInSeconds < 60) {
      return "just now";
    } else {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    }
  };

  const handleAuthorizeChange = async () => {
    try {
      const response = await fetch(`/api/protected/collections/${id}/authorize`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_public: !isPublic }),
      });
      if (!response.ok) {
        showDialog("Error", "Unexpected error! Please try again later.")
        return;
      }
      setIsPublic((prev) => !prev);
      collections[index].is_public = collections[index].is_public
    } catch (error) {
      console.error('Error updating collection authority:', error);
      showDialog("Error", 'An unexpected error occurred while updating the collection.');
    };

  }

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
        <h3 className="flex-1 text-xl md:text-2xl font-semibold text-gray-800  " style={{ overflowWrap: 'break-word' }}>
          {name}
        </h3>



        <DropdownMenu button={<KebabMenuIcon size={20} />}>
          {last_viewed_at && (
            <DropdownItem icon={<ViewIcon />}>
              Last viewed: {getFormattedDistance(last_viewed_at)}
            </DropdownItem>
          )}
          <DropdownItem icon={<CreateIcon />}>
            Created at: {getFormattedDistance(created_at)}
          </DropdownItem>
          <DropdownItem >
            <SwitcherButton
              offBody={<div className="inline-flex gap-1 items-center"><LockIcon />Private</div>}
              onBody={<div className="inline-flex gap-1 items-center"><GlobalIcon />Public</div>}
              status={isPublic}
              onOn={handleAuthorizeChange}
              onOff={handleAuthorizeChange}
            />

          </DropdownItem>
          {isPublic && (
            <>
              <DropdownItem icon={<ViewIcon />}>
                {view_cnt} views
              </DropdownItem>
              <DropdownItem icon={<DownloadIcon />}>
                {save_cnt} saves
              </DropdownItem>
            </>
          )
          }
          <hr className="m-2" />
          {isPublic && (
              <DropdownItem icon={<ShareIcon />}>
                Share
              </DropdownItem>
          )
          }
          <DropdownItem onClick={() => setEditingIdx(index)} icon={<EditIcon />}>
            Edit
          </DropdownItem>
          <DropdownItem onClick={handleDelete} icon={<DeleteIcon />}>
            Delete
          </DropdownItem>
        </DropdownMenu>
      </div>
    </>
  );
};

export default UserCollectionCardHeader;
