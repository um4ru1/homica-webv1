'use client';

import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';

type LocationResult = {
  display_name: string;
  lat: string;
  lon: string;
};

type Props = {
  onSelect: (lat: number, lon: number, displayName: string) => void;
};

export default function LocationIQSearch({ onSelect }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const API_KEY = process.env.NEXT_PUBLIC_LOCATIONIQ_API_KEY;

  // Debounce search untuk menghemat API call
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length < 3) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(
          `https://api.locationiq.com/v1/autocomplete?key=${API_KEY}&q=${query}&limit=5&countrycodes=id&format=json`
        );
        const data = await res.json();
        if (Array.isArray(data)) setResults(data);
      } catch (error) {
        console.error("Search error", error);
      } finally {
        setLoading(false);
      }
    }, 500); // Tunggu 500ms setelah ketik

    return () => clearTimeout(timer);
  }, [query, API_KEY]);

  return (
    <div className="absolute top-3 left-3 z-10 w-full max-w-xs sm:max-w-md">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari alamat (cth: Jl. Dago, Bandung)..."
          className="w-full h-[44px] pl-10 pr-4 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1C1C1C] text-gray-900 dark:text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        
        {/* Loading Indicator */}
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        )}
      </div>

      {/* Dropdown Hasil */}
      {results.length > 0 && (
        <ul className="mt-2 bg-white dark:bg-[#1C1C1C] rounded-lg shadow-xl border border-gray-200 dark:border-white/10 overflow-hidden max-h-60 overflow-y-auto">
          {results.map((item, idx) => (
            <li
              key={idx}
              onClick={() => {
                onSelect(parseFloat(item.lat), parseFloat(item.lon), item.display_name);
                setQuery(item.display_name); // Set input jadi alamat lengkap
                setResults([]); // Tutup dropdown
              }}
              className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-[#252525] cursor-pointer text-sm text-gray-700 dark:text-gray-200 border-b border-gray-100 dark:border-white/5 last:border-0"
            >
              {item.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}