'use client';

import { useState, useEffect } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { Heart, MessageSquare, Share, Copy, Eye, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/header';
import { CommentForm } from '@/components/snippets/comment-form';
import { CommentItem } from '@/components/snippets/comment-item';
import { LikeButton } from '@/components/ui/like-button';

interface SnippetPageProps {
  params: {
    id: string;
  };
}

interface Snippet {
  id: string;
  title: string;
  description: string | null;
  content: string;
  language: string;
  tags: string[];
  isPublic: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string | null;
    username: string | null;
    image: string | null;
  };
  _count: {
    likes: number;
    comments: number;
  };
}

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
}

export default function SnippetPage({ params }: SnippetPageProps) {
  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [shareUrlCopied, setShareUrlCopied] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);

  useEffect(() => {
    const fetchSnippet = async () => {
      try {
        const response = await fetch(`/api/snippets/${params.id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            notFound();
            return;
          }
          throw new Error('Failed to fetch snippet');
        }

        const data = await response.json();
        setSnippet(data.snippet);
        setComments(data.comments || []);
        setIsLiked(data.isLiked || false);
        setLikesCount(data.snippet._count.likes);
        setCommentsCount(data.snippet._count.comments);
      } catch (error) {
        console.error('Failed to fetch snippet:', error);
        toast.error('Failed to load snippet');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchSnippet();
    }
  }, [params.id]);

  const handleCopyCode = async () => {
    if (!snippet) return;
    
    try {
      await navigator.clipboard.writeText(snippet.content);
      setCopied(true);
      toast.success('Code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy code');
    }
  };

  const handleShareSnippet = async () => {
    const shareUrl = window.location.href;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareUrlCopied(true);
      toast.success('Snippet URL copied to clipboard!');
      setTimeout(() => setShareUrlCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy URL');
    }
  };

  const handleLike = async () => {
    if (!snippet) return;

    try {
      const response = await fetch(`/api/snippets/${snippet.id}/like`, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        setIsLiked(data.isLiked);
        setLikesCount(data.likesCount);
        toast.success(data.message);
      }
    } catch (error) {
      toast.error('Failed to update like');
    }
  };

  const handleCommentAdded = (newComment: any) => {
    if (newComment.parentId) {
      // This is a reply, don't add to main comments list
      // The CommentItem component handles reply updates
      return;
    }
    
    // Add new comment to the beginning of the list
    setComments(prev => [newComment, ...prev]);
    setCommentsCount(prev => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-4xl">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Loading snippet...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!snippet) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Header */}
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold">{snippet.title}</h1>
              {snippet.description && (
                <p className="mt-2 text-lg text-muted-foreground">
                  {snippet.description}
                </p>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-xs font-medium text-primary-foreground">
                      {snippet.author.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{snippet.author.name || 'Unknown'}</p>
                    <p className="text-xs text-muted-foreground">
                      @{snippet.author.username || 'unknown'}
                    </p>
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  {new Date(snippet.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={handleShareSnippet}>
                  {shareUrlCopied ? (
                    <Check className="mr-2 h-4 w-4 text-green-600" />
                  ) : (
                    <Share className="mr-2 h-4 w-4" />
                  )}
                  {shareUrlCopied ? 'Copied!' : 'Share'}
                </Button>
                <Button variant="outline" size="sm" onClick={handleCopyCode}>
                  {copied ? (
                    <Check className="mr-2 h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="mr-2 h-4 w-4" />
                  )}
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {snippet.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Code Content */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge>{snippet.language}</Badge>
                <span className="text-sm text-muted-foreground">
                  {snippet.content.split('\n').length} lines
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={handleCopyCode}>
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </CardHeader>
            <CardContent>
              <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
                <code>{snippet.content}</code>
              </pre>
            </CardContent>
          </Card>

          {/* Stats and Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {snippet.views} views
              </span>
              <LikeButton
                snippetId={snippet.id}
                initialIsLiked={isLiked}
                initialLikesCount={likesCount}
                size="sm"
                variant="ghost"
                showCount={true}
                className="p-0 h-auto text-muted-foreground hover:text-foreground"
              />
              <span className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                {commentsCount} comments
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <LikeButton
                snippetId={snippet.id}
                initialIsLiked={isLiked}
                initialLikesCount={likesCount}
                size="sm"
                variant="outline"
                showCount={false}
              />
              <Button variant="outline" size="sm" onClick={handleShareSnippet}>
                {shareUrlCopied ? (
                  <Check className="mr-2 h-4 w-4 text-green-600" />
                ) : (
                  <Share className="mr-2 h-4 w-4" />
                )}
                Share
              </Button>
            </div>
          </div>

          {/* Comments */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">
                Comments ({commentsCount})
              </h3>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Comment Form */}
              <CommentForm 
                snippetId={snippet.id} 
                onCommentAdded={handleCommentAdded}
              />
              
              {/* Comments List */}
              {comments.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    No comments yet. Be the first to comment!
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {comments.map((comment) => (
                    <CommentItem
                      key={comment.id}
                      comment={comment}
                      snippetId={snippet.id}
                      onCommentAdded={handleCommentAdded}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}