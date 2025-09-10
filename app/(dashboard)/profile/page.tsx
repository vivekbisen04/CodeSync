import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { 
  Code, 
  Users, 
  Heart, 
  MessageSquare,
  MapPin,
  Link as LinkIcon,
  Github,
  Twitter,
  Calendar,
  Edit
} from 'lucide-react';

import { authOptions } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const metadata: Metadata = {
  title: 'Profile',
  description: 'Your profile page',
};

// Mock data - in a real app, this would come from your database
const mockUserStats = {
  totalSnippets: 24,
  totalLikes: 189,
  totalFollowers: 42,
  totalFollowing: 38,
};

const mockUserSnippets = [
  {
    id: '1',
    title: 'React Custom Hook for API Calls',
    language: 'typescript',
    createdAt: new Date('2024-01-15'),
    likes: 23,
    comments: 5,
    isPublic: true,
  },
  {
    id: '2',
    title: 'CSS Flexbox Utilities',
    language: 'css',
    createdAt: new Date('2024-01-14'),
    likes: 18,
    comments: 3,
    isPublic: true,
  },
  {
    id: '3',
    title: 'Python Data Processing Function',
    language: 'python',
    createdAt: new Date('2024-01-13'),
    likes: 31,
    comments: 8,
    isPublic: false,
  },
];

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <Avatar className="h-32 w-32">
                <AvatarImage src={session.user?.image || undefined} />
                <AvatarFallback className="text-2xl">
                  {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
            
            <div className="flex-1 space-y-4">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold">{session.user?.name}</h1>
                  <p className="text-xl text-muted-foreground">
                    @{session.user?.username || 'username'}
                  </p>
                </div>
                <Button>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </div>
              
              <p className="text-muted-foreground">
                Full-stack developer passionate about clean code and modern web technologies. 
                Love sharing knowledge through code snippets and helping the developer community grow.
              </p>
              
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  San Francisco, CA
                </div>
                <div className="flex items-center gap-1">
                  <LinkIcon className="h-4 w-4" />
                  <a href="#" className="hover:underline text-primary">
                    https://johndoe.dev
                  </a>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Joined January 2024
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button variant="ghost" size="sm">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </Button>
                <Button variant="ghost" size="sm">
                  <Twitter className="mr-2 h-4 w-4" />
                  Twitter
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Snippets</CardTitle>
            <Code className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockUserStats.totalSnippets}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Likes</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockUserStats.totalLikes}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Followers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockUserStats.totalFollowers}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Following</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockUserStats.totalFollowing}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Snippets */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Snippets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockUserSnippets.map((snippet) => (
            <div key={snippet.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{snippet.title}</h4>
                  {!snippet.isPublic && (
                    <Badge variant="secondary">Private</Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <Badge variant="outline">{snippet.language}</Badge>
                  <span>{snippet.createdAt.toLocaleDateString()}</span>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {snippet.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {snippet.comments}
                    </span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                View
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}