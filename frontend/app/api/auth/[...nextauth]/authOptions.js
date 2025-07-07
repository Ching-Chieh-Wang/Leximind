import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
require('dotenv').config(); 

export const authOptions ={
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),

    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const res = await fetch(`${process.env.BACKEND_API_URL}/api/users/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        const data = await res.json();

        if(!res.ok) {
          throw new Error(data.message);
        }
        return data;
      }
    }),
  ],



  callbacks: {
    async jwt({ user, token, trigger, session, account }) {
      try {
        if (trigger === 'signIn' ) {
          if(account && account.provider === 'google') {
            // If the user is signing in with Google, fetch their profile
            const res = await fetch(`${process.env.BACKEND_API_URL}/api/users/google`, {
              method: 'POST',
              headers: {'Content-Type': 'application/json',},
              body: JSON.stringify({ token_id: account.id_token }),
            });
            const data = await res.json();

            if (!res.ok) {
              console.error('Error fetching user data when google login:', data.message);
              throw new Error('Failed to sign in with Google, please try again later.');
            }
            token = {...data}
          } 
          else if (account.provider === 'credentials') {
            // If the user is signing in with credentials, set the token with user data
            token = {...user}
          }
        } else if (trigger === 'update' && session ) {
          // If the user is updating their profile, update the token
          token = {...session};
        }
        return token;
      } catch (error) {
        console.error('JWT callback error:', error);
        throw new Error('Failed to process authentication, please try again later.');
      }
    },
    async session({ session, token }) {
      if(token){
        session={...token};
      }
      return session;
    },

    
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
};

