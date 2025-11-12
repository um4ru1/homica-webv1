'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import UserDashboardClient from './user-client';

export default function UserPage() {
  const router = useRouter();
  const [payload, setPayload] = useState<null | {
    uid: string;
    email: string;
    joinedAt: string;
    initialProfile: {
      display_name: string;
      avatar_url: string;
      bio: string;
      role: 'user' | 'worker' | 'owner' | null;
    };
  }>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      // baca session di client (pasti konsisten dgn navbar/useAuth)
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/signin?next=/user');
        return;
      }

      const uid = session.user.id;
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name, avatar_url, bio, role')
        .eq('id', uid)
        .maybeSingle();

      if (!mounted) return;
      setPayload({
        uid,
        email: session.user.email ?? '',
        joinedAt: session.user.created_at ?? '',
        initialProfile: {
          display_name: profile?.display_name ?? '',
          avatar_url: profile?.avatar_url ?? '',
          bio: profile?.bio ?? '',
          role: (profile?.role as 'user' | 'worker' | 'owner' | null) ?? null,
        },
      });
    })();

    return () => { mounted = false; };
  }, [router]);

  if (!payload) return null; // optional: spinner/skeleton

  return <UserDashboardClient {...payload} />;
}
