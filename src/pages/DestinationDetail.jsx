import { Link, useParams } from 'react-router-dom';
import Reveal from '../components/Reveal';
import SmartImage from '../components/SmartImage';
import WeatherCard from '../components/WeatherCard';
import FamousPlaceCard from '../components/FamousPlaceCard';
import Chatbot from '../components/Chatbot';
import NotFound from './NotFound';
import { getDestination } from '../data/destinations';

/**
 * DestinationDetail — the editorial page for one destination.
 * The id comes from the URL (React Router's useParams); an unknown id
 * renders the designed 404 instead of crashing.
 */
export default function DestinationDetail() {
  const { id } = useParams();
  const destination = getDestination(id);
  if (!destination) return <NotFound />;

  const d = destination;

  return (
    <main className="page detail">
      {/* ---- Cinematic header ---- */}
      <header className="detail-hero on-dark">
        <SmartImage src={d.image} alt={`${d.name}, ${d.country}`} className="detail-hero-img" />
        <div className="detail-hero-scrim" aria-hidden="true" />
        <div className="container detail-hero-content">
          <nav aria-label="Breadcrumb">
            <Link to="/explore" className="detail-back">
              ← All destinations
            </Link>
          </nav>
          <p className="eyebrow">{d.country} · {d.region}</p>
          <h1>{d.name}</h1>
          <p className="detail-tagline">{d.tagline}</p>
        </div>
      </header>

      {/* ---- Quick facts strip ---- */}
      <div className="detail-facts" role="list" aria-label="Quick facts">
        <div className="container detail-facts-inner">
          <div role="listitem">
            <span>Best time</span>
            <strong>{d.bestTime}</strong>
          </div>
          <div role="listitem">
            <span>Suggested stay</span>
            <strong>{d.days} days</strong>
          </div>
          <div role="listitem">
            <span>Travel style</span>
            <strong>{d.tags.join(' · ')}</strong>
          </div>
        </div>
      </div>

      {/* ---- Intro + weather ---- */}
      <section className="section" aria-labelledby="about-title">
        <div className="container detail-grid">
          <Reveal className="detail-copy">
            <p className="eyebrow">In brief</p>
            <h2 id="about-title">About {d.name}</h2>
            <p className="lede">{d.description}</p>
            <Link to={`/planner?destination=${d.id}`} className="btn btn-primary detail-plan-btn">
              Plan my {d.name} trip <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </Reveal>
          <Reveal delay={120}>
            <WeatherCard lat={d.lat} lon={d.lon} label={d.name} sublabel="Current conditions" />
          </Reveal>
        </div>
      </section>

      {/* ---- Famous places ---- */}
      <section className="section section-tinted" aria-labelledby="places-title">
        <div className="container">
          <Reveal className="section-head">
            <p className="eyebrow">Worth your time</p>
            <h2 id="places-title">Famous places in {d.name}</h2>
          </Reveal>
          <div className="places-grid">
            {d.places.map((place, i) => (
              <Reveal key={place.name} delay={(i % 4) * 80}>
                <FamousPlaceCard place={place} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---- AI concierge ---- */}
      <section className="section" aria-labelledby="chat-title">
        <div className="container detail-chat">
          <Reveal className="section-head">
            <p className="eyebrow">Travel concierge</p>
            <h2 id="chat-title">Still deciding? Ask.</h2>
          </Reveal>
          <Reveal delay={100}>
            <Chatbot destination={d} />
          </Reveal>
        </div>
      </section>
    </main>
  );
}
