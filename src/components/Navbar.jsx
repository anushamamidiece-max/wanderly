import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useLocationContext } from '../context/LocationContext';

/**
 * Navbar — transparent over the home hero, solid paper once the page
 * scrolls (or on any inner page). Mobile gets a full-width menu panel
 * behind an accessible toggle button.
 */
export default function Navbar() {
  const { pathname } = useLocation();
  const { location } = useLocationContext();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  const overHero = pathname === '/' && !scrolled && !open;

  return (
    <header className={`navbar ${overHero ? 'navbar-clear' : 'navbar-solid'}`}>
      <nav className="container navbar-inner" aria-label="Main">
        <Link to="/" className="brand">
          Wanderly<span aria-hidden="true">.</span>
        </Link>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="nav-toggle-bars" aria-hidden="true" />
          Menu
        </button>

        <div id="site-menu" className={`nav-menu ${open ? 'is-open' : ''}`}>
          <NavLink to="/explore" className="nav-link">
            Explore
          </NavLink>
          <NavLink to="/planner" className="nav-link">
            AI Planner
          </NavLink>
          <Link to="/#near-you" className="nav-location" title="Weather near you">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M12 21s-6.5-5.5-6.5-10.3A6.5 6.5 0 0112 4a6.5 6.5 0 016.5 6.7C18.5 15.5 12 21 12 21z" />
              <circle cx="12" cy="10.6" r="2.2" />
            </svg>
            {location ? location.name : 'Set location'}
          </Link>
        </div>
      </nav>
    </header>
  );
}
