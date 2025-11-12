// app/signin/SignInForm.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";

type Mode = "user" | "worker";
type Tab = "signin" | "signup";

export default function SignInForm() {
  const router = useRouter();
  const sp = useSearchParams();

  const [mode, setMode] = useState<Mode>("user");
  const [tab, setTab] = useState<Tab>("signin");

  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const q = sp.get("mode");
    if (q === "worker" || q === "user") setMode(q);
  }, [sp]);

  async function onSignin(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
      if (error) throw error;
      // send them to post-login resolver with mode
      router.push(`/post-login?mode=${mode}`);
    } catch (e: any) {
      setErr(e?.message ?? "Sign in failed.");
    } finally {
      setBusy(false);
    }
  }

  async function onSignup(e: React.FormEvent) {
    e.preventDefault();
    if (pw.length < 6) return setErr("Password minimal 6 karakter.");
    if (pw !== pw2) return setErr("Konfirmasi password tidak cocok.");
    setBusy(true);
    setErr(null);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password: pw,
        options: {
          emailRedirectTo: `${location.origin}/post-login?mode=${mode}`,
        },
      });
      if (error) throw error;
      alert("Cek email untuk verifikasi akun.");
      router.push("/");
    } catch (e: any) {
      setErr(e?.message ?? "Sign up failed.");
    } finally {
      setBusy(false);
    }
  }

  async function signInWithGoogle() {
    setBusy(true);
    setErr(null);
    try {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${location.origin}/post-login?mode=${mode}`,
        },
      });
      // Supabase will redirect; no push here
    } catch (e: any) {
      setErr(e?.message ?? "Google sign-in gagal.");
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-xl dark:bg-custombg2 dark:text-customtext">
      {/* Mode toggle */}
      <div className="mb-4 grid grid-cols-2 gap-2">
        <button
          onClick={() => setMode("user")}
          className={`rounded-lg px-3 py-2 border text-sm font-medium ${
            mode === "user" ? "bg-blue-600 text-white border-blue-600" : "dark:border-gray-700"
          }`}
        >
          Masuk sebagai Pengguna
        </button>
        <button
          onClick={() => setMode("worker")}
          className={`rounded-lg px-3 py-2 border text-sm font-medium ${
            mode === "worker" ? "bg-blue-600 text-white border-blue-600" : "dark:border-gray-700"
          }`}
        >
          Masuk sebagai Pekerja
        </button>
      </div>

      {/* Tab toggle */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setTab("signin")}
          className={`rounded-lg px-3 py-2 border text-sm font-medium ${
            tab === "signin" ? "bg-blue-600 text-white border-blue-600" : "dark:border-gray-700"
          }`}
        >
          Sign in
        </button>
        <button
          onClick={() => setTab("signup")}
          className={`rounded-lg px-3 py-2 border text-sm font-medium ${
            tab === "signup" ? "bg-blue-600 text-white border-blue-600" : "dark:border-gray-700"
          }`}
        >
          Sign up
        </button>
      </div>

      <h1 className="mb-2 text-2xl font-bold">Welcome back</h1>
      <p className="mb-4 text-sm opacity-80">
        {mode === "user"
          ? tab === "signin"
            ? "Masuk dengan email & password Anda atau Google."
            : "Buat akun baru (kami kirim email verifikasi)."
          : "Khusus pekerja: jika pertama kali, Anda akan diminta melengkapi data pekerja."}
      </p>

      {err && (
        <div className="mb-3 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
          {err}
        </div>
      )}

      {tab === "signin" ? (
        <form onSubmit={onSignin} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full rounded-lg border p-2 dark:bg-custombg dark:border-gray-700"
            required
          />
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Password"
            className="w-full rounded-lg border p-2 dark:bg-custombg dark:border-gray-700"
            required
          />
          <button
            disabled={busy}
            className="w-full rounded-lg bg-[#0A74DA] px-4 py-2 font-medium text-white disabled:opacity-60"
          >
            {busy ? "Processing…" : "Sign in"}
          </button>
        </form>
      ) : (
        <form onSubmit={onSignup} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full rounded-lg border p-2 dark:bg-custombg dark:border-gray-700"
            required
          />
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Password (min 6)"
            className="w-full rounded-lg border p-2 dark:bg-custombg dark:border-gray-700"
            required
            minLength={6}
          />
          <input
            type="password"
            value={pw2}
            onChange={(e) => setPw2(e.target.value)}
            placeholder="Confirm password"
            className="w-full rounded-lg border p-2 dark:bg-custombg dark:border-gray-700"
            required
            minLength={6}
          />
          <button
            disabled={busy}
            className="w-full rounded-lg bg-[#0A74DA] px-4 py-2 font-medium text-white disabled:opacity-60"
          >
            {busy ? "Processing…" : "Sign up"}
          </button>
        </form>
      )}

      <div className="my-4 flex items-center justify-center gap-3 text-sm opacity-70">
        <span className="h-px w-16 bg-current/30" />
        <span>atau</span>
        <span className="h-px w-16 bg-current/30" />
      </div>

      <button
        onClick={signInWithGoogle}
        disabled={busy}
        className="w-full rounded-lg border px-4 py-2 font-medium dark:border-gray-700 disabled:opacity-60"
      >
        Continue with Google
      </button>

      <div className="mt-4 text-center text-sm">
        <a href="/" className="underline">
          Back to Home
        </a>
      </div>
    </div>
  );
}
