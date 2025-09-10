import { Snippet, Comment, Like, User } from '@prisma/client';

export interface SnippetWithRelations extends Snippet {
  author: User;
  comments: CommentWithAuthor[];
  likes: Like[];
  _count: {
    comments: number;
    likes: number;
  };
}

export interface CommentWithAuthor extends Comment {
  author: User;
  replies?: CommentWithAuthor[];
}

export interface CreateSnippetData {
  title: string;
  description?: string;
  content: string;
  language: string;
  isPublic: boolean;
  tags: string[];
}

export interface UpdateSnippetData extends Partial<CreateSnippetData> {
  id: string;
}

export interface SnippetFilter {
  language?: string;
  tags?: string[];
  authorId?: string;
  search?: string;
  isPublic?: boolean;
}

export interface SnippetSort {
  field: 'createdAt' | 'updatedAt' | 'likes' | 'comments';
  order: 'asc' | 'desc';
}

export interface CreateCommentData {
  content: string;
  snippetId: string;
  parentId?: string;
}

export interface SnippetStats {
  totalSnippets: number;
  totalLikes: number;
  totalComments: number;
  popularLanguages: Array<{
    language: string;
    count: number;
  }>;
}

export type Language =
  | 'typescript'
  | 'javascript'
  | 'python'
  | 'java'
  | 'cpp'
  | 'c'
  | 'csharp'
  | 'php'
  | 'ruby'
  | 'go'
  | 'rust'
  | 'swift'
  | 'kotlin'
  | 'html'
  | 'css'
  | 'scss'
  | 'sql'
  | 'bash'
  | 'json'
  | 'yaml'
  | 'markdown'
  | 'xml';

export const SUPPORTED_LANGUAGES: Array<{ value: Language; label: string }> = [
  { value: 'typescript', label: 'TypeScript' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'c', label: 'C' },
  { value: 'csharp', label: 'C#' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'swift', label: 'Swift' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'scss', label: 'SCSS' },
  { value: 'sql', label: 'SQL' },
  { value: 'bash', label: 'Bash' },
  { value: 'json', label: 'JSON' },
  { value: 'yaml', label: 'YAML' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'xml', label: 'XML' },
];