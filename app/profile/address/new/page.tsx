'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import MapLocationIQ from '@/components/MapLocationIQ';
import { ArrowLeft, MapPin, Camera, Save, Loader2, X, Plus } from 'lucide-react';

export default function AddAddressPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State Form
  const [formData, setFormData] = useState({
    label: 'Rumah', 
    address: '',
    latitude: null as number | null,
    longitude: null as number | null,
    notes: '',
    // Array untuk menyimpan banyak file
    photos: [] as File[], 
    photoPreviews: [] as string[],
  });

  // Handler Lokasi
  const handleLocationSelect = (loc: { latitude: number; longitude: number; address: string }) => {
    setFormData(prev => ({
      ...prev,
      latitude: loc.latitude,
      longitude: loc.longitude,
      address: loc.address
    }));
  };

  // Handler Tambah Foto (Multi)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      
      // Validasi Max 5 Foto (Opsional)
      if (formData.photos.length + newFiles.length > 5) {
        alert("Maksimal 5 foto yang diperbolehkan.");
        return;
      }

      const newPreviews = newFiles.map(file => URL.createObjectURL(file));

      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...newFiles],
        photoPreviews: [...prev.photoPreviews, ...newPreviews]
      }));
    }
  };

  // Handler Hapus Foto dari Preview
  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
      photoPreviews: prev.photoPreviews.filter((_, i) => i !== index)
    }));
  };

  // Submit Data
  const handleSubmit = async () => {
    if (!formData.latitude || !formData.address) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return alert("Mohon pilih lokasi di peta terlebih dahulu.");
    }
    
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      // 1. Upload Semua Foto ke Storage (Looping)
      const uploadedUrls: string[] = [];

      if (formData.photos.length > 0) {
        // Upload file satu per satu secara paralel
        const uploadPromises = formData.photos.map(async (file) => {
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `${user.id}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('address-photos')
                .upload(filePath, file);

            if (uploadError) throw new Error(`Gagal upload ${file.name}`);

            const { data } = supabase.storage.from('address-photos').getPublicUrl(filePath);
            return data.publicUrl;
        });

        // Tunggu semua selesai
        const results = await Promise.all(uploadPromises);
        uploadedUrls.push(...results);
      }

      // 2. Simpan ke Database (dengan Array Foto & Koordinat Akurat)
      const { error: insertError } = await supabase
        .from('user_addresses')
        .insert({
          user_id: user.id,
          label: formData.label,
          address: formData.address,
          latitude: formData.latitude,   // PENTING: Ini kunci pencarian worker nanti
          longitude: formData.longitude, // PENTING: Ini kunci pencarian worker nanti
          notes: formData.notes,
          photo_urls: uploadedUrls,      // Simpan sebagai Array Text []
          is_primary: false 
        });

      if (insertError) throw insertError;

      alert("Alamat berhasil disimpan!");
      router.push('/profile'); 
      router.refresh();

    } catch (error: any) {
      alert("Gagal menyimpan: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#121212] text-gray-900 dark:text-white p-6 pb-20">
      <div className="max-w-xl mx-auto">
        
        <button onClick={() => router.back()} className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
        </button>
        <h1 className="text-2xl font-bold mb-6">Tambah Alamat Baru</h1>

        <div className="space-y-6">
            
            {/* 1. PETA (INTI LOKASI) */}
            <div className="bg-white dark:bg-[#1C1C1C] p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                   <MapPin className="w-4 h-4 text-blue-500" /> Cari & Tandai Lokasi
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    Geser pin merah ke titik yang <b>paling akurat</b> (depan pagar/pintu). Titik ini akan digunakan worker untuk navigasi.
                </p>
                <div className="h-[300px] rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700 relative">
                    <MapLocationIQ onLocationSelect={handleLocationSelect} />
                    {!formData.address && (
                        <div className="absolute bottom-2 left-2 right-2 bg-red-500/90 text-white text-xs p-2 rounded-md text-center shadow-lg backdrop-blur-sm pointer-events-none">
                           ⚠️ Lokasi belum dipilih
                        </div>
                    )}
                </div>
                <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-1">Alamat Terdeteksi:</p>
                    <div className="p-3 bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300">
                        {formData.address || "-"}
                    </div>
                </div>
            </div>

            {/* 2. DETAIL & FOTO */}
            <div className="bg-white dark:bg-[#1C1C1C] p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-5">
                
                {/* Label */}
                <div>
                    <label className="block text-sm font-medium mb-2">Label Alamat</label>
                    <div className="flex gap-2 flex-wrap">
                        {['Rumah', 'Kantor', 'Apartemen', 'Kost', 'Lainnya'].map(type => (
                            <button 
                                key={type}
                                onClick={() => setFormData({...formData, label: type})}
                                className={`px-4 py-1.5 text-xs rounded-full border transition-all ${formData.label === type ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 dark:border-gray-700 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Catatan */}
                <div>
                    <label className="block text-sm font-medium mb-1">Catatan / Patokan</label>
                    <textarea 
                        rows={2} 
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:border-blue-500 outline-none text-sm"
                        placeholder="Contoh: Pagar hitam tinggi, samping warkop, bel rumah warna putih..."
                    />
                </div>

                {/* Multi Upload Foto */}
                <div>
                    <label className="block text-sm font-medium mb-2">Foto Lokasi (Opsional - Max 5)</label>
                    
                    <div className="grid grid-cols-3 gap-2 mb-3">
                        {/* Tombol Tambah */}
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="aspect-square border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        >
                            <Camera className="w-6 h-6 text-gray-400 mb-1" />
                            <span className="text-[10px] text-gray-500 text-center px-1">Tambah Foto</span>
                        </div>

                        {/* Preview Grid */}
                        {formData.photoPreviews.map((src, idx) => (
                            <div key={idx} className="aspect-square relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 group">
                                <img src={src} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                                <button 
                                    onClick={() => removePhoto(idx)}
                                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-90 hover:bg-red-600 transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>

                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        hidden 
                        multiple // MENGIZINKAN BANYAK FILE
                        accept="image/*" 
                    />
                     <p className="text-xs text-gray-400">
                        Tips: Foto pagar depan, jalan masuk, atau nomor rumah sangat membantu worker.
                     </p>
                </div>

            </div>

            {/* SAVE BUTTON */}
            <button 
                onClick={handleSubmit}
                disabled={loading || !formData.address}
                className="w-full py-3.5 bg-[#0A74DA] hover:bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Simpan Alamat
            </button>

        </div>
      </div>
    </div>
  );
}