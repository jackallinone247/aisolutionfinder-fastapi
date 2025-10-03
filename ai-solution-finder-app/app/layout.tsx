import './globals.css';
import { ReactNode } from 'react';
import Header from '../components/Header';
import { AuthProvider } from '../components/AuthProvider';

export const metadata = {
  title: 'AI Solution Finder',
  description: 'Prozessoptimierung mit KI Analyse',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de">
      <body className="bg-brand-light text-brand-border min-h-screen flex flex-col">
        <AuthProvider>
          <Header />
          <main className="flex-1 container mx-auto mt-6 px-4 pb-10">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}