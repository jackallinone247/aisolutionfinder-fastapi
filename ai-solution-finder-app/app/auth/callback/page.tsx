// app/auth/callback/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    // Handles both OAuth and email magic link/OTP
    supabase.auth
      .exchangeCodeForSession(window.location.href)
      .then(({ error }) => {
        if (error) console.error("exchange error", error);
        router.replace("/"); // or wherever you want to land
      });
  }, [router]);

  return (
    <div className="p-6">Anmeldung wird abgeschlossen …</div>
  );
}
