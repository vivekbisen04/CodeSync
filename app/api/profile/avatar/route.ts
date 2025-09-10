import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.formData();
    const file: File | null = data.get('avatar') as unknown as File;

    if (!file) {
      return NextResponse.json(
        { message: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { message: 'File must be an image' },
        { status: 400 }
      );
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { message: 'File size must be less than 2MB' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Get current user to check if they have an existing avatar
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { image: true, cloudinaryPublicId: true },
    });

    // Delete old avatar from Cloudinary if exists
    if (currentUser?.cloudinaryPublicId) {
      try {
        await deleteFromCloudinary(currentUser.cloudinaryPublicId);
      } catch (error) {
        console.warn('Failed to delete old avatar:', error);
      }
    }

    // Upload new image to Cloudinary
    const { url: imageUrl, public_id } = await uploadToCloudinary(buffer, {
      public_id: `user_${session.user.id}_${Date.now()}`,
    });
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { 
        image: imageUrl,
        cloudinaryPublicId: public_id,
      },
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
      },
    });

    return NextResponse.json({
      message: 'Avatar updated successfully',
      user,
      imageUrl,
    });

  } catch (error) {
    console.error('Upload avatar error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/profile/avatar - Remove user avatar
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get current user to get Cloudinary public_id
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { cloudinaryPublicId: true },
    });

    // Delete from Cloudinary if exists
    if (currentUser?.cloudinaryPublicId) {
      try {
        await deleteFromCloudinary(currentUser.cloudinaryPublicId);
      } catch (error) {
        console.warn('Failed to delete avatar from Cloudinary:', error);
      }
    }

    // Update user's image URL to null
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { 
        image: null,
        cloudinaryPublicId: null,
      },
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
      },
    });

    return NextResponse.json({
      message: 'Avatar removed successfully',
      user,
    });

  } catch (error) {
    console.error('Remove avatar error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}