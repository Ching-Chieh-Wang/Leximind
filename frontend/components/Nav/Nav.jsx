import Link from 'next/link';
import Image from 'next/image';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import LoginLogoutComponent from './LoginLogoutComponent';


const Nav =  () => {
  const {initialSession} =getServerSession(authOptions);
  return (
    <nav className="flex items-center justify-between bg-transparent">
      {/* Logo and Brand Name */}
      <Link href="/" className="flex items-center space-x-3 sm:space-x-6">
        <Image
          src="/assets/images/logo.jpg"
          width={40}
          height={40}
          className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16"
          alt="Logo"
        />
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-manrope font-black leading-snug text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-indigo-400 to-sky-300">
          LexiMind
        </h2>
      </Link>


      <div className="flex items-center space-x-3 sm:space-x-6">
        <LoginLogoutComponent initialSession={initialSession}/>
      </div>
    </nav>
  );
};

export default Nav;