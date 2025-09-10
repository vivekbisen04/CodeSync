import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function GET() {
  try {
    // List images in both test and avatars folders
    const [testResult, avatarResult] = await Promise.all([
      cloudinary.api.resources({
        type: 'upload',
        prefix: 'codesync/test',
        max_results: 10
      }).catch(err => ({ resources: [], error: err.message })),
      cloudinary.api.resources({
        type: 'upload',
        prefix: 'codesync/avatars',
        max_results: 10
      }).catch(err => ({ resources: [], error: err.message }))
    ]);

    const allImages = [
      ...(testResult.resources || []),
      ...(avatarResult.resources || [])
    ];
    
    return NextResponse.json({
      success: true,
      message: `Found ${allImages.length} images`,
      images: allImages.map((resource: any) => ({
        public_id: resource.public_id,
        url: resource.secure_url,
        created_at: resource.created_at,
        format: resource.format,
        width: resource.width,
        height: resource.height
      })),
      debug: {
        testCount: testResult.resources?.length || 0,
        avatarCount: avatarResult.resources?.length || 0,
        testError: (testResult as any).error,
        avatarError: (avatarResult as any).error
      }
    });
  } catch (error) {
    console.error('Cloudinary list error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}