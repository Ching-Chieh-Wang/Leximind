// components/CollectionCard.jsx
import GlobalCollectionCardHeader from './globalCollectionCard/GlobalCollectionCardHeader';
import GlobalCollectionCardFooter from './globalCollectionCard/GlobalCollectionCardFooter';
import Card from '../Card';
import GlobalCollectionCardBody from './globalCollectionCard/GlobalCollectionCardBody';

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