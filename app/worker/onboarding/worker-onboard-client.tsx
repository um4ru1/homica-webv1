'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import MapLocationIQ from '@/components/MapLocationIQ'; 
import Link from 'next/link';
import { Check, X, MapPin, Info, UploadCloud, FileText, Trash2, NotebookPen } from 'lucide-react'; 

interface Props {
  userEmail: string;
  userId: string;
  initialData?: any; 
}

type CertificationItem = {
  name: string;
  file?: File | null; 
  url?: string;       
};

export default function WorkerOnboardingClient({ userEmail, userId, initialData }: Props) {
  const router = useRouter();
  const supabase = createClient();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  
  // State khusus untuk Error Telepon
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const [certNameInput, setCertNameInput] = useState('');
  const [certFileInput, setCertFileInput] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    phone: initialData?.phone || '',
    bio: initialData?.bio || '',
    address: initialData?.address || '', // Ini yang wajib diisi via peta
    notes: initialData?.notes || '',
    age: initialData?.age || '',
    latitude: initialData?.latitude || null,
    longitude: initialData?.longitude || null,
    zone: initialData?.areas?.[0] || null, 
    serviceTypes: initialData?.service_types || [],
    availability: initialData?.availability_days || [], 
    experienceYears: initialData?.experience_years || 0,
    certifications: (initialData?.certifications || []) as CertificationItem[], 
  });

  // --- VALIDASI NOMOR WHATSAPP ---
  const handlePhoneChange = (val: string) => {
    setFormData(prev => ({ ...prev, phone: val }));

    const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,11}$/;
    const onlyNumbers = /^[0-9+]+$/;

    if (!val) {
        setPhoneError(null); 
    } else if (!onlyNumbers.test(val)) {
        setPhoneError("Hanya boleh berisi angka");
    } else if (!phoneRegex.test(val)) {
        setPhoneError("Format tidak valid. Gunakan 08xx atau 628xx (Min 10 digit)");
    } else {
        setPhoneError(null); 
    }
  };

  // --- HANDLERS LAINNYA ---

  const handleLocationSelect = (loc: { latitude: number; longitude: number; address: string; zone: string | null }) => {
    setFormData(prev => ({
      ...prev,
      latitude: loc.latitude,
      longitude: loc.longitude,
      address: loc.address,
      zone: loc.zone
    }));
  };

  const handleServiceToggle = (service: string) => {
    setFormData(prev => {
      const exists = prev.serviceTypes.includes(service);
      if (exists) return { ...prev, serviceTypes: prev.serviceTypes.filter((s: string) => s !== service) };
      return { ...prev, serviceTypes: [...prev.serviceTypes, service] };
    });
  };

  const handleAvailabilityToggle = (day: string) => {
    setFormData(prev => {
      const exists = prev.availability.includes(day);
      if (exists) return { ...prev, availability: prev.availability.filter((d: string) => d !== day) };
      return { ...prev, availability: [...prev.availability, day] };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCertFileInput(e.target.files[0]);
    }
  };

  const addCertification = () => {
    if (!certNameInput.trim()) return alert("Nama sertifikasi harus diisi");
    if (!certFileInput) return alert("Harap upload file bukti sertifikasi");

    setFormData(prev => ({
      ...prev,
      certifications: [...prev.certifications, { name: certNameInput, file: certFileInput }]
    }));
    
    setCertNameInput('');
    setCertFileInput(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeCertification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  // --- SUBMIT ---

  const handleSubmit = async () => {
    setShowValidation(true);

    // 1. Cek Error Telepon
    if (phoneError) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    // 2. Cek Field Wajib (Termasuk ALAMAT/PETA)
    const isAddressEmpty = !formData.address || !formData.latitude || !formData.longitude;
    const isServicesEmpty = formData.serviceTypes.length === 0;
    const isAvailabilityEmpty = formData.availability.length === 0;

    if (
        !formData.bio || 
        !formData.phone || 
        !formData.age ||
        isAddressEmpty || // Validasi Alamat Wajib
        isServicesEmpty || 
        isAvailabilityEmpty 
    ) {
        // Scroll ke atas agar user melihat field yang merah
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
        let cleanPhone = formData.phone.replace(/\D/g, '');
        if (cleanPhone.startsWith('0')) cleanPhone = '62' + cleanPhone.substring(1);

        const processedCertifications = await Promise.all(formData.certifications.map(async (cert) => {
            if (cert.url && !cert.file) return { name: cert.name, url: cert.url };
            
            if (cert.file) {
                const fileExt = cert.file.name.split('.').pop();
                const fileName = `${userId}-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
                const filePath = `${userId}/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('certifications')
                    .upload(filePath, cert.file);

                if (uploadError) throw new Error(`Gagal upload: ${uploadError.message}`);

                const { data: publicUrlData } = supabase.storage
                    .from('certifications')
                    .getPublicUrl(filePath);
                
                return { name: cert.name, url: publicUrlData.publicUrl };
            }
            return { name: cert.name, url: '' };
        }));

        const payload = {
            user_id: userId,
            phone: cleanPhone,
            age: Number(formData.age),
            bio: formData.bio,
            address: formData.address,
            notes: formData.notes,
            latitude: formData.latitude,
            longitude: formData.longitude,
            areas: formData.zone ? [formData.zone] : [], 
            service_types: formData.serviceTypes, 
            availability_days: formData.availability, 
            experience_years: Number(formData.experienceYears),
            certifications: processedCertifications,
            verified: false, 
            updated_at: new Date().toISOString(),
        };

        let error;

        if (initialData) {
            const { error: updateError } = await supabase
                .from('workers')
                .update(payload)
                .eq('id', initialData.id);
            error = updateError;
        } else {
            const { error: insertError } = await supabase
                .from('workers')
                .insert(payload);
            error = insertError;
        }

        if (error) throw error;

        router.refresh();
        
        if (initialData) {
            router.push('/profile');
        } else {
            router.push('/worker/status');
        }

    } catch (err: any) {
        console.error(err);
        alert('Gagal menyimpan: ' + err.message);
    } finally {
        setIsSubmitting(false);
    }
  };

  const serviceOptions = ['Fresh', 'Careplus', 'Little']; 
  const dayOptions = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#121212] text-gray-900 dark:text-white p-6 pb-20">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
                {initialData ? 'Perbarui Data Pendaftaran' : 'Gabung sebagai Homica Family'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
                {initialData ? 'Silakan ubah data yang diperlukan. Perubahan akan direview ulang oleh admin.' : 'Lengkapi data di bawah ini untuk memulai proses verifikasi Anda.'}
            </p>
        </div>

        {/* --- BOX 1: INFO DASAR --- */}
        <div className="bg-white dark:bg-[#1C1C1C] border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg text-[#0A74DA] font-bold">1</div>
                <h2 className="text-lg font-bold">Informasi Pribadi</h2>
            </div>

            <div className="space-y-5">
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-1">Nomor WhatsApp <span className="text-red-500">*</span></label>
                    <input 
                        id="phone" 
                        type="tel" 
                        value={formData.phone} 
                        onChange={e => handlePhoneChange(e.target.value)} 
                        className={`w-full p-3 rounded-lg border bg-transparent focus:outline-none transition-colors
                            ${(showValidation && !formData.phone) || phoneError 
                                ? 'border-red-500 bg-red-50 dark:bg-red-900/10 text-red-900 dark:text-red-100 placeholder:text-red-300' 
                                : 'border-gray-300 dark:border-gray-700 focus:border-blue-500'}`}
                        placeholder="Contoh: 0812xxxxxx" 
                    />
                    {(phoneError || (showValidation && !formData.phone)) && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                             <Info className="w-3 h-3" /> {phoneError || "Nomor wajib diisi"}
                        </p>
                    )}
                </div>
                {/* INPUT UMUR (HANYA ANGKA) */}
                <div>
                    <label htmlFor="age" className="block text-sm font-medium mb-1">
                        Umur <span className="text-red-500">*</span>
                    </label>
                    <input 
                        type="number" 
                        id="age" 
                        value={formData.age} 
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })} 
                        min="17" // Validasi minimal umur (opsional)
                        max="99" 
                        className={`w-full p-3 rounded-lg border bg-transparent focus:outline-none transition-colors
                            ${(showValidation && !formData.age) 
                                ? 'border-red-500 bg-red-50 dark:bg-red-900/10 text-red-900 dark:text-red-100' 
                                : 'border-gray-300 dark:border-gray-700 focus:border-blue-500'}`}
                        placeholder="Contoh: 25" 
                    />
                    {showValidation && !formData.age && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                            <Info className="w-3 h-3" /> Umur wajib diisi
                        </p>
                    )}
                </div>
                <div>
                    <label htmlFor="bio" className="block text-sm font-medium mb-1">Deskripsi Singkat <span className="text-red-500">*</span></label>
                    <textarea id="bio" rows={4} value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} 
                        className={`w-full p-3 rounded-lg border bg-transparent focus:outline-none ${showValidation && !formData.bio ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-700 focus:border-blue-500'}`}
                        placeholder="Ceritakan pengalaman dan keahlian Anda..." />
                </div>
            </div>
        </div>

        {/* --- BOX 2: LOKASI --- */}
        <div className="bg-white dark:bg-[#1C1C1C] border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg text-[#0A74DA] font-bold">2</div>
                <h2 className="text-lg font-bold">Lokasi Operasional</h2>
            </div>

            <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    Cari area di search bar, lalu <b>geser pin merah</b> ke titik tepat rumah/basecamp Anda.
                </p>
                
                {/* PETA */}
                <div className={`h-[500px] w-full rounded-lg overflow-hidden border relative z-0 ${showValidation && !formData.latitude ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300 dark:border-gray-700'}`}>
                    <MapLocationIQ 
                      onLocationSelect={handleLocationSelect} 
                      initialLatitude={formData.latitude}
                      initialLongitude={formData.longitude}
                      initialAddress={formData.address}
                    />
                </div>

                <div className="mt-4 space-y-4">
                    {/* Alamat Read-only (WAJIB ISI) */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Lokasi Terpilih <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <textarea 
                                readOnly 
                                rows={2} 
                                value={formData.address} 
                                className={`w-full p-3 pl-10 rounded-lg border bg-gray-50 dark:bg-[#252525] text-gray-500 dark:text-gray-400 focus:outline-none cursor-not-allowed resize-none
                                    ${showValidation && !formData.address ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-700'}
                                `}
                                placeholder="Pilih lokasi di peta untuk mengisi alamat ini..." 
                            />
                            <MapPin className={`w-5 h-5 absolute top-3 left-3 ${showValidation && !formData.address ? 'text-red-400' : 'text-gray-400'}`} />
                        </div>
                        {showValidation && !formData.address && (
                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                <Info className="w-3 h-3" /> Wajib memilih lokasi di peta di atas
                            </p>
                        )}
                    </div>

                    {/* Field Catatan */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Catatan / Patokan (Opsional)</label>
                        <div className="relative">
                            <input 
                                type="text"
                                value={formData.notes}
                                onChange={e => setFormData({...formData, notes: e.target.value})}
                                className="w-full p-3 pl-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:outline-none focus:border-blue-500"
                                placeholder="Contoh: Rumah pagar hitam, depan masjid..." 
                            />
                            <NotebookPen className="w-5 h-5 text-gray-400 absolute top-3 left-3" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* --- BOX 3: KEAHLIAN --- */}
        <div className="bg-white dark:bg-[#1C1C1C] border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg text-[#0A74DA] font-bold">3</div>
                <h2 className="text-lg font-bold">Keahlian & Kualifikasi</h2>
            </div>

            <div className="space-y-6">
                {/* INPUT LAYANAN (REQUIRED) */}
                <div>
                    <label className="block text-sm font-medium mb-2">Layanan yang Ditawarkan <span className="text-red-500">*</span></label>
                    <div className="flex flex-wrap gap-3">
                        {serviceOptions.map((srv) => (
                            <button key={srv} type="button" onClick={() => handleServiceToggle(srv.toLowerCase())}
                                className={`px-5 py-2.5 rounded-full border text-sm font-medium transition-all ${formData.serviceTypes.includes(srv.toLowerCase()) ? 'bg-[#0A74DA] border-[#0A74DA] text-white shadow-md shadow-blue-500/20' : 'border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300'}`}>
                                {srv}
                            </button>
                        ))}
                    </div>
                    {showValidation && formData.serviceTypes.length === 0 && (
                        <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                            <Info className="w-3 h-3" /> Pilih minimal satu layanan
                        </p>
                    )}
                </div>

                {/* INPUT HARI (REQUIRED) */}
                <div>
                    <label className="block text-sm font-medium mb-2">Hari Ketersediaan <span className="text-red-500">*</span></label>
                    <div className="flex flex-wrap gap-2">
                        {dayOptions.map((day) => (
                            <button key={day} type="button" onClick={() => handleAvailabilityToggle(day.toLowerCase())}
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all border ${formData.availability.includes(day.toLowerCase()) ? 'bg-green-600 border-green-600 text-white' : 'bg-transparent border-gray-300 dark:border-gray-700 text-gray-500'}`}>
                                {day.substring(0, 1)}
                            </button>
                        ))}
                    </div>
                    {showValidation && formData.availability.length === 0 && (
                        <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                            <Info className="w-3 h-3" /> Pilih minimal satu hari ketersediaan
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">Tahun Pengalaman</label>
                        <input type="number" min="0" value={formData.experienceYears} onChange={e => setFormData({...formData, experienceYears: Number(e.target.value)})} 
                            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:border-blue-500 outline-none" />
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                    <label className="block text-sm font-medium mb-3">Sertifikasi & Dokumen</label>
                    
                    <div className="bg-gray-50 dark:bg-gray-900/30 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-4">
                        <div className="flex flex-col gap-3">
                            <input type="text" value={certNameInput} onChange={e => setCertNameInput(e.target.value)} 
                                className="w-full p-2 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-black focus:outline-none" placeholder="Nama Sertifikat" />
                            <div className="flex gap-2">
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" id="cert-upload" accept="image/*,.pdf" />
                                <label htmlFor="cert-upload" className="flex-1 cursor-pointer flex items-center gap-2 px-3 py-2 bg-white dark:bg-black border border-dashed border-gray-300 dark:border-gray-600 rounded text-xs text-gray-500 hover:bg-gray-50 transition-colors truncate">
                                    <UploadCloud className="w-4 h-4" /> {certFileInput ? certFileInput.name : "Pilih File"}
                                </label>
                                <button type="button" onClick={addCertification} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium">Tambah</button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        {formData.certifications.map((cert, index) => (
                            <div key={index} className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded"><FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" /></div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium truncate text-gray-900 dark:text-white">{cert.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{cert.file ? `File baru` : (cert.url ? 'Tersimpan' : 'No file')}</p>
                                    </div>
                                </div>
                                <button type="button" onClick={() => removeCertification(index)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        <div>
            {/* TOMBOL SUBMIT */}
            <button type="submit" onClick={handleSubmit} disabled={isSubmitting || !!phoneError}
                className="w-full py-4 px-4 rounded-xl bg-[#0A74DA] hover:bg-blue-600 text-white font-bold text-lg shadow-xl shadow-blue-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                {isSubmitting ? 'Menyimpan...' : (initialData ? 'Simpan Perubahan' : 'Kirim Pendaftaran')}
            </button>
            
            {/* VALIDASI SUMMARY */}
            {showValidation && (
                (!formData.phone || !formData.address || !formData.bio || formData.serviceTypes.length === 0 || formData.availability.length === 0 || phoneError) && (
                <p className="text-red-500 text-center text-sm mt-3 flex items-center justify-center gap-1">
                    <Info className="w-4 h-4" /> Mohon lengkapi semua data yang ditandai merah
                </p>
            ))}
        </div>

        <div className="text-center">
            <Link href="/profile" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm font-medium">
                Batal & Kembali ke Profil
            </Link>
        </div>

      </div>
    </div>
  );
}