import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Reveal from '../components/Reveal';
import Itinerary from '../components/Itinerary';
import { LoadingState, ErrorState, EmptyState } from '../components/States';
import { destinations, getDestination, styles } from '../data/destinations';
import { buildLocalItinerary, generateItinerary, isAiConfigured } from '../services/aiService';

/**
 * Planner — the AI itinerary generator.
 * The form collects destination / days / style / interests, the AI
 * service returns validated JSON, and <Itinerary> renders it as a real
 * day-by-day plan. Without a Gemini key we fall back to a clearly
 * labelled sample plan built from the guide data — never fake AI.
 */
export default function Planner() {
  const [params] = useSearchParams();
  const preselected = getDestination(params.get('destination') ?? '');

  const [form, setForm] = useState({
    destinationId: preselected?.id ?? destinations[0].id,
    days: preselected?.days ?? 3,
    styles: [],
    interests: '',
  });
  const [status, setStatus] = useState('idle'); // idle | loading | ready | error
  const [itinerary, setItinerary] = useState(null);

  const destination = getDestination(form.destinationId);

  function toggleStyle(style) {
    setForm((f) => ({
      ...f,
      styles: f.styles.includes(style)
        ? f.styles.filter((s) => s !== style)
        : [...f.styles, style],
    }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setStatus('loading');
    setItinerary(null);
    const options = {
      destination,
      days: form.days,
      styles: form.styles,
      interests: form.interests.trim(),
    };
    try {
      const plan = isAiConfigured()
        ? await generateItinerary(options)
        : (await new Promise((r) => setTimeout(r, 600)), buildLocalItinerary(options));
      setItinerary(plan);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }

  return (
    <main className="page">
      <header className="page-head container">
        <Reveal>
          <p className="eyebrow">AI trip planner</p>
          <h1>Shape your days.</h1>
          <p className="lede">
            Choose where, how long and in what spirit — the planner drafts a
            structured morning-to-evening itinerary you can refine.
          </p>
        </Reveal>
      </header>

      <div className="container planner-layout">
        {/* ---- The brief ---- */}
        <Reveal as="form" className="planner-form panel" onSubmit={onSubmit} aria-label="Trip preferences">
          <div className="field">
            <label htmlFor="p-dest">Destination</label>
            <select
              id="p-dest"
              className="select"
              value={form.destinationId}
              onChange={(e) => {
                const next = getDestination(e.target.value);
                setForm((f) => ({ ...f, destinationId: e.target.value, days: next?.days ?? f.days }));
              }}
            >
              {destinations.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}, {d.country}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="p-days">Number of days — {form.days}</label>
            <input
              id="p-days"
              type="range"
              min="2"
              max="7"
              value={form.days}
              onChange={(e) => setForm((f) => ({ ...f, days: Number(e.target.value) }))}
            />
            <div className="range-scale" aria-hidden="true">
              <span>2</span><span>7</span>
            </div>
          </div>

          <fieldset className="field">
            <legend>Travel style — optional</legend>
            <div className="filter-chips">
              {styles.map((s) => (
                <button
                  key={s}
                  type="button"
                  className="chip"
                  aria-pressed={form.styles.includes(s)}
                  onClick={() => toggleStyle(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="field">
            <label htmlFor="p-interests">Anything specific? — optional</label>
            <input
              id="p-interests"
              className="input"
              placeholder="e.g. street food, photography, museums"
              value={form.interests}
              onChange={(e) => setForm((f) => ({ ...f, interests: e.target.value }))}
            />
          </div>

          <button type="submit" className="btn btn-primary planner-submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Planning…' : 'Generate itinerary'}
          </button>
          {!isAiConfigured() && (
            <p className="planner-note">
              No Gemini API key configured — you’ll get a labelled sample plan
              built from the Wanderly guide.
            </p>
          )}
        </Reveal>

        {/* ---- The result ---- */}
        <div className="planner-result" aria-live="polite">
          {status === 'idle' && (
            <EmptyState
              title="Your itinerary will appear here"
              message="Set the brief on the left and generate — each day arrives as morning, afternoon and evening."
            />
          )}
          {status === 'loading' && <LoadingState message={`Planning your ${form.days} days in ${destination.name}…`} />}
          {status === 'error' && (
            <ErrorState
              message="The planner couldn't finish your itinerary. Please try again."
              onRetry={onSubmit}
            />
          )}
          {status === 'ready' && itinerary && <Itinerary itinerary={itinerary} />}
        </div>
      </div>
    </main>
  );
}
