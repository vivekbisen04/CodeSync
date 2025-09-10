import { Header } from '@/components/layout/header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </div>
    </div>
  );
}