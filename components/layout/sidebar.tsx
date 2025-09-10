'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Code,
  Users,
  TrendingUp,
  Bookmark,
  User,
  Settings,
  Plus,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarProps {
  className?: string;
}

const navigation = [
  {
    name: 'Home',
    href: '/dashboard',
    icon: Home,
  },
  {
    name: 'My Snippets',
    href: '/my-snippets',
    icon: Code,
  },
  {
    name: 'Explore',
    href: '/explore',
    icon: TrendingUp,
  },
  {
    name: 'Following',
    href: '/following',
    icon: Users,
  },
  {
    name: 'Bookmarks',
    href: '/bookmarks',
    icon: Bookmark,
  },
];

const bottomNavigation = [
  {
    name: 'Profile',
    href: '/profile',
    icon: User,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn('flex h-full max-h-screen flex-col gap-2', className)}>
      <div className="flex h-14 items-center border-b px-4">
        <Button className="w-full" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          New Snippet
        </Button>
      </div>
      <div className="flex-1">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href as any}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                  isActive && 'bg-muted text-primary'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="mt-auto">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {bottomNavigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href as any}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                  isActive && 'bg-muted text-primary'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}