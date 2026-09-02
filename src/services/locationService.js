/**
 * Location service — three small, focused helpers.
 *
 * 1. getCurrentPosition  — wraps the browser Geolocation API in a Promise
 *                          and translates its error codes into messages a
 *                          person can actually act on.
 * 2. reverseGeocode      — coordinates → "Bengaluru, India"
 *                          (BigDataCloud client API, keyless).
 * 3. searchLocations     — free-text city search → coordinates
 *                          (Open-Meteo geocoding API, keyless).
 */

export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject({ code: 'unsupported', message: 'This browser does not support location.' });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      (err) => {
        const messages = {
          1: 'Location access is off. Search for a place instead.',
          2: 'Your location could not be determined right now.',
          3: 'Finding your location took too long. Try again or search instead.',
        };
        reject({
          code: err.code === 1 ? 'denied' : 'unavailable',
          message: messages[err.code] ?? 'Something went wrong while locating you.',
        });
      },
      { timeout: 10000, maximumAge: 300000 }
    );
  });
}

export async function reverseGeocode(lat, lon) {
  const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Reverse geocoding responded ${res.status}`);
  const d = await res.json();
  return {
    name: d.city || d.locality || d.principalSubdivision || 'Your area',
    country: d.countryName || '',
  };
}

export async function searchLocations(query) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Geocoding responded ${res.status}`);
  const data = await res.json();
  return (data.results ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    region: r.admin1 ?? '',
    country: r.country ?? '',
    lat: r.latitude,
    lon: r.longitude,
  }));
}
