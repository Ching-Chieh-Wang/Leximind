// components/CollectionCard.jsx
import GlobalCollectionCardHeader from "./GlobalCollectionCard/GlobalCollectionCardHeader";
import GlobalCollectionCardBody from "./GlobalCollectionCard/GlobalCollectionCardBody";
import GlobalCollectionCardFooter from "./GlobalCollectionCard/GlobalCollectionCardFooter";

const GlobalCollectionCard = ({
  id,
  name,
  description,
  username,
  userImg,
  wordsCnt,
  viewCnt,
  saveCnt,
}) => {
  return (
    <div className="bg-white border rounded-lg shadow-md mt-4">
      {/* Header */}
      <GlobalCollectionCardHeader name={name} viewCnt={viewCnt} saveCnt={saveCnt}/>

      {/* Body */}
      <GlobalCollectionCardBody
        description={description}
        username={username}
        profileImg={profileImg}
        wordsCnt={wordsCnt}
      />

      {/* Footer */}
      <GlobalCollectionCardFooter  id={id}/>
    </div>
  );
};

export default GlobalCollectionCard;