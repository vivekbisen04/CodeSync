'use client';

import React, { useState, useEffect } from 'react';
import { UserPlus, UserCheck, Users } from 'lucide-react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';

interface FollowButtonProps {
  username: string;
  initialIsFollowing?: boolean;
  initialFollowersCount?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'ghost' | 'outline' | 'secondary';
  showCount?: boolean;
  showText?: boolean;
  className?: string;
  disabled?: boolean;
  currentUserId?: string; // To prevent following yourself
}

export function FollowButton({
  username,
  initialIsFollowing = false,
  initialFollowersCount = 0,
  size = 'md',
  variant = 'default',
  showCount = false,
  showText = true,
  className = '',
  disabled = false,
  currentUserId,
}: FollowButtonProps) {
  const { data: session } = useSession();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [followersCount, setFollowersCount] = useState(initialFollowersCount);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // Map size to Button component's accepted sizes
  const buttonSize = size === 'md' ? 'default' : size;

  // Handle hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Check if this is the current user (can't follow yourself)
  const isCurrentUser = currentUserId === (session?.user as any)?.id;

  // Fetch follow status when component mounts or user changes
  useEffect(() => {
    if (!isMounted || !username || isCurrentUser) return;

    const fetchFollowStatus = async () => {
      try {
        const response = await fetch(`/api/users/${username}/follow`);
        if (response.ok) {
          const data = await response.json();
          setIsFollowing(data.isFollowing);
          setFollowersCount(data.followersCount);
        }
      } catch (error) {
        console.error('Failed to fetch follow status:', error);
      }
    };

    fetchFollowStatus();
  }, [username, session, isMounted, isCurrentUser]);

  const handleFollow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      toast.error('Please sign in to follow users');
      return;
    }

    if (isCurrentUser) {
      toast.error('You cannot follow yourself');
      return;
    }

    if (isLoading || disabled) return;

    setIsLoading(true);

    // Optimistic update
    const newIsFollowing = !isFollowing;
    const newFollowersCount = newIsFollowing ? followersCount + 1 : followersCount - 1;
    
    setIsFollowing(newIsFollowing);
    setFollowersCount(newFollowersCount);

    try {
      const response = await fetch(`/api/users/${username}/follow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIsFollowing(data.isFollowing);
        setFollowersCount(data.followersCount);
        
        // Show success message
        if (data.isFollowing) {
          toast.success(`Now following @${username}!`, { duration: 2000 });
        } else {
          toast.success(`Unfollowed @${username}`, { duration: 2000 });
        }
      } else {
        // Revert optimistic update
        setIsFollowing(!newIsFollowing);
        setFollowersCount(newIsFollowing ? followersCount - 1 : followersCount + 1);
        
        const error = await response.json();
        toast.error(error.message || 'Failed to update follow status');
      }
    } catch (error) {
      // Revert optimistic update
      setIsFollowing(!newIsFollowing);
      setFollowersCount(newIsFollowing ? followersCount - 1 : followersCount + 1);
      
      console.error('Follow toggle error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render for current user
  if (isCurrentUser) {
    return null;
  }

  // Don't render until mounted to avoid hydration mismatch
  if (!isMounted) {
    return (
      <Button
        variant={variant}
        size={buttonSize}
        className={`${className} opacity-50`}
        disabled
      >
        <UserPlus className="h-4 w-4" />
        {showText && <span className="ml-2">Follow</span>}
        {showCount && <span className="ml-1">({followersCount})</span>}
      </Button>
    );
  }

  const sizeClasses = {
    sm: 'h-8 px-2 text-xs',
    md: 'h-9 px-3 text-sm',
    lg: 'h-10 px-4 text-base',
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  // Determine button variant based on follow status
  const buttonVariant = isFollowing ? 'outline' : variant;
  
  return (
    <Button
      variant={buttonVariant}
      size={buttonSize}
      onClick={handleFollow}
      disabled={isLoading || disabled || !session}
      className={`
        ${sizeClasses[size]} 
        ${className}
        ${isFollowing ? 'hover:bg-red-50 hover:text-red-600 hover:border-red-300' : ''}
        ${isLoading ? 'cursor-not-allowed opacity-50' : ''}
        transition-all duration-200
      `}
      title={
        !session 
          ? 'Sign in to follow users' 
          : isFollowing 
            ? `Unfollow @${username}` 
            : `Follow @${username}`
      }
    >
      {isFollowing ? (
        <UserCheck 
          className={`
            ${iconSizes[size]}
            ${isLoading ? 'animate-pulse' : ''}
            transition-all duration-200
          `}
        />
      ) : (
        <UserPlus 
          className={`
            ${iconSizes[size]}
            ${isLoading ? 'animate-pulse' : ''}
            transition-all duration-200
          `}
        />
      )}
      
      {showText && (
        <span className={`ml-2 ${isLoading ? 'animate-pulse' : ''}`}>
          {isLoading 
            ? (isFollowing ? 'Unfollowing...' : 'Following...') 
            : (isFollowing ? 'Following' : 'Follow')
          }
        </span>
      )}
      
      {showCount && (
        <span className={`ml-1 ${isLoading ? 'animate-pulse' : ''}`}>
          ({followersCount.toLocaleString()})
        </span>
      )}
    </Button>
  );
}

// Compact follow button for inline use (e.g., in snippet cards)
export function CompactFollowButton({
  username,
  currentUserId,
  className = '',
}: {
  username: string;
  currentUserId?: string;
  className?: string;
}) {
  return (
    <FollowButton
      username={username}
      currentUserId={currentUserId}
      size="sm"
      variant="ghost"
      showText={false}
      showCount={false}
      className={`h-6 w-6 p-0 ${className}`}
    />
  );
}

// Hook for managing follow state
export function useFollowButton(username: string) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFollowStatus = async () => {
    try {
      const response = await fetch(`/api/users/${username}/follow`);
      if (response.ok) {
        const data = await response.json();
        setIsFollowing(data.isFollowing);
        setFollowersCount(data.followersCount);
        setFollowingCount(data.followingCount);
      }
    } catch (error) {
      console.error('Failed to fetch follow status:', error);
    }
  };

  const toggleFollow = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/users/${username}/follow`, {
        method: 'POST',
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsFollowing(data.isFollowing);
        setFollowersCount(data.followersCount);
        return data;
      } else {
        throw new Error('Failed to toggle follow');
      }
    } catch (error) {
      console.error('Toggle follow error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isFollowing,
    followersCount,
    followingCount,
    isLoading,
    fetchFollowStatus,
    toggleFollow,
  };
}

// Simple followers count display component
export function FollowersCount({
  count,
  className = '',
  size = 'md',
}: {
  count: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={`flex items-center gap-1 text-muted-foreground ${textSizes[size]} ${className}`}>
      <Users className={iconSizes[size]} />
      <span>{count.toLocaleString()} {count === 1 ? 'follower' : 'followers'}</span>
    </div>
  );
}