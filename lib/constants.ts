export const APP_NAME = 'CodeSync';
export const APP_DESCRIPTION = 'A real-time social coding platform for developers';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SNIPPET: '/snippet',
  SETTINGS: '/settings',
} as const;

export const API_ROUTES = {
  AUTH: '/api/auth',
  SNIPPETS: '/api/snippets',
  USERS: '/api/users',
  COMMENTS: '/api/comments',
  LIKES: '/api/likes',
} as const;

export const SOCKET_EVENTS = {
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  SNIPPET_CREATED: 'snippet:created',
  SNIPPET_UPDATED: 'snippet:updated',
  SNIPPET_DELETED: 'snippet:deleted',
  COMMENT_CREATED: 'comment:created',
  COMMENT_UPDATED: 'comment:updated',
  COMMENT_DELETED: 'comment:deleted',
  LIKE_ADDED: 'like:added',
  LIKE_REMOVED: 'like:removed',
  USER_ONLINE: 'user:online',
  USER_OFFLINE: 'user:offline',
  TYPING: 'typing',
  STOP_TYPING: 'stop_typing',
} as const;

export const CACHE_KEYS = {
  USER_PROFILE: (userId: string) => `user:${userId}`,
  USER_SNIPPETS: (userId: string) => `user:${userId}:snippets`,
  SNIPPET_DETAILS: (snippetId: string) => `snippet:${snippetId}`,
  SNIPPET_COMMENTS: (snippetId: string) => `snippet:${snippetId}:comments`,
  POPULAR_SNIPPETS: 'snippets:popular',
  RECENT_SNIPPETS: 'snippets:recent',
  TRENDING_TAGS: 'tags:trending',
} as const;

export const CACHE_TTL = {
  SHORT: 300, // 5 minutes
  MEDIUM: 1800, // 30 minutes
  LONG: 3600, // 1 hour
  VERY_LONG: 86400, // 24 hours
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

export const LIMITS = {
  SNIPPET_TITLE_MAX: 100,
  SNIPPET_DESCRIPTION_MAX: 500,
  SNIPPET_CONTENT_MAX: 50000,
  COMMENT_MAX: 1000,
  BIO_MAX: 160,
  USERNAME_MIN: 3,
  USERNAME_MAX: 20,
  PASSWORD_MIN: 6,
  TAGS_MAX: 10,
  TAGS_PER_SNIPPET: 5,
} as const;

export const FILE_TYPES = {
  IMAGES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
} as const;

export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'You must be logged in to perform this action',
  FORBIDDEN: 'You do not have permission to perform this action',
  NOT_FOUND: 'The requested resource was not found',
  VALIDATION_ERROR: 'Please check your input and try again',
  SERVER_ERROR: 'Something went wrong. Please try again later',
  RATE_LIMIT: 'Too many requests. Please try again later',
} as const;

export const SUCCESS_MESSAGES = {
  SNIPPET_CREATED: 'Snippet created successfully!',
  SNIPPET_UPDATED: 'Snippet updated successfully!',
  SNIPPET_DELETED: 'Snippet deleted successfully!',
  COMMENT_CREATED: 'Comment added successfully!',
  COMMENT_UPDATED: 'Comment updated successfully!',
  COMMENT_DELETED: 'Comment deleted successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  ACCOUNT_CREATED: 'Account created successfully!',
  PASSWORD_CHANGED: 'Password changed successfully!',
} as const;