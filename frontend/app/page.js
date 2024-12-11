import Button from '@/components/buttons/Button';
import GetStartedIcon from '@/components/icons/GetStartedIcon';
import { CollectionsProvider } from '@/context/CollectionsContext';
import RecentlyViewedCollectionsComponent from '@/components/Collection/RecentlyViewedCollectionsComponent';
import FireIcon from '@/components/icons/FireIcon';

const HomePage = () => {
  return (
    < >
      <div className="flex-col text-center py-16 space-y-8">
      <h1 className=" text-3xl md:text-5xl font-bold text-gray-800">Master Your Vocabulary with LexiMind</h1>

      <p className="text-sm md:text-lg text-gray-600 ">
        LexiMind is your personal vocabulary-building companion.
        <br /><br />Using an intuitive, card-based approach, we make memorizing words effortless and effective.
        <br />Whether you're prepping for exams, learning a new language,
        or enhancing your vocabulary,
        <br /><br />LexiMind adapts to your needs and helps you learn faster.
      </p>
      <br />
      </div>

      <div className="flex justify-center align-middle gap-x-4 items-center">
        <Button href="/protected/collections">Get Started! <GetStartedIcon /></Button>
        <Button href="/collections/search?query=">Popular Collections <FireIcon /></Button>
      </div>



      {/* Render Recently Viewed Collections if user is logged in */}
      <CollectionsProvider type="user">
        <RecentlyViewedCollectionsComponent />
      </CollectionsProvider>

    </>
  );
};

export default HomePage;