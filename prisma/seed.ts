import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create demo users with upsert (create or update)
  const user1 = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'john@example.com',
      username: 'johndoe',
      bio: 'Full-stack developer passionate about clean code',
      location: 'San Francisco, CA',
      website: 'https://johndoe.dev',
      githubUrl: 'https://github.com/johndoe',
      isVerified: true,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'jane@example.com' },
    update: {},
    create: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      username: 'janesmith',
      bio: 'Frontend developer & UI/UX enthusiast',
      location: 'New York, NY',
      website: 'https://janesmith.design',
      githubUrl: 'https://github.com/janesmith',
      isVerified: false,
    },
  });

  // Clear existing data for clean seed (in correct order due to foreign keys)
  await prisma.follow.deleteMany({});
  await prisma.like.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.snippet.deleteMany({});
  
  // Create demo snippets
  const snippet1 = await prisma.snippet.create({
    data: {
      title: 'React Hook for API Calls',
      description: 'Custom hook for managing API requests with loading and error states',
      content: `import { useState, useEffect } from 'react';

export function useApi<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}`,
      language: 'typescript',
      tags: ['react', 'hooks', 'typescript', 'api'],
      authorId: user1.id,
    },
  });

  const snippet2 = await prisma.snippet.create({
    data: {
      title: 'CSS Flexbox Centering',
      description: 'Simple utility classes for centering content with flexbox',
      content: `.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.flex-center-col {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}`,
      language: 'css',
      tags: ['css', 'flexbox', 'utilities'],
      authorId: user2.id,
    },
  });

  // Create demo comments
  await prisma.comment.create({
    data: {
      content: 'Great hook! Very useful for handling API states.',
      snippetId: snippet1.id,
      authorId: user2.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: 'These utility classes are so handy. Thanks for sharing!',
      snippetId: snippet2.id,
      authorId: user1.id,
    },
  });

  // Create demo likes
  await prisma.like.create({
    data: {
      userId: user1.id,
      snippetId: snippet2.id,
    },
  });

  await prisma.like.create({
    data: {
      userId: user2.id,
      snippetId: snippet1.id,
    },
  });

  // Create follow relationship
  await prisma.follow.create({
    data: {
      followerId: user2.id,
      followingId: user1.id,
    },
  });

  console.log('Seeded database with demo data!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });