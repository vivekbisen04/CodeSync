import { NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json(
        { message: 'No file uploaded' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload with minimal options for testing
    const { url: imageUrl, public_id } = await uploadToCloudinary(buffer, {
      public_id: `test_${Date.now()}`,
      folder: 'codesync/test'
    });

    return NextResponse.json({
      success: true,
      message: 'Upload successful',
      imageUrl,
      public_id,
      // Test direct URL access
      testUrl: `https://res.cloudinary.com/dipijsjjh/image/upload/${public_id}.jpg`
    });

  } catch (error) {
    console.error('Test upload error:', error);
    return NextResponse.json(
      { 
        success: false,
        message: error instanceof Error ? error.message : 'Upload failed' 
      },
      { status: 500 }
    );
  }
}