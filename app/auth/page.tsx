'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Eye, EyeOff, Mail, Lock, Loader2, CheckCircle } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const supabase = createClient();
  
  // State Tab (Masuk / Daftar)
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  
  // State Form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Tambahkan ini lagi
  const [otp, setOtp] = useState(''); 
  
  // UI State
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [needsOtp, setNeedsOtp] = useState(false); // Jika true, tampilkan form OTP

  // --- 1. FLOW DAFTAR BARU (MANUAL) ---
  const handleSignUp = async () => {
    // Validasi Password
    if (!password || password.length < 6) return alert("Password minimal 6 karakter");
    if (password !== confirmPassword) return alert("Password dan Konfirmasi Password tidak sama!");

    setLoading(true);
    
    // Daftar ke Supabase (Password DISIMPAN di sini)
    const { error } = await supabase.auth.signUp({
      email,
      password, // <--- Password ini akan disimpan untuk login nanti
      options: { emailRedirectTo: `${location.origin}/auth/callback` }
    });
    
    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      // Sukses daftar, sekarang minta OTP untuk aktifkan akun
      setNeedsOtp(true);
      alert(`Akun dibuat! Kode OTP telah dikirim ke email ${email}.`);
    }
  };

  // --- 2. FLOW VERIFIKASI OTP (EMAIL) ---
  const handleVerifyOtp = async () => {
    if (otp.length < 6) return alert("Masukkan 6 digit kode OTP");
    setLoading(true);
    
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'signup' // Tipe signup = Verifikasi pendaftaran
    });
    
    setLoading(false);

    if (error) {
        alert("Kode salah atau kadaluarsa: " + error.message);
    } else {
      alert("Email berhasil diverifikasi! Anda sekarang sudah login.");
      router.push('/profile');
      router.refresh();
    }
  };

  // --- 3. FLOW LOGIN (MASUK) ---
  const handleSignIn = async () => {
    setLoading(true);
    // Login menggunakan Password yang dibuat saat daftar
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    
    if (error) {
        alert("Login gagal: " + error.message);
    } else {
      router.push('/profile');
      router.refresh();
    }
  };

  // --- GOOGLE LOGIN ---
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
  };

  // --- TAMPILAN: INPUT OTP (Langkah 2 Pendaftaran) ---
  if (needsOtp) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black p-4">
        <div className="w-full max-w-md bg-[#1C1C1C] border border-gray-800 rounded-2xl p-8 text-center space-y-6 animate-fade-in">
          <div className="w-16 h-16 bg-[#0A74DA]/20 rounded-full flex items-center justify-center mx-auto">
             <Mail className="w-8 h-8 text-[#0A74DA]" />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Verifikasi Email</h2>
            <p className="text-gray-400 text-sm">
                Masukkan 6 digit kode yang kami kirim ke <br/>
                <span className="text-white font-medium">{email}</span>
            </p>
          </div>
          
          <input 
            type="text" 
            value={otp} 
            onChange={(e) => setOtp(e.target.value)}
            placeholder="XXXXXX" 
            className="w-full p-4 bg-black border border-gray-700 rounded-xl text-center text-2xl text-white tracking-[0.5em] focus:border-[#0A74DA] outline-none transition-all"
            maxLength={6}
          />
          
          <button 
            onClick={handleVerifyOtp} 
            disabled={loading || otp.length < 6} 
            className="w-full py-3 bg-[#0A74DA] hover:bg-blue-600 text-white font-bold rounded-xl flex justify-center items-center gap-2 disabled:opacity-50 transition-all"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Verifikasi & Masuk"}
          </button>
          
          <button onClick={() => setNeedsOtp(false)} className="text-sm text-gray-500 hover:text-white underline transition-colors">
            Salah email? Kembali
          </button>
        </div>
      </div>
    );
  }

  // --- TAMPILAN: FORM UTAMA (LOGIN / DAFTAR) ---
  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-md bg-[#1C1C1C] border border-gray-800 rounded-2xl p-8 animate-fade-in">
        
        {/* TAB SWITCHER */}
        <div className="flex bg-black p-1 rounded-lg mb-8 border border-gray-800">
          <button onClick={() => setTab('signin')} className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${tab === 'signin' ? 'bg-[#0A74DA] text-white shadow-md' : 'text-gray-400 hover:text-white'}`}>Masuk</button>
          <button onClick={() => setTab('signup')} className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${tab === 'signup' ? 'bg-[#0A74DA] text-white shadow-md' : 'text-gray-400 hover:text-white'}`}>Daftar Baru</button>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">
            {tab === 'signin' ? 'Selamat Datang' : 'Buat Akun Baru'}
        </h2>
        <p className="text-gray-400 text-sm mb-6">
            {tab === 'signin' ? 'Masuk dengan email & password Anda.' : 'Daftar untuk mulai memesan layanan.'}
        </p>

        <div className="space-y-4">
          {/* INPUT EMAIL */}
          <div className="relative">
             <Mail className="absolute left-3 top-3.5 text-gray-500 w-5 h-5" />
             <input 
                type="email" 
                placeholder="Email address" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full pl-10 p-3 bg-black border border-gray-700 rounded-lg text-white outline-none focus:border-[#0A74DA] transition-colors placeholder:text-gray-600" 
             />
          </div>
          
          {/* INPUT PASSWORD */}
          <div className="relative">
             <Lock className="absolute left-3 top-3.5 text-gray-500 w-5 h-5" />
             <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password (Min 6)" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full pl-10 pr-10 p-3 bg-black border border-gray-700 rounded-lg text-white outline-none focus:border-[#0A74DA] transition-colors placeholder:text-gray-600" 
             />
             <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-gray-500 hover:text-white transition-colors">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
             </button>
          </div>

          {/* INPUT KONFIRMASI PASSWORD (Hanya saat Signup) */}
          {tab === 'signup' && (
             <div className="relative animate-fade-in">
               <Lock className="absolute left-3 top-3.5 text-gray-500 w-5 h-5" />
               <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Ulangi Password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  className={`w-full pl-10 p-3 bg-black border rounded-lg text-white outline-none transition-colors placeholder:text-gray-600 ${password && confirmPassword && password !== confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-[#0A74DA]'}`} 
               />
               {password && confirmPassword && password === confirmPassword && (
                   <CheckCircle className="absolute right-3 top-3.5 text-green-500 w-5 h-5" />
               )}
             </div>
          )}

          <button 
            onClick={tab === 'signin' ? handleSignIn : handleSignUp} 
            disabled={loading} 
            className="w-full py-3 bg-[#0A74DA] hover:bg-blue-600 text-white font-bold rounded-lg flex justify-center items-center gap-2 disabled:opacity-70 transition-all shadow-lg shadow-blue-900/20"
          >
            {loading ? <Loader2 className="animate-spin" /> : (tab === 'signin' ? 'Masuk Sekarang' : 'Daftar & Kirim OTP')}
          </button>
        </div>

        <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-800"></div></div>
            <div className="relative flex justify-center text-xs uppercase tracking-wider"><span className="px-2 bg-[#1C1C1C] text-gray-500">atau lanjutkan dengan</span></div>
        </div>

        <button onClick={handleGoogleLogin} className="w-full py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
           <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27c3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12.5S6.42 23 12.1 23c5.83 0 8.84-4.15 8.84-8.83c0-.76-.1-1.27-.1-1.27z"/></svg>
           Google
        </button>
        
        <button onClick={() => router.push('/')} className="block w-full text-center text-gray-500 text-sm mt-6 hover:text-white transition-colors">
            Kembali ke Beranda
        </button>
      </div>
    </div>
  );
}