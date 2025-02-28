import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import generateSignedUrl from '@/config/c2';

const isC2Image = (image) => {
  return image.startsWith('C2');
};

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
        try {
          if (!credentials || !credentials.email || !credentials.password) {
            return null;
          }
          // Send login request to your backend
          const res = await fetch(`${process.env.BACKEND_API_URL}/api/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!res.ok) {
            const errorData = await res.json();
            console.error("Authorization failed: ", errorData.message || 'Login failed');
            throw new Error(errorData.message || 'Login failed');
          }

          const data = await res.json();
          return { ...data.user, accessToken: data.token };
        } catch(error){
          console.error("Error login", error);
          throw error;
        }
      }
    }),
  ],



  callbacks: {
    async jwt({ user, token, trigger, session, account }) {
      try {
        if (
          user?.image &&
          (user.login_provider !== 'google' || isC2Image(session.user.image))
        ) {
          user.image = await generateSignedUrl(user.image);
        }
        if (account && user) {
          if (account.provider === 'google' && account.id_token) {

            // Send the Google ID token to your backend
            const res = await fetch(`${process.env.BACKEND_API_URL}/api/users/google`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token_id: account.id_token }),
            });

            const data = await res.json();
            
            if (res.ok) {
              token.user = { ...data.user, accessToken: data.token };
            } else {
              console.error("Google login failed: ", data.message || 'Google login failed');
              throw new Error(data.message || 'Google login failed');
            }
          } else if (account.provider === 'credentials') {
            token.user = user;
          }
        } else if (trigger === "update") {
          if(session){
            session.user.image= await generateSignedUrl(session.user.image)
            token.user.username = session.user.username;
            token.user.email = session.user.email;
            token.user.image= session.user.image;
          }
        }
        return token;
      } catch (error) {
        console.error("Error in JWT callback: ", error);
        throw(error)
      }
    },





    async session({ session, token }) {
      if(token){
        session.user=token.user;
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

