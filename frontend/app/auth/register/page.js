'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ErrorMsg from '@/components/msg/ErrorMsg';
import Card from '@/components/Card';
import FormButton from '@/components/buttons/FormButton'

export default function RegisterPage() {
  const { data: session, status, update } = useSession();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    update()
    if (status === 'authenticated') {
      router.push('/'); // Redirect to profile or home page
    }
  }, [status, session,router]);

  // State to store field-specific errors
  const [fieldErrors, setFieldErrors] = useState({});



  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Clear previous errors
    setFieldErrors({});


    try {
      // Call the internal Next.js API route for registering the user
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 400 && data.errors) {
          // Handle field-specific errors
          const errors = {};
          data.errors.forEach((error) => {
            if (!errors[error.path]) {
              errors[error.path] = error.msg; // Store only the first error for each field
            }
          });
          setFieldErrors(errors);
        } else {
          // Handle general errors
          setFieldErrors({ general: data.message || 'Registration failed. Please try again.' });
        }
        return;
      }
      alert("Register sucessfully! Please log in.")
      // Redirect the user to the login page after successful registration
      router.push('/auth/login');

    } catch (error) {
      setFieldErrors({ general: error.message });
    }finally{
      setIsLoading(false);
    }
  };

  return (
    <Card maxWidth="sm:max-w-md">
      <h1 className="text-xl font-bold text-gray-900">Register your account</h1>

          {/* Show general error message */}
          {fieldErrors.general && <ErrorMsg>{fieldErrors.general}</ErrorMsg>}

          <form className="space-y-6" onSubmit={handleRegister}>
            <div>
              <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900">
                Your username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}ß
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-teal-600 focus:border-teal-600 block w-full p-2.5"
                placeholder="Username"
                required
              />
              {/* Display field-specific error for username */}
              {fieldErrors.username && <ErrorMsg>{fieldErrors.username}</ErrorMsg>}
            </div>

            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
                Your email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-teal-600 focus:border-teal-600 block w-full p-2.5"
                placeholder="name@company.com"
                required
              />
              {/* Display field-specific error for email */}
              {fieldErrors.email && <ErrorMsg>{fieldErrors.email}</ErrorMsg>}
            </div>

            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-teal-600 focus:border-teal-600 block w-full p-2.5"
                placeholder="••••••••"
                required
              />
              {/* Display field-specific error for password */}
              {fieldErrors.password && <ErrorMsg>{fieldErrors.password}</ErrorMsg>}
            </div>

            <FormButton onClick={handleRegister} isLoading={isLoading}>
              Register
            </FormButton>

            <p className="text-sm font-light text-gray-500">
              Already have an account?{' '}
              <a href="/auth/login" className="font-medium text-teal-600 hover:underline">
                Login
              </a>
            </p>
          </form>
      </Card>
  );
}