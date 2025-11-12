'use client';

import Image from 'next/image';
import { useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { ArrowLeft, Loader2, Upload, UserRound } from 'lucide-react';
import { useRouter } from 'next/navigation';

const BUCKET = 'avatars'; // pastikan sama dengan nama bucket-mu

type Props = {
  uid: string;
  email: string;
  joinedAt: string; // ISO string
  initialProfile: {
    display_name: string;
    avatar_url: string;
    bio: string;
    role: 'user' | 'worker' | 'owner' | null;
  };
};

export default function UserDashboardClient({
  uid,
  email,
  joinedAt,
  initialProfile,
}: Props) {
  const router = useRouter();

  const [displayName, setDisplayName] = useState(initialProfile.display_name);
  const [bio, setBio] = useState(initialProfile.bio);
  const [avatarUrl, setAvatarUrl] = useState(initialProfile.avatar_url);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const roleLabel =
    initialProfile.role === 'worker' ? 'Homica Family' : (initialProfile.role ?? 'user');

  async function saveProfile() {
    setSaving(true);
    setErrorMsg(null);
    const { error } = await supabase
      .from('profiles')
      .update({ display_name: displayName, bio })
      .eq('id', uid);
    setSaving(false);
    if (error) setErrorMsg(error.message);
  }

  async function onPickAvatar(e: React.ChangeEvent<HTMLInputElement>) {
  const file = e.target.files?.[0];
  if (!file) return;

  const okTypes = ['image/png', 'image/jpeg', 'image/webp'];
  if (!okTypes.includes(file.type)) {
    setErrorMsg('Format harus PNG, JPG, atau WebP.');
    return;
  }
  if (file.size > 3 * 1024 * 1024) {
    setErrorMsg('Maksimal ukuran gambar 3 MB.');
    return;
  }

  setErrorMsg(null);
  setUploading(true);

  const ext = file.name.split('.').pop();
  const path = `${uid}/${Date.now()}.${ext}`;
  console.log('[avatar] uid=', uid, 'path=', path);

  const up = await supabase.storage.from('avatars').upload(path, file, { upsert: true });

  if (up.error) {
    console.error('[avatar] upload error:', up.error);
    setUploading(false);
    setErrorMsg(up.error.message);
    return;
  }

  const { data } = supabase.storage.from('avatars').getPublicUrl(path);

  const { error } = await supabase
    .from('profiles')
    .update({ avatar_url: data.publicUrl })
    .eq('id', uid);

  setUploading(false);

  if (error) {
    console.error('[avatar] update profile error:', error);
    setErrorMsg(error.message);
    return;
  }

  setAvatarUrl(data.publicUrl);
}


  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      {/* Header + Back */}
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm hover:bg-black/5 dark:hover:bg-white/5 dark:border-gray-700"
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <h1 className="text-2xl font-semibold">Your Profile</h1>
      </div>

      {/* Top card: Avatar */}
      <section className="mb-8 grid gap-8 md:grid-cols-[240px,1fr]">
        <div className="flex flex-col items-center gap-4">
          {/* Avatar container */}
          <div className="relative flex h-48 w-48 items-center justify-center overflow-hidden rounded-full border border-black/10 bg-gradient-to-b from-white to-gray-100 shadow-sm dark:border-white/10 dark:from-[#151a22] dark:to-[#0f141b]">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt="Avatar"
                fill
                sizes="192px"
                className="object-cover"
              />
            ) : (
              <UserRound className="h-20 w-20 opacity-60" />
            )}
          </div>

          {/* Upload button */}
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#0A74DA] bg-[#0A74DA] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:brightness-95">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {uploading ? 'Uploading…' : 'Change photo'}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={onPickAvatar}
              disabled={uploading}
            />
          </label>
          <p className="text-xs opacity-60">Max 3 MB • JPG/PNG/WebP</p>

          {errorMsg && (
            <div className="mt-1 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
              {errorMsg}
            </div>
          )}
        </div>

        {/* Info card */}
        <div className="rounded-2xl border border-black/10 bg-white/60 p-5 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
          <div className="text-sm opacity-70">Email</div>
          <div className="text-base">{email}</div>

          <div className="mt-4 grid grid-cols-2 gap-6 text-sm">
            <div>
              <div className="opacity-70">Role</div>
              <div className="capitalize">{roleLabel}</div>
            </div>
            <div>
              <div className="opacity-70">Joined</div>
              <div>{new Date(joinedAt).toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Form card */}
      <section className="rounded-2xl border border-black/10 bg-white/60 p-5 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
        <div className="grid gap-5">
          <div>
            <label className="mb-1 block text-sm opacity-70">Display name</label>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full rounded-xl border border-black/10 bg-white/90 p-3 outline-none transition placeholder:opacity-60 hover:border-black/20 focus:border-[#0A74DA] dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20 dark:focus:border-[#5aa3ff]"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm opacity-70">Short description</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-black/10 bg-white/90 p-3 outline-none transition placeholder:opacity-60 hover:border-black/20 focus:border-[#0A74DA] dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20 dark:focus:border-[#5aa3ff]"
              placeholder="Tulis deskripsi singkat tentang dirimu…"
            />
            <p className="mt-1 text-xs opacity-60">
              Deskripsi singkat akan tampil di area profil & kartu pengguna.
            </p>
          </div>

          <div className="pt-1">
            <button
              onClick={saveProfile}
              disabled={saving}
              className="inline-flex items-center justify-center rounded-xl bg-[#0A74DA] px-5 py-2.5 font-medium text-white shadow-sm transition hover:brightness-95 disabled:opacity-60"
            >
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
