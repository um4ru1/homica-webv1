// 'use client';

// import { useState, useCallback, useEffect, useRef } from 'react';
// import Map, { Marker } from 'react-map-gl';
// import type { MapLayerMouseEvent, ViewState, MapRef } from 'react-map-gl';
// import mapboxgl from 'mapbox-gl';
// import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
// import type { GeocoderOptions } from '@mapbox/mapbox-gl-geocoder';

// type MapboxInputProps = {
//   onLocationSelect: (data: {
//     address: string;
//     longitude: number;
//     latitude: number;
//   }) => void;
// };

// export default function MapboxInput({ onLocationSelect }: MapboxInputProps) {
//   const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;
//   mapboxgl.accessToken = MAPBOX_TOKEN;

//   const mapRef = useRef<MapRef>(null);
//   const geocoderContainerRef = useRef<HTMLDivElement>(null);
//   const geocoderRef = useRef<MapboxGeocoder | null>(null);

//   const [marker, setMarker] = useState<{ longitude: number; latitude: number } | null>(null);
//   const [mapTheme, setMapTheme] = useState<string>('mapbox://styles/mapbox/streets-v12');
  
//   const [viewport, setViewport] = useState<Partial<ViewState>>({
//     longitude: 107.6191,
//     latitude: -6.9175,
//     zoom: 12,
//   });

//   useEffect(() => {
//     const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
//     setMapTheme(isDark ? "mapbox://styles/mapbox/dark-v11" : "mapbox://styles/mapbox/streets-v12");
    
//     const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
//     const handler = (e: MediaQueryListEvent) => {
//       setMapTheme(e.matches ? "mapbox://styles/mapbox/dark-v11" : "mapbox://styles/mapbox/streets-v12");
//     };
    
//     mediaQuery.addEventListener('change', handler);
//     return () => mediaQuery.removeEventListener('change', handler);
//   }, []);

//   const handleMapClick = useCallback((event: MapLayerMouseEvent) => {
//     const { lng, lat } = event.lngLat;
//     setMarker({ longitude: lng, latitude: lat });
//     fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}`)
//       .then(res => res.json())
//       .then(data => {
//         const address = data.features[0]?.place_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
//         onLocationSelect({ address, longitude: lng, latitude: lat });
//       })
//       .catch(err => {
//         console.error('Reverse geocoding error:', err);
//         onLocationSelect({ 
//           address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`, 
//           longitude: lng, 
//           latitude: lat 
//         });
//       });
//   }, [MAPBOX_TOKEN, onLocationSelect]);

//   const handleGeocoderResult = useCallback((e: any) => {
//     const { center, place_name } = e.result;
//     const [lng, lat] = center;
//     setMarker({ longitude: lng, latitude: lat });
//     setViewport(prev => ({ ...prev, longitude: lng, latitude: lat, zoom: 15 }));
//     onLocationSelect({ address: place_name, longitude: lng, latitude: lat });
//   }, [onLocationSelect]);

//   const handleMarkerDrag = useCallback((event: any) => {
//     const { lng, lat } = event.lngLat;
//     setMarker({ longitude: lng, latitude: lat });
//     fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}`)
//       .then(res => res.json())
//       .then(data => {
//         const address = data.features[0]?.place_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
//         onLocationSelect({ address, longitude: lng, latitude: lat });
//       })
//       .catch(err => {
//         console.error('Reverse geocoding error:', err);
//       });
//   }, [MAPBOX_TOKEN, onLocationSelect]);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (!geocoderContainerRef.current || geocoderRef.current) return;

//       const geocoderOptions: Omit<GeocoderOptions, 'accessToken'> = {
//         countries: 'ID',
//         proximity: { longitude: 107.6191, latitude: -6.9175 },
//         mapboxgl: mapboxgl,
//         marker: false,
//         placeholder: 'Ketik alamat atau nama tempat...',
//         minLength: 3,
//         language: 'id',
//         limit: 10,
//         fuzzyMatch: true,
//         autocomplete: true,
//       };

//       const geocoder = new MapboxGeocoder({
//         ...geocoderOptions,
//         accessToken: MAPBOX_TOKEN,
//       });

//       geocoder.addTo(geocoderContainerRef.current);
//       geocoder.on('result', handleGeocoderResult);
//       geocoderRef.current = geocoder;
//     }, 100);

//     return () => {
//       clearTimeout(timer);
//       if (geocoderRef.current) {
//         geocoderRef.current.off('result', handleGeocoderResult);
//       }
//     };
//   }, [MAPBOX_TOKEN, handleGeocoderResult]);

