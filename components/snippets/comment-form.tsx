'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { Send } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface CommentFormProps {
  snippetId: string;
  parentId?: string;
  placeholder?: string;
  onCommentAdded?: (comment: any) => void;
  onCancel?: () => void;
  showCancel?: boolean;
}

export function CommentForm({ 
  snippetId, 
  parentId, 
  placeholder = "Write a comment...", 
  onCommentAdded,
  onCancel,
  showCancel = false
}: CommentFormProps) {
  const { data: session } = useSession();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    if (!session) {
      toast.error('Please sign in to comment');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/snippets/${snippetId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content.trim(),
          parentId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to post comment');
      }

      const newComment = await response.json();
      
      // Reset form
      setContent('');
      
      // Notify parent component
      if (onCommentAdded) {
        onCommentAdded(newComment);
      }

      toast.success(parentId ? 'Reply posted!' : 'Comment posted!');
    } catch (error) {
      console.error('Comment submission error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to post comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center p-4 border rounded-lg bg-muted/50">
        <p className="text-muted-foreground">Please sign in to comment</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-3">
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={session.user?.image || undefined} />
          <AvatarFallback className="text-xs">
            {session.user?.name?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-3">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            className="min-h-[80px] resize-none"
            disabled={isSubmitting}
          />
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">
              {content.length}/1000 characters
            </span>
            <div className="flex gap-2">
              {showCancel && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                size="sm"
                disabled={!content.trim() || isSubmitting || content.length > 1000}
              >
                <Send className="mr-2 h-3 w-3" />
                {isSubmitting ? 'Posting...' : (parentId ? 'Reply' : 'Comment')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}