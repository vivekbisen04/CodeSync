'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  Search,
  Plus,
  Bell,
  User,
  Settings,
  LogOut,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { APP_NAME } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const searchUrl = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
      router.push(searchUrl as any);
      setSearchQuery('');
    }
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-foreground flex items-center justify-center">
              <span className="text-background font-bold text-sm">CS</span>
            </div>
            <span className="hidden font-bold sm:inline-block">
              {APP_NAME}
            </span>
          </Link>
        </div>

        <div className="flex flex-1 items-center space-x-2">
          <form onSubmit={handleSearch} className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search snippets, users..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
        </div>

        <div className="flex items-center space-x-2">
          {session ? (
            <>
              <Button variant="ghost" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
              
              <Button
                onClick={() => router.push('/new')}
                size="sm"
                className="hidden sm:flex"
              >
                <Plus className="mr-2 h-4 w-4" />
                New Snippet
              </Button>

              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="relative p-1"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={session.user?.image || undefined} />
                    <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                      {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>

                {isMenuOpen && (
                  <div className="absolute right-0 top-12 w-48 rounded-md border bg-popover p-1 shadow-md">
                    <div className="flex items-center gap-3 px-3 py-2 text-sm">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={session.user?.image || undefined} />
                        <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                          {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{session.user?.name}</p>
                        <p className="text-muted-foreground truncate">
                          @{(session.user as any)?.username || 'username'}
                        </p>
                      </div>
                    </div>
                    <div className="border-t my-1" />
                    <Link href="/dashboard">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Button>
                    </Link>
                    <Link href="/settings">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Button>
                    </Link>
                    <div className="border-t my-1" />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleSignOut();
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </Button>
                  </div>
                )}
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="sm:hidden"
                onClick={() => router.push('/new')}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" onClick={() => router.push('/login')}>
                Sign In
              </Button>
              <Button onClick={() => router.push('/register')}>
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}