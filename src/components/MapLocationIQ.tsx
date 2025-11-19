'use client';

import { useState, useEffect, useRef } from 'react';
import Map, { Marker, NavigationControl, MapLayerMouseEvent, MarkerDragEvent, Source, Layer } from 'react-map-gl';
import maplibregl from 'maplibre-gl'; 
import 'maplibre-gl/dist/maplibre-gl.css'; 
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { point } from '@turf/helpers';

type LocationIQResult = {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
};

type MapComponentProps = {
  initialLatitude?: number | null;
  initialLongitude?: number | null;
  initialAddress?: string | null;
  onLocationSelect?: (data: { 
    latitude: number; 
    longitude: number; 
    address: string;
    zone: string | null; 
  }) => void;
};

// DATA ZONA BANDUNG (Tetap sama)
const BANDUNG_ZONES = {
  type: 'FeatureCollection',
  features: [
    { type: 'Feature', properties: { name: 'Bandung Utara', color: '#3b82f6' }, geometry: { type: 'Polygon', coordinates: [[[107.59, -6.89], [107.65, -6.89], [107.65, -6.83], [107.59, -6.83], [107.59, -6.89]]] } },
    { type: 'Feature', properties: { name: 'Bandung Pusat', color: '#ef4444' }, geometry: { type: 'Polygon', coordinates: [[[107.59, -6.94], [107.64, -6.94], [107.64, -6.89], [107.59, -6.89], [107.59, -6.94]]] } },
    { type: 'Feature', properties: { name: 'Bandung Timur', color: '#10b981' }, geometry: { type: 'Polygon', coordinates: [[[107.64, -6.96], [107.74, -6.96], [107.74, -6.89], [107.64, -6.89], [107.64, -6.96]]] } },
    { type: 'Feature', properties: { name: 'Bandung Selatan', color: '#f59e0b' }, geometry: { type: 'Polygon', coordinates: [[[107.58, -7.00], [107.68, -7.00], [107.68, -6.94], [107.58, -6.94], [107.58, -7.00]]] } },
    { type: 'Feature', properties: { name: 'Bandung Barat', color: '#8b5cf6' }, geometry: { type: 'Polygon', coordinates: [[[107.52, -6.95], [107.59, -6.95], [107.59, -6.86], [107.52, -6.86], [107.52, -6.95]]] } }
  ]
};

