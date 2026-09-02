import { useId } from 'react';

/** SearchBar — controlled input; the parent owns the query state. */
export default function SearchBar({ value, onChange, placeholder = 'Search destinations…' }) {
  const id = useId();
  return (
    <div className="search-bar">
      <label htmlFor={id} className="sr-only">
        Search destinations
      </label>
      <svg className="search-bar-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-3.8-3.8" />
      </svg>
      <input
        id={id}
        type="search"
        className="input search-bar-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
      />
      {value && (
        <button
          type="button"
          className="search-bar-clear"
          onClick={() => onChange('')}
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
}
