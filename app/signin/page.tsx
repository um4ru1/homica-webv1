'use client';
import { Suspense } from 'react';
import SignInForm from './SignInForm';

export default function SignInPage() {
  return (
    <main className="min-h-[calc(100dvh-80px)] w-full grid place-items-center px-4">
      <div className="w-full max-w-md">
        {/* Wajib: wrap komponen yang memanggil useSearchParams */}
        <Suspense fallback={null}>
          <SignInForm />
        </Suspense>
      </div>
    </main>
  );
}