export default function MapLocationIQ({ onLocationSelect, initialLatitude, initialLongitude, initialAddress }: MapComponentProps) {
  const API_KEY = process.env.NEXT_PUBLIC_LOCATIONIQ_API_KEY;

  // PERBAIKAN 1: State Query selalu kosong di awal, meskipun ada initialAddress (Edit Mode)
  const [query, setQuery] = useState('');
  
  const [suggestions, setSuggestions] = useState<LocationIQResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentZone, setCurrentZone] = useState<string | null>(null);
  
  const ignoreSearchRef = useRef(false);

  const [viewState, setViewState] = useState({
    longitude: initialLongitude || 107.6191,
    latitude: initialLatitude || -6.9175,
    zoom: initialLongitude ? 16 : 12
  });

  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(
    initialLatitude && initialLongitude ? { lat: initialLatitude, lng: initialLongitude } : null
  );

  const checkZone = (lat: number, lng: number) => {
    const pt = point([lng, lat]); 
    let foundZone = null;
    for (const zone of BANDUNG_ZONES.features as any) {
      if (booleanPointInPolygon(pt, zone)) { foundZone = zone.properties.name; break; }
    }
    setCurrentZone(foundZone);
    return foundZone;
  };

  // Effect untuk memuat posisi peta saat Edit Mode
  useEffect(() => {
    if (initialLatitude && initialLongitude) {
        setMarker({ lat: initialLatitude, lng: initialLongitude });
        setViewState(prev => ({ ...prev, latitude: initialLatitude, longitude: initialLongitude, zoom: 16 }));
        
        // PERBAIKAN 2: Kita TIDAK setQuery(initialAddress) di sini.
        // Search bar dibiarkan kosong agar bersih.
        
        checkZone(initialLatitude, initialLongitude);
    }
  }, [initialLatitude, initialLongitude]);

  const searchLocation = async (searchText: string) => {
    if (!searchText || searchText.length < 3) return;
    setIsLoading(true);
    try {
      const res = await fetch(`https://api.locationiq.com/v1/autocomplete?key=${API_KEY}&q=${searchText}&limit=5&countrycodes=id`);
      if (!res.ok) throw new Error('Fail');
      const data = await res.json();
      setSuggestions(data);
    } catch (error) { setSuggestions([]); } finally { setIsLoading(false); }
  };

  useEffect(() => {
    if (ignoreSearchRef.current) { ignoreSearchRef.current = false; return; }
    const timeoutId = setTimeout(() => { 
        if (query) searchLocation(query); 
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const processLocationUpdate = async (lat: number, lng: number, manualAddress?: string) => {
    const detectedZone = checkZone(lat, lng);
    let finalAddress = manualAddress;

    if (!finalAddress) {
      setIsLoading(true);
      try {
        const res = await fetch(`https://us1.locationiq.com/v1/reverse?key=${API_KEY}&lat=${lat}&lon=${lng}&format=json`);
        const data = await res.json();
        finalAddress = data.display_name;
      } catch (error) { finalAddress = "Lokasi terpilih (Alamat tidak ditemukan)"; } finally { setIsLoading(false); }
    }

    if (onLocationSelect && finalAddress) {
      onLocationSelect({ latitude: lat, longitude: lng, address: finalAddress, zone: detectedZone });
    }
  };

  const handleSelectSuggestion = (item: LocationIQResult) => {
    ignoreSearchRef.current = true;
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lon);

    setViewState((prev) => ({ ...prev, latitude: lat, longitude: lng, zoom: 16 }));
    setMarker({ lat, lng });
    
    // PERBAIKAN 3: Langsung kosongkan query setelah pilih lokasi
    setQuery(''); 
    setSuggestions([]); 
    
    processLocationUpdate(lat, lng, item.display_name);
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => { 
    if (e.key === 'Enter') { 
        e.preventDefault(); 
        
        // Jika ada sugesti di dropdown, pilih yang pertama
        if (suggestions.length > 0) {
            handleSelectSuggestion(suggestions[0]);
        } else if (query.length > 3) {
            // Force search
            setIsLoading(true);
            try {
                const res = await fetch(`https://api.locationiq.com/v1/autocomplete?key=${API_KEY}&q=${query}&limit=1&countrycodes=id`);
                const data = await res.json();
                if (data && data.length > 0) {
                    handleSelectSuggestion(data[0]); // Ini akan memicu setQuery('') di dalamnya
                }
            } catch(err) { console.error(err) } finally { setIsLoading(false); }
        }
        // Jaga-jaga kosongkan jika tidak ada hasil
        setSuggestions([]);
    } 
  };

  // Saat map diklik / pin digeser -> Search bar TIDAK berubah (karena kita tidak setQuery di sini)
  const handleMapClick = (e: MapLayerMouseEvent) => { const { lat, lng } = e.lngLat; setMarker({ lat, lng }); processLocationUpdate(lat, lng); };
  const handleMarkerDragEnd = (e: MarkerDragEvent) => { const { lat, lng } = e.lngLat; setMarker({ lat, lng }); processLocationUpdate(lat, lng); };

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden border border-gray-300 bg-gray-100">
      
      <div className="absolute top-3 left-3 z-10 max-w-[75%] flex flex-col items-start">
        <div className="grid relative shadow-md rounded-lg bg-white overflow-hidden border border-gray-200">
          {/* Ghost element untuk efek 'elastic width' */}
          <span className="col-start-1 row-start-1 invisible whitespace-pre px-3 py-2 text-sm font-sans min-w-[200px]">{query || "Cari jalan..."}</span>
          <input type="text" value={query} onKeyDown={handleKeyDown} onChange={(e) => setQuery(e.target.value)} placeholder="Cari jalan..." className="col-start-1 row-start-1 w-full h-full px-3 py-2 text-sm text-gray-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg" />
          {isLoading && (<div className="absolute right-2 top-2.5 pointer-events-none"><span className="loading-spinner text-blue-500 text-[10px]">...</span></div>)}
        </div>
        {suggestions.length > 0 && (
          <ul className="mt-1 w-full bg-white rounded-lg shadow-xl overflow-hidden max-h-48 overflow-y-auto border border-gray-200">
            {suggestions.map((item) => (
              <li key={item.place_id} onClick={() => handleSelectSuggestion(item)} className="px-3 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-50 text-xs text-gray-700 leading-tight break-words">{item.display_name}</li>
            ))}
          </ul>
        )}
      </div>
      
      {currentZone && (<div className="absolute top-3 right-5 z-10 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">{currentZone}</div>)}
      
      <Map 
        {...viewState} 
        onMove={(evt) => setViewState(evt.viewState)} 
        mapLib={maplibregl as any} 
        mapStyle={`https://tiles.locationiq.com/v3/streets/vector.json?key=${API_KEY}`} 
        onClick={handleMapClick} 
        attributionControl={false}
      >
        <NavigationControl position="bottom-left" showCompass={true} showZoom={true} />
        <Source id="bandung-zones" type="geojson" data={BANDUNG_ZONES as any}>
          <Layer id="zone-fills" type="fill" paint={{ 'fill-color': ['get', 'color'], 'fill-opacity': 0.1 }} />
          <Layer id="zone-borders" type="line" paint={{ 'line-color': ['get', 'color'], 'line-width': 1, 'line-dasharray': [2, 2] }} />
        </Source>
        {marker && (
          <Marker latitude={marker.lat} longitude={marker.lng} anchor="bottom" draggable={true} onDragEnd={handleMarkerDragEnd}>
            <svg height="40" viewBox="0 0 24 24" style={{ fill: '#ef4444', filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.5))', cursor: 'move' }}>
                <path d="M12 0c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z"/>
            </svg>
          </Marker>
        )}
      </Map>
      <div className="absolute bottom-1 right-2 bg-white/80 px-2 py-0.5 rounded text-[10px] text-gray-500 pointer-events-none z-0">© LocationIQ © OpenStreetMap</div>
    </div>
  );
}