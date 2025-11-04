"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/";

  function LoadingFallback() {
  return <p>Loading...</p>
  }
  <Suspense fallback={<LoadingFallback />}>
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="email"
        className="w-full rounded-xl border p-3 outline-none bg-background dark:bg-background border-black/10 dark:border-white/10"
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoFocus
      />
      <input
        type="password"
        className="w-full rounded-xl border p-3 outline-none bg-background dark:bg-background border-black/10 dark:border-white/10"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button
        disabled={busy}
        className="w-full rounded-xl px-4 py-3 font-medium bg-[#0A74DA] text-[var(--color-custom-button-text)] disabled:opacity-60"
      >
        {busy ? "Processing…" : "Continue"}
      </button>

      {msg && (
        <p className="text-sm text-yellow-500/90 bg-yellow-500/10 rounded-lg p-2">
          {msg}
        </p>
      )}
    </form>
  </Suspense>;
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);

    // 1) Try sign-in
    const { error: signInErr } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!signInErr) {
      router.push(next);
      return;
    }

    // 2) If fails, auto sign-up
    const { error: signUpErr } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${location.origin}` },
    });

    if (signUpErr) setMsg(signUpErr.message);
    else setMsg("Check your email to verify your account.");
    setBusy(false);
  }

  return (
    <main className="min-h-[calc(100dvh-80px)] w-full grid place-items-center px-4">
      <div className="w-full max-w-md rounded-2xl shadow-lg p-6 bg-[var(--color-surface)] dark:bg-[var(--color-surface)]">
        {/* Homica brand header */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm bg-background/50">
            <span className="font-semibold">Homica</span>
            <span className="opacity-70">Sign in / Sign up</span>
          </div>
          <h1 className="mt-3 text-2xl font-bold">Welcome back</h1>
          <p className="text-sm opacity-80">Use your email & password</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            className="w-full rounded-xl border p-3 outline-none bg-background dark:bg-background border-black/10 dark:border-white/10"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
          <input
            type="password"
            className="w-full rounded-xl border p-3 outline-none bg-background dark:bg-background border-black/10 dark:border-white/10"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            disabled={busy}
            className="w-full rounded-xl px-4 py-3 font-medium bg-[#0A74DA] text-[var(--color-custom-button-text)] disabled:opacity-60"
          >
            {busy ? "Processing…" : "Continue"}
          </button>

          {msg && (
            <p className="text-sm text-yellow-500/90 bg-yellow-500/10 rounded-lg p-2">
              {msg}
            </p>
          )}
        </form>

        <div className="mt-6 text-center text-sm opacity-80">
          <span>Back to </span>
          <Link href="/" className="underline underline-offset-4">
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
