'use client'

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import LoggedInComponent from './LoggedInComponent';
import LoggedOutComponent from './LoggedOutComponent';
import { set } from 'date-fns';

const LoginLogoutComponent = ({initialSession}) => {
    const { data: session, status } = useSession();
    const [user,setUser]=useState(initialSession||null);
    // Synchronize session state
    useEffect(() => {
      setUser(session);
    }, [session, status]);
  return (
    user? <LoggedInComponent user={user}/>:<LoggedOutComponent/>
  )
}

export default LoginLogoutComponent