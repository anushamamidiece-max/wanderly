import { useMemo, useState } from 'react';
import Reveal from '../components/Reveal';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import DestinationCard from '../components/DestinationCard';
import { EmptyState } from '../components/States';
import { destinations, durations } from '../data/destinations';

/**
 * Explore — search + filters + grid.
 * Filtering is pure derived data (useMemo), so there is no duplicated
 * state to fall out of sync: query/filters in, visible list out.
 */
export default function Explore() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({ region: '', style: '', duration: '' });

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return destinations.filter((d) => {
      const matchesQuery =
        !q ||
        [d.name, d.country, d.region, d.tagline, ...d.tags]
          .join(' ')
          .toLowerCase()
          .includes(q);
      const matchesRegion = !filters.region || d.region === filters.region;
      const matchesStyle = !filters.style || d.tags.includes(filters.style);
      const durationRule = durations.find((x) => x.id === filters.duration);
      const matchesDuration = !durationRule || durationRule.test(d);
      return matchesQuery && matchesRegion && matchesStyle && matchesDuration;
    });
  }, [query, filters]);

  const activeCount = Object.values(filters).filter(Boolean).length;

  function reset() {
    setQuery('');
    setFilters({ region: '', style: '', duration: '' });
  }

  return (
    <main className="page">
      <header className="page-head container">
        <Reveal>
          <p className="eyebrow">The atlas</p>
          <h1>Explore destinations</h1>
          <p className="lede">
            Twelve places, honestly described. Search them, filter them, open
            the one that pulls at you.
          </p>
        </Reveal>
      </header>

      <div className="container explore-controls">
        <SearchBar value={query} onChange={setQuery} />
        <FilterBar filters={filters} onChange={setFilters} activeCount={activeCount} />
        <p className="explore-count" role="status">
          {results.length === destinations.length
            ? `Showing all ${destinations.length} destinations`
            : `${results.length} of ${destinations.length} destinations`}
        </p>
      </div>

      <div className="container">
        {results.length > 0 ? (
          <div className="explore-grid">
            {results.map((d, i) => (
              <Reveal key={d.id} delay={(i % 3) * 70}>
                <DestinationCard destination={d} index={destinations.indexOf(d)} />
              </Reveal>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No destinations found"
            message={`Nothing matches ${query ? `“${query}”` : 'those filters'}. Try a different search or clear your filters.`}
            action={
              <button type="button" className="btn btn-ink" onClick={reset}>
                Clear search & filters
              </button>
            }
          />
        )}
      </div>
    </main>
  );
}
