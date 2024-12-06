// components/CollectionCard.jsx
import GlobalCollectionCardHeader from './GlobalCollectionCard/GlobalCollectionCardHeader';
import GlobalCollectionCardFooter from './GlobalCollectionCard/GlobalCollectionCardFooter';
import Card from '../Card';
import CollectionCardBody from './CollectionCardBody';

const UserCollectionCard = ({ index }) => {
  return (
    <Card type="card">
      
      <GlobalCollectionCardHeader index={index} />

      <CollectionCardBody index={index} />

      <GlobalCollectionCardFooter index={index} />
    </Card>
  );
};



export default UserCollectionCard;