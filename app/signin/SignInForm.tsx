"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";

type Mode = "user" | "worker"; // 'worker' di sini berarti 'Homica Family'
type Tab = "signin" | "signup";

export default function SignInForm() {
  const { supabase } = useAuth();
  const router = useRouter();
  const sp = useSearchParams();

  const [mode, setMode] = useState<Mode>("user");
  const [tab, setTab] = useState<Tab>("signin");

  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null); // State untuk pesan sukses

  useEffect(() => {
    const q = sp.get("mode");
    if (q === "worker" || q === "user") setMode(q as Mode);
  }, [sp]);

  // Fungsi untuk mendapatkan teks header dinamis
  const getHeaderText = () => {
    if (tab === "signin") {
      return "Selamat Datang Kembali!";
    } else {
      return mode === "user" ? "Buat Akun Baru" : "Gabung Homica Family";
    }
  };

  // Fungsi untuk mendapatkan teks deskripsi dinamis
  const getDescriptionText = () => {
    if (tab === "signin") {
      if (mode === "worker") {
        return "Masuk sebagai pekerja. Jika pertama kali, Anda akan diminta melengkapi data.";
      }
      return "Masuk dengan email & password Anda atau Google.";
    } else { // tab === "signup"
      return "Buat akun baru. Kami akan kirim email verifikasi.";
    }
  };


  async function onSignin(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return;

    setBusy(true);
    setErr(null);
    setSuccessMsg(null); // Reset pesan sukses
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: pw });
      if (error) throw error;
      
      // Jika berhasil login, redirect sesuai mode
      if (mode === 'worker') {
          router.push('/worker/onboarding');
      } else {
          router.push('/profile'); // Atau halaman beranda user
      }

    } catch (e: any) {
      setErr(e?.message ?? "Sign in failed.");
    } finally {
      setBusy(false);
    }
  }

  async function onSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return;

    setErr(null);
    setSuccessMsg(null);
    if (pw.length < 6) return setErr("Password minimal 6 karakter.");
    if (pw !== pw2) return setErr("Konfirmasi password tidak cocok.");
    setBusy(true);
    
    try {
      // Tentukan URL tujuan setelah verifikasi email (melalui /auth/callback)
      const nextUrlAfterVerification = mode === 'worker' ? '/worker/onboarding' : '/profile';
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pw,
        options: {
          // emailRedirectTo: ini akan digunakan oleh Supabase untuk mengarahkan user
          // setelah mereka mengklik link verifikasi di email.
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${nextUrlAfterVerification}`,
        },
      });
      if (error) throw error;

      // Jika signup berhasil, berikan pesan untuk cek email
      if (data.user && !data.user.confirmed_at) { // Jika email belum terkonfirmasi
        setSuccessMsg("Pendaftaran berhasil! Silakan cek email Anda untuk verifikasi.");
      } else {
        // Jika sudah terkonfirmasi (jarang terjadi di signup pertama, tapi sebagai fallback)
        if (mode === 'worker') {
            router.push('/worker/onboarding');
        } else {
            router.push('/profile');
        }
      }
      
    } catch (e: any) {
      setErr(e?.message ?? "Sign up failed.");
    } finally {
      setBusy(false);
    }
  }

  async function signInWithGoogle() {
    if (!supabase) return;

    setBusy(true);
    setErr(null);
    setSuccessMsg(null);
    try {
      // Tentukan URL tujuan setelah login Google sukses (melalui /auth/callback)
      const nextUrl = mode === 'worker' ? '/worker/onboarding' : '/profile';
      
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${nextUrl}`,
        },
      });
      // Supabase akan mengarahkan otomatis
    } catch (e: any) {
      setErr(e?.message ?? "Google sign-in gagal.");
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-xl dark:bg-[#020d24] dark:text-white border border-gray-800 w-full max-w-md">
      {/* Mode toggle */}
      <div className="mb-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setMode("user")}
          className={`rounded-lg px-3 py-2 border text-sm font-medium transition-colors ${
            mode === "user" 
            ? "bg-blue-600 text-white border-blue-600" 
            : "bg-transparent text-gray-400 border-gray-700"
          }`}
        >
          Masuk sebagai Pengguna
        </button>
        <button
          type="button"
          onClick={() => setMode("worker")}
          className={`rounded-lg px-3 py-2 border text-sm font-medium transition-colors ${
            mode === "worker" 
            ? "bg-blue-600 text-white border-blue-600" 
            : "bg-transparent text-gray-400 border-gray-700"
          }`}
        >
          Gabung Homica Family
        </button>
      </div>

      {/* Tab toggle */}
      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => setTab("signin")}
          className={`flex-1 rounded-lg px-3 py-2 border text-sm font-medium transition-colors ${
            tab === "signin" 
            ? "bg-gray-800 text-white border-gray-600" 
            : "bg-transparent text-gray-400 border-gray-700"
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => setTab("signup")}
          className={`flex-1 rounded-lg px-3 py-2 border text-sm font-medium transition-colors ${
            tab === "signup" 
             ? "bg-gray-800 text-white border-gray-600" 
            : "bg-transparent text-gray-400 border-gray-700"
          }`}
        >
          Sign Up
        </button>
      </div>

      <h1 className="mb-2 text-2xl font-bold">{getHeaderText()}</h1>
      <p className="mb-4 text-sm opacity-80 text-gray-400">
        {getDescriptionText()}
      </p>

      {err && (
        <div className="mb-3 rounded-lg border border-red-500/30 bg-red-900/20 px-3 py-2 text-sm text-red-200">
          {err}
        </div>
      )}
      {successMsg && ( // Tampilkan pesan sukses
        <div className="mb-3 rounded-lg border border-green-500/30 bg-green-900/20 px-3 py-2 text-sm text-green-200">
          {successMsg}
        </div>
      )}

      {tab === "signin" ? (
        <form onSubmit={onSignin} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full rounded-lg border p-3 bg-gray-900 border-gray-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            required
          />
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Password"
            className="w-full rounded-lg border p-3 bg-gray-900 border-gray-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            required
          />
          <button
            disabled={busy}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-60 transition-colors"
          >
            {busy ? "Processing…" : "Sign In"}
          </button>
        </form>
      ) : ( // tab === "signup"
        <form onSubmit={onSignup} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full rounded-lg border p-3 bg-gray-900 border-gray-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            required
          />
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Password (min 6)"
            className="w-full rounded-lg border p-3 bg-gray-900 border-gray-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            required
            minLength={6}
          />
          <input
            type="password"
            value={pw2}
            onChange={(e) => setPw2(e.target.value)}
            placeholder="Confirm password"
            className="w-full rounded-lg border p-3 bg-gray-900 border-gray-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            required
            minLength={6}
          />
          <button
            disabled={busy}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-60 transition-colors"
          >
            {busy ? "Processing…" : "Sign Up"}
          </button>
        </form>
      )}

      <div className="my-6 flex items-center justify-center gap-3 text-sm opacity-70">
        <span className="h-px w-full bg-gray-700" />
        <span className="text-gray-400">atau</span>
        <span className="h-px w-full bg-gray-700" />
      </div>

      <button
        type="button"
        onClick={signInWithGoogle}
        disabled={busy}
        className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 font-medium text-white hover:bg-gray-800 disabled:opacity-60 transition-colors"
      >
        Continue with Google
      </button>

      <div className="mt-6 text-center text-sm">
        <a href="/" className="text-gray-400 hover:text-white underline">
          Back to Home
        </a>
      </div>
    </div>
  );
}