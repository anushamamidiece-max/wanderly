import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="page container notfound">
      <p className="eyebrow">404</p>
      <h1>This place isn’t on our map.</h1>
      <p className="lede">
        The page you’re looking for doesn’t exist — but twelve very good
        destinations do.
      </p>
      <Link to="/explore" className="btn btn-ink">
        Explore destinations <span className="arrow" aria-hidden="true">→</span>
      </Link>
    </main>
  );
}
