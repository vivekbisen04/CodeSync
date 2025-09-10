# CodeSync 🚀

A modern social coding platform for developers to share, discover, and collaborate on code snippets with real-time features.

## 🌐 Live Demo

**[https://codesync-phi.vercel.app/](https://codesync-phi.vercel.app/)**

> Experience CodeSync live! Create an account and start sharing your code snippets with the community.

## ✨ Features

- 🔐 **Multi-Provider Authentication** - Secure login with NextAuth.js supporting Google OAuth and email/password
- 👨‍💻 **Code Sharing & Management** - Create, edit, and organize code snippets with rich metadata
- 💬 **Social Interactions** - Like, comment, and follow other developers
- 🎨 **Monaco Editor Integration** - VS Code-like editing experience with syntax highlighting
- 📱 **Responsive Design** - Beautiful, modern UI built with Tailwind CSS and Shadcn/ui
- 🔍 **Advanced Search** - Filter snippets by language, tags, and content
- 👤 **User Profiles** - Customizable profiles with bio, social links, and snippet showcase
- 🏷️ **Smart Tagging** - Organize and discover content with trending tags
- 📊 **Engagement Analytics** - Track snippet views, likes, and comments
- 🌙 **Dark/Light Theme** - User preference-based theme switching

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router & TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui components
- **Code Editor**: Monaco Editor (VS Code editor)
- **State Management**: React Context & Server State
- **Forms**: React Hook Form with Zod validation
- **Theme**: Next-themes for dark/light mode

### Backend
- **API**: Next.js API Routes (RESTful)
- **Database**: Neon PostgreSQL (Serverless)
- **ORM**: Prisma with TypeScript
- **Authentication**: NextAuth.js with JWT
- **File Upload**: Cloudinary integration
- **Validation**: Zod schemas

### Deployment & DevOps
- **Platform**: Vercel (Serverless deployment)
- **Database**: Neon PostgreSQL (No cold starts)
- **CDN**: Vercel Edge Network
- **CI/CD**: Vercel Git integration
- **Analytics**: Built-in engagement tracking

## 🚀 Local Development Setup

### Prerequisites

- Node.js 18+ 
- Git
- A Neon PostgreSQL database (free tier)
- Cloudinary account (optional, for image uploads)

### 1. Clone the repository

```bash
git clone https://github.com/vivekbisen04/Codesync.git
cd codesync
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Create a `.env` file in the root directory:

```env
# Database (Get from Neon Console)
DATABASE_URL="postgresql://username:password@host/database?sslmode=require"
DIRECT_URL="postgresql://username:password@host/database?sslmode=require"

# NextAuth (Generate a random secret)
NEXTAUTH_SECRET="your-super-secret-key-here-32-chars-min"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (Get from Google Cloud Console)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
NEXT_PUBLIC_GOOGLE_ENABLED=true

# Cloudinary (Optional - for profile image uploads)
CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
CLOUDINARY_API_KEY="your-cloudinary-api-key"
CLOUDINARY_API_SECRET="your-cloudinary-api-secret"
```

> **Setup Guides:**
> - [Neon Database Setup](https://neon.tech) - Create free PostgreSQL database
> - [Google OAuth Setup](https://console.cloud.google.com) - Enable Google login
> - [Cloudinary Setup](https://cloudinary.com) - For image uploads (optional)

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


