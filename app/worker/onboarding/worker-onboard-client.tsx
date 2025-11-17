'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider'; // Impor hook AuthProvider

export default function WorkerOnboardClient() {
  const { supabase, session } = useAuth(); // Ambil supabase & session dari context
  const router = useRouter();
  
  // State untuk form
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [bio, setBio] = useState('');
  const [serviceTypes, setServiceTypes] = useState<string[]>([]);
  const [availability, setAvailability] = useState<string[]>([]);
  const [experience, setExperience] = useState(0);
  const [certs, setCerts] = useState('[]'); // Simpan sebagai string JSON

  // Helper untuk Checkbox
  const handleServiceTypeChange = (service: string) => {
    setServiceTypes(prev => 
      prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]
    );
  };
  const handleDayChange = (day: string) => {
    setAvailability(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const ALL_DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
  const ALL_SERVICES = ['fresh', 'careplus', 'little'];

  // Fungsi Submit Form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!supabase || !session) return;
    
    setLoading(true);

    // Validasi JSON Sertifikasi
    let certsJson;
    try {
      certsJson = JSON.parse(certs);
      if (!Array.isArray(certsJson)) throw new Error('Format harus array.');
    } catch (err) {
      alert('Format JSON Sertifikasi salah. Contoh: [{"name": "Sertifikat A", "year": 2024}]');
      setLoading(false);
      return;
    }
    
    // Siapkan data untuk INSERT
    const newWorkerData = {
      user_id: session.user.id, // Kunci utama
      phone: phone,
      address: address,
      bio: bio,
      service_types: serviceTypes,
      availability_days: availability,
      experience_years: experience,
      certifications: certsJson,
      verified: false, // KUNCI: Set 'verified' ke 'false'
    };

    // INSERT ke tabel 'workers'
    const { error } = await supabase
      .from('workers')
      .insert(newWorkerData);

    setLoading(false);

    if (error) {
      alert('Terjadi error: ' + error.message);
    } else {
      alert('Pendaftaran berhasil! Akun Anda akan segera kami verifikasi.');
      // Arahkan ke halaman status
      router.push('/worker/status');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Bio (Short Description) */}
      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-400">
          Deskripsi Singkat
        </label>
        <textarea 
          id="bio" 
          rows={3} 
          value={bio} 
          onChange={(e) => setBio(e.target.value)} 
          className="mt-1 block w-full bg-gray-900 border-gray-700 rounded-md shadow-sm text-white" 
          placeholder="Saya seorang pekerja keras..."
          required
        />
      </div>

      {/* Nomor Telepon */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-400">
          Nomor Telepon (WhatsApp)
        </label>
        <input 
          type="tel" 
          id="phone" 
          value={phone} 
          onChange={(e) => setPhone(e.target.value)} 
          className="mt-1 block w-full bg-gray-900 border-gray-700 rounded-md shadow-sm text-white" 
          placeholder="0812..."
          required
        />
      </div>

      {/* Alamat */}
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-400">
          Alamat (Bandung)
        </label>
        <input 
          type="text" 
          id="address" 
          value={address} 
          onChange={(e) => setAddress(e.target.value)} 
          className="mt-1 block w-full bg-gray-900 border-gray-700 rounded-md shadow-sm text-white" 
          placeholder="Jl. Merdeka No. 10"
          required
        />
      </div>

      {/* Service Types (Pilihan ganda) */}
      <div>
        <label className="block text-sm font-medium text-gray-400">
          Layanan yang Akan Ditawarkan
        </label>
        <div className="flex space-x-4 mt-2">
          {ALL_SERVICES.map(service => (
            <label key={service} className="flex items-center space-x-2 capitalize">
              <input type="checkbox" checked={serviceTypes.includes(service)} onChange={() => handleServiceTypeChange(service)} className="rounded text-blue-600 bg-gray-700 border-gray-500" />
              <span>{service}</span>
            </label>
          ))}
        </div>
      </div>
        
      {/* Availability Days (Pilihan ganda) */}
      <div>
        <label className="block text-sm font-medium text-gray-400">
          Hari Ketersediaan
        </label>
        <div className="flex flex-wrap gap-2 mt-2">
          {ALL_DAYS.map(day => (
            <label key={day} className="flex items-center space-x-2 p-2 bg-gray-700 rounded-md">
              <input type="checkbox" checked={availability.includes(day)} onChange={() => handleDayChange(day)} className="rounded text-blue-600 bg-gray-700 border-gray-500" />
              <span>{day}</span>
            </label>
          ))}
        </div>
      </div>
        
      {/* Data Profesional */}
      <hr className="my-6 border-gray-700" />

      <div>
        <label htmlFor="experience" className="block text-sm font-medium text-gray-400">
          Tahun Pengalaman
        </label>
        <input 
          type="number" 
          id="experience" 
          value={experience} 
          onChange={(e) => setExperience(parseInt(e.target.value) || 0)} 
          className="mt-1 block w-full bg-gray-900 border-gray-700 rounded-md shadow-sm text-white" 
        />
      </div>

      <div>
        <label htmlFor="certs" className="block text-sm font-medium text-gray-400">
          Sertifikasi (Format JSON)
        </label>
        <textarea 
          id="certs" 
          rows={5} 
          value={certs} 
          onChange={(e) => setCerts(e.target.value)} 
          className="mt-1 block w-full bg-gray-900 border-gray-700 rounded-md shadow-sm text-white font-mono"
          placeholder={`[{"name": "Sertifikat A", "year": 2024}, ... ]`}
        ></textarea>
      </div>
        
      <button 
        type="submit" 
        disabled={loading} 
        className="w-full px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-500"
      >
        {loading ? 'Mengirim...' : 'Daftar Sekarang'}
      </button>
    </form>
  );
}