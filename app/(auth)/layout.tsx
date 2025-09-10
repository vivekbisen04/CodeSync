import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center">
              <span className="text-black font-bold text-sm">CS</span>
            </div>
            <span>{APP_NAME}</span>
          </Link>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "CodeSync has transformed how I share and discover code snippets. 
              The real-time collaboration features are incredible!"
            </p>
            <footer className="text-sm">Vivek Bisen - Software Engineer</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center lg:hidden">
            <Link href="/" className="flex items-center justify-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-foreground flex items-center justify-center">
                <span className="text-background font-bold text-sm">CS</span>
              </div>
              <span className="text-xl font-bold">{APP_NAME}</span>
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}