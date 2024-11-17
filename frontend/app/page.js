// app/page.js

import Button from '@/components/buttons/Button';
import ToggleButton from '@/components/buttons/ToggleButton';
import GetStartedIcon from '@/components/icons/GetStartedIcon';
import RecentlyViewedCollections from '@/components/RecentlyViewedCollections';

const HomePage = () => {
  return (
    <main className="text-center py-16 ">
      <h1 className="text-5xl font-bold text-gray-800">Master Your Vocabulary with LexiMind</h1>
      <p className="text-lg text-gray-600 mt-4">
        LexiMind is your personal vocabulary-building companion. 
        <br /><br />Using an intuitive, card-based approach, we make memorizing words effortless and effective. 
        <br />Whether you're prepping for exams, learning a new language,
        or enhancing your vocabulary, 
        <br /><br />LexiMind adapts to your needs and helps you learn faster.
      </p>
      <br />

      <Button href="/protected/collections">Get Started! <GetStartedIcon /></Button>

      {/* Render Recently Viewed Collections if user is logged in */}
      <RecentlyViewedCollections />
    </main>
  );
};

export default HomePage;