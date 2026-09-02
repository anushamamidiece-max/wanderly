import { useId, useState } from 'react';
import { regions, styles, durations } from '../data/destinations';

/**
 * FilterBar — region chips + style & duration selects.
 * On small screens the whole thing folds behind a "Filters" toggle so
 * it never eats the phone's viewport.
 */
export default function FilterBar({ filters, onChange, activeCount }) {
  const [open, setOpen] = useState(false);
  const styleId = useId();
  const durationId = useId();

  const set = (patch) => onChange({ ...filters, ...patch });

  return (
    <div className="filter-bar">
      <button
        type="button"
        className="filter-toggle chip"
        aria-expanded={open}
        aria-controls="filter-panel"
        onClick={() => setOpen((o) => !o)}
      >
        Filters{activeCount > 0 && ` · ${activeCount}`}
      </button>

      <div id="filter-panel" className={`filter-panel ${open ? 'is-open' : ''}`}>
        <fieldset className="filter-group">
          <legend>Region</legend>
          <div className="filter-chips">
            <button
              type="button"
              className="chip"
              aria-pressed={filters.region === ''}
              onClick={() => set({ region: '' })}
            >
              All
            </button>
            {regions.map((r) => (
              <button
                key={r}
                type="button"
                className="chip"
                aria-pressed={filters.region === r}
                onClick={() => set({ region: filters.region === r ? '' : r })}
              >
                {r}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="filter-selects">
          <div className="field">
            <label htmlFor={styleId}>Travel style</label>
            <select
              id={styleId}
              className="select"
              value={filters.style}
              onChange={(e) => set({ style: e.target.value })}
            >
              <option value="">Any style</option>
              {styles.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor={durationId}>Trip length</label>
            <select
              id={durationId}
              className="select"
              value={filters.duration}
              onChange={(e) => set({ duration: e.target.value })}
            >
              <option value="">Any length</option>
              {durations.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          {activeCount > 0 && (
            <button
              type="button"
              className="filter-clear"
              onClick={() => onChange({ region: '', style: '', duration: '' })}
            >
              Clear all
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
