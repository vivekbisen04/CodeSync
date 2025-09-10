'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Code, Eye, Save, Lock, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { CodeEditor } from '@/components/ui/code-editor';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

const languages = [
  'javascript',
  'typescript',
  'python',
  'java',
  'cpp',
  'c',
  'csharp',
  'go',
  'rust',
  'php',
  'ruby',
  'swift',
  'kotlin',
  'dart',
  'html',
  'css',
  'scss',
  'sql',
  'json',
  'yaml',
  'markdown',
  'bash',
  'other'
];

export default function NewSnippetPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    language: '',
    code: '',
    tags: '',
    isPublic: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/snippets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          language: formData.language,
          content: formData.code, // Map 'code' to 'content' for API
          isPublic: formData.isPublic,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        }),
      });

      if (response.ok) {
        const snippet = await response.json();
        toast.success('Snippet created successfully!');
        router.push(`/snippet/${snippet.id}`);
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to create snippet');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Please sign in to create snippets.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Snippet</h1>
          <p className="text-muted-foreground">
            Share your code with the community
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="mr-2 h-4 w-4" />
            {previewMode ? 'Edit' : 'Preview'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Snippet Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    placeholder="Give your snippet a descriptive title..."
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    placeholder="Describe what your snippet does..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Language</label>
                    <Select
                      value={formData.language}
                      onValueChange={(value) => handleInputChange('language', value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang} value={lang}>
                            {lang.charAt(0).toUpperCase() + lang.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tags</label>
                    <Input
                      placeholder="react, hooks, api, etc..."
                      value={formData.tags}
                      onChange={(e) => handleInputChange('tags', e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Separate tags with commas
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Code Editor */}
            <Card>
              <CardHeader>
                <CardTitle>Code</CardTitle>
              </CardHeader>
              <CardContent>
                {previewMode ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{formData.language}</Badge>
                      {formData.tags && formData.tags.split(',').map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag.trim()}
                        </Badge>
                      ))}
                    </div>
                    <CodeEditor
                      value={formData.code}
                      onChange={() => {}} // Read-only in preview mode
                      language={formData.language || 'javascript'}
                      height="500px"
                      readOnly={true}
                      showToolbar={true}
                    />
                  </div>
                ) : (
                  <CodeEditor
                    value={formData.code}
                    onChange={(value) => handleInputChange('code', value)}
                    language={formData.language || 'javascript'}
                    height="500px"
                    placeholder="Start typing your code here... Use Ctrl+S to save, Ctrl+F to find, and Ctrl+H to replace."
                    showToolbar={true}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Visibility</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {formData.isPublic ? (
                        <Globe className="h-4 w-4" />
                      ) : (
                        <Lock className="h-4 w-4" />
                      )}
                      <span className="font-medium">
                        {formData.isPublic ? 'Public' : 'Private'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formData.isPublic 
                        ? 'Anyone can view this snippet'
                        : 'Only you can view this snippet'
                      }
                    </p>
                  </div>
                  <Switch
                    checked={formData.isPublic}
                    onCheckedChange={(checked) => handleInputChange('isPublic', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-medium line-clamp-2">
                    {formData.title || 'Untitled Snippet'}
                  </h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {formData.description || 'No description provided'}
                  </p>
                </div>
                {formData.language && (
                  <Badge variant="outline">{formData.language}</Badge>
                )}
                {formData.code && (
                  <div className="text-xs text-muted-foreground">
                    {formData.code.split('\n').length} lines
                  </div>
                )}
              </CardContent>
            </Card>

            <Button type="submit" className="w-full" disabled={isLoading}>
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? 'Creating...' : 'Create Snippet'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}