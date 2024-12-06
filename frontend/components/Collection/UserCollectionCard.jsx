// components/CollectionCard.jsx
import UserCollectionCardHeader from './UserCollectionCard/UserCollectionCardHeader';
import CollectionCardBody from './CollectionCardBody';
import { UserCollectionStatus } from './UserCollectionCard/UserCollectionStatus';
import UserCollectionCardFooter from './UserCollectionCard/UserCollectionCardFooter';
import Card from '../Card';

const UserCollectionCard = ({ index }) => {
  return (
    <Card type="card">
      
      <UserCollectionCardHeader index={index} />

      <CollectionCardBody index={index} />

      <UserCollectionStatus index={index} />

      <UserCollectionCardFooter index={index} />
    </Card>
  );
};



export default UserCollectionCard;