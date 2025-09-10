import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { updateProfileSchema } from '@/lib/validations';

// GET /api/profile - Get current user profile
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        image: true,
        bio: true,
        location: true,
        website: true,
        githubUrl: true,
        twitterUrl: true,
        isVerified: true,
        createdAt: true,
        theme: true,
        language: true,
        defaultSnippetVisibility: true,
        showEmail: true,
        showLocation: true,
        _count: {
          select: {
            snippets: true,
            followers: true,
            following: true,
            likes: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/profile - Update current user profile
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = updateProfileSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: 'Invalid input data', errors: validation.error.issues },
        { status: 400 }
      );
    }

    // Check if username is already taken by another user
    if (validation.data.username) {
      const existingUser = await prisma.user.findFirst({
        where: {
          username: validation.data.username,
          NOT: { id: session.user.id },
        },
      });

      if (existingUser) {
        return NextResponse.json(
          { message: 'Username is already taken' },
          { status: 400 }
        );
      }
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: validation.data,
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        image: true,
        bio: true,
        location: true,
        website: true,
        githubUrl: true,
        twitterUrl: true,
        isVerified: true,
        createdAt: true,
        theme: true,
        language: true,
        defaultSnippetVisibility: true,
        showEmail: true,
        showLocation: true,
        _count: {
          select: {
            snippets: true,
            followers: true,
            following: true,
            likes: true,
          },
        },
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}