import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { cache } from '@/lib/redis';
import { createSnippetSchema } from '@/lib/validations';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const language = searchParams.get('language');
    const authorId = searchParams.get('authorId');
    const search = searchParams.get('search');
    const tags = searchParams.get('tags')?.split(',');

    const skip = (page - 1) * limit;

    const where: any = {
      isPublic: true,
    };

    if (language) {
      where.language = language;
    }

    if (authorId) {
      where.authorId = authorId;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (tags && tags.length > 0) {
      where.tags = {
        hasSome: tags,
      };
    }

    const snippets = await prisma.snippet.findMany({
      where,
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
      skip,
      take: limit,
    });

    const total = await prisma.snippet.count({ where });

    return NextResponse.json({
      snippets,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get snippets error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    console.log('Session in API:', { session: session, userId: session?.user?.id });

    if (!session?.user?.id) {
      console.log('No valid session found');
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = createSnippetSchema.safeParse(body);

    if (!validation.success) {
      console.log('Validation failed:', validation.error.issues);
      return NextResponse.json(
        { message: 'Invalid input data', errors: validation.error.issues },
        { status: 400 }
      );
    }

    const snippet = await prisma.snippet.create({
      data: {
        ...validation.data,
        authorId: session.user.id,
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
    });

    // Invalidate explore page cache when new snippet is created
    await cache.del('explore:page:data');

    return NextResponse.json(snippet, { status: 201 });
  } catch (error) {
    console.error('Create snippet error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}