'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestCloudinaryPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [images, setImages] = useState<any[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/test-upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Upload error:', error);
      setResult({ success: false, message: 'Upload failed' });
    } finally {
      setUploading(false);
    }
  };

  const listImages = async () => {
    try {
      const response = await fetch('/api/test-cloudinary-list');
      const data = await response.json();
      setImages(data.images || []);
    } catch (error) {
      console.error('List error:', error);
    }
  };

  return (
    <div className="container mx-auto p-8 space-y-6">
      <h1 className="text-2xl font-bold">Cloudinary Test Page</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Upload Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          <Button 
            onClick={handleUpload} 
            disabled={!file || uploading}
          >
            {uploading ? 'Uploading...' : 'Test Upload'}
          </Button>
          
          {result && (
            <div className="mt-4 p-4 bg-gray-100 rounded">
              <h3 className="font-semibold">Upload Result:</h3>
              <pre className="text-sm overflow-x-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
              
              {result.success && result.imageUrl && (
                <div className="mt-4">
                  <h4 className="font-semibold">Test Image Display:</h4>
                  <img 
                    src={result.imageUrl} 
                    alt="Test upload" 
                    className="max-w-xs h-auto border rounded"
                    onLoad={() => console.log('Image loaded successfully')}
                    onError={(e) => console.error('Image failed to load:', e)}
                  />
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Images</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={listImages}>List Images in Cloudinary</Button>
          
          {images.length > 0 && (
            <div className="mt-4 space-y-4">
              {images.map((img, index) => (
                <div key={index} className="p-4 border rounded">
                  <p><strong>Public ID:</strong> {img.public_id}</p>
                  <p><strong>URL:</strong> <a href={img.url} target="_blank" className="text-blue-600 break-all">{img.url}</a></p>
                  <p><strong>Created:</strong> {img.created_at}</p>
                  <img 
                    src={img.url} 
                    alt={img.public_id} 
                    className="max-w-xs h-auto border rounded mt-2"
                    onLoad={() => console.log('Existing image loaded:', img.public_id)}
                    onError={(e) => console.error('Existing image failed to load:', img.public_id, e)}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}