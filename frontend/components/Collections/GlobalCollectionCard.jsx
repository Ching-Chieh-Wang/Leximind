// components/CollectionCard.jsx
import GlobalCollectionCardHeader from './GlobalCollectionCard/GlobalCollectionCardHeader';
import GlobalCollectionCardFooter from './GlobalCollectionCard/GlobalCollectionCardFooter';
import Card from '../Card';
import GlobalCollectionCardBody from './GlobalCollectionCard/GlobalCollectionCardBody';

const UserCollectionCard = ({ index }) => {
  if(index==undefined){console.error("index must provide")}
  return (
    <Card type="card">
      <GlobalCollectionCardHeader index={index} />
      <GlobalCollectionCardBody index={index} />
      <GlobalCollectionCardFooter index={index} />
    </Card>
  );
};



export default UserCollectionCard;