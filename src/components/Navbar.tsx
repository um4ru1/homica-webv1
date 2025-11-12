'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { Menu, X, LogIn, UserRound } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/utils/supabase/client';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { session, role } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Semua role pakai ikon UserRound; label worker tetap "Homica Family"
  const roleLabel = role === 'worker' ? 'Homica Family' : 'User';
  const RoleIcon = UserRound;

  const nextParam = encodeURIComponent(pathname || '/');

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.refresh();
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-100 bg-white/50 backdrop-blur-sm dark:border-gray-800 dark:bg-custombg/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <div className="rounded-lg bg-[#0A74DA] px-3 py-1 text-white">
              <a href="#home" className="font-['Poppins'] text-lg font-semibold">Homica</a>
            </div>
          </div>

          <ThemeToggle />

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-12 md:flex">
            {['home','about','services','how-it-works','tracking','pricing','testimonials','blog','contact'].map(id => (
              <a
                key={id}
                href={`#${id}`}
                className="text-gray-700 transition-colors duration-200 hover:text-[#0A74DA] dark:text-customtext2"
              >
                {id.replaceAll('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
              </a>
            ))}
          </div>

          {/* Right: chip ke /user + auth (tanpa ikon sign-out) */}
          <div className="hidden items-center gap-4 md:flex">
            {session && (
              <Link
                href="/user"
                className="inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs hover:bg-white/50 dark:hover:bg-white/5 dark:border-gray-700"
                title="Buka profil"
              >
                <RoleIcon className="h-3.5 w-3.5" />
                <span className="capitalize">{roleLabel}</span>
              </Link>
            )}

            {!session ? (
              <Button asChild className="bg-[#0A74DA] text-custom-button-text hover:bg-[#0A74DA]/90">
                <Link href={`/signin?next=${nextParam}`}>
                  <LogIn className="mr-2 h-4 w-4" /> Sign in
                </Link>
              </Button>
            ) : (
              <Button
                onClick={handleSignOut}
                variant="ghost"
                className="text-red-500 hover:text-red-600"
              >
                {/* tanpa ikon */} Sign out
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen((s) => !s)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white dark:border-gray-800 dark:bg-custombg">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {['home','about','services','how-it-works','tracking','pricing','testimonials','blog','contact'].map(id => (
                <a
                  key={id}
                  href={`#${id}`}
                  className="block px-3 py-2 text-gray-700 hover:text-[#0A74DA] dark:text-customtext2"
                >
                  {id.replaceAll('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </a>
              ))}

              <div className="flex flex-col space-y-2 px-3 pt-2">
                {session && (
                  <Link
                    href="/user"
                    className="flex items-center gap-2 rounded-xl border px-3 py-2 text-sm dark:border-gray-700"
                    title="Buka profil"
                  >
                    <RoleIcon className="h-4 w-4" />
                    <span className="capitalize">{roleLabel}</span>
                  </Link>
                )}

                {!session ? (
                  <Button asChild className="bg-[#0A74DA] hover:bg-[#0A74DA]/90">
                    <Link href={`/signin?next=${nextParam}`}>
                      <LogIn className="mr-2 h-4 w-4" /> Sign in
                    </Link>
                  </Button>
                ) : (
                  <Button
                    onClick={handleSignOut}
                    variant="ghost"
                    className="text-red-500"
                  >
                    Sign out
                  </Button>
                )}

                <Button className="bg-[#0A74DA] hover:bg-[#0A74DA]/90">Pesan Sekarang</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
