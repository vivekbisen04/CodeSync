import { User, Account, Session } from '@prisma/client';

export interface AuthUser extends User {
  accounts?: Account[];
  sessions?: Session[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  username: string;
}

export interface AuthResponse {
  user: AuthUser | null;
  error?: string;
  success?: boolean;
}

export interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  username?: string | null;
}

export interface AuthContextType {
  user: SessionUser | null;
  loading: boolean;
  signIn: (credentials: LoginCredentials) => Promise<AuthResponse>;
  signUp: (credentials: RegisterCredentials) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<AuthUser>) => Promise<AuthResponse>;
}