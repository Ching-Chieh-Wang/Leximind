
import Block from '../Block';
import Link from 'next/link';
import SearchIcon from '../icons/SearchIcon';
import CollectionsSearch from '../CollectionsSearch';
import Horizontal_Layout from '../Horizontal_Layout';


const SearchCollectionComponent = () => {


  return (
    <Horizontal_Layout>
      <div className="block [@media(max-width:500px)]:hidden">
        <CollectionsSearch />
      </div>
      <div className="hidden [@media(max-width:500px)]:block">
        <Block>
          <Link href="/collections/search?query=">
            <SearchIcon size={22} />
          </Link>
        </Block>
      </div>

    </Horizontal_Layout>


  );
};

export default SearchCollectionComponent;