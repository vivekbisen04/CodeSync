import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// POST /api/users/[username]/follow - Toggle follow user
export async function POST(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Find the user to follow/unfollow
    const userToFollow = await prisma.user.findUnique({
      where: { username: params.username },
      select: { id: true },
    });

    if (!userToFollow) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Can't follow yourself
    if (userToFollow.id === session.user.id) {
      return NextResponse.json(
        { message: 'Cannot follow yourself' },
        { status: 400 }
      );
    }

    // Check if already following
    const existingFollow = await prisma.follow.findFirst({
      where: {
        followerId: session.user.id,
        followingId: userToFollow.id,
      },
    });

    let isFollowing: boolean;
    let followersCount: number;

    if (existingFollow) {
      // Unfollow - remove the follow relationship
      await prisma.follow.delete({
        where: { id: existingFollow.id },
      });
      isFollowing = false;
    } else {
      // Follow - create a new follow relationship
      await prisma.follow.create({
        data: {
          followerId: session.user.id,
          followingId: userToFollow.id,
        },
      });
      isFollowing = true;
    }

    // Get updated followers count
    followersCount = await prisma.follow.count({
      where: { followingId: userToFollow.id },
    });

    return NextResponse.json({
      isFollowing,
      followersCount,
      message: isFollowing ? 'User followed' : 'User unfollowed',
    });
  } catch (error) {
    console.error('Toggle follow error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/users/[username]/follow - Get follow status
export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({
        isFollowing: false,
        followersCount: 0,
        followingCount: 0,
      });
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { username: params.username },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Check if current user is following this user
    const follow = await prisma.follow.findFirst({
      where: {
        followerId: session.user.id,
        followingId: user.id,
      },
    });

    // Get followers and following counts
    const followersCount = await prisma.follow.count({
      where: { followingId: user.id },
    });

    const followingCount = await prisma.follow.count({
      where: { followerId: user.id },
    });

    return NextResponse.json({
      isFollowing: !!follow,
      followersCount,
      followingCount,
    });
  } catch (error) {
    console.error('Get follow status error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}