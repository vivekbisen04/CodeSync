'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const login = useCallback(async (redirectTo?: string) => {
    await signIn(undefined, { callbackUrl: redirectTo || '/dashboard' });
  }, []);

  const logout = useCallback(async () => {
    await signOut({ callbackUrl: '/' });
  }, []);

  const requireAuth = useCallback(() => {
    if (status === 'loading') return false;
    
    if (!session) {
      router.push('/login');
      return false;
    }
    
    return true;
  }, [session, status, router]);

  return {
    user: session?.user || null,
    isAuthenticated: !!session,
    isLoading: status === 'loading',
    login,
    logout,
    requireAuth,
  };
}