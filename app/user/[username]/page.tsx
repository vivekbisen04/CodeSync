'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
  Calendar, 
  MapPin, 
  Link as LinkIcon, 
  Github, 
  Twitter,
  Code,
  Heart,
  MessageSquare,
  Eye,
  Users,
  UserCheck,
  Globe,
  Lock
} from 'lucide-react';
import toast from 'react-hot-toast';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FollowButton, FollowersCount } from '@/components/ui/follow-button';
import { LikeButton } from '@/components/ui/like-button';
import Link from 'next/link';

interface UserPageProps {
  params: {
    username: string;
  };
}

interface User {
  id: string;
  name: string | null;
  email: string | null;
  username: string | null;
  image: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  githubUrl: string | null;
  twitterUrl: string | null;
  createdAt: string;
  _count: {
    snippets: number;
    followers: number;
    following: number;
  };
}

interface Snippet {
  id: string;
  title: string;
  description: string | null;
  language: string;
  tags: string[];
  isPublic: boolean;
  createdAt: string;
  _count: {
    likes: number;
    comments: number;
  };
}

export default function UserPage({ params }: UserPageProps) {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('snippets');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${params.username}?includeSnippets=true`);
        
        if (!response.ok) {
          if (response.status === 404) {
            notFound();
            return;
          }
          throw new Error('Failed to fetch user');
        }

        const data = await response.json();
        setUser(data);
        setSnippets(data.snippets || []);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        toast.error('Failed to load user profile');
        notFound();
      } finally {
        setIsLoading(false);
      }
    };

    if (params.username) {
      fetchUser();
    }
  }, [params.username]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    notFound();
  }

  const isCurrentUser = user.id === (session?.user as any)?.id;
  const publicSnippets = snippets.filter(s => s.isPublic || isCurrentUser);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header */}
        <Card>
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <Avatar className="h-24 w-24 md:h-32 md:w-32">
                  <AvatarImage src={user.image || undefined} alt={user.name || 'User avatar'} />
                  <AvatarFallback className="text-2xl font-semibold">
                    {user.name?.charAt(0) || user.username?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">
                      {user.name || user.username}
                    </h1>
                    {user.name && user.username && (
                      <p className="text-lg text-muted-foreground">@{user.username}</p>
                    )}
                    {user.bio && (
                      <p className="mt-2 text-muted-foreground max-w-2xl">
                        {user.bio}
                      </p>
                    )}
                  </div>
                  
                  {!isCurrentUser && (
                    <FollowButton
                      username={user.username!}
                      currentUserId={user.id}
                      size="lg"
                      className="shrink-0"
                    />
                  )}
                </div>
                
                {/* User Info */}
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {user.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{user.location}</span>
                    </div>
                  )}
                  
                  {user.website && (
                    <div className="flex items-center gap-1">
                      <LinkIcon className="h-4 w-4" />
                      <a 
                        href={user.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors"
                      >
                        Website
                      </a>
                    </div>
                  )}
                  
                  {user.githubUrl && (
                    <div className="flex items-center gap-1">
                      <Github className="h-4 w-4" />
                      <a 
                        href={user.githubUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors"
                      >
                        GitHub
                      </a>
                    </div>
                  )}
                  
                  {user.twitterUrl && (
                    <div className="flex items-center gap-1">
                      <Twitter className="h-4 w-4" />
                      <a 
                        href={user.twitterUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors"
                      >
                        Twitter
                      </a>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>
                
                {/* Stats */}
                <div className="flex flex-wrap gap-6 pt-2">
                  <div className="flex items-center gap-1 text-sm">
                    <Code className="h-4 w-4" />
                    <span className="font-medium">{user._count.snippets}</span>
                    <span className="text-muted-foreground">snippets</span>
                  </div>
                  
                  <FollowersCount 
                    count={user._count.followers} 
                    size="sm"
                  />
                  
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <UserCheck className="h-4 w-4" />
                    <span>{user._count.following} following</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="snippets" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Snippets ({publicSnippets.length})
            </TabsTrigger>
            <TabsTrigger value="about" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              About
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="snippets" className="space-y-4">
            {publicSnippets.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <Code className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No snippets yet</h3>
                  <p className="text-muted-foreground">
                    {isCurrentUser 
                      ? "You haven't created any snippets yet." 
                      : `${user.name || user.username} hasn't shared any public snippets yet.`
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {publicSnippets.map((snippet) => (
                  <Card key={snippet.id} className="group hover:shadow-lg transition-all duration-200">
                    <CardContent className="p-6 space-y-4">
                      {/* Header */}
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <Link 
                            href={`/snippet/${snippet.id}`}
                            className="block group-hover:text-primary transition-colors flex-1"
                          >
                            <h3 className="font-semibold leading-tight line-clamp-2">
                              {snippet.title}
                            </h3>
                          </Link>
                          
                          <div className="flex items-center gap-1 ml-2">
                            {snippet.isPublic ? (
                              <Globe className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Lock className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                        
                        {snippet.description && (
                          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                            {snippet.description}
                          </p>
                        )}
                      </div>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        <Badge variant="outline" className="text-xs font-medium">
                          {snippet.language}
                        </Badge>
                        {snippet.tags?.slice(0, 2).map((tag: string) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {snippet.tags?.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{snippet.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                      
                      {/* Stats */}
                      <div className="flex items-center justify-between pt-2 border-t border-border/50">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <LikeButton
                            snippetId={snippet.id}
                            initialLikesCount={snippet._count.likes}
                            size="sm"
                            variant="ghost"
                            showCount={true}
                            className="p-0 h-auto text-xs text-muted-foreground hover:text-foreground"
                          />
                          <span className="flex items-center gap-1.5">
                            <MessageSquare className="h-3.5 w-3.5" />
                            {snippet._count.comments}
                          </span>
                        </div>
                        
                        <span className="text-xs text-muted-foreground">
                          {new Date(snippet.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About {user.name || user.username}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {user.bio ? (
                  <div>
                    <h4 className="font-medium mb-2">Bio</h4>
                    <p className="text-muted-foreground leading-relaxed">{user.bio}</p>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    {isCurrentUser 
                      ? "You haven't added a bio yet. Update your profile to share more about yourself."
                      : `${user.name || user.username} hasn't shared a bio yet.`
                    }
                  </div>
                )}
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-medium mb-3">Stats</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Snippets</span>
                        <span className="font-medium">{user._count.snippets}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Followers</span>
                        <span className="font-medium">{user._count.followers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Following</span>
                        <span className="font-medium">{user._count.following}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Member Since</span>
                        <span className="font-medium">
                          {new Date(user.createdAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            year: 'numeric' 
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {(user.location || user.website || user.githubUrl || user.twitterUrl) && (
                    <div>
                      <h4 className="font-medium mb-3">Links & Info</h4>
                      <div className="space-y-2">
                        {user.location && (
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{user.location}</span>
                          </div>
                        )}
                        
                        {user.website && (
                          <div className="flex items-center gap-2 text-sm">
                            <LinkIcon className="h-4 w-4 text-muted-foreground" />
                            <a 
                              href={user.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              Website
                            </a>
                          </div>
                        )}
                        
                        {user.githubUrl && (
                          <div className="flex items-center gap-2 text-sm">
                            <Github className="h-4 w-4 text-muted-foreground" />
                            <a 
                              href={user.githubUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              GitHub
                            </a>
                          </div>
                        )}
                        
                        {user.twitterUrl && (
                          <div className="flex items-center gap-2 text-sm">
                            <Twitter className="h-4 w-4 text-muted-foreground" />
                            <a 
                              href={user.twitterUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              Twitter
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}