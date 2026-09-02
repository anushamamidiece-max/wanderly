import { Link } from 'react-router-dom';
import SmartImage from './SmartImage';

/**
 * DestinationCard — the core card of the explorer grid.
 * A real <Link> (not a clickable div) so it works for keyboards
 * and screen readers out of the box.
 */
export default function DestinationCard({ destination, index, featured = false }) {
  const d = destination;
  return (
    <Link
      to={`/destination/${d.id}`}
      className={`dest-card ${featured ? 'is-featured' : ''}`}
    >
      <div className="dest-card-media">
        <SmartImage src={d.image} alt={`${d.name}, ${d.country}`} className="dest-card-img" />
        {typeof index === 'number' && (
          <span className="dest-card-index" aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </span>
        )}
      </div>
      <div className="dest-card-body">
        <p className="dest-card-country">{d.country} · {d.region}</p>
        <h3 className="dest-card-name">{d.name}</h3>
        <p className="dest-card-tagline">{d.tagline}</p>
        <p className="dest-card-meta">
          <span>{d.days} days suggested</span>
          <span aria-hidden="true">·</span>
          <span>{d.tags.slice(0, 3).join(', ')}</span>
        </p>
      </div>
    </Link>
  );
}
