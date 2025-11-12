'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { supabase } from '@/utils/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

type P = {
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: 'user'|'worker'|'owner'|null;
};

export default function ProfilePage() {
  const { session, refresh } = useAuth();
  const uid = session?.user.id;
  const [p, setP] = useState<P>({ display_name: null, avatar_url: null, bio: null, role: null });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    (async () => {
      if (!uid) return;
      const { data } = await supabase.from('profiles')
        .select('display_name, avatar_url, bio, role')
        .eq('id', uid).single();
      if (data) setP(data as P);
    })();
  }, [uid]);

  async function onSave() {
    if (!uid) return;
    setSaving(true);
    await supabase.from('profiles')
      .update({ display_name: p.display_name, bio: p.bio })
      .eq('id', uid);
    setSaving(false);
    await refresh();
    alert('Saved');
  }

  async function onAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !uid) return;
    setUploading(true);
    // pastikan bucket "avatars" sudah dibuat (public)
    const path = `${uid}/${Date.now()}_${file.name}`;
    const up = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
    if (up.error) { setUploading(false); alert(up.error.message); return; }

    const { data } = supabase.storage.from('avatars').getPublicUrl(path);
    const publicUrl = data.publicUrl;

    await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', uid);
    setP(prev => ({ ...prev, avatar_url: publicUrl }));
    setUploading(false);
    await refresh();
  }

  const placeholder = '/avatar-placeholder.png'; // taruh gambar placeholder kecil di /public

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Profile</h1>

      <div className="grid gap-8 md:grid-cols-[200px,1fr]">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative h-40 w-40 overflow-hidden rounded-full border">
            <Image
              src={p.avatar_url || placeholder}
              alt="Avatar"
              fill
              className="object-cover"
            />
          </div>
          <label className="cursor-pointer rounded-lg border px-3 py-2 text-sm">
            {uploading ? 'Uploading…' : 'Change photo'}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onAvatarChange}
              disabled={uploading}
            />
          </label>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm opacity-70">Display name</label>
            <input
              value={p.display_name ?? ''}
              onChange={e => setP(v => ({ ...v, display_name: e.target.value }))}
              className="w-full rounded-lg border p-2 dark:bg-custombg dark:border-gray-700"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm opacity-70">Short bio</label>
            <textarea
              value={p.bio ?? ''}
              onChange={e => setP(v => ({ ...v, bio: e.target.value }))}
              rows={4}
              className="w-full rounded-lg border p-2 dark:bg-custombg dark:border-gray-700"
              placeholder="Describe yourself..."
            />
            <p className="mt-1 text-xs opacity-60">Tampilkan di beberapa bagian profil.</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onSave}
              disabled={saving}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
            <span className="self-center text-xs opacity-70 capitalize">Current role: {p.role ?? 'user'}</span>
          </div>
        </div>
      </div>
    </main>
  );
}
