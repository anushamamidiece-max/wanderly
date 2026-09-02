import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getCurrentPosition, reverseGeocode } from '../services/locationService';

/**
 * LocationContext shares "where is the traveller?" across the whole app
 * (navbar chip, home weather panel) without prop-drilling.
 *
 * status: 'idle' | 'locating' | 'ready' | 'denied' | 'error'
 * location: { name, country, lat, lon, source: 'gps' | 'search' } | null
 */
const LocationContext = createContext(null);
const STORAGE_KEY = 'wanderly:location';

export function LocationProvider({ children }) {
  const [location, setLocation] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? null;
    } catch {
      return null;
    }
  });
  const [status, setStatus] = useState(location ? 'ready' : 'idle');
  const [error, setError] = useState(null);

  // Persist so a returning visitor isn't asked again.
  useEffect(() => {
    try {
      if (location) localStorage.setItem(STORAGE_KEY, JSON.stringify(location));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* private mode — fine */
    }
  }, [location]);

  /* Triggered only by an explicit user action (never on page load),
     so the permission prompt is a choice, not an ambush. */
  const locate = useCallback(async () => {
    setStatus('locating');
    setError(null);
    try {
      const { lat, lon } = await getCurrentPosition();
      let name = 'Your location';
      let country = '';
      try {
        const geo = await reverseGeocode(lat, lon);
        name = geo.name;
        country = geo.country;
      } catch {
        /* coordinates still work for weather without a pretty name */
      }
      setLocation({ name, country, lat, lon, source: 'gps' });
      setStatus('ready');
    } catch (err) {
      setStatus(err.code === 'denied' ? 'denied' : 'error');
      setError(err.message);
    }
  }, []);

  const setManualLocation = useCallback((place) => {
    setLocation({ ...place, source: 'search' });
    setStatus('ready');
    setError(null);
  }, []);

  const clearLocation = useCallback(() => {
    setLocation(null);
    setStatus('idle');
    setError(null);
  }, []);

  return (
    <LocationContext.Provider
      value={{ location, status, error, locate, setManualLocation, clearLocation }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationContext() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useLocationContext must be used inside <LocationProvider>');
  return ctx;
}
