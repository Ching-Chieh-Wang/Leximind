'use client'

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import LoggedInComponent from './LoggedInComponent';
import LoggedOutComponent from './LoggedOutComponent';

const LoginLogoutComponent = ({initialSession}) => {
    const { data: session, status } = useSession();
    const [user,setUser]=useState(initialSession?.user||null);
    // Synchronize session state
    useEffect(() => {

      if (status === 'authenticated') {
        setUser(session?.user)
      }
      else{
        setUser(null)
      }
    }, [session, status]);
  return (
    user? <LoggedInComponent user={user}/>:<LoggedOutComponent/>
  )
}

export default LoginLogoutComponent