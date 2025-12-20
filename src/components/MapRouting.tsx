'use client';

import { useEffect, useRef, useState } from 'react';
import Map, { Source, Layer, Marker, useMap } from 'react-map-gl';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { User, MapPin } from 'lucide-react';

// Koordinat format: [longitude, latitude]
type Props = {
  start: [number, number]; // Posisi Worker
  end: [number, number];   // Posisi Customer
  onRouteCalculated?: (distanceKm: number, durationMin: number) => void;
};

export default function MapRouting({ start, end, onRouteCalculated }: Props) {
  const mapRef = useRef<any>(null);
  const API_KEY = process.env.NEXT_PUBLIC_LOCATIONIQ_API_KEY;
  const [routeGeoJSON, setRouteGeoJSON] = useState<any>(null);

  // Fetch Rute menggunakan OSRM (Open Source Routing Machine) - Gratis & Kompatibel
  useEffect(() => {
    const getRoute = async () => {
        if (!start || !end) return;
        
        // OSRM membutuhkan format string: "lon,lat;lon,lat"
        const coords = `${start[0]},${start[1]};${end[0]},${end[1]}`;
        
        // Endpoint publik OSRM (Gratis untuk demo/dev)
        // Alternatif Production: Gunakan LocationIQ Directions API jika ingin lebih stabil
        const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;
        
        try {
            const res = await fetch(url);
            const data = await res.json();
            
            if (data.routes && data.routes.length > 0) {
                const route = data.routes[0];
                
                // Set data garis rute
                setRouteGeoJSON({
                    type: 'Feature',
                    properties: {},
                    geometry: route.geometry
                });

                // Kirim data jarak & durasi ke parent
                if (onRouteCalculated) {
                    // distance dalam meter -> ubah ke KM
                    // duration dalam detik -> ubah ke Menit
                    onRouteCalculated(route.distance / 1000, route.duration / 60);
                }

                // Auto Zoom agar kedua titik terlihat (Fit Bounds)
                if (mapRef.current) {
                    const bounds = new maplibregl.LngLatBounds(start, start);
                    bounds.extend(end);
                    
                    mapRef.current.fitBounds(bounds, {
                        padding: 50, // Jarak bantalan dari pinggir peta
                        duration: 1000
                    });
                }
            }
        } catch (error) {
            console.error("Gagal mengambil rute:", error);
        }
    };

    getRoute();
  }, [start, end]); // Jalankan ulang jika koordinat berubah

  return (
    <Map
        ref={mapRef}
        initialViewState={{
            longitude: start[0],
            latitude: start[1],
            zoom: 12
        }}
        // Gunakan MapLibre + LocationIQ Tiles
        mapLib={maplibregl as any}
        mapStyle={`https://tiles.locationiq.com/v3/streets/vector.json?key=${API_KEY}`}
        style={{ width: '100%', height: '100%' }}
        attributionControl={false}
    >
        {/* Marker Worker (Hijau) */}
        <Marker longitude={start[0]} latitude={start[1]} anchor="bottom">
            <div className="bg-white p-1.5 rounded-full shadow-md border-2 border-green-500 z-10 relative">
                <User className="w-4 h-4 text-green-600" fill="currentColor" />
            </div>
        </Marker>

        {/* Marker Customer (Merah) */}
        <Marker longitude={end[0]} latitude={end[1]} anchor="bottom">
             <div className="bg-white p-1.5 rounded-full shadow-md border-2 border-red-500 z-20 relative animate-bounce">
                <MapPin className="w-4 h-4 text-red-600" fill="currentColor" />
            </div>
        </Marker>

        {/* Garis Rute (Biru) */}
        {routeGeoJSON && (
            <Source id="route" type="geojson" data={routeGeoJSON}>
                <Layer
                    id="route-line"
                    type="line"
                    layout={{ "line-join": "round", "line-cap": "round" }}
                    paint={{
                        "line-color": "#3b82f6", // Biru Tailwind
                        "line-width": 4,
                        "line-opacity": 0.8
                    }}
                />
            </Source>
        )}
    </Map>
  );
}