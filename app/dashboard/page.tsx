import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { 
  Code, 
  Users, 
  Heart, 
  MessageSquare,
  TrendingUp,
  Clock
} from 'lucide-react';
import Link from 'next/link';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your coding dashboard',
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login');
  }

  // Calculate date ranges for growth comparison
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
  const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate());

  // Fetch current and previous month stats
  const [userSnippets, userLikes, userFollowers, userComments,
         prevSnippets, prevLikes, prevFollowers, prevComments] = await Promise.all([
    // Current totals
    prisma.snippet.count({
      where: { authorId: session.user.id },
    }),
    prisma.like.count({
      where: { 
        snippet: { authorId: session.user.id } 
      },
    }),
    prisma.follow.count({
      where: { followingId: session.user.id },
    }),
    prisma.comment.count({
      where: { 
        snippet: { authorId: session.user.id } 
      },
    }),
    // Previous month totals (for growth calculation)
    prisma.snippet.count({
      where: { 
        authorId: session.user.id,
        createdAt: { lte: lastMonth }
      },
    }),
    prisma.like.count({
      where: { 
        snippet: { authorId: session.user.id },
        createdAt: { lte: lastMonth }
      },
    }),
    prisma.follow.count({
      where: { 
        followingId: session.user.id,
        createdAt: { lte: lastMonth }
      },
    }),
    prisma.comment.count({
      where: { 
        snippet: { authorId: session.user.id },
        createdAt: { lte: lastMonth }
      },
    }),
  ]);

  // Fetch recent snippets by user
  const recentSnippets = await prisma.snippet.findMany({
    where: { authorId: session.user.id },
    include: {
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 3,
  });

  // Fetch trending public snippets
  const trendingSnippets = await prisma.snippet.findMany({
    where: { isPublic: true },
    include: {
      author: {
        select: {
          username: true,
          name: true,
        },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
    orderBy: {
      likes: {
        _count: 'desc',
      },
    },
    take: 3,
  });

  const stats = {
    totalSnippets: userSnippets,
    totalLikes: userLikes,
    totalFollowers: userFollowers,
    totalComments: userComments,
    snippetGrowth: userSnippets - prevSnippets,
    likesGrowth: userLikes - prevLikes,
    followersGrowth: userFollowers - prevFollowers,
    commentsGrowth: userComments - prevComments,
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {session.user?.name?.split(' ')[0]}!
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your code snippets today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Snippets</CardTitle>
            <Code className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSnippets}</div>
            <p className="text-xs text-muted-foreground">
              {stats.snippetGrowth >= 0 ? '+' : ''}{stats.snippetGrowth} from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLikes}</div>
            <p className="text-xs text-muted-foreground">
              {stats.likesGrowth >= 0 ? '+' : ''}{stats.likesGrowth} from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Followers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFollowers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.followersGrowth >= 0 ? '+' : ''}{stats.followersGrowth} from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comments</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalComments}</div>
            <p className="text-xs text-muted-foreground">
              {stats.commentsGrowth >= 0 ? '+' : ''}{stats.commentsGrowth} from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Recent Snippets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Your Recent Snippets
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentSnippets.map((snippet) => (
              <div key={snippet.id} className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium leading-none">
                      {snippet.title}
                    </h4>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {snippet.language}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {snippet.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    {snippet._count.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    {snippet._count.comments}
                  </span>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full" asChild>
              <Link href="/my-snippets">
                View All Your Snippets
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Trending Snippets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Trending Snippets
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {trendingSnippets.map((snippet) => (
              <div key={snippet.id} className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium leading-none">
                      {snippet.title}
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        by @{snippet.author.username}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {snippet.language}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    {snippet._count.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    {snippet._count.comments}
                  </span>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full" asChild>
              <Link href="/explore">
                Explore More Snippets
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}