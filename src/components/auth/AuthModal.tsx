'use client';
import { useState } from 'react';
import { supabase } from '@/utils/supabase/client';

export default function AuthModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
    if (!signInErr) return onClose();

    const { error: signUpErr } = await supabase.auth.signUp({
      email, password, options: { emailRedirectTo: `${location.origin}` }
    });
    if (signUpErr) alert(signUpErr.message);
    else { alert('Check your email to verify.'); onClose(); }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 dark:bg-custombg2 dark:text-customtext">
        <h2 className="mb-4 text-xl font-semibold">Masuk / Daftar</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
                 placeholder="Email" className="w-full rounded-lg border p-2 dark:bg-custombg dark:border-gray-700" required />
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)}
                 placeholder="Password" className="w-full rounded-lg border p-2 dark:bg-custombg dark:border-gray-700" required />
          <button className="w-full rounded-lg bg-[#0A74DA] px-4 py-2 font-medium text-custom-button-text">Lanjut</button>
        </form>
        <button onClick={onClose} className="mt-3 w-full rounded-lg border px-4 py-2 dark:border-gray-700">Tutup</button>
      </div>
    </div>
  );
}
