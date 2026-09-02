import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer on-dark">
      <div className="container">
        <div className="footer-top">
          <p className="footer-wordmark" aria-hidden="true">
            Wanderly.
          </p>
          <div className="footer-cols">
            <nav aria-label="Footer">
              <h3 className="footer-heading">Navigate</h3>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/explore">Explore destinations</Link></li>
                <li><Link to="/planner">AI trip planner</Link></li>
              </ul>
            </nav>
            <div>
              <h3 className="footer-heading">Powered by</h3>
              <ul>
                <li>Weather · OpenWeather &amp; Open-Meteo</li>
                <li>Photography · Unsplash &amp; Wikipedia</li>
                <li>AI concierge · Google Gemini</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Wanderly — a front-end assessment project. Built with React.</p>
        </div>
      </div>
    </footer>
  );
}
