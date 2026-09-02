import { useWeather } from '../hooks/useWeather';
import WeatherIcon from './WeatherIcon';
import { LoadingState, ErrorState } from './States';

/**
 * WeatherCard — live conditions for any coordinates.
 * All three states (loading / error / data) are designed, and a failure
 * here never breaks the page around it.
 */
export default function WeatherCard({ lat, lon, label, sublabel }) {
  const { weather, loading, error, retry } = useWeather(lat, lon);

  return (
    <section className="weather-card panel" aria-label={`Current weather in ${label}`}>
      <header className="weather-card-head">
        <div>
          <h3 className="weather-card-place">{label}</h3>
          {sublabel && <p className="weather-card-sub">{sublabel}</p>}
        </div>
        {weather && <WeatherIcon kind={weather.kind} size={44} />}
      </header>

      {loading && <LoadingState message="Checking the skies…" />}
      {!loading && error && <ErrorState message={error} onRetry={retry} />}

      {!loading && !error && weather && (
        <>
          <p className="weather-card-temp">
            {weather.tempC}°<span>C</span>
          </p>
          <p className="weather-card-cond">{weather.condition}</p>
          <dl className="weather-card-stats">
            <div>
              <dt>Feels like</dt>
              <dd>{weather.feelsLikeC}°C</dd>
            </div>
            <div>
              <dt>Humidity</dt>
              <dd>{weather.humidity}%</dd>
            </div>
            <div>
              <dt>Wind</dt>
              <dd>{weather.windKmh} km/h</dd>
            </div>
          </dl>
          <p className="weather-card-src">Live · {weather.source}</p>
        </>
      )}
    </section>
  );
}
