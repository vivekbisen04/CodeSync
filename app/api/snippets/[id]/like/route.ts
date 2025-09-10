import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { cache } from '@/lib/redis';

// POST /api/snippets/[id]/like - Toggle like on snippet
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!(session?.user as any)?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if snippet exists and is accessible
    const snippet = await prisma.snippet.findUnique({
      where: { id: params.id },
      select: { id: true, isPublic: true, authorId: true },
    });

    if (!snippet) {
      return NextResponse.json(
        { message: 'Snippet not found' },
        { status: 404 }
      );
    }

    // Check if snippet is private and user is not the author
    if (!snippet.isPublic && snippet.authorId !== (session!.user as any).id) {
      return NextResponse.json(
        { message: 'Cannot like private snippet' },
        { status: 403 }
      );
    }

    // Check if user already liked this snippet
    const existingLike = await prisma.like.findFirst({
      where: {
        userId: (session!.user as any).id,
        snippetId: params.id,
      },
    });

    let isLiked: boolean;
    let likesCount: number;

    if (existingLike) {
      // Unlike - remove the like
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
      isLiked = false;
    } else {
      // Like - create a new like
      await prisma.like.create({
        data: {
          userId: (session!.user as any).id,
          snippetId: params.id,
        },
      });
      isLiked = true;
    }

    // Get updated likes count
    likesCount = await prisma.like.count({
      where: { snippetId: params.id },
    });

    // Invalidate snippet cache when likes change
    await cache.del(`snippet:${params.id}:${(session!.user as any).id}`);
    await cache.del(`snippet:${params.id}:guest`);

    return NextResponse.json({
      isLiked,
      likesCount,
      message: isLiked ? 'Snippet liked' : 'Snippet unliked',
    });
  } catch (error) {
    console.error('Toggle like error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/snippets/[id]/like - Get like status
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!(session?.user as any)?.id) {
      return NextResponse.json({
        isLiked: false,
        likesCount: 0,
      });
    }

    // Check if user has liked this snippet
    const like = await prisma.like.findFirst({
      where: {
        userId: (session!.user as any).id,
        snippetId: params.id,
      },
    });

    // Get total likes count
    const likesCount = await prisma.like.count({
      where: { snippetId: params.id },
    });

    return NextResponse.json({
      isLiked: !!like,
      likesCount,
    });
  } catch (error) {
    console.error('Get like status error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}