'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { Menu, X, LogIn, LogOut, UserRound, Briefcase, Crown } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/utils/supabase/client';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { session, role } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const RoleBadge = () => {
    if (!role) return null;
    const label = role === 'owner' ? 'Owner' : role === 'worker' ? 'Homica Family' : 'User';
    const Icon = role === 'owner' ? Crown : role === 'worker' ? Briefcase : UserRound;
    return (
      <span className="inline-flex items-center gap-1 rounded-xl bg-custombg2 px-2 py-1 text-xs dark:text-customtext2">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </span>
    );
  };

  const nextParam = encodeURIComponent(pathname || '/');

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

          {/* Right: role + auth */}
          <div className="hidden items-center gap-3 md:flex">
            <RoleBadge />
            {!session ? (
              <Button asChild className="bg-[#0A74DA] text-custom-button-text hover:bg-[#0A74DA]/90">
                <Link href={`/signin?next=${nextParam}`}>
                  <LogIn className="mr-2 h-4 w-4" /> Sign in
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="outline" className="dark:border-gray-700">
                  <Link href={role === 'owner' ? '/dashboard/owner' : role === 'worker' ? '/dashboard/worker' : '/dashboard'}>
                    Dashboard
                  </Link>
                </Button>
                <Button
                  onClick={async () => {
                    await supabase.auth.signOut();
                    router.refresh();
                  }}
                  variant="ghost"
                  className="text-red-500 hover:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Sign out
                </Button>
              </>
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
                {!session ? (
                  <Button asChild className="bg-[#0A74DA] hover:bg-[#0A74DA]/90">
                    <Link href={`/signin?next=${nextParam}`}>
                      <LogIn className="mr-2 h-4 w-4" /> Sign in
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild variant="outline" className="dark:border-gray-700">
                      <Link href={role === 'owner' ? '/dashboard/owner' : role === 'worker' ? '/dashboard/worker' : '/dashboard'}>
                        Dashboard
                      </Link>
                    </Button>
                    <Button
                      onClick={async () => {
                        await supabase.auth.signOut();
                        router.refresh();
                      }}
                      variant="ghost"
                      className="text-red-500"
                    >
                      <LogOut className="mr-2 h-4 w-4" /> Sign out
                    </Button>
                  </>
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
