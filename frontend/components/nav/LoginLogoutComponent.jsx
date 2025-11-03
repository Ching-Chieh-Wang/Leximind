'use client';

import { useSession } from 'next-auth/react';
import LoggedInComponent from './LoggedInComponent';
import LoggedOutComponent from './LoggedOutComponent';

const LoginLogoutComponent = () => {
  const { data: session, status } = useSession();

  console.log(session)

  if (status === 'Loading...') {
    return null; // or a skeleton/placeholder if desired
  }
  return session ? (
    <LoggedInComponent />
  ) : (
    <LoggedOutComponent />
  );
};

export default LoginLogoutComponent;