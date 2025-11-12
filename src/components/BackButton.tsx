'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function BackButton({ className = '' }: { className?: string }) {
  const router = useRouter();
  return (
    <Button variant="outline" onClick={() => router.back()} className={className}>
      ← Kembali
    </Button>
  );
}
