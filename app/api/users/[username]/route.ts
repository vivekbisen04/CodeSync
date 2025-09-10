import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/users/[username] - Get user profile by username
export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const includeSnippets = searchParams.get('includeSnippets') === 'true';

    const user = await prisma.user.findUnique({
      where: { username: params.username },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        bio: true,
        location: true,
        website: true,
        githubUrl: true,
        twitterUrl: true,
        isVerified: true,
        createdAt: true,
        _count: {
          select: {
            snippets: {
              where: {
                // Only count public snippets unless it's the user's own profile
                ...(session?.user?.id !== undefined && session.user.id !== params.username
                  ? { isPublic: true }
                  : {}
                ),
              },
            },
            followers: true,
            following: true,
            likes: true,
          },
        },
        ...(includeSnippets && {
          snippets: {
            where: {
              // Only show public snippets unless it's the user's own profile
              ...(session?.user?.username !== params.username
                ? { isPublic: true }
                : {}
              ),
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
                  comments: true,
                  likes: true,
                },
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
            take: 20, // Limit to recent snippets
          },
        }),
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Check if current user is following this user
    let isFollowing = false;
    if (session?.user?.id && session.user.id !== user.id) {
      const follow = await prisma.follow.findFirst({
        where: {
          followerId: session.user.id,
          followingId: user.id,
        },
      });
      isFollowing = !!follow;
    }

    return NextResponse.json({
      ...user,
      isFollowing,
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}