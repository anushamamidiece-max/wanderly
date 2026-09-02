/**
 * Weather service.
 *
 * Primary:  OpenWeather (requires VITE_OPENWEATHER_API_KEY).
 * Fallback: Open-Meteo — a free, keyless weather API — so the app keeps
 *           working (and the live demo never breaks) if no key is set
 *           or the OpenWeather request fails.
 *
 * Both responses are normalised to ONE shape so components never need
 * to know which provider answered:
 * { tempC, feelsLikeC, humidity, windKmh, condition, kind, source }
 */

const OW_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

/* Open-Meteo weather codes → human condition + icon kind */
const METEO_CODES = {
  0: ['Clear sky', 'sun'],
  1: ['Mostly clear', 'sun'],
  2: ['Partly cloudy', 'partly'],
  3: ['Overcast', 'cloud'],
  45: ['Foggy', 'fog'],
  48: ['Icy fog', 'fog'],
  51: ['Light drizzle', 'rain'],
  53: ['Drizzle', 'rain'],
  55: ['Heavy drizzle', 'rain'],
  61: ['Light rain', 'rain'],
  63: ['Rain', 'rain'],
  65: ['Heavy rain', 'rain'],
  66: ['Freezing rain', 'rain'],
  67: ['Freezing rain', 'rain'],
  71: ['Light snow', 'snow'],
  73: ['Snow', 'snow'],
  75: ['Heavy snow', 'snow'],
  77: ['Snow grains', 'snow'],
  80: ['Rain showers', 'rain'],
  81: ['Rain showers', 'rain'],
  82: ['Violent showers', 'rain'],
  85: ['Snow showers', 'snow'],
  86: ['Snow showers', 'snow'],
  95: ['Thunderstorm', 'storm'],
  96: ['Thunderstorm', 'storm'],
  99: ['Thunderstorm with hail', 'storm'],
};

/* OpenWeather condition groups → icon kind */
const OW_KIND = {
  Clear: 'sun',
  Clouds: 'cloud',
  Rain: 'rain',
  Drizzle: 'rain',
  Thunderstorm: 'storm',
  Snow: 'snow',
  Mist: 'fog',
  Fog: 'fog',
  Haze: 'fog',
  Smoke: 'fog',
  Dust: 'fog',
  Sand: 'fog',
  Squall: 'storm',
  Tornado: 'storm',
};

async function fromOpenWeather(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OW_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`OpenWeather responded ${res.status}`);
  const d = await res.json();
  const group = d.weather?.[0]?.main ?? 'Clear';
  return {
    tempC: Math.round(d.main.temp),
    feelsLikeC: Math.round(d.main.feels_like),
    humidity: d.main.humidity,
    windKmh: Math.round(d.wind.speed * 3.6), // m/s → km/h
    condition: d.weather?.[0]?.description
      ? d.weather[0].description[0].toUpperCase() + d.weather[0].description.slice(1)
      : group,
    kind: OW_KIND[group] ?? 'partly',
    source: 'OpenWeather',
  };
}

async function fromOpenMeteo(lat, lon) {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Open-Meteo responded ${res.status}`);
  const { current } = await res.json();
  if (!current) throw new Error('Open-Meteo returned no current weather');
  const [condition, kind] = METEO_CODES[current.weather_code] ?? ['—', 'partly'];
  return {
    tempC: Math.round(current.temperature_2m),
    feelsLikeC: Math.round(current.apparent_temperature),
    humidity: current.relative_humidity_2m,
    windKmh: Math.round(current.wind_speed_10m),
    condition,
    kind,
    source: 'Open-Meteo',
  };
}

export async function getWeather(lat, lon) {
  if (OW_KEY) {
    try {
      return await fromOpenWeather(lat, lon);
    } catch {
      // fall through to the keyless provider rather than failing the UI
    }
  }
  return fromOpenMeteo(lat, lon);
}
