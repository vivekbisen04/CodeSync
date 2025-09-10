import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        image: true,
        cloudinaryPublicId: true,
      }
    });
    
    return NextResponse.json({
      message: 'Current user data',
      user,
      session: {
        userId: session.user.id,
        userImage: session.user.image,
        userName: session.user.name,
      }
    });
    
  } catch (error) {
    console.error('Debug user error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user data' }, 
      { status: 500 }
    );
  }
}