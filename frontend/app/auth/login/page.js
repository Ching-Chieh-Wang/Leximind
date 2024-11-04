'use client';

import { signIn, useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Page from '@/components/Page';
import ErrorMsg from '@/components/ErrorMsg';
import FormButton from '@/components/FormButton';

const LoginPage = () => {
  const { data: session, status, update } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // If the user is already authenticated, redirect them
  useEffect(() => {
    update();
    if (status === 'authenticated') {
      router.push('/'); // Redirect to profile page or any other page
    }
  }, [status, session, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null); // Reset previous error

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result.error) {
        setError(result.error);
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Page>
      <h1 className="text-xl font-bold text-gray-900">Log in to your account</h1>

      <button
        onClick={() => signIn('google')}
        className="w-full inline-flex items-center justify-center py-2.5 px-5 mb-2 text-sm font-medium text-gray-900 bg-white rounded-lg border hover:bg-gray-100"
      >
        <svg
          className="w-5 h-5 mr-2"
          viewBox="0 0 21 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0)">
            <path
              d="M20.308 10.23c0-.68-.056-1.364-.173-2.03h-9.43v3.85h5.401a4.857 4.857 0 01-1.999 2.038v2.498h3.223c1.892-1.742 2.98-4.314 2.98-7.357z"
              fill="#3F83F8"
            />
            <path
              d="M10.702 20c2.697 0 4.972-0.885 6.629-2.414l-3.223-2.498c-.896.61-2.053.955-3.401.955-2.609 0-4.821-1.76-5.615-4.126H1.766v2.576C3.464 17.87 6.922 20 10.702 20z"
              fill="#34A853"
            />
            <path
              d="M5.089 11.917c-.418-1.242-.418-2.586 0-3.829V5.512H1.767a9.983 9.983 0 000 8.982l3.322-2.576z"
              fill="#FBBC04"
            />
            <path
              d="M10.702 3.958c1.426 0 2.804.537 3.837 1.522l2.855-2.855c-1.808-1.697-4.207-2.63-6.691-2.63C6.921 0 3.464 2.132 1.766 5.512L5.088 8.088c.79-2.37 3.006-4.13 5.615-4.13z"
              fill="#EA4335"
            />
          </g>
          <defs>
            <clipPath id="clip0">
              <rect width="20" height="20" fill="white" />
            </clipPath>
          </defs>
        </svg>
        Sign in with Google
      </button>

      <div className="flex items-center">
        <div className="w-full h-0.5 bg-gray-200"></div>
        <div className="px-5 text-center text-gray-500">or</div>
        <div className="w-full h-0.5 bg-gray-200"></div>
      </div>

      {error && <ErrorMsg>{error}</ErrorMsg>}

      <form className="space-y-6" onSubmit={handleLogin}>
        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Your email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-teal-600 focus:border-teal-600 block w-full p-2.5"
            placeholder="name@company.com"
            required
            autoComplete="on"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-teal-600 focus:border-teal-600 block w-full p-2.5"
            placeholder="••••••••"
            required
            autoComplete="on"
          />
        </div>

        <FormButton isLoading={isLoading}>Sign in</FormButton>

        <p className="text-sm font-light text-gray-500">
          Don’t have an account yet?{' '}
          <a
            href="/auth/register"
            className="font-medium text-teal-600 hover:underline"
          >
            Sign up
          </a>
        </p>
      </form>
    </Page>
  );
};

export default LoginPage;