import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { RegisterForm } from '@/components/auth/register-form';

export const metadata: Metadata = {
  title: 'Sign Up | CodeSync',
  description: 'Create your CodeSync account',
};

export default async function RegisterPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/dashboard');
  }

  return <RegisterForm />;
}