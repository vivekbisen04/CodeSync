'use client';

import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';

interface LikeButtonProps {
  snippetId: string;
  initialIsLiked?: boolean;
  initialLikesCount?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'ghost' | 'outline';
  showCount?: boolean;
  className?: string;
  disabled?: boolean;
}

export function LikeButton({
  snippetId,
  initialIsLiked = false,
  initialLikesCount = 0,
  size = 'md',
  variant = 'ghost',
  showCount = true,
  className = '',
  disabled = false,
}: LikeButtonProps) {
  const { data: session } = useSession();
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // Map size to Button component's accepted sizes
  const buttonSize = size === 'md' ? 'default' : size;

  // Handle hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch like status when component mounts or user changes
  useEffect(() => {
    if (!isMounted || !snippetId) return;

    const fetchLikeStatus = async () => {
      try {
        const response = await fetch(`/api/snippets/${snippetId}/like`);
        if (response.ok) {
          const data = await response.json();
          setIsLiked(data.isLiked);
          setLikesCount(data.likesCount);
        }
      } catch (error) {
        console.error('Failed to fetch like status:', error);
      }
    };

    fetchLikeStatus();
  }, [snippetId, session, isMounted]);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      toast.error('Please sign in to like snippets');
      return;
    }

    if (isLoading || disabled) return;

    setIsLoading(true);

    // Optimistic update
    const newIsLiked = !isLiked;
    const newLikesCount = newIsLiked ? likesCount + 1 : likesCount - 1;
    
    setIsLiked(newIsLiked);
    setLikesCount(newLikesCount);

    try {
      const response = await fetch(`/api/snippets/${snippetId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIsLiked(data.isLiked);
        setLikesCount(data.likesCount);
        
        // Optional: Show subtle feedback
        if (data.isLiked) {
          toast.success('❤️ Liked!', { duration: 1000 });
        }
      } else {
        // Revert optimistic update
        setIsLiked(!newIsLiked);
        setLikesCount(newIsLiked ? likesCount - 1 : likesCount + 1);
        
        const error = await response.json();
        toast.error(error.message || 'Failed to update like');
      }
    } catch (error) {
      // Revert optimistic update
      setIsLiked(!newIsLiked);
      setLikesCount(newIsLiked ? likesCount - 1 : likesCount + 1);
      
      console.error('Like toggle error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render until mounted to avoid hydration mismatch
  if (!isMounted) {
    return (
      <Button
        variant={variant}
        size={buttonSize}
        className={`${className} opacity-50`}
        disabled
      >
        <Heart className="h-4 w-4" />
        {showCount && <span className="ml-1">0</span>}
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

  return (
    <Button
      variant={variant}
      size={buttonSize}
      onClick={handleLike}
      disabled={isLoading || disabled || !session}
      className={`
        ${sizeClasses[size]} 
        ${className}
        ${isLiked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-foreground'}
        ${isLoading ? 'cursor-not-allowed opacity-50' : ''}
        transition-all duration-200
      `}
      title={session ? (isLiked ? 'Unlike' : 'Like') : 'Sign in to like'}
    >
      <Heart 
        className={`
          ${iconSizes[size]}
          ${isLiked ? 'fill-current' : ''}
          ${isLoading ? 'animate-pulse' : ''}
          transition-all duration-200
        `}
      />
      {showCount && (
        <span className={`ml-1 ${isLoading ? 'animate-pulse' : ''}`}>
          {likesCount.toLocaleString()}
        </span>
      )}
    </Button>
  );
}

// Hook for managing like state
export function useLikeButton(snippetId: string) {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLikeStatus = async () => {
    try {
      const response = await fetch(`/api/snippets/${snippetId}/like`);
      if (response.ok) {
        const data = await response.json();
        setIsLiked(data.isLiked);
        setLikesCount(data.likesCount);
      }
    } catch (error) {
      console.error('Failed to fetch like status:', error);
    }
  };

  const toggleLike = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/snippets/${snippetId}/like`, {
        method: 'POST',
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsLiked(data.isLiked);
        setLikesCount(data.likesCount);
        return data;
      } else {
        throw new Error('Failed to toggle like');
      }
    } catch (error) {
      console.error('Toggle like error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLiked,
    likesCount,
    isLoading,
    fetchLikeStatus,
    toggleLike,
  };
}