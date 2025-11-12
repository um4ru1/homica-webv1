// app/worker/onboarding/worker-onboard-client.tsx
"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabase/client";

const AREAS = [
  { id: "utara", label: "Bandung Utara" },
  { id: "timur", label: "Bandung Timur" },
  { id: "selatan", label: "Bandung Selatan" },
  { id: "barat", label: "Bandung Barat" },
] as const;

const TYPES = [
  { id: "careplus", label: "Care+ (pendamping lansia)" },
  { id: "little", label: "Little (pengasuhan bayi/anak)" },
  { id: "fresh", label: "Fresh (cleaning/bersih rumah)" },
] as const;

type Initial = {
  id: string | null;
  verified: boolean;
  service_type: string | null;
  phone: string;
  areas: string[];
  bio: string;
};

export default function WorkerOnboardClient({
  email,
  initial,
}: {
  email: string;
  initial: Initial;
}) {
  const [serviceType, setServiceType] = useState<string>(
    initial.service_type ?? "careplus"
  );
  const [phone, setPhone] = useState(initial.phone ?? "");
  const [areas, setAreas] = useState<string[]>(initial.areas ?? []);
  const [bio, setBio] = useState(initial.bio ?? "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function toggleArea(a: string) {
    setAreas((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
  }

  async function submit() {
    setBusy(true);
    setErr(null);
    try {
      const { data: ures } = await supabase.auth.getUser();
      if (!ures.user) {
        setErr("Sesi login berakhir. Silakan masuk kembali.");
        return;
      }

      if (!phone.trim()) return setErr("Nomor telepon wajib diisi.");
      if (areas.length === 0) return setErr("Pilih minimal satu area operasi.");
      if (bio.trim().length < 20) return setErr("Deskripsi minimal 20 karakter.");

      if (initial.id) {
        const { error } = await supabase
          .from("workers")
          .update({
            service_type: serviceType,
            phone,
            areas,
            bio,
          })
          .eq("id", initial.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("workers").insert({
          user_id: ures.user.id,
          service_type: serviceType,
          phone,
          areas,
          bio,
          verified: false,
        });
        if (error) throw error;
      }

      // go home (navbar will already reflect the session)
      location.href = "/";
    } catch (e: any) {
      setErr(e?.message ?? "Gagal menyimpan data.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border p-6 shadow-xl bg-white dark:bg-custombg2 dark:border-gray-800">
      <h1 className="text-2xl font-bold mb-2 dark:text-customtext">Daftar Homica Family</h1>
      <p className="text-sm mb-6 dark:text-customtext2">
        Email: <span className="font-medium">{email}</span>. Lengkapi data berikut, tim kami akan
        menghubungi untuk verifikasi.
      </p>

      {err && (
        <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
          {err}
        </div>
      )}

      <div className="space-y-5">
        {/* Kategori */}
        <div>
          <label className="block text-sm font-medium mb-2 dark:text-customtext">
            Ingin jadi pekerja di
          </label>
          <div className="grid sm:grid-cols-3 gap-2">
            {TYPES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setServiceType(t.id)}
                className={`rounded-lg px-3 py-2 border text-sm text-left dark:border-gray-700 ${
                  serviceType === t.id ? "bg-[#0A74DA] text-white border-[#0A74DA]" : ""
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Telp */}
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-customtext">No. Telepon</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="08xxxxxxxxxx"
            className="w-full rounded-lg border p-2 dark:bg-custombg dark:border-gray-700"
          />
        </div>

        {/* Area */}
        <div>
          <label className="block text-sm font-medium mb-2 dark:text-customtext">
            Area Operasi (Bandung)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {AREAS.map((a) => (
              <label
                key={a.id}
                className={`rounded-lg px-3 py-2 border text-sm cursor-pointer select-none dark:border-gray-700 ${
                  areas.includes(a.id) ? "bg-emerald-600 text-white border-emerald-600" : ""
                }`}
              >
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={areas.includes(a.id)}
                  onChange={() => toggleArea(a.id)}
                />
                {a.label}
              </label>
            ))}
          </div>
        </div>

        {/* Deskripsi */}
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-customtext">
            Deskripsi singkat
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            placeholder="Jelaskan pengalaman, sertifikasi, ketersediaan jam, dll."
            className="w-full rounded-lg border p-2 dark:bg-custombg dark:border-gray-700"
          />
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={submit}
          disabled={busy}
          className="rounded-lg bg-[#0A74DA] px-4 py-2 font-medium text-white disabled:opacity-60"
        >
          {busy ? "Mengirim…" : "Kirim & Ajukan Verifikasi"}
        </button>
        <a href="/" className="rounded-lg border px-4 py-2 dark:border-gray-700">
          Batal
        </a>
      </div>
    </div>
  );
}
