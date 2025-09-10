'use client';

import { useState } from 'react';
import { MessageSquare, Reply } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CommentForm } from './comment-form';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string | null;
    username: string | null;
    image: string | null;
  };
  replies?: Comment[];
  _count?: {
    replies: number;
  };
}

interface CommentItemProps {
  comment: Comment;
  snippetId: string;
  onCommentAdded?: (comment: any) => void;
  isReply?: boolean;
}

export function CommentItem({ 
  comment, 
  snippetId, 
  onCommentAdded, 
  isReply = false 
}: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replies, setReplies] = useState(comment.replies || []);

  const handleReplyAdded = (newReply: Comment) => {
    setReplies(prev => [...prev, newReply]);
    setShowReplyForm(false);
    if (onCommentAdded) {
      onCommentAdded(newReply);
    }
  };

  return (
    <div className={`space-y-3 ${isReply ? 'ml-12' : ''}`}>
      <div className="flex gap-3">
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={comment.author.image || undefined} />
          <AvatarFallback className="text-xs">
            {comment.author.name?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">
                {comment.author.name || 'Unknown User'}
              </span>
              <span className="text-muted-foreground">
                @{comment.author.username || 'unknown'}
              </span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {comment.content}
            </p>
          </div>
          
          {!isReply && (
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-1 text-muted-foreground hover:text-foreground"
                onClick={() => setShowReplyForm(!showReplyForm)}
              >
                <Reply className="mr-1 h-3 w-3" />
                <span className="text-xs">Reply</span>
              </Button>
              
              {(replies.length > 0 || (comment._count?.replies && comment._count.replies > 0)) && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MessageSquare className="h-3 w-3" />
                  <span>
                    {replies.length || comment._count?.replies || 0} 
                    {' '}
                    {((replies.length || comment._count?.replies || 0) === 1) ? 'reply' : 'replies'}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showReplyForm && (
        <div className="ml-11">
          <CommentForm
            snippetId={snippetId}
            parentId={comment.id}
            placeholder={`Reply to ${comment.author.name || 'this comment'}...`}
            onCommentAdded={handleReplyAdded}
            onCancel={() => setShowReplyForm(false)}
            showCancel={true}
          />
        </div>
      )}

      {replies.length > 0 && (
        <div className="space-y-3 border-l-2 border-muted pl-4 ml-8">
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              snippetId={snippetId}
              onCommentAdded={onCommentAdded}
              isReply={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}