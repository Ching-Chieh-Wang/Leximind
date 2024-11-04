import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions = NextAuth({
  providers: [
    // Google OAuth Provider
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
    
    // Credentials Provider for Email/Password login
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Send login request to your backend
        const res = await fetch(`${process.env.BACKEND_API_URL}/api/users/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        const data = await res.json();

        // If login fails, throw an error
        if (!res.ok) {
          throw new Error(data.message || 'Login failed');
        }

        // Return the user object along with the JWT token received from the backend
        return {
          id: data.user.id,
          username: data.user.username,
          email: data.user.email,
          role: data.user.role,
          token: data.token,
        };
      },
    }),
  ],
  
  session: {
    strategy: 'jwt',  // Use JWT for session handling
    maxAge: 30 * 24 * 60 * 60,  // Set session expiry to 30 days (in seconds)
  },

  callbacks: {
    // JWT callback, triggered when a JWT token is created or updated
    async jwt({ token, user, account }) {
      // Handle first-time sign-in
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
            token.id = data.user.id;
            token.username = data.user.username;
            token.email = data.user.email;
            token.role = data.user.role;
            token.accessToken = data.token;  // Store the JWT token from backend
          } else {
            throw new Error(data.message || 'Google login failed');
          }
        } else if (account.provider === 'credentials') {
          // For credentials provider, user object contains necessary info
          token.id = user.id;
          token.username = user.username;
          token.email = user.email;
          token.role = user.role;
          token.accessToken = user.token;
        }
      }
      return token;
    },
    
    // Session callback, used to pass the user data (from the JWT) to the frontend
    async session({ session, token }) {
      // Copy data from JWT token to session object
      session.user.id = token.id;
      session.user.username = token.username;
      session.user.email = token.email;
      session.user.role = token.role;
      session.accessToken = token.accessToken;
      return session;
    },
  },
});

export { authOptions as GET, authOptions as POST };