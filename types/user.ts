import { User, Snippet, Follow } from '@prisma/client';

export interface UserProfile extends User {
  snippets?: Snippet[];
  followers?: Follow[];
  following?: Follow[];
  _count: {
    snippets: number;
    followers: number;
    following: number;
  };
}

export interface UpdateProfileData {
  name?: string;
  username?: string;
  bio?: string;
  location?: string;
  website?: string;
  githubUrl?: string;
  twitterUrl?: string;
}

export interface UserStats {
  totalSnippets: number;
  totalLikes: number;
  totalFollowers: number;
  totalFollowing: number;
  joinedDate: Date;
  mostUsedLanguages: Array<{
    language: string;
    count: number;
  }>;
}

export interface UserSearch {
  query?: string;
  isVerified?: boolean;
  location?: string;
}

export interface FollowUser {
  userId: string;
  followingId: string;
}