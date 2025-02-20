import UserCollectionCardHeader from './userCollectionCard/UserCollectionCardHeader';
import UserCollectionCardBody from './userCollectionCard/UserCollectionCardBody';
import UserCollectionStatus  from './userCollectionCard/UserCollectionStatus';
import UserCollectionCardFooter from './userCollectionCard/UserCollectionCardFooter';
import Card from '../Card';

const UserCollectionCard = ({ index }) => {
  return (
    <Card type="card" >
      <UserCollectionCardHeader index={index} />
      <UserCollectionCardBody index={index} />
      <UserCollectionStatus index={index} />
      <UserCollectionCardFooter index={index} />
    </Card>
  );
};



export default UserCollectionCard;