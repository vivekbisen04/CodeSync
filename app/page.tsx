import Link from 'next/link';
import { ArrowRight, Code, Users, Zap, Star, Github } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/components/layout/header';
import { APP_NAME, APP_DESCRIPTION } from '@/lib/constants';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container px-4 py-16 mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Share Code.
              <br />
              <span className="text-primary">Build Together.</span>
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-6">
              {APP_DESCRIPTION}. Connect with developers worldwide and level up your coding skills.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button size="lg" className="text-lg px-8" asChild>
                <Link href="/register">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8" asChild>
                <Link href="/explore">
                  Explore Snippets
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container px-4 py-16 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Why Choose {APP_NAME}?
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
              Everything you need to share, discover, and collaborate on code snippets.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            <Card>
              <CardContent className="flex flex-col items-center space-y-4 p-6">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Code className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Smart Code Editor</h3>
                <p className="text-center text-muted-foreground">
                  Syntax highlighting for 20+ languages with intelligent formatting and instant preview.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex flex-col items-center space-y-4 p-6">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Social Coding</h3>
                <p className="text-center text-muted-foreground">
                  Follow developers, comment on snippets, and build your coding network.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex flex-col items-center space-y-4 p-6">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Real-time Updates</h3>
                <p className="text-center text-muted-foreground">
                  Get instant notifications and see live changes as they happen.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-muted/50 border-t border-b">
          <div className="container px-4 py-16 mx-auto">
            <div className="grid gap-8 md:grid-cols-4 text-center">
              <div>
                <div className="text-3xl font-bold text-primary">10K+</div>
                <div className="text-sm text-muted-foreground">Code Snippets</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">5K+</div>
                <div className="text-sm text-muted-foreground">Developers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">20+</div>
                <div className="text-sm text-muted-foreground">Languages</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">Community</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container px-4 py-16 mx-auto text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Ready to Start Coding?
            </h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl mt-4">
              Join thousands of developers sharing knowledge and building amazing things together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button size="lg" className="text-lg px-8" asChild>
                <Link href="/register">
                  Sign Up Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8" asChild>
                <Link href="/login">
                  Sign In
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container px-4 py-8 mx-auto">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-foreground flex items-center justify-center">
                <span className="text-background font-bold text-sm">CS</span>
              </div>
              <span className="font-bold">{APP_NAME}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 {APP_NAME}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
