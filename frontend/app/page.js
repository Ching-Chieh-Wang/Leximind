import Button from '@/components/buttons/Button';
import GetStartedIcon from '@/components/icons/GetStartedIcon';
import { CollectionsProvider } from '@/context/CollectionsContext';
import RecentlyViewedCollectionsComponent from '@/components/collections/RecentlyViewedCollectionsComponent';
import FireIcon from '@/components/icons/FireIcon';
import Horizontal_Layout from '@/components/Horizontal_Layout';
import CollectionPage from './collections/[collection_id]/page';
import { CollectionProvider } from '@/context/collection/CollectionContext';
import DemoCollection from '@/components/collection/DemoCollection';
import GridBackground from '@/components/GridBackground';

const HomePage = () => {
  return (
    <div className="flex-col  py-16 space-y-8 items-center">
      <h1 className="text-center text-3xl md:text-5xl font-bold text-gray-800">Master Your Vocabulary with LexiMind</h1>

      <p className="text-center text-sm md:text-lg text-gray-600 ">
        LexiMind is your personal vocabulary-building companion.
        <br /><br />Using an intuitive, card-based approach, we make memorizing words effortless and effective.
        <br />Whether you're prepping for exams, learning a new language,
        or enhancing your vocabulary,
        <br /><br />LexiMind adapts to your needs and helps you learn faster.
      </p>
      <br />
      <Horizontal_Layout>
        <Button href="/protected/collections">Get Started! <GetStartedIcon /></Button>
        <Button href="/collections/search?query=">Popular Collections <FireIcon /></Button>
      </Horizontal_Layout>



      {/* Render Recently Viewed Collections if user is logged in */}
      <CollectionsProvider type="user">
        <RecentlyViewedCollectionsComponent />
      </CollectionsProvider>

      <GridBackground/>
  {/* Try it Callout */}
    <div className="flex justify-center">
      <span className="mt-10 inline-block bg-gradient-to-r from-teal-400 via-blue-400 to-indigo-400 text-white font-semibold rounded-full px-6 py-2 shadow-md text-lg md:text-xl animate-pulse">
        👀 Explore how it works
      </span>
    </div>

      <CollectionProvider isPublic={true}>
        <DemoCollection/>
      </CollectionProvider>
    </div>



  );
};

export default HomePage;