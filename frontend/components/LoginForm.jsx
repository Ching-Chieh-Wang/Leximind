'use client';

import { signIn } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Card from '@/components/Card';
import ErrorMsg from '@/components/msg/ErrorMsg';
import FormSubmitButton from '@/components/buttons/FormSubmitButton';
import GoogleIcon from '@/components/icons/Google';
import ToggleButton from './buttons/ToggleButton';
import Vertical_Layout from './Vertical_Layout';
import Horizontal_Layout from './Horizontal_Layout';

const LoginForm = () => {
  const { data: session, status, update } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams(); // Access query parameters
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  useEffect(() => {
    update();
    if (status === 'authenticated') {
      router.push(callbackUrl)
    }
  }
    , [session, status, router]
  )

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default browser form submission
    setIsLoading(true);
    setError(null); // Reset previous error

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (!res.ok) {
        setError(res.error || "An unexpected error occurred. Please try again");
        return;
      }

      router.push(callbackUrl); // Redirect to callback URL or home
      router.refresh();
    } catch (error) {
      console.error(error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <form onSubmit={handleLogin}>
      <Card type='form' title="Log in to your account">
        <button
          type="button"
          onClick={() => { signIn('google', { redirect: false }) }}
          className="w-full inline-flex items-center justify-center py-2.5 px-5 mb-2 text-sm font-medium text-gray-900 bg-white rounded-lg border hover:bg-gray-100"
        >
          <GoogleIcon />
          Sign in with Google
        </button>

        <Horizontal_Layout spacing='space-x-0.5'>
          <div className="w-full h-0.5 bg-gray-200"></div>
          <div className="px-5 text-center text-gray-500">or</div>
          <div className="w-full h-0.5 bg-gray-200"></div>
        </Horizontal_Layout>

        {error && <ErrorMsg>{error}</ErrorMsg>}


        <Vertical_Layout spacing='space-y-0.5'>
          <label className="block mb-2 text-sm font-medium text-gray-900">
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
        </Vertical_Layout>
        <Vertical_Layout spacing='space-y-0.5'>
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
        </Vertical_Layout>

        <FormSubmitButton isLoading={isLoading} >
          Sign in
        </FormSubmitButton>

        <p className="text-sm font-light text-gray-500">
          Don’t have an account yet?{'  '}
          <a
            href="/auth/register"
            className="font-medium text-teal-600 hover:underline"
          >
            Sign up
          </a>
        </p>
      </Card>
    </form>
  );
};

export default LoginForm;