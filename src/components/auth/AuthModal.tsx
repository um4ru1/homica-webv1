'use client';
import { useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

type Mode = 'user' | 'worker';

export default function AuthModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('user');
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');

  async function afterAuthRedirect() {
    // habis sign-in, arahkan ke handler pasca-login yg baca role
    router.push(`/post-login?mode=${mode}`);
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
    if (!signInErr) return afterAuthRedirect();

    const { error: signUpErr } = await supabase.auth.signUp({
      email, password, options: { emailRedirectTo: `${location.origin}/post-login?mode=${mode}` }
    });
    if (signUpErr) alert(signUpErr.message);
    else { alert('Cek email untuk verifikasi.'); onClose(); }
  }

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/post-login?mode=${mode}` }
    });
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 dark:bg-custombg2 dark:text-customtext">
        <div className="mb-3 grid grid-cols-2 gap-2">
          <button
            className={`rounded-lg px-3 py-2 border ${mode==='user'?'bg-blue-600 text-white':'dark:border-gray-700'}`}
            onClick={()=>setMode('user')}
          >Masuk sebagai Pengguna</button>
          <button
            className={`rounded-lg px-3 py-2 border ${mode==='worker'?'bg-blue-600 text-white':'dark:border-gray-700'}`}
            onClick={()=>setMode('worker')}
          >Masuk sebagai Pekerja</button>
        </div>

        <h2 className="mb-4 text-xl font-semibold">
          {mode==='user' ? 'Masuk / Daftar (Pengguna)' : 'Masuk / Daftar (Pekerja)'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
                 placeholder="Email" className="w-full rounded-lg border p-2 dark:bg-custombg dark:border-gray-700" required />
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)}
                 placeholder="Password" className="w-full rounded-lg border p-2 dark:bg-custombg dark:border-gray-700" required />
          <button className="w-full rounded-lg bg-[#0A74DA] px-4 py-2 font-medium text-custom-button-text">Lanjut</button>
        </form>

        <button onClick={signInWithGoogle}
                className="mt-2 w-full rounded-lg border px-4 py-2 dark:border-gray-700">
          Lanjut dengan Google
        </button>

        <button onClick={onClose} className="mt-3 w-full rounded-lg border px-4 py-2 dark:border-gray-700">Tutup</button>
      </div>
    </div>
  );
}
