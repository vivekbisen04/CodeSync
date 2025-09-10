'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Code, Eye, Save, Lock, Globe, ArrowLeft } from 'lucide-react';
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
import Link from 'next/link';

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

interface Snippet {
  id: string;
  title: string;
  description: string | null;
  content: string;
  language: string;
  tags: string[];
  isPublic: boolean;
  authorId: string;
}

export default function EditSnippetPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const snippetId = params?.id as string;

  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    language: '',
    code: '',
    tags: '',
    isPublic: true,
  });

  // Fetch snippet data
  useEffect(() => {
    const fetchSnippet = async () => {
      if (!snippetId) return;

      try {
        const response = await fetch(`/api/snippets/${snippetId}`);
        if (response.ok) {
          const data = await response.json();
          const snippetData = data.snippet;
          
          // Check if user owns this snippet
          if (snippetData.authorId !== (session?.user as any)?.id) {
            toast.error('You can only edit your own snippets');
            router.push('/my-snippets');
            return;
          }

          setSnippet(snippetData);
          setFormData({
            title: snippetData.title,
            description: snippetData.description || '',
            language: snippetData.language,
            code: snippetData.content,
            tags: snippetData.tags.join(', '),
            isPublic: snippetData.isPublic,
          });
        } else {
          toast.error('Snippet not found');
          router.push('/my-snippets');
        }
      } catch (error) {
        console.error('Failed to fetch snippet:', error);
        toast.error('Failed to load snippet');
        router.push('/my-snippets');
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user && snippetId) {
      fetchSnippet();
    }
  }, [session, snippetId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!snippet) return;

    setIsSaving(true);

    try {
      const response = await fetch(`/api/snippets/${snippetId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          language: formData.language,
          content: formData.code,
          isPublic: formData.isPublic,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        }),
      });

      if (response.ok) {
        const updatedSnippet = await response.json();
        toast.success('Snippet updated successfully!');
        router.push(`/snippet/${snippetId}`);
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to update snippet');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCancel = () => {
    if (snippet) {
      router.push(`/snippet/${snippetId}`);
    } else {
      router.push('/my-snippets');
    }
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Please sign in to edit snippets.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading snippet...</p>
        </div>
      </div>
    );
  }

  if (!snippet) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Snippet not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/snippet/${snippetId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Snippet
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Snippet</h1>
            <p className="text-muted-foreground">
              Update your code snippet
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
            disabled={isSaving}
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
                    disabled={isSaving}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    placeholder="Describe what your snippet does..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    disabled={isSaving}
                  />
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Language</label>
                    <Select
                      value={formData.language}
                      onValueChange={(value) => handleInputChange('language', value)}
                      disabled={isSaving}
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
                      disabled={isSaving}
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
                    placeholder="Update your code here..."
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
                    disabled={isSaving}
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

            <div className="flex flex-col gap-2">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSaving}
              >
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
              
              <Button 
                type="button" 
                variant="outline" 
                className="w-full" 
                onClick={handleCancel}
                disabled={isSaving}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}