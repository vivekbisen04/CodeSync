'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { 
  Code, 
  Plus,
  Heart, 
  MessageSquare,
  Eye,
  Lock,
  Globe,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  ExternalLink
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { AlertDialog, useAlertDialog } from '@/components/ui/alert-dialog';

interface Snippet {
  id: string;
  title: string;
  description: string | null;
  language: string;
  tags: string[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string | null;
    username: string | null;
    image: string | null;
  };
  _count: {
    comments: number;
    likes: number;
  };
}

export default function MySnippetsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [filteredSnippets, setFilteredSnippets] = useState<Snippet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedVisibility, setSelectedVisibility] = useState('all');
  const [deleteSnippetId, setDeleteSnippetId] = useState<string | null>(null);
  const [deleteSnippetTitle, setDeleteSnippetTitle] = useState<string>('');
  
  const deleteDialog = useAlertDialog();

  // Get unique languages from snippets
  const availableLanguages = Array.from(new Set(snippets.map(s => s.language))).sort();

  // Fetch user snippets
  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        const response = await fetch('/api/snippets/my-snippets');
        if (response.ok) {
          const data = await response.json();
          setSnippets(data);
          setFilteredSnippets(data);
        }
      } catch (error) {
        console.error('Failed to fetch snippets:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if ((session?.user as any)?.id) {
      fetchSnippets();
    }
  }, [(session?.user as any)?.id]);

  // Apply filters
  useEffect(() => {
    let filtered = [...snippets];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((snippet) =>
        snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        snippet.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        snippet.language.toLowerCase().includes(searchTerm.toLowerCase()) ||
        snippet.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply language filter
    if (selectedLanguage !== 'all') {
      filtered = filtered.filter((snippet) => snippet.language === selectedLanguage);
    }

    // Apply visibility filter
    if (selectedVisibility !== 'all') {
      filtered = filtered.filter((snippet) => 
        selectedVisibility === 'public' ? snippet.isPublic : !snippet.isPublic
      );
    }

    setFilteredSnippets(filtered);
  }, [snippets, searchTerm, selectedLanguage, selectedVisibility]);

  // Handle delete snippet
  const handleDeleteClick = (snippet: Snippet) => {
    setDeleteSnippetId(snippet.id);
    setDeleteSnippetTitle(snippet.title);
    deleteDialog.openDialog();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteSnippetId) return;

    deleteDialog.setLoading(true);

    try {
      const response = await fetch(`/api/snippets/${deleteSnippetId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove the snippet from both arrays
        setSnippets(prev => prev.filter(s => s.id !== deleteSnippetId));
        setFilteredSnippets(prev => prev.filter(s => s.id !== deleteSnippetId));
        toast.success('Snippet deleted successfully');
        deleteDialog.closeDialog();
        setDeleteSnippetId(null);
        setDeleteSnippetTitle('');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to delete snippet');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      deleteDialog.setLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    if (!deleteDialog.isLoading) {
      deleteDialog.closeDialog();
      setDeleteSnippetId(null);
      setDeleteSnippetTitle('');
    }
  };

  if (!session) {
    redirect('/login');
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading your snippets...</p>
        </div>
      </div>
    );
  }

  const totalSnippets = snippets.length;
  const publicSnippets = snippets.filter(s => s.isPublic).length;
  const privateSnippets = snippets.filter(s => !s.isPublic).length;
  const totalLikes = snippets.reduce((sum, s) => sum + s._count.likes, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Snippets</h1>
          <p className="text-muted-foreground">
            Manage and organize your code snippets
          </p>
        </div>
        <Button asChild>
          <Link href="/new">
            <Plus className="mr-2 h-4 w-4" />
            New Snippet
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Snippets</CardTitle>
            <Code className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSnippets}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Public</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publicSnippets}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Private</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{privateSnippets}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLikes}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search snippets..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                {availableLanguages.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedVisibility} onValueChange={setSelectedVisibility}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            Showing {filteredSnippets.length} of {totalSnippets} snippets
          </div>
        </CardContent>
      </Card>

      {/* Snippets Grid */}
      <div className="grid gap-6">
        {filteredSnippets.map((snippet) => (
          <Card key={snippet.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <Link 
                        href={`/snippet/${snippet.id}` as any}
                        className="text-lg font-semibold hover:underline"
                      >
                        {snippet.title}
                      </Link>
                      {snippet.isPublic ? (
                        <Globe className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <p className="text-muted-foreground line-clamp-2">
                      {snippet.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{snippet.language}</Badge>
                      {snippet.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <DropdownMenu
                    trigger={
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    }
                  >
                    <DropdownMenuItem onClick={() => window.open(`/snippet/${snippet.id}`, '_blank')}>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/edit/${snippet.id}`)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => handleDeleteClick(snippet)}
                      variant="destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenu>
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {snippet._count.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {snippet._count.comments}
                    </span>
                  </div>
                  <div className="text-right">
                    <div>Updated {new Date(snippet.updatedAt).toLocaleDateString()}</div>
                    <div>Created {new Date(snippet.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredSnippets.length === 0 && snippets.length > 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Search className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No snippets found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setSelectedLanguage('all');
                setSelectedVisibility('all');
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}

      {/* No snippets at all */}
      {snippets.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Code className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No snippets yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first code snippet to get started
            </p>
            <Button asChild>
              <Link href="/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Snippet
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={deleteDialog.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Snippet"
        description={`Are you sure you want to delete "${deleteSnippetTitle}"? This action cannot be undone and will permanently remove the snippet and all its comments.`}
        confirmText={deleteDialog.isLoading ? "Deleting..." : "Delete"}
        cancelText="Cancel"
        variant="destructive"
        isLoading={deleteDialog.isLoading}
      />
    </div>
  );
}