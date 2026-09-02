import { useState } from 'react';
import { Link } from 'react-router-dom';

const VIDEO_SRC =
  'https://videos.pexels.com/video-files/3015510/3015510-hd_1920_1080_24fps.mp4';
const POSTER_SRC =
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1800&q=70';

/**
 * Hero — full-viewport looping video (free-licence footage streamed from
 * the Pexels CDN, so no large file lives in the repo). If the video
 * fails to load, the poster photograph takes over gracefully.
 */
export default function Hero() {
  const [videoFailed, setVideoFailed] = useState(false);

  return (
    <section className="hero on-dark" aria-label="Welcome to Wanderly">
      <div className="hero-media" aria-hidden="true">
        <img className="hero-poster" src={POSTER_SRC} alt="" />
        {!videoFailed && (
          <video
            className="hero-video"
            src={VIDEO_SRC}
            poster={POSTER_SRC}
            autoPlay
            muted
            loop
            playsInline
            onError={() => setVideoFailed(true)}
          />
        )}
        <div className="hero-scrim" />
      </div>

      <div className="container hero-content">
        <p className="eyebrow">A field guide to going places</p>
        <h1>
          Go somewhere
          <br />
          worth remembering.
        </h1>
        <p className="hero-sub">
          Twelve destinations, chosen with care. Live weather, the places that
          matter, and an AI concierge to shape your days.
        </p>
        <div className="hero-actions">
          <Link to="/explore" className="btn btn-primary">
            Explore destinations <span className="arrow" aria-hidden="true">→</span>
          </Link>
          <Link to="/planner" className="btn btn-ghost">
            Plan with AI
          </Link>
        </div>
      </div>

      <a href="#near-you" className="hero-scroll" aria-label="Scroll to content">
        <span aria-hidden="true" />
      </a>
    </section>
  );
}
