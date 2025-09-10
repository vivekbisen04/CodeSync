# CodeSync 🚀

A real-time social coding platform for developers to share, discover, and collaborate on code snippets.

## Features

- 🔐 **Authentication** - Secure auth with NextAuth.js (GitHub, Google, Credentials)
- 👨‍💻 **Code Sharing** - Share and discover code snippets
- 💬 **Social Features** - Comments, likes, follows
- 🎨 **Syntax Highlighting** - Support for 20+ programming languages
- 🌐 **Real-time Updates** - Socket.IO for live collaboration
- 📱 **Responsive Design** - Beautiful UI with Tailwind CSS
- 🔍 **Search & Filter** - Find snippets by language, tags, or content
- 📊 **Analytics** - Track views, likes, and engagement

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Cache**: Redis
- **Real-time**: Socket.IO
- **UI Components**: Custom components with Radix UI
- **Forms**: React Hook Form with Zod validation
- **Deployment**: Docker & Docker Compose

## Quick Start

### Prerequisites

- Node.js 18+ 
- Docker & Docker Compose
- Git

### 1. Clone the repository

```bash
git clone <repository-url>
cd codesync
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

```bash
cp .env.example .env
```

Update `.env` with your configuration:

```env
DATABASE_URL="postgresql://codesync_user:codesync_password@localhost:5432/codesync"
NEXTAUTH_SECRET="your-super-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
REDIS_URL="redis://:codesync_redis_password@localhost:6379"

# OAuth providers (optional)
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
GOOGLE_CLIENT_ID="your-google-client-id"  
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 4. Start the database services

```bash
npm run docker:dev
```

This starts PostgreSQL and Redis containers in the background.

### 5. Setup the database

```bash
# Generate Prisma client
npm run db:generate

# Push the schema to the database
npm run db:push

# Seed the database with sample data (optional)
npm run db:seed
```

### 6. Start the development server

```bash
npm run dev
```

🎉 **Your app is now running at [http://localhost:3000](http://localhost:3000)!**

## Development Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues |
| `npm run type-check` | Check TypeScript types |
| `npm run format` | Format code with Prettier |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed database with sample data |
| `npm run db:studio` | Open Prisma Studio |
| `npm run docker:dev` | Start Docker services |
| `npm run docker:down` | Stop Docker services |

## Project Structure

```
codesync/
├── app/                    # Next.js 14 app router
│   ├── (auth)/            # Authentication pages
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   └── snippet/           # Snippet pages
├── components/            # React components
│   ├── auth/              # Authentication components
│   ├── layout/            # Layout components
│   ├── providers/         # Context providers
│   ├── snippets/          # Snippet components
│   └── ui/                # UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
│   ├── auth.ts            # NextAuth configuration
│   ├── db.ts              # Prisma client
│   ├── redis.ts           # Redis client
│   ├── utils.ts           # Helper functions
│   └── validations.ts     # Zod schemas
├── prisma/                # Database schema and migrations
├── types/                 # TypeScript type definitions
└── public/                # Static assets
```

## Database Schema

The app uses PostgreSQL with the following main entities:

- **Users** - User profiles and authentication
- **Snippets** - Code snippets with metadata
- **Comments** - Snippet comments and replies
- **Likes** - User likes on snippets
- **Follows** - User follow relationships

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/auth/*` | * | NextAuth endpoints |
| `/api/snippets` | GET, POST | List and create snippets |
| `/api/snippets/[id]` | GET, PUT, DELETE | Snippet CRUD |
| `/api/users` | GET, PUT | User operations |
| `/api/comments` | GET, POST | Comment operations |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you have any questions or run into issues, please [open an issue](https://github.com/your-username/codesync/issues) on GitHub.

---

Built with ❤️ by the CodeSync team
