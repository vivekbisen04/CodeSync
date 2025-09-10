'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  TrendingUp,
  Clock,
  Heart, 
  MessageSquare,
  Eye,
  Search,
  Filter,
  User
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LikeButton } from '@/components/ui/like-button';
import { CompactFollowButton } from '@/components/ui/follow-button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function SnippetCard({ snippet }: { snippet: any }) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-0 shadow-sm hover:shadow-md">
      <CardContent className="p-0">
        <div className="p-6 space-y-4">
          {/* Header */}
          <div className="space-y-3">
            <Link 
              href={`/snippet/${snippet.id}` as any}
              className="block group-hover:text-primary transition-colors"
            >
              <h3 className="text-lg font-semibold leading-tight line-clamp-2">
                {snippet.title}
              </h3>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
              {snippet.description}
            </p>
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
                initialLikesCount={snippet._count?.likes || 0}
                size="sm"
                variant="ghost"
                showCount={true}
                className="p-0 h-auto text-xs text-muted-foreground hover:text-foreground"
              />
              <span className="flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5" />
                {snippet._count?.comments || 0}
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5" />
                {snippet.views || 0}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Avatar className="h-5 w-5">
                <AvatarImage src={snippet.author?.image} />
                <AvatarFallback className="text-xs">
                  {snippet.author?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <Link 
                href={`/user/${snippet.author?.username || 'unknown'}` as any}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                @{snippet.author?.username || 'unknown'}
              </Link>
              {snippet.author?.username && (
                <CompactFollowButton
                  username={snippet.author.username}
                  currentUserId={snippet.author.id}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ExplorePage() {
  const [snippets, setSnippets] = useState<any[]>([]);
  const [filteredSnippets, setFilteredSnippets] = useState<any[]>([]);
  const [topLanguages, setTopLanguages] = useState<any[]>([]);
  const [trendingTags, setTrendingTags] = useState<any[]>([]);
  const [totalSnippets, setTotalSnippets] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [sortBy, setSortBy] = useState('trending');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/snippets/explore');
        const data = await response.json();
        
        setSnippets(data.snippets);
        setFilteredSnippets(data.snippets);
        setTopLanguages(data.topLanguages);
        setTrendingTags(data.trendingTags);
        setTotalSnippets(data.totalCount);
      } catch (error) {
        console.error('Failed to fetch explore data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter and sort snippets
  useEffect(() => {
    let filtered = [...snippets];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((snippet: any) =>
        snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        snippet.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        snippet.language.toLowerCase().includes(searchTerm.toLowerCase()) ||
        snippet.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        snippet.author.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply language filter
    if (selectedLanguage !== 'all') {
      filtered = filtered.filter((snippet: any) =>
        snippet.language.toLowerCase() === selectedLanguage.toLowerCase()
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'recent':
        filtered.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'likes':
        filtered.sort((a: any, b: any) => (b._count?.likes || 0) - (a._count?.likes || 0));
        break;
      case 'comments':
        filtered.sort((a: any, b: any) => (b._count?.comments || 0) - (a._count?.comments || 0));
        break;
      case 'trending':
      default:
        // Trending = combination of likes and recent activity
        filtered.sort((a: any, b: any) => {
          const scoreA = (a._count?.likes || 0) * 0.7 + (a._count?.comments || 0) * 0.3;
          const scoreB = (b._count?.likes || 0) * 0.7 + (b._count?.comments || 0) * 0.3;
          return scoreB - scoreA;
        });
        break;
    }

    setFilteredSnippets(filtered);
  }, [snippets, searchTerm, selectedLanguage, sortBy]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading snippets...</p>
        </div>
      </div>
    );
  }

  const trendingSnippets = filteredSnippets.slice(0, 6);
  const recentSnippets = [...filteredSnippets].sort((a: any, b: any) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 6);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            Explore Code Snippets
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover amazing code snippets from developers around the world. Learn, share, and get inspired.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search snippets, users, or tags..."
                className="pl-12 h-12 text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="sm:w-[160px]">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  {topLanguages.map((lang: any) => (
                    <SelectItem key={lang.name.toLowerCase()} value={lang.name.toLowerCase()}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="sm:w-[160px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trending">🔥 Trending</SelectItem>
                  <SelectItem value="recent">🕒 Most Recent</SelectItem>
                  <SelectItem value="likes">❤️ Most Liked</SelectItem>
                  <SelectItem value="comments">💬 Most Commented</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex-1" />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{filteredSnippets.length.toLocaleString()} of {totalSnippets.toLocaleString()} snippets</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-8 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <Tabs value={sortBy === 'recent' ? 'recent' : 'trending'} onValueChange={(value) => setSortBy(value)} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 h-12">
              <TabsTrigger value="trending" className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4" />
                Trending
              </TabsTrigger>
              <TabsTrigger value="recent" className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                Recent
              </TabsTrigger>
            </TabsList>

            <TabsContent value="trending" className="space-y-6">
              {filteredSnippets.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No snippets found matching your criteria.</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-1">
                  {trendingSnippets.map((snippet) => (
                    <SnippetCard key={snippet.id} snippet={snippet} />
                  ))}
                </div>
              )}
              
              {/* Load More Button */}
              {filteredSnippets.length > 6 && (
                <div className="flex justify-center pt-4">
                  <Button variant="outline" size="lg">
                    Load More Snippets
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="recent" className="space-y-6">
              {filteredSnippets.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No snippets found matching your criteria.</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-1">
                  {recentSnippets.map((snippet) => (
                    <SnippetCard key={snippet.id} snippet={snippet} />
                  ))}
                </div>
              )}
              
              {/* Load More Button */}
              {filteredSnippets.length > 6 && (
                <div className="flex justify-center pt-4">
                  <Button variant="outline" size="lg">
                    Load More Snippets
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">Popular Languages</CardTitle>
              <p className="text-sm text-muted-foreground">Most used programming languages</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {topLanguages.map((language: any, index) => (
                <div 
                  key={language.name} 
                  className="flex items-center justify-between group hover:bg-muted/50 -mx-2 px-2 py-2 rounded-md transition-colors cursor-pointer"
                  onClick={() => setSelectedLanguage(language.name.toLowerCase())}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className={`w-3 h-3 rounded-full ${language.color}`} />
                      <span className="absolute -top-1 -right-1 text-xs font-bold text-muted-foreground">
                        {index + 1}
                      </span>
                    </div>
                    <span className="text-sm font-medium">{language.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground font-mono">
                    {language.count.toLocaleString()}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">Trending Tags</CardTitle>
              <p className="text-sm text-muted-foreground">Popular topics this week</p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {trendingTags.map((tag: string) => (
                  <Badge 
                    key={tag} 
                    variant="secondary" 
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all duration-200 text-xs"
                    onClick={() => setSearchTerm(tag)}
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="p-6 text-center space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Share Your Code</h3>
                <p className="text-sm text-muted-foreground">
                  Join our community of developers and share your awesome snippets!
                </p>
              </div>
              <Button asChild className="w-full" size="sm">
                <Link href="/new">
                  Create Snippet
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}