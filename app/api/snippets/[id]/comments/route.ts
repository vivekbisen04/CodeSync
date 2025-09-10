import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { cache } from '@/lib/redis';
import { createCommentSchema } from '@/lib/validations';

// GET /api/snippets/[id]/comments - Get comments for snippet
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const comments = await prisma.comment.findMany({
      where: {
        snippetId: params.id,
        parentId: null, // Only top-level comments
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
        replies: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
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
      skip,
      take: limit,
    });

    const total = await prisma.comment.count({
      where: {
        snippetId: params.id,
        parentId: null,
      },
    });

    return NextResponse.json({
      comments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get comments error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/snippets/[id]/comments - Create comment
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

    const body = await request.json();
    const validation = createCommentSchema.safeParse({
      ...body,
      snippetId: params.id,
    });

    if (!validation.success) {
      return NextResponse.json(
        { message: 'Invalid input data', errors: validation.error.issues },
        { status: 400 }
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
        { message: 'Cannot comment on private snippet' },
        { status: 403 }
      );
    }

    // If replying to a comment, check if parent comment exists
    if (validation.data.parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: validation.data.parentId },
        select: { snippetId: true },
      });

      if (!parentComment || parentComment.snippetId !== params.id) {
        return NextResponse.json(
          { message: 'Parent comment not found' },
          { status: 400 }
        );
      }
    }

    const comment = await prisma.comment.create({
      data: {
        content: validation.data.content,
        snippetId: params.id,
        authorId: (session!.user as any).id,
        parentId: validation.data.parentId,
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
            replies: true,
          },
        },
      },
    });

    // Invalidate snippet cache when comments are added
    await cache.del(`snippet:${params.id}:${(session!.user as any).id}`);
    await cache.del(`snippet:${params.id}:guest`);

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('Create comment error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}