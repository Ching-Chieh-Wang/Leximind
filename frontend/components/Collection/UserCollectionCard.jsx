// components/CollectionCard.jsx
import UserCollectionCardHeader from './UserCollectionCard/UserCollectionCardHeader';
import UserCollectionCardBody from './UserCollectionCard/UserCollectionCardBody';
import UserCollectionCardFooter from './UserCollectionCard/UserCollectionCardFooter';
import Card from '../Card';

const UserCollectionCard = ({ index }) => {


  return (
    <Card>
      {/* Header */}
      <UserCollectionCardHeader index={index}/>

      {/* Body */}
      <UserCollectionCardBody index={index}/>

      {/* Footer */}
      <UserCollectionCardFooter index={index}/>
    </Card>
  );
};

export default UserCollectionCard;