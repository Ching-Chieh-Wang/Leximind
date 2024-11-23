// components/CollectionCard.jsx
import UserCollectionCardHeader from './UserCollectionCard/UserCollectionCardHeader';
import UserCollectionCardBody from './UserCollectionCard/UserCollectionCardBody';
import { UserCollectionStatus } from './UserCollectionCard/UserCollectionStatus';
import UserCollectionCardFooter from './UserCollectionCard/UserCollectionCardFooter';
import Card from '../Card';

const UserCollectionCard = ({ index }) => {
  return (
    <Card type="card">
      
      <UserCollectionCardHeader index={index} />

      <UserCollectionCardBody index={index} />

      <UserCollectionStatus index={index} />

      <UserCollectionCardFooter index={index} />
    </Card>
  );
};



export default UserCollectionCard;