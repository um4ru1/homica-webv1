'use server'

// PERBAIKAN: Ganti 'createClient' menjadi 'createSupabaseServer'
import { createSupabaseServer } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function createBooking(formData: any) {
  // PERBAIKAN: Panggil fungsi dengan nama yang benar
  const supabase = createSupabaseServer();

  const {
    serviceType,
    date,
    addressData, 
    price
  } = formData;

  // 1. Cek User Login
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // 2. Tentukan Hari
  const dateObj = new Date(date);
  const daysMap = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const dayName = daysMap[dateObj.getDay()]; 

  console.log(`Mencari worker untuk: ${serviceType}, Hari: ${dayName}`);

  // 3. JALANKAN ALGORITMA MATCHING (RPC)
  const { data: workers, error: matchError } = await supabase
    .rpc('get_nearby_workers', {
      lat: addressData.latitude,
      long: addressData.longitude,
      service_req: serviceType.toLowerCase(),
      day_req: dayName, // Pastikan format di DB (Senin/senin) sesuai
      radius_km: 20 
    });

  if (matchError) {
    console.error("Matching Error:", matchError);
    throw new Error("Gagal mencari worker: " + matchError.message);
  }

  // 4. Cek Hasil
  const assignedWorker = workers && workers.length > 0 ? workers[0] : null;
  const bookingStatus = assignedWorker ? 'accepted' : 'pending'; 

  // 5. Simpan Booking
  const { data: booking, error: insertError } = await supabase
    .from('bookings')
    .insert({
      user_id: user.id,
      worker_id: assignedWorker?.worker_id || null,
      service_type: serviceType,
      booking_date: date,
      address_json: addressData, // Pastikan kolom ini tipe JSONB di DB
      status: bookingStatus,
      price: price,
      notes: addressData.notes
    })
    .select()
    .single();

  if (insertError) {
    console.error("Booking Error:", insertError);
    throw new Error("Gagal membuat pesanan");
  }

  return { success: true, bookingId: booking.id, workerFound: !!assignedWorker };
}