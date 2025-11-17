import { createSupabaseServer } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createSupabaseServer();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return redirect('/signin');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return redirect('/'); 
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 border-r border-gray-700 p-6 hidden md:block">
        <h2 className="text-xl font-bold mb-8 text-blue-400">Admin Panel</h2>
        <nav className="space-y-4">
          <Link href="/admin/dashboard" className="block hover:text-blue-400">Dashboard</Link>
          
          {/* PERBAIKAN LINK DI SINI: ke /verification */}
          <Link href="/admin/verification" className="block hover:text-blue-400 font-semibold">
            Verifikasi Pekerja
          </Link>
          
          <Link href="/" className="block text-gray-500 hover:text-white mt-8">Kembali ke Web</Link>
        </nav>
      </aside>

      {/* Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}