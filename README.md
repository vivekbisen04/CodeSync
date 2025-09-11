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

### 4. Setup the database

```bash
# Generate Prisma client
npx prisma generate

# Push the schema to your Neon database
npx prisma db push

# (Optional) Seed with sample data
npm run db:seed
```

### 5. Start the development server

```bash
npm run dev
```

🎉 **Your app is now running at [http://localhost:3000](http://localhost:3000)!**

## 📋 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Check TypeScript types |
| `npx prisma generate` | Generate Prisma client |
| `npx prisma db push` | Push schema to database |
| `npx prisma studio` | Open Prisma Studio |
| `npm run db:seed` | Seed database with sample data |

## 📁 Project Structure

```
codesync/
├── app/                    # Next.js 14 app router
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Protected dashboard pages
│   ├── api/               # API routes
│   ├── snippet/           # Individual snippet pages
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── auth/              # Authentication forms
│   ├── layout/            # Layout components
│   ├── providers/         # Context providers
│   └── ui/                # Reusable UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
│   ├── auth.ts            # NextAuth configuration
│   ├── db.ts              # Prisma client
│   ├── utils.ts           # Helper functions
│   └── validations.ts     # Zod schemas
├── prisma/                # Database schema
├── types/                 # TypeScript definitions
└── public/                # Static assets
```

## Database Schema

The app uses PostgreSQL with the following main entities:

- **Users** - User profiles and authentication
- **Snippets** - Code snippets with metadata
- **Comments** - Snippet comments and replies
- **Likes** - User likes on snippets
- **Follows** - User follow relationships

## 🔗 API Endpoints

| Route | Method | Description |
|-------|--------|-------------|
| `/api/auth/*` | * | NextAuth.js endpoints |
| `/api/snippets` | GET, POST | List and create snippets |
| `/api/snippets/[id]` | GET, PUT, DELETE | Snippet CRUD operations |
| `/api/snippets/[id]/like` | POST, DELETE | Like/unlike snippets |
| `/api/snippets/[id]/comments` | GET, POST | Snippet comments |
| `/api/snippets/explore` | GET | Explore public snippets |
| `/api/snippets/my-snippets` | GET | User's own snippets |
| `/api/users` | GET | List users |
| `/api/users/[username]` | GET | User profile |
| `/api/users/[username]/follow` | POST, DELETE | Follow/unfollow users |
| `/api/profile` | GET, PUT | Current user profile |

## 🚀 Deployment

This project is optimized for deployment on Vercel with Neon PostgreSQL:

1. **Fork this repository**
2. **Import to Vercel** - Connect your GitHub account
3. **Add environment variables** - Copy from your local `.env`
4. **Deploy** - Vercel will automatically build and deploy

### Production Environment Variables

```env
DATABASE_URL="your-neon-database-url"
DIRECT_URL="your-neon-direct-url"
NEXTAUTH_SECRET="your-production-secret"
NEXTAUTH_URL="https://your-domain.vercel.app"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Prisma](https://prisma.io/) - Database toolkit
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Shadcn/ui](https://ui.shadcn.com/) - UI components
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - Code editor
- [Neon](https://neon.tech/) - Serverless PostgreSQL

---

<div align="center">
  <p>Built with ❤️ by <a href="https://github.com/vivekbisen04">Vivek Bisen</a></p>
  <p>
    <a href="https://codesync-phi.vercel.app/">Live Demo</a> |
    <a href="https://github.com/vivekbisen04/Codesync/issues">Report Bug</a> |
    <a href="https://github.com/vivekbisen04/Codesync/issues">Request Feature</a>
  </p>
</div>