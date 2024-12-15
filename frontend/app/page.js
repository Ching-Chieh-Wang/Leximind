import Button from '@/components/Buttons/Button';
import GetStartedIcon from '@/components/icons/GetStartedIcon';
import { CollectionsProvider } from '@/context/CollectionsContext';
import RecentlyViewedCollectionsComponent from '@/components/Collections/RecentlyViewedCollectionsComponent';
import FireIcon from '@/components/icons/FireIcon';
import HorizontalLayout from '@/components/horizontalLayout';

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
      <HorizontalLayout>
        <Button href="/protected/collections">Get Started! <GetStartedIcon /></Button>
        <Button href="/collections/search?query=">Popular Collections <FireIcon /></Button>
      </HorizontalLayout>



      {/* Render Recently Viewed Collections if user is logged in */}
      <CollectionsProvider type="user">
        <RecentlyViewedCollectionsComponent />
      </CollectionsProvider>
    </div>



  );
};

export default HomePage;