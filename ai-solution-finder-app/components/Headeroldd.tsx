"use client";

import Link from 'next/link';
import { useAuth } from './AuthProvider';
import { supabase } from '../lib/supabaseClient';
import { Search, User as UserIcon, LogOut, LogIn, Share2 } from 'lucide-react';

/**
 * The Header component renders the top navigation bar for the application. It mirrors
 * the reference design: a rectangular card with thick borders, the application name
 * and tagline on the left and a set of action icons on the right. When the user
 * is authenticated a logout button is presented; otherwise a login button appears.
 */
export default function Header() {
  const { user } = useAuth();

  const handleGoogleSignIn = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="bg-white border-brand-border border-thick shadow-card px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 flex items-center justify-center bg-brand-primary text-white rounded-md border-brand-border border-thick shadow-card">
          {/* simple document icon using lucide-react */}
          <Share2 className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-lg font-semibold leading-none text-brand-border">AI Solution Finder</h1>
          <p className="text-sm leading-none text-gray-600">Prozessoptimierung mit KI‑Analyse</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/history" className="p-2 border-brand-border border-thick rounded-md shadow-card bg-white text-brand-border hover:bg-brand-accent" title="History">
          <Search className="h-4 w-4" />
        </Link>
        {user ? (
          <button
            onClick={handleLogout}
            className="p-2 border-brand-border border-thick rounded-md shadow-card bg-white text-brand-border hover:bg-brand-accent"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={handleGoogleSignIn}
            className="p-2 border-brand-border border-thick rounded-md shadow-card bg-white text-brand-border hover:bg-brand-accent"
            title="Login"
          >
            <LogIn className="h-4 w-4" />
          </button>
        )}
      </div>
    </header>
  );
}