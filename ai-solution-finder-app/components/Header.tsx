"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "./AuthProvider";
import { supabase } from "../lib/supabaseClient";
import { Search, LogOut, LogIn, Share2 } from "lucide-react";

const GOOGLE_ENABLED =
  process.env.NEXT_PUBLIC_AUTH_GOOGLE_ENABLED === "true";

export default function Header() {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleGoogleSignIn = async () => {
    const redirectTo = `${window.location.origin}/auth/callback`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
    if (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setSent(false);
    const redirectTo = `${window.location.origin}/auth/callback`;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });
    setSending(false);
    if (error) {
      console.error(error);
      alert(error.message);
    } else {
      setSent(true);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <header className="bg-white border-brand-border border-thick shadow-card px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 flex items-center justify-center bg-brand-primary text-white rounded-md border-brand-border border-thick shadow-card">
          <Share2 className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-lg font-semibold leading-none text-brand-border">
            AI Solution Finder
          </h1>
          <p className="text-sm leading-none text-gray-600">
            Prozessoptimierung mit KI-Analyse
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/history"
          className="p-2 border-brand-border border-thick rounded-md shadow-card bg-white text-brand-border hover:bg-brand-accent"
          title="History"
        >
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
          <>
            {/* Always show a Login button that toggles the email form */}
            <button
              onClick={() => setShowForm((v) => !v)}
              className="p-2 border-brand-border border-thick rounded-md shadow-card bg-white text-brand-border hover:bg-brand-accent"
              title="Login"
            >
              <LogIn className="h-4 w-4" />
            </button>

            {showForm && (
              <form
                onSubmit={handleEmailSignIn}
                className="flex items-center gap-2 bg-white border-brand-border border-thick rounded-md shadow-card px-2 py-1"
              >
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-2 py-1 outline-none border border-gray-200 rounded"
                />
                <button
                  type="submit"
                  disabled={sending}
                  className="px-3 py-1 border-brand-border border-thick rounded-md shadow-card bg-brand-accent hover:bg-brand-accent/80"
                >
                  {sending ? "Senden…" : "Link senden"}
                </button>
                {GOOGLE_ENABLED && (
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="px-3 py-1 border-brand-border border-thick rounded-md shadow-card bg-white hover:bg-brand-accent"
                    title="Mit Google anmelden"
                  >
                    Google
                  </button>
                )}
                {sent && (
                  <span className="text-sm text-green-700 ml-1">
                    Magic-Link gesendet ✓
                  </span>
                )}
              </form>
            )}
          </>
        )}
      </div>
    </header>
  );
}
