import { useId, useRef, useState } from 'react';
import { useLocationContext } from '../context/LocationContext';
import { searchLocations } from '../services/locationService';

/**
 * LocationPanel — the "location awareness" feature in one place.
 *
 * Two equal paths, so the app is useful whether or not the visitor
 * shares their position:
 *   1. "Use my location" → browser geolocation (only on click — we
 *      never ambush people with a permission prompt on page load).
 *   2. A manual city search via the Open-Meteo geocoding API.
 * Denied permission is a designed state, not an error screen.
 */
export default function LocationPanel() {
  const { status, error, locate, setManualLocation } = useLocationContext();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null); // null = untouched, [] = no matches
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const inputId = useId();
  const debounceRef = useRef(null);

  function onQueryChange(e) {
    const value = e.target.value;
    setQuery(value);
    setSearchError(null);
    clearTimeout(debounceRef.current);

    if (value.trim().length < 2) {
      setResults(null);
      setSearching(false);
      return;
    }
    setSearching(true);
    // Debounce: wait for a typing pause instead of one request per keystroke.
    debounceRef.current = setTimeout(async () => {
      try {
        setResults(await searchLocations(value.trim()));
      } catch {
        setSearchError("We couldn't search places right now. Please try again.");
        setResults(null);
      } finally {
        setSearching(false);
      }
    }, 350);
  }

  function choose(place) {
    setManualLocation(place);
    setQuery('');
    setResults(null);
  }

  return (
    <div className="location-panel">
      <button
        type="button"
        className="btn btn-ink"
        onClick={locate}
        disabled={status === 'locating'}
      >
        {status === 'locating' ? 'Finding your location…' : 'Use my location'}
      </button>

      <span className="location-panel-or" aria-hidden="true">or</span>

      <div className="location-search">
        <label htmlFor={inputId} className="sr-only">
          Search for a city
        </label>
        <input
          id={inputId}
          className="input"
          type="search"
          placeholder="Search a city — e.g. Bengaluru"
          value={query}
          onChange={onQueryChange}
          autoComplete="off"
          role="combobox"
          aria-expanded={Boolean(results)}
          aria-controls={`${inputId}-results`}
        />
        {(searching || results || searchError) && (
          <ul id={`${inputId}-results`} className="location-results panel" role="listbox">
            {searching && <li className="location-results-note">Searching…</li>}
            {searchError && <li className="location-results-note">{searchError}</li>}
            {!searching && results && results.length === 0 && (
              <li className="location-results-note">No places found for “{query}”.</li>
            )}
            {!searching &&
              results?.map((r) => (
                <li key={r.id}>
                  <button type="button" role="option" aria-selected="false" onClick={() => choose(r)}>
                    <strong>{r.name}</strong>
                    <span>
                      {[r.region, r.country].filter(Boolean).join(', ')}
                    </span>
                  </button>
                </li>
              ))}
          </ul>
        )}
      </div>

      {(status === 'denied' || status === 'error') && (
        <p className="location-panel-note" role="status">
          {error}
        </p>
      )}
    </div>
  );
}
