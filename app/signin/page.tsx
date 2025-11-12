'use client';
import SignInForm from './SignInForm';

export default function SignInPage() {
  return (
    <main className="min-h-[calc(100dvh-80px)] w-full grid place-items-center px-4">
      <div className="w-full max-w-md">
        <SignInForm />
      </div>
    </main>
  );
}
