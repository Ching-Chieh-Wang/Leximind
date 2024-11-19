// components/CollectionCard.jsx
import UserCollectionCardHeader from './UserCollectionCard/UserCollectionCardHeader';
import UserCollectionCardBody from './UserCollectionCard/UserCollectionCardBody';
import UserCollectionCardFooter from './UserCollectionCard/UserCollectionCardFooter';

const UserCollectionCard = ({ collection }) => {
  const {
    id,
    name,
    description,
    created_at,
    is_public,
    not_memorized_cnt,
    word_cnt,
    view_cnt,
    save_cnt,
    last_viewed_at
  } = collection;

  return (
    <div className="bg-white border rounded-lg shadow-md mt-4">
      {/* Header */}
      <UserCollectionCardHeader name={name} isPublic={is_public} viewCnt={view_cnt} saveCnt={save_cnt} id={id}/>

      {/* Body */}
      <UserCollectionCardBody
        description={description}
        not_memorized_cnt={not_memorized_cnt}
        created_at={created_at}
        word_cnt={word_cnt}
      />

      {/* Footer */}
      <UserCollectionCardFooter last_viewed_at={last_viewed_at} id={id}/>
    </div>
  );
};

export default UserCollectionCard;