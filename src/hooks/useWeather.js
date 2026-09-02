import { useEffect, useState } from 'react';
import { getWeather } from '../services/weatherService';

/**
 * useWeather — gives any component live weather for coordinates with
 * the three states every API call needs: loading / data / error.
 * The `cancelled` flag prevents a state update if the component
 * unmounts (or coords change) before the fetch finishes.
 */
export function useWeather(lat, lon) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(Boolean(lat != null && lon != null));
  const [error, setError] = useState(null);
  const [retryToken, setRetryToken] = useState(0);

  useEffect(() => {
    if (lat == null || lon == null) return undefined;
    let cancelled = false;

    setLoading(true);
    setError(null);
    getWeather(lat, lon)
      .then((data) => {
        if (!cancelled) setWeather(data);
      })
      .catch(() => {
        if (!cancelled) setError("We couldn't load the weather right now.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [lat, lon, retryToken]);

  return { weather, loading, error, retry: () => setRetryToken((t) => t + 1) };
}
