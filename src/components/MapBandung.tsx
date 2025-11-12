'use client';

import { useEffect, useState, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import type { LatLngExpression, LatLngTuple } from 'leaflet';

// Poligon area ITB Ganesha dari GeoJSON (format [lat, lon]), poligon akurat dari geojson.io
const ITB_POLYGON: LatLngExpression[] = [
  [-6.887875652787457, 107.60838060192145],
  [-6.891621831528639, 107.60816206365871],
  [-6.89360338900795, 107.608584570966],
  [-6.8930826885750065, 107.61040572315619],
  [-6.893617852900292, 107.61288249013461],
  [-6.8875429791141585, 107.61337784352867],
  [-6.887354946064164, 107.61144013759895],
  [-6.887875652787457, 107.60838060192145], // titik awal diulang opsional
];


const ITB_CENTER: LatLngTuple = [-6.8905, 107.6110];
const MAP_CENTER: LatLngTuple = [-6.8905, 107.6110];

export default function MapBandung() {
  const [isMounted, setIsMounted] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !mapRef.current || leafletMapRef.current) return;

    // Dynamic import Leaflet hanya di client-side
    const initMap = async () => {
      try {
        const L = await import('leaflet');
        
        // Hapus map yang ada jika ada
        if (leafletMapRef.current) {
          leafletMapRef.current.remove();
          leafletMapRef.current = null;
        }

        // Inisialisasi map
        const map = L.map(mapRef.current!, {
          center: MAP_CENTER,
          zoom: 16,
          scrollWheelZoom: false,
          attributionControl: false,
        });

        // Tambah tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        // Tambah polygon
        L.polygon(ITB_POLYGON as any, {
          color: '#0A74DA',
          fillColor: '#0A74DA',
          fillOpacity: 0.2,
          weight: 3,
        }).addTo(map);

        // Tambah circle dengan popup
        const marker = L.circle(ITB_CENTER, {
          color: '#0A74DA',
          fillColor: '#0A74DA',
          fillOpacity: 0.8,
          radius: 50,
        })
          .bindPopup(`
            <div style="text-align: center; min-width: 150px;">
              <strong style="color: #0A74DA; font-weight: 600; font-size: 14px;">Homica Office</strong>
              <p style="font-size: 12px; color: #6b7280; margin-top: 4px; margin-bottom: 0;">Institut Teknologi Bandung</p>
            </div>
          `)
          .addTo(map);

        // Auto open popup
        marker.openPopup();

        leafletMapRef.current = map;

        // Perbaiki ukuran map setelah render
        setTimeout(() => {
          map.invalidateSize();
        }, 100);
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    initMap();

    // Cleanup function
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [isMounted]);

  if (!isMounted) {
    return (
      <div className="h-80 w-full overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <div className="w-12 h-12 mx-auto mb-4 border-4 border-gray-300 dark:border-gray-600 border-t-[#0A74DA] rounded-full animate-spin" />
          <p className="text-sm">Memuat peta...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={mapRef} 
      className="h-80 w-full overflow-hidden rounded-xl"
      style={{ minHeight: '320px' }}
    />
  );
}