//   return (
//     <div className="h-96 w-full rounded-lg overflow-hidden relative border dark:border-white/10">
//       <style jsx global>{`
//         .mapboxgl-ctrl-geocoder {
//           width: 100% !important;
//           max-width: 320px !important;
//           box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4) !important;
//           font-family: inherit !important;
//           border: none !important;
//           background: transparent !important;
//         }
//         .mapboxgl-ctrl-geocoder--input {
//           background: #1e293b !important;
//           color: #f1f5f9 !important;
//           border: 1px solid #475569 !important;
//           border-radius: 0.5rem !important;
//           padding: 0.625rem 2.75rem 0.625rem 2.5rem !important;
//           height: 42px !important;
//           font-size: 0.875rem !important;
//           box-shadow: none !important;
//           outline: none !important;
//         }
//         .mapboxgl-ctrl-geocoder--input:focus {
//           border-color: #3b82f6 !important;
//           box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2) !important;
//           outline: none !important;
//         }
//         .mapboxgl-ctrl-geocoder--input::placeholder {
//           color: #94a3b8 !important;
//           opacity: 0.7 !important;
//         }
//         .mapboxgl-ctrl-geocoder--icon-search {
//           top: 12px !important;
//           left: 12px !important;
//           fill: #94a3b8 !important;
//         }
//         .mapboxgl-ctrl-geocoder--icon-loading {
//           top: 12px !important;
//           right: 42px !important;
//           fill: #3b82f6 !important;
//         }
//         .mapboxgl-ctrl-geocoder--button {
//           top: 7px !important;
//           right: 7px !important;
//           width: 28px !important;
//           height: 28px !important;
//           border-radius: 0.25rem !important;
//           background: transparent !important;
//         }
//         .mapboxgl-ctrl-geocoder--button:hover {
//           background: rgba(255, 255, 255, 0.1) !important;
//         }
//         .mapboxgl-ctrl-geocoder--icon-close {
//           fill: #94a3b8 !important;
//         }
//         .mapboxgl-ctrl-geocoder--suggestions {
//           background: #0f172a !important;
//           border: 1px solid #475569 !important;
//           border-radius: 0.5rem !important;
//           margin-top: 0.5rem !important;
//           box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6) !important;
//           max-height: 360px !important;
//           overflow-y: auto !important;
//         }
//         .mapboxgl-ctrl-geocoder--suggestion {
//           background: transparent !important;
//           padding: 1rem !important;
//           border-bottom: 1px solid #1e293b !important;
//           cursor: pointer !important;
//         }
//         .mapboxgl-ctrl-geocoder--suggestion:last-child {
//           border-bottom: none !important;
//         }
//         .mapboxgl-ctrl-geocoder--suggestion:hover {
//           background: #1e3a8a !important;
//         }
//         .mapboxgl-ctrl-geocoder--suggestion.active {
//           background: #1e40af !important;
//         }
//         .mapboxgl-ctrl-geocoder--suggestion-title {
//           color: #ffffff !important;
//           font-weight: 700 !important;
//           font-size: 0.9rem !important;
//           margin-bottom: 0.25rem !important;
//         }
//         .mapboxgl-ctrl-geocoder--suggestion-address {
//           color: #e2e8f0 !important;
//           font-size: 0.8rem !important;
//         }
//         .mapboxgl-ctrl-geocoder--suggestions::-webkit-scrollbar {
//           width: 8px;
//         }
//         .mapboxgl-ctrl-geocoder--suggestions::-webkit-scrollbar-thumb {
//           background: #475569;
//           border-radius: 4px;
//         }
//         :root:not(.dark) .mapboxgl-ctrl-geocoder--input {
//           background: #ffffff !important;
//           color: #111827 !important;
//           border: 1px solid #d1d5db !important;
//         }
//         :root:not(.dark) .mapboxgl-ctrl-geocoder--suggestions {
//           background: #ffffff !important;
//           border: 1px solid #e5e7eb !important;
//           box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15) !important;
//         }
//         :root:not(.dark) .mapboxgl-ctrl-geocoder--suggestion {
//           color: #111827 !important;
//           border-bottom: 1px solid #f3f4f6 !important;
//         }
//         :root:not(.dark) .mapboxgl-ctrl-geocoder--suggestion:hover {
//           background: #eff6ff !important;
//         }
//         :root:not(.dark) .mapboxgl-ctrl-geocoder--suggestion-title {
//           color: #111827 !important;
//         }
//         :root:not(.dark) .mapboxgl-ctrl-geocoder--suggestion-address {
//           color: #6b7280 !important;
//         }
//       `}</style>
      
//       <div 
//         ref={geocoderContainerRef} 
//         className="absolute top-3 left-3 z-[1000]"
//         style={{ 
//           width: '320px',
//           maxWidth: 'calc(100% - 1.5rem)',
//           pointerEvents: 'auto'
//         }}
//       />
      
//       <Map
//         ref={mapRef}
//         {...viewport}
//         mapboxAccessToken={MAPBOX_TOKEN}
//         mapLib={mapboxgl} 
//         onMove={evt => setViewport(evt.viewState)}
//         onClick={handleMapClick}
//         mapStyle={mapTheme}
//         style={{ width: '100%', height: '100%' }}
//         attributionControl={true}
//       >
//         {marker && (
//           <Marker 
//             longitude={marker.longitude} 
//             latitude={marker.latitude} 
//             anchor="bottom"
//             draggable
//             onDragEnd={handleMarkerDrag}
//           />
//         )}
//       </Map>
      
//       <div className="absolute bottom-0 left-0 z-20 px-3 py-2 bg-custombg2/95 backdrop-blur-sm border-t border-r border-white/10 rounded-tr-lg" style={{ maxWidth: '280px' }}>
//         <p className="text-xs text-customtext2 leading-relaxed">
//           💡 <strong className="text-customtext">Tip:</strong> Ketik untuk cari atau klik peta untuk pin lokasi.
//         </p>
//       </div>
//     </div>
//   );
// }