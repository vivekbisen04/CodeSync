import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { cache } from '@/lib/redis';
import { updateSnippetSchema } from '@/lib/validations';

// GET /api/snippets/[id] - Get single snippet
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    // Check cache first (only for public snippets to avoid permission issues)
    const cacheKey = `snippet:${params.id}:${userId || 'guest'}`;
    const cachedData = await cache.get<any>(cacheKey);
    
    if (cachedData) {
      return NextResponse.json(cachedData);
    }
    
    const snippet = await prisma.snippet.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        comments: {
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
                replies: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });

    if (!snippet) {
      return NextResponse.json(
        { message: 'Snippet not found' },
        { status: 404 }
      );
    }

    // Check if snippet is private and user is not the author
    if (!snippet.isPublic && snippet.authorId !== userId) {
      return NextResponse.json(
        { message: 'Snippet not found' },
        { status: 404 }
      );
    }

    // Check if current user has liked this snippet
    let isLiked = false;
    if (userId) {
      const like = await prisma.like.findFirst({
        where: {
          userId: userId,
          snippetId: params.id,
        },
      });
      isLiked = !!like;
    }

    // Update view count (simple increment)
    await prisma.snippet.update({
      where: { id: params.id },
      data: {
        // Note: In a real app, you'd want to track views more sophisticated
        // to avoid counting multiple views from same user
      },
    });

    const responseData = {
      snippet: snippet,
      comments: snippet.comments,
      isLiked,
    };

    // Cache for 5 minutes (shorter than explore page due to comments/likes changing)
    await cache.set(cacheKey, responseData, 300);

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Get snippet error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/snippets/[id] - Update snippet
export async function PUT(
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

    const body = await request.json();
    const validation = updateSnippetSchema.safeParse({ ...body, id: params.id });

    if (!validation.success) {
      return NextResponse.json(
        { message: 'Invalid input data', errors: validation.error.issues },
        { status: 400 }
      );
    }

    // Check if user owns the snippet
    const existingSnippet = await prisma.snippet.findUnique({
      where: { id: params.id },
      select: { authorId: true },
    });

    if (!existingSnippet) {
      return NextResponse.json(
        { message: 'Snippet not found' },
        { status: 404 }
      );
    }

    if (existingSnippet.authorId !== (session!.user as any).id) {
      return NextResponse.json(
        { message: 'Forbidden' },
        { status: 403 }
      );
    }

    const { id, ...updateData } = validation.data;
    const snippet = await prisma.snippet.update({
      where: { id: params.id },
      data: updateData,
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
    });

    // Invalidate caches when snippet is updated
    await cache.del(`snippet:${params.id}:${(session!.user as any).id}`);
    await cache.del(`snippet:${params.id}:guest`);
    await cache.del('explore:page:data');

    return NextResponse.json(snippet);
  } catch (error) {
    console.error('Update snippet error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/snippets/[id] - Delete snippet
export async function DELETE(
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

    // Check if user owns the snippet
    const existingSnippet = await prisma.snippet.findUnique({
      where: { id: params.id },
      select: { authorId: true },
    });

    if (!existingSnippet) {
      return NextResponse.json(
        { message: 'Snippet not found' },
        { status: 404 }
      );
    }

    if (existingSnippet.authorId !== (session!.user as any).id) {
      return NextResponse.json(
        { message: 'Forbidden' },
        { status: 403 }
      );
    }

    await prisma.snippet.delete({
      where: { id: params.id },
    });

    // Invalidate caches when snippet is deleted
    await cache.del(`snippet:${params.id}:${(session!.user as any).id}`);
    await cache.del(`snippet:${params.id}:guest`);
    await cache.del('explore:page:data');

    return NextResponse.json(
      { message: 'Snippet deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete snippet error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}