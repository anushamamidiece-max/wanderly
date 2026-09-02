import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import Reveal from '../components/Reveal';
import DestinationCard from '../components/DestinationCard';
import LocationPanel from '../components/LocationPanel';
import WeatherCard from '../components/WeatherCard';
import { useLocationContext } from '../context/LocationContext';
import { destinations } from '../data/destinations';

export default function Home() {
  const { location, clearLocation } = useLocationContext();
  const { hash } = useLocation();
  const featured = destinations.slice(0, 4);

  // Support /#near-you links (e.g. from the navbar location chip).
  useEffect(() => {
    if (!hash) return;
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [hash]);

  return (
    <>
      <Hero />

      {/* ---- Location awareness + live weather ---- */}
      <section id="near-you" className="section" aria-labelledby="near-you-title">
        <div className="container near-you">
          <Reveal className="near-you-copy">
            <p className="eyebrow">Right now, where you are</p>
            <h2 id="near-you-title">Start from your own sky.</h2>
            <p className="lede">
              Share your location — or search for any city — and Wanderly shows
              you the weather you are leaving behind.
            </p>
            {!location && <LocationPanel />}
            {location && (
              <p className="near-you-current">
                Showing weather for <strong>{location.name}</strong>
                {location.country ? `, ${location.country}` : ''}
                {location.source === 'gps' ? ' (detected)' : ' (searched)'} ·{' '}
                <button type="button" className="link-button" onClick={clearLocation}>
                  change
                </button>
              </p>
            )}
          </Reveal>
          <Reveal delay={120} className="near-you-card">
            {location ? (
              <WeatherCard
                lat={location.lat}
                lon={location.lon}
                label={location.name}
                sublabel={location.country}
              />
            ) : (
              <div className="near-you-placeholder panel" aria-hidden="true">
                <p>Your local weather will appear here.</p>
              </div>
            )}
          </Reveal>
        </div>
      </section>

      {/* ---- Featured destinations ---- */}
      <section className="section section-tinted" aria-labelledby="featured-title">
        <div className="container">
          <Reveal className="section-head section-head-row">
            <div>
              <p className="eyebrow">The shortlist</p>
              <h2 id="featured-title">Places worth the flight.</h2>
            </div>
            <Link to="/explore" className="btn btn-ghost">
              All destinations <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </Reveal>
          <div className="featured-grid">
            {featured.map((d, i) => (
              <Reveal key={d.id} delay={i * 90}>
                <DestinationCard destination={d} index={i} featured={i === 0} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---- How it works ---- */}
      <section className="section" aria-labelledby="how-title">
        <div className="container">
          <Reveal className="section-head">
            <p className="eyebrow">How Wanderly works</p>
            <h2 id="how-title">Three steps from idea to itinerary.</h2>
          </Reveal>
          <div className="how-grid">
            {[
              {
                n: '01',
                title: 'Discover',
                text: 'Browse a curated shortlist of destinations — searchable, filterable, and honestly described.',
              },
              {
                n: '02',
                title: 'Understand',
                text: 'See live weather, the best season to go, and the places genuinely worth your time.',
              },
              {
                n: '03',
                title: 'Plan',
                text: 'Ask the AI concierge anything, then generate a structured day-by-day itinerary.',
              },
            ].map((step, i) => (
              <Reveal key={step.n} delay={i * 90} className="how-item">
                <span className="how-num" aria-hidden="true">{step.n}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Planner CTA ---- */}
      <section className="cta-band on-dark" aria-labelledby="cta-title">
        <div className="container cta-band-inner">
          <Reveal>
            <p className="eyebrow">AI trip planner</p>
            <h2 id="cta-title">Tell us the days. We’ll shape them.</h2>
            <p className="lede cta-lede">
              Pick a destination, a length and a style — Wanderly drafts a
              morning-to-evening plan you can actually follow.
            </p>
            <Link to="/planner" className="btn btn-primary">
              Plan my trip <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
