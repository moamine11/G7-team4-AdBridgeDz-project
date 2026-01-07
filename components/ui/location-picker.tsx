'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { MapPin, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type LocationValue = {
  label: string;
  lat: number | null;
  lng: number | null;
};

type GeocodeResult = {
  place_id: string | number;
  display_name: string;
  lat: string;
  lon: string;
  address?: Record<string, any>;
};

function getBackendBaseUrl() {
  const raw = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
  return raw.replace(/\/$/, '');
}

function parseAddressToWilayaOrCity(address: any): string {
  if (!address) return '';
  return (
    address.state ||
    address.county ||
    address.city ||
    address.town ||
    address.village ||
    address.municipality ||
    ''
  );
}

function formatAccuracy(meters: number): string {
  if (!Number.isFinite(meters)) return '';
  if (meters >= 1000) return `~${Math.round(meters / 1000)}km`;
  return `~${Math.round(meters)}m`;
}

const LOW_ACCURACY_HINT_THRESHOLD_METERS = 20000; // 20km

export function LocationPicker({
  value,
  onChange,
  onAddressResolved,
  className,
}: {
  value: LocationValue;
  onChange: (next: LocationValue) => void;
  onAddressResolved?: (info: { city?: string; streetAddress?: string }) => void;
  className?: string;
}) {
  const BACKEND_URL = useMemo(() => getBackendBaseUrl(), []);

  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  const [ready, setReady] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [pendingReverse, setPendingReverse] = useState(false);
  const [locating, setLocating] = useState(false);
  const [lastAccuracyMeters, setLastAccuracyMeters] = useState<number | null>(null);

  const hasCoords = Number.isFinite(value.lat ?? NaN) && Number.isFinite(value.lng ?? NaN);

  const defaultCenter: [number, number] = [36.7538, 3.0588];

  useEffect(() => {
    let cancelled = false;

    const loadLeaflet = () => {
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      if (!(window as any).L) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => {
          if (!cancelled) setReady(true);
        };
        document.head.appendChild(script);
      } else {
        setReady(true);
      }
    };

    loadLeaflet();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!ready) return;

    const L = (window as any).L;
    if (!L) return;

    const el = document.getElementById('location-picker-map');
    if (!el) return;

    if (!mapRef.current) {
      const center = hasCoords ? ([value.lat as number, value.lng as number] as [number, number]) : defaultCenter;

      mapRef.current = L.map('location-picker-map', {
        zoomControl: true,
        attributionControl: false,
      }).setView(center, hasCoords ? 15 : 6);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        subdomains: 'abc',
      }).addTo(mapRef.current);

      const icon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="background: #14b8a6; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white;"></div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
      });

      markerRef.current = L.marker(center, { icon, draggable: true }).addTo(mapRef.current);

      const setFromLatLng = async (lat: number, lng: number) => {
        onChange({ ...value, lat, lng });
        setPendingReverse(true);
        try {
          const res = await fetch(`${BACKEND_URL}/api/geocode/reverse?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}`);
          if (!res.ok) throw new Error('reverse failed');
          const data = await res.json();
          const label = String(data?.display_name || '').trim();
          const city = parseAddressToWilayaOrCity(data?.address);

          if (label) onChange({ label, lat, lng });
          onAddressResolved?.({
            city: city || undefined,
            streetAddress: label || undefined,
          });
        } catch {
          // best-effort
        } finally {
          setPendingReverse(false);
        }
      };

      mapRef.current.on('click', (e: any) => {
        const lat = e?.latlng?.lat;
        const lng = e?.latlng?.lng;
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
        markerRef.current?.setLatLng([lat, lng]);
        setFromLatLng(lat, lng);
      });

      markerRef.current.on('dragend', () => {
        const pos = markerRef.current.getLatLng();
        if (!pos) return;
        setFromLatLng(pos.lat, pos.lng);
      });
    }
  }, [ready]);

  useEffect(() => {
    if (!ready) return;
    if (!mapRef.current || !markerRef.current) return;
    if (!hasCoords) return;

    const next: [number, number] = [value.lat as number, value.lng as number];
    markerRef.current.setLatLng(next);
    mapRef.current.setView(next, 15);
  }, [ready, value.lat, value.lng]);

  const doSearch = async () => {
    const q = query.trim();
    if (!q) return;

    setSearching(true);
    setError(null);
    try {
      const res = await fetch(`${BACKEND_URL}/api/geocode/search?q=${encodeURIComponent(q)}&limit=6&countrycodes=dz`);
      if (!res.ok) throw new Error('search failed');
      const data = await res.json();
      setResults(Array.isArray(data?.results) ? data.results : []);
    } catch {
      setError('Search unavailable right now. Try again.');
    } finally {
      setSearching(false);
    }
  };

  const useMyLocation = async () => {
    setError(null);

    if (!('geolocation' in navigator)) {
      setError('Geolocation is not supported in this browser.');
      return;
    }

    // Most browsers require HTTPS for geolocation (localhost is treated as secure).
    if (!window.isSecureContext && window.location.hostname !== 'localhost') {
      setError('Geolocation requires HTTPS (or localhost). Open the app over HTTPS to use current location.');
      return;
    }

    setLocating(true);
    try {
      const getPos = (options: PositionOptions) =>
        new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, options);
        });

      // Prefer a fresh high-accuracy fix first. Cached/coarse locations are a common reason for “wrong location”.
      let pos: GeolocationPosition;
      try {
        pos = await getPos({ enableHighAccuracy: true, timeout: 20000, maximumAge: 0 });
      } catch (e: any) {
        // If it times out or is unavailable, retry with high accuracy and longer timeout.
        const code = e?.code;
        if (code === 2 || code === 3) {
          // Fallback: allow a coarse fix rather than failing completely.
          pos = await getPos({ enableHighAccuracy: false, timeout: 15000, maximumAge: 0 });
        } else {
          throw e;
        }
      }

      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      const accuracy = Number.isFinite(pos.coords.accuracy) ? pos.coords.accuracy : null;
      setLastAccuracyMeters(accuracy);

      if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        setError('Could not read your location.');
        return;
      }

      // If the reported accuracy is extremely poor, do not auto-fill address.
      // This usually means IP-based location (VPN/proxy/desktop) and can be wildly wrong.
      const accuracyTooLow = typeof accuracy === 'number' && accuracy > LOW_ACCURACY_HINT_THRESHOLD_METERS;

      // Move marker/map immediately
      onChange({ ...value, lat, lng });
      if (markerRef.current) markerRef.current.setLatLng([lat, lng]);
      if (mapRef.current) mapRef.current.setView([lat, lng], 16);

      if (accuracyTooLow) {
        setError(
          `Your device reported very low accuracy (${formatAccuracy(accuracy as number)}). This is usually IP/VPN based; please drag the pin to the exact location or use a phone.`
        );
        return;
      }

      // Best-effort reverse geocode to get a readable label
      setPendingReverse(true);
      try {
        const res = await fetch(
          `${BACKEND_URL}/api/geocode/reverse?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}`
        );
        if (res.ok) {
          const data = await res.json();
          const label = String(data?.display_name || '').trim();
          const city = parseAddressToWilayaOrCity(data?.address);
          if (label) onChange({ label, lat, lng });
          onAddressResolved?.({
            city: city || undefined,
            streetAddress: label || undefined,
          });
        }
      } finally {
        setPendingReverse(false);
      }
    } catch (e: any) {
      const code = e?.code;
      if (code === 1) setError('Location permission denied.');
      else if (code === 2) setError('Location unavailable. Turn on Location Services (Windows) and try again.');
      else if (code === 3) setError('Location request timed out. Try again, disable VPN, or use a device with GPS (phone).');
      else setError('Could not get your location.');
    } finally {
      setLocating(false);
    }
  };

  const selectResult = (r: GeocodeResult) => {
    const lat = parseFloat(r.lat);
    const lng = parseFloat(r.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

    const label = r.display_name;
    onChange({ label, lat, lng });

    const city = parseAddressToWilayaOrCity(r.address);
    onAddressResolved?.({
      city: city || undefined,
      streetAddress: label || undefined,
    });

    setResults([]);
    setQuery('');
  };

  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-2">
        <MapPin className="w-4 h-4 text-teal-400" />
        <p className="text-sm font-medium text-slate-200">Pick exact location</p>
        {pendingReverse && <Loader2 className="w-4 h-4 animate-spin text-slate-400" />}
      </div>

      <div className="flex gap-2">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search address or business name (OSM)"
              className="pl-9 bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-400"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  doSearch();
                }
              }}
            />
          </div>

          {error && <p className="text-xs text-red-300 mt-2">{error}</p>}

          {results.length > 0 && (
            <div className="mt-2 rounded-lg border border-slate-700/50 bg-slate-900/95 overflow-hidden">
              {results.map((r) => (
                <button
                  key={String(r.place_id)}
                  type="button"
                  onClick={() => selectResult(r)}
                  className="w-full text-left px-3 py-2 text-sm text-slate-200 hover:bg-slate-800/70 transition-colors"
                >
                  {r.display_name}
                </button>
              ))}
            </div>
          )}
        </div>

        <Button
          type="button"
          onClick={doSearch}
          disabled={searching || !query.trim()}
          className="bg-teal-600 hover:bg-teal-700 text-white"
        >
          {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
        </Button>

        <Button
          type="button"
          onClick={useMyLocation}
          disabled={locating}
          className="bg-slate-800/60 hover:bg-slate-800 text-slate-200 border border-slate-700/50"
        >
          {locating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Use my location'}
        </Button>
      </div>

      <div className="mt-3 rounded-lg border border-slate-700/50 overflow-hidden">
        <div id="location-picker-map" className="w-full h-64" />
      </div>

      <div className="mt-2 text-xs text-slate-400">
        <div>
          {value.label ? <span>Selected: {value.label}</span> : <span>Tip: click the map or drag the marker.</span>}
        </div>
        {lastAccuracyMeters !== null && (
          <div className="mt-1">Reported location accuracy: {formatAccuracy(lastAccuracyMeters)}</div>
        )}
        {lastAccuracyMeters !== null && lastAccuracyMeters > LOW_ACCURACY_HINT_THRESHOLD_METERS && (
          <div className="mt-1 text-amber-300">
            Tip: Hotspot/Ethernet often can’t provide precise location; use a phone or drag the pin.
          </div>
        )}
      </div>
    </div>
  );
}
