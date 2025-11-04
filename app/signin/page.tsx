import { Suspense } from "react";
import SignInForm from "./SignInForm"; // Kita akan buat file ini

/**
 * Komponen Loading Sederhana.
 * Ini hanya akan tampil sepersekian detik.
 * Dibuat mirip form agar layout tidak "lompat".
 */
function LoadingFallback() {
  return (
    <main className="min-h-[calc(100dvh-80px)] w-full grid place-items-center px-4">
      <div className="w-full max-w-md rounded-2xl shadow-lg p-6 bg-[var(--color-surface)] dark:bg-[var(--color-surface)]">
        {/* Header Palsu (Placeholder) */}
        <div className="mb-6 text-center animate-pulse">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm bg-background/50 h-8 w-40 mx-auto"></div>
          <h1 className="mt-3 text-2xl font-bold h-8 w-48 mx-auto bg-background/50 rounded-md"></h1>
          <p className="text-sm opacity-80 h-4 w-32 mx-auto mt-1 bg-background/50 rounded-md"></p>
        </div>
        {/* Form Palsu (Placeholder) */}
        <div className="space-y-3 animate-pulse">
          <div className="w-full h-12 rounded-xl bg-background/50"></div>
          <div className="w-full h-12 rounded-xl bg-background/50"></div>
          <div className="w-full h-12 rounded-xl bg-[#0A74DA]/60"></div>
        </div>
        <div className="mt-6 text-center text-sm opacity-80 h-4 w-20 mx-auto bg-background/50 rounded-md animate-pulse">
        </div>
      </div>
    </main>
  );
}

/**
 * Ini adalah halaman Sign In utama.
 * Halaman ini HANYA me-render Suspense boundary.
 * Semua logika form dipindahkan ke <SignInForm />
 */
export default function SignInPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      {/* Komponen ANAK inilah yang memanggil useSearchParams() */}
      <SignInForm />
    </Suspense>
  );
}

