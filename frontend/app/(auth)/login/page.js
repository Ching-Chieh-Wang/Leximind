// app/(auth)/login/page.js
import LoginForm from "@/components/LoginForm"
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";

export default async function LoginPage({ searchParams }) {
  // Fetch the session on the server side
  const session = await getServerSession(authOptions);

  // Extract the "callbackUrl" from searchParams
  const callbackUrl = searchParams?.callbackUrl || "/";

  // If the user is already logged in, redirect to the callbackUrl
  if (session) {
    redirect(callbackUrl);
  }

  // Render the login page if the user is not authenticated
  return (
    <LoginForm/>
  );
}