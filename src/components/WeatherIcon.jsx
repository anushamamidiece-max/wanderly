/* Minimal inline weather icons — no icon library needed. */

const paths = {
  sun: (
    <>
      <circle cx="12" cy="12" r="4.4" />
      <path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5 5l1.7 1.7M17.3 17.3L19 19M19 5l-1.7 1.7M6.7 17.3L5 19" />
    </>
  ),
  partly: (
    <>
      <circle cx="8.5" cy="9" r="3.4" />
      <path d="M8.5 2.8v1.8M2.7 9h1.8M4.4 4.9l1.3 1.3" />
      <path d="M9 20h8.5a3.5 3.5 0 100-7 5 5 0 00-9.6 1.4A2.9 2.9 0 009 20z" />
    </>
  ),
  cloud: (
    <path d="M7 19h10.5a3.8 3.8 0 100-7.6 5.6 5.6 0 00-10.9 1.6A3.1 3.1 0 007 19z" />
  ),
  rain: (
    <>
      <path d="M7 15h10.5a3.8 3.8 0 100-7.6 5.6 5.6 0 00-10.9 1.6A3.1 3.1 0 007 15z" />
      <path d="M8.5 18l-1 2.6M13 18l-1 2.6M17.5 18l-1 2.6" />
    </>
  ),
  snow: (
    <>
      <path d="M7 15h10.5a3.8 3.8 0 100-7.6 5.6 5.6 0 00-10.9 1.6A3.1 3.1 0 007 15z" />
      <path d="M8.3 18.2h.01M12.2 20h.01M16 18.2h.01" strokeWidth="2.4" />
    </>
  ),
  storm: (
    <>
      <path d="M7 14h10.5a3.8 3.8 0 100-7.6 5.6 5.6 0 00-10.9 1.6A3.1 3.1 0 007 14z" />
      <path d="M12.8 15.5l-2.4 3.4h3l-2 3.6" />
    </>
  ),
  fog: (
    <>
      <path d="M7 13h10.5a3.8 3.8 0 100-7.6 5.6 5.6 0 00-10.9 1.6A3.1 3.1 0 007 13z" />
      <path d="M5.5 16.5h13M7.5 19.5h9" />
    </>
  ),
};

export default function WeatherIcon({ kind = 'partly', size = 40 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[kind] ?? paths.partly}
    </svg>
  );
}
