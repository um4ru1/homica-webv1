'use client';
import { useState } from 'react';
import { Button } from './ui/button';
import { Menu, X, Download, LogIn, LogOut, UserRound, Briefcase, Crown } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '@/components/auth/AuthProvider';
import AuthModal from '@/components/auth/AuthModal';
import { supabase } from '@/utils/supabase/client';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const { session, role } = useAuth();

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

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/50 dark:bg-custombg/50 backdrop-blur-sm border-b dark:backdrop-blur-sm border-gray-100 dark:border-gray-800 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="bg-[#0A74DA] text-white px-3 py-1 rounded-lg">
              <a href="#home" className="font-['Poppins'] font-semibold text-lg">Homica</a>
            </div>
          </div>

          <ThemeToggle />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-12">
            {['home','about','services','how-it-works','tracking','pricing','testimonials','blog','contact'].map(id => (
              <a key={id} href={`#${id}`} className="text-gray-700 dark:text-customtext2 hover:text-[#0A74DA] transition-colors duration-200">
                {id.replaceAll('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
              </a>
            ))}
          </div>

          {/* Right: role + auth */}
          <div className="hidden md:flex items-center gap-3">
            <RoleBadge />
            {!session ? (
              <Button onClick={() => setShowAuth(true)} className="bg-[#0A74DA] hover:bg-[#0A74DA]/90 text-custom-button-text">
                <LogIn className="w-4 h-4 mr-2" /> Sign in
              </Button>
            ) : (
              <>
                <Button asChild variant="outline" className="dark:border-gray-700">
                  <a href={role === 'owner' ? '/dashboard/owner' : role === 'worker' ? '/dashboard/worker' : '/dashboard'}>
                    Dashboard
                  </a>
                </Button>
                <Button onClick={() => supabase.auth.signOut()} variant="ghost" className="text-red-500 hover:text-red-600">
                  <LogOut className="w-4 h-4 mr-2" /> Sign out
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen((s) => !s)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 dark:bg-custombg dark:border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {['home','about','services','how-it-works','tracking','pricing','testimonials','blog','contact'].map(id => (
                <a key={id} href={`#${id}`} className="block px-3 py-2 text-gray-700 hover:text-[#0A74DA] dark:text-customtext2">
                  {id.replaceAll('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </a>
              ))}
              <div className="flex flex-col space-y-2 px-3 pt-2">
                {!session ? (
                  <Button onClick={() => setShowAuth(true)} className="bg-[#0A74DA] hover:bg-[#0A74DA]/90">
                    <LogIn className="w-4 h-4 mr-2" /> Sign in
                  </Button>
                ) : (
                  <>
                    <Button asChild variant="outline" className="dark:border-gray-700">
                      <a href={role === 'owner' ? '/dashboard/owner' : role === 'worker' ? '/dashboard/worker' : '/dashboard'}>
                        Dashboard
                      </a>
                    </Button>
                    <Button onClick={() => supabase.auth.signOut()} variant="ghost" className="text-red-500">
                      <LogOut className="w-4 h-4 mr-2" /> Sign out
                    </Button>
                  </>
                )}
                <Button className="bg-[#0A74DA] hover:bg-[#0A74DA]/90">Pesan Sekarang</Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </nav>
  );
}
