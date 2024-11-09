// middleware.js
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
    function middleware(req) {
        return NextResponse.next(); // Continue to the protected page if authenticated
    },
    {
        callbacks: {
            async authorized({ token }) {
                // Only allow access if the user has a valid token (session)
                return token;
            },
        },
        pages: {
            signIn: '/auth/login', // Redirect to login if unauthenticated
        },
    }
);

export const config = {
    matcher: ['/protected/:path*','/api/protected/:path*'], // Apply middleware to /api/protected-route
};