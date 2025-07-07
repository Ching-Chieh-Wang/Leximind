import Link from 'next/link';
import Image from 'next/image';
import Block from '../Block';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import LoginLogoutComponent from './LoginLogoutComponent';
import SearchCollectionComponent from './SearchCollectionComponent';
import SearchIcon from '../icons/SearchIcon';
import Horizontal_Layout from '../Horizontal_Layout';


const Nav = () => {
  const { initialSession } = getServerSession(authOptions);
  console.log('initialSession in Nav', initialSession);
  return (
    <nav className="flex items-center justify-between bg-transparent ">
      {/* Logo and Brand Name */}
      <Horizontal_Layout justify='start'>
        <Link href="/" className="flex items-center space-x-3 sm:space-x-6">
          <Image
            src="/assets/images/logo.jpg"
            width={40}
            height={40}
            className="w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16"
            alt="Logo"
          />
          <h2 className="text-2xl lg:text-3xl font-manrope font-black leading-snug text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-indigo-400 to-sky-300">
            LexiMind
          </h2>

        </Link>
      </Horizontal_Layout>

      <Horizontal_Layout justify='end'>
        <div className="[@media(max-width:480px)]:hidden pl-6 md:pl-16">
          <SearchCollectionComponent />
        </div>
        <div className="hidden [@media(max-width:480px)]:block">
          <Block>
            <Link href="/collections/search">
              <SearchIcon size={22} />
            </Link>
          </Block>
        </div>
        <LoginLogoutComponent initialSession={initialSession} />
      </Horizontal_Layout>
    </nav>
  );
};

export default Nav;