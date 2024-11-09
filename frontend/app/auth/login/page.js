'use client';

import { signIn, useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Card from '@/components/Card';
import ErrorMsg from '@/components/msg/ErrorMsg';
import FormButton from '@/components/buttons/FormButton';
import GoogleIcon from '@/components/icons/Google';

const LoginPage = () => {
  const { data: session, status, update } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams(); // Access query parameters
  const [isRedirected, setIsRedirected] = useState(false); // Track redirection state


  // If the user is already authenticated, redirect them
  useEffect(() => {
    if (!isRedirected) {
      update();
      // Redirect only when session status is 'authenticated' and not already redirected
      if (status === 'authenticated') {
        // Call update to sync the session state across tabs

        const callbackUrl = searchParams.get('callbackUrl') || '/';
        setIsRedirected(true); // Set redirection flag to true
        router.push(callbackUrl); // Redirect to callback URL or home
      }
    }
  }, [status, session]);

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
      const callbackUrl = searchParams.get('callbackUrl') || '/';
      setIsRedirected(true); // Set redirection flag to true
      router.push(callbackUrl); // Redirect to callback URL or home
    } catch (error) {
      console.error(error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card maxWidth="sm:max-w-md">
      <h1 className="text-xl font-bold text-gray-900">Log in to your account</h1>

      <button
        onClick={() => signIn('google')}
        className="w-full inline-flex items-center justify-center py-2.5 px-5 mb-2 text-sm font-medium text-gray-900 bg-white rounded-lg border hover:bg-gray-100"
      >
        <GoogleIcon/>
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

        <FormButton isLoading={isLoading} onClick={handleLogin}>
          Sign in
        </FormButton>

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
    </Card>
  );
};

export default LoginPage;