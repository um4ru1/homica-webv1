'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import { Menu, X, LogIn, UserRound, Bell } from 'lucide-react'; // Tambah Bell
import ThemeToggle from './ThemeToggle';
import { useAuth } from '@/components/auth/AuthProvider';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { session, supabase } = useAuth();
  const pathname = usePathname();

  const [userType, setUserType] = useState<'user' | 'worker' | 'admin'>('user');

  useEffect(() => {
    const checkUserRole = async () => {
      if (!session || !supabase) return;
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
      if (profile?.role === 'admin') { setUserType('admin'); return; }
      const { data: worker } = await supabase.from('workers').select('verified').eq('user_id', session.user.id).single();
      if (worker && worker.verified) { setUserType('worker'); } else { setUserType('user'); }
    };
    checkUserRole();
  }, [session, supabase]);

  let roleLabel = 'User';
  if (userType === 'worker') roleLabel = 'Homica Family';
  if (userType === 'admin') roleLabel = 'Admin';
  
  const RoleIcon = UserRound;
  const nextParam = encodeURIComponent(pathname || '/');

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-100 bg-white/50 backdrop-blur-sm dark:border-gray-800 dark:bg-[#020d24]/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <div className="rounded-lg bg-[#0A74DA] px-3 py-1 text-white">
              <a href="/" className="font-['Poppins'] text-lg font-semibold">Homica</a>
            </div>
          </div>

          <ThemeToggle />

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-12 md:flex">
            {['home','about','services','how-it-works','tracking','pricing','testimonials','blog','contact'].map(id => (
              <a key={id} href={`/#${id}`} className="text-gray-700 transition-colors duration-200 hover:text-[#0A74DA] dark:text-gray-300">
                {id.replaceAll('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
              </a>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden items-center gap-4 md:flex">
            {session && (
              <>
                {/* Tombol Notifikasi (Pengganti Sign Out) */}
                <button className="p-2 text-gray-500 hover:text-[#0A74DA] dark:text-gray-400 dark:hover:text-white transition-colors">
                  <Bell className="w-5 h-5" />
                </button>

                {/* Chip Profil */}
                <Link
                  href="/profile"
                  className="inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs hover:bg-white/50 dark:hover:bg-white/5 dark:border-gray-700 dark:text-white"
                >
                  <RoleIcon className="h-3.5 w-3.5" />
                  <span className="capitalize">{roleLabel}</span>
                </Link>
              </>
            )}

            {!session && (
              <Button asChild className="bg-[#0A74DA] text-white hover:bg-[#0A74DA]/90">
                <Link href={`/signin?next=${nextParam}`}>
                  <LogIn className="mr-2 h-4 w-4" /> Sign in
                </Link>
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
          <div className="md:hidden border-t border-gray-100 bg-white dark:border-gray-800 dark:bg-[#020d24]">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {['home','about','services','how-it-works','tracking','pricing','testimonials','blog','contact'].map(id => (
                <a key={id} href={`/#${id}`} className="block px-3 py-2 text-gray-700 hover:text-[#0A74DA] dark:text-gray-300">
                  {id.replaceAll('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </a>
              ))}

              <div className="flex flex-col space-y-2 px-3 pt-2">
                {session ? (
                  <Link href="/profile" className="flex items-center gap-2 rounded-xl border px-3 py-2 text-sm dark:border-gray-700 dark:text-white">
                    <RoleIcon className="h-4 w-4" />
                    <span className="capitalize">{roleLabel}</span>
                  </Link>
                ) : (
                  <Button asChild className="bg-[#0A74DA] hover:bg-[#0A74DA]/90">
                    <Link href={`/signin?next=${nextParam}`}>
                      <LogIn className="mr-2 h-4 w-4" /> Sign in
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}