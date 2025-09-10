import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cache } from '@/lib/redis';

export async function GET(request: NextRequest) {
  try {
    // Check cache first
    const cacheKey = 'explore:page:data';
    const cachedData = await cache.get<any>(cacheKey);
    
    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    // Fetch all public snippets with author and counts
    const snippets = await prisma.snippet.findMany({
      where: { 
        isPublic: true 
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
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
        createdAt: 'desc',
      },
    });

    // Get language statistics
    const languageStats = await prisma.snippet.groupBy({
      by: ['language'],
      where: { isPublic: true },
      _count: {
        language: true,
      },
      orderBy: {
        _count: {
          language: 'desc',
        },
      },
      take: 5,
    });

    // Transform language stats for display
    const topLanguages = languageStats.map((lang, index) => ({
      name: lang.language.charAt(0).toUpperCase() + lang.language.slice(1),
      count: lang._count.language,
      color: [
        'bg-yellow-500',
        'bg-blue-500', 
        'bg-green-500',
        'bg-purple-500',
        'bg-red-500'
      ][index] || 'bg-gray-500',
    }));

    // Get total count for display
    const totalCount = await prisma.snippet.count({
      where: { isPublic: true }
    });

    // Get trending tags (most used tags)
    const allSnippets = await prisma.snippet.findMany({
      where: { isPublic: true },
      select: { tags: true },
    });

    const tagCounts = allSnippets
      .flatMap(snippet => snippet.tags)
      .reduce((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const trendingTags = Object.entries(tagCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([tag]) => tag);

    const responseData = {
      snippets,
      topLanguages,
      trendingTags,
      totalCount,
    };

    // Cache the data for 10 minutes
    await cache.set(cacheKey, responseData, 600);

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Explore API error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}