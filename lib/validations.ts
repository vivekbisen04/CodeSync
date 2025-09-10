import { z } from 'zod';

// Auth validations
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
});

// Profile validations
export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .optional(),
  bio: z.string().max(160, 'Bio must be less than 160 characters').optional(),
  location: z.string().max(50, 'Location must be less than 50 characters').optional(),
  website: z.string().url('Please enter a valid URL').or(z.literal('')).optional(),
  githubUrl: z.string().url('Please enter a valid GitHub URL').or(z.literal('')).optional(),
  twitterUrl: z.string().url('Please enter a valid Twitter URL').or(z.literal('')).optional(),
  image: z.string().url('Please enter a valid image URL').or(z.literal('')).optional(),
  theme: z.enum(['light', 'dark', 'system']).optional(),
  language: z.string().min(2).max(5).optional(),
  defaultSnippetVisibility: z.enum(['public', 'private']).optional(),
  showEmail: z.boolean().optional(),
  showLocation: z.boolean().optional(),
});

// Snippet validations
export const createSnippetSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  content: z.string().min(1, 'Content is required'),
  language: z.string().min(1, 'Language is required'),
  isPublic: z.boolean().default(true),
  tags: z.array(z.string()).max(10, 'Maximum 10 tags allowed').default([]),
});

export const updateSnippetSchema = createSnippetSchema.extend({
  id: z.string(),
});

// Comment validations
export const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, 'Comment cannot be empty')
    .max(1000, 'Comment must be less than 1000 characters'),
  snippetId: z.string(),
  parentId: z.string().optional(),
});

// Search validations
export const snippetFilterSchema = z.object({
  language: z.string().optional(),
  tags: z.array(z.string()).optional(),
  authorId: z.string().optional(),
  search: z.string().optional(),
  isPublic: z.boolean().optional(),
});

export const userSearchSchema = z.object({
  query: z.string().optional(),
  isVerified: z.boolean().optional(),
  location: z.string().optional(),
});

// Utility types
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
export type CreateSnippetFormData = z.infer<typeof createSnippetSchema>;
export type UpdateSnippetFormData = z.infer<typeof updateSnippetSchema>;
export type CreateCommentFormData = z.infer<typeof createCommentSchema>;
export type SnippetFilterData = z.infer<typeof snippetFilterSchema>;
export type UserSearchData = z.infer<typeof userSearchSchema>;