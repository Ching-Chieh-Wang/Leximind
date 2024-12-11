'use client';
import { formatDistanceToNow } from 'date-fns';
import DropdownMenu from '@/components/DropdownMenu/DropdownMenu';
import DropdownItem from '@/components/DropdownMenu/DropdownItem';
import EditIcon from '@/components/icons/EditIcon';
import DeleteIcon from '@/components/icons/DeleteIcon';
import KebabMenuIcon from '@/components/icons/KebabMenuIcon';
import { useCollections } from '@/context/CollectionsContext';
import { useDialog } from '@/context/DialogContext';
import { useState } from 'react';
import ViewIcon from '@/components/icons/ViewIcon';
import CreateIcon from '@/components/icons/CreateIcon';
import SwitcherButton from '@/components/buttons/SwitcherButton';
import GlobalIcon from '@/components/icons/GlobalIcon';
import LockIcon from '@/components/icons/LockIcon';
import DownloadIcon from '@/components/icons/DownloadIcon';
import ShareIcon from '@/components/icons/ShareIcon';
import Link from 'next/link';

const UserCollectionCardHeader = ({ index }) => {
  if(index==undefined){console.error("index must provide")}
  const {
    collections,
    startUpdateCollectionSession,
    updateAuthority,
    removeCollection,
  } = useCollections();
  const { showDialog } = useDialog();

  const {
    name,
    id:collection_id,
    created_at,
    last_viewed_at,
    view_cnt,
    save_cnt,
    is_public,
  } = collections[index];

  const [isPublic, setIsPublic] = useState(is_public);

  const getFormattedDistance = (date) => {
    const diffInSeconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (diffInSeconds < 60) {
      return 'just now';
    } else {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    }
  };

  const handleDelete = () => {
    showDialog(
      {title:'Warning!',
      description:`Deleting ${name}? You will lose all of your words by deleting this. This action cannot be undone.`,
      type:'warning',
      onOk:()=>{removeCollection(`/api/protected/collections/${collection_id}`, index)},
      onCancel:()=>{}
    })
  };

  const handleAuthorizeChange = async (e) => {
    const updatedIsPublic = e.target.checked;
    setIsPublic(updatedIsPublic); 
    updateAuthority(`/api/protected/collections/${collection_id}/authorize`, index, updatedIsPublic);
  };

  return (
    <>
      <div className="flex justify-between items-center ">
        {/* Project Title */}
        <Link
          href={`/protected/collections/${collection_id}`}
          className="flex text-xl md:text-2xl font-semibold text-gray-800  hover:underline"
          style={{ overflowWrap: 'break-word' }}
        >
          {name}
        </Link>

        <DropdownMenu button={<KebabMenuIcon size={20} />}>
          {last_viewed_at && (
            <DropdownItem icon={<ViewIcon />}>
              Last viewed: {getFormattedDistance(last_viewed_at)}
            </DropdownItem>
          )}
          <DropdownItem icon={<CreateIcon />}>
            Created at: {getFormattedDistance(created_at)}
          </DropdownItem>
          {isPublic && (
            <>
              <DropdownItem icon={<ViewIcon />}>{view_cnt} views</DropdownItem>
              <DropdownItem icon={<DownloadIcon />}>
                {save_cnt} saves
              </DropdownItem>
            </>
          )}
          <DropdownItem>
            <SwitcherButton
              offBody={
                <div className="inline-flex gap-1 items-center">
                  <LockIcon />
                  Private
                </div>
              }
              onBody={
                <div className="inline-flex gap-1 items-center">
                  <GlobalIcon />
                  Public
                </div>
              }
              checked={isPublic}
              onChange={handleAuthorizeChange}
            />
          </DropdownItem>

          <hr className="m-2" />
          {isPublic && (
            <DropdownItem icon={<ShareIcon />}>Share</DropdownItem>
          )}
          <DropdownItem
            onClick={() => startUpdateCollectionSession(index)}
            icon={<EditIcon />}
          >
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