import { useEffect, useState } from 'react';
import { getPlaceImage } from '../services/imageService';

/**
 * SmartImage — an image that manages its own three states:
 * skeleton while loading, the photo on success, and a designed
 * placeholder (never a broken-image icon) on failure.
 *
 * Give it either a direct `src`, or a `wikiTitle` to fetch the
 * landmark's photo dynamically from the Wikipedia REST API.
 */
export default function SmartImage({ src, wikiTitle, alt, className = '', ...rest }) {
  const [resolvedSrc, setResolvedSrc] = useState(src ?? null);
  const [state, setState] = useState('loading'); // loading | ready | failed

  useEffect(() => {
    let cancelled = false;
    if (src) {
      setResolvedSrc(src);
      return undefined;
    }
    if (!wikiTitle) {
      setState('failed');
      return undefined;
    }
    getPlaceImage(wikiTitle)
      .then((img) => {
        if (cancelled) return;
        if (img?.src) setResolvedSrc(img.src);
        else setState('failed');
      })
      .catch(() => {
        if (!cancelled) setState('failed');
      });
    return () => {
      cancelled = true;
    };
  }, [src, wikiTitle]);

  if (state === 'failed') {
    return (
      <div className={`smart-image is-fallback ${className}`} role="img" aria-label={alt}>
        <svg viewBox="0 0 48 48" width="34" height="34" aria-hidden="true">
          <path
            d="M8 34l10-12 7 8 5-5 10 9M8 34h32M18 17a3 3 0 11-6 0 3 3 0 016 0z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>Image unavailable</span>
      </div>
    );
  }

  return (
    <div className={`smart-image ${state === 'loading' ? 'skeleton' : ''} ${className}`}>
      {resolvedSrc && (
        <img
          src={resolvedSrc}
          alt={alt}
          loading="lazy"
          onLoad={() => setState('ready')}
          onError={() => setState('failed')}
          style={{ opacity: state === 'ready' ? 1 : 0 }}
          {...rest}
        />
      )}
    </div>
  );
}
