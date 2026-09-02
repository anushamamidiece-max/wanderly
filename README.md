# Wanderly

**Go somewhere worth remembering.**

Wanderly is a travel discovery web application built in React. It pairs a
curated, editorial guide to twelve destinations with live data: real-time
weather for any point on Earth, dynamically fetched photography, an AI travel
concierge, and an AI itinerary generator that renders real day-by-day plans —
not walls of chat text.

Built as a Front-End Developer assessment for **Design Esthetics** (via TAP
Academy).

![Landing page](screenshots/home-hero.png)

---

## Features

- **Cinematic landing page** — full-viewport looping background video
  (free-licence footage streamed from the Pexels CDN, with a graceful
  photographic fallback if the video cannot load).
- **Destination explorer** — browse 12 curated destinations; live search
  (case-insensitive, partial matches) plus region, travel-style and
  trip-length filters that genuinely narrow the results. Designed empty state
  with a one-click reset.
- **Destination detail pages** — an editorial page per destination with
  cinematic header, quick facts (best time, suggested stay, style), live
  weather, famous places and the AI concierge. Routed with React Router;
  unknown ids get a designed 404.
- **Famous places** — visual cards (photo, description, category, visit
  duration, "must see" badge). Photos are fetched dynamically from the
  Wikipedia REST API, so each card shows the actual landmark.
- **Location awareness** — "Use my location" triggers browser geolocation
  *only on click* (no permission ambush), reverse-geocodes the coordinates to
  a city name, and shows live local weather. Denied permission is a designed
  state — and a **manual city search** (Open-Meteo geocoding) works with or
  without permission.
- **Real-time weather** — temperature, condition, feels-like, humidity and
  wind for the visitor's location and for every destination. Uses OpenWeather
  when a key is configured and transparently falls back to the keyless
  Open-Meteo API otherwise, so the live demo never breaks.
- **AI travel concierge** — a Google Gemini-powered chat that knows which
  destination you are reading about. Suggested prompts, typing indicator,
  error state, keyboard accessible, `aria-live` conversation log.
- **AI itinerary generator** — choose destination, days (2–7), travel styles
  and interests; Gemini returns strict JSON which is validated and rendered
  as a structured plan: DayCard → Morning / Afternoon / Evening blocks with
  activity, description, duration and category. Malformed AI output is
  caught; without an API key a clearly-labelled sample plan is built from the
  guide data (the app never fakes an AI response).
- **Designed states everywhere** — loading skeletons and spinners, empty
  results, failed requests with retry, denied location, image fallbacks, 404.
- **Responsive** — intentional layouts from 320 px phones to large desktops:
  collapsible menu, filter drawer, stacked grids, sticky planner form.
- **Accessible** — semantic landmarks and headings, labelled inputs, alt
  text, visible focus rings, skip-to-content link, keyboard-only usable,
  `prefers-reduced-motion` respected.

| Explorer | Detail page | Itinerary |
| --- | --- | --- |
| ![Explore](screenshots/explore.png) | ![Detail](screenshots/detail-hero.png) | ![Itinerary](screenshots/planner-itinerary.png) |

| Famous places | Live weather | Chat concierge |
| --- | --- | --- |
| ![Places](screenshots/detail-places.png) | ![Weather](screenshots/weather-located.png) | ![Chat](screenshots/detail-chat.png) |

| Mobile | Location denied | Empty state |
| --- | --- | --- |
| ![Mobile](screenshots/mobile-home.png) | ![Denied](screenshots/location-denied.png) | ![Empty](screenshots/explore-empty.png) |

---

## Tech stack

- **React 18** + **Vite** — SPA with **React Router 6**
- **JavaScript (ES2022)**, **HTML**, **CSS** — no UI framework, no Bootstrap,
  no Tailwind; a hand-built design system on CSS custom properties
  (colour, type, spacing, radius, shadow and motion scales in
  `src/styles/variables.css`)
- **Fonts** — Fraunces (display serif) + Inter (text), via Google Fonts

## APIs used

| Purpose | Primary | Keyless fallback |
| --- | --- | --- |
| Weather | [OpenWeather](https://openweathermap.org/) (`VITE_OPENWEATHER_API_KEY`) | [Open-Meteo](https://open-meteo.com/) |
| Place photos | [Wikipedia REST API](https://en.wikipedia.org/api/rest_v1/) (keyless) | designed placeholder |
| Destination covers | [Unsplash API](https://unsplash.com/developers) (`VITE_UNSPLASH_ACCESS_KEY`, optional) | curated Unsplash CDN photos |
| AI chat + itineraries | [Google Gemini](https://ai.google.dev/) (`VITE_GEMINI_API_KEY`) | labelled offline guide mode |
| Geocoding (city search) | Open-Meteo Geocoding (keyless) | — |
| Reverse geocoding | BigDataCloud client API (keyless) | — |
| Geolocation | Browser Geolocation API | manual city search |
| Hero video | Pexels video CDN (free licence) | poster photograph |

Every provider response is normalised in a service module
(`src/services/`), so components never know or care which API answered.

## Getting started

```bash
git clone <your-repo-url>
cd wanderly
npm install
cp .env.example .env      # then add your keys (see below)
npm run dev
```

The app runs immediately **without any keys** — weather comes from
Open-Meteo, photos from Wikipedia/Unsplash CDN, and the AI features switch to
a clearly-labelled offline guide mode. Add keys to unlock the full
experience.

## Environment variables

| Variable | Required for | Where to get it |
| --- | --- | --- |
| `VITE_GEMINI_API_KEY` | AI chat + AI itineraries | [Google AI Studio](https://aistudio.google.com/apikey) |
| `VITE_OPENWEATHER_API_KEY` | OpenWeather as weather source (optional) | [openweathermap.org](https://openweathermap.org/api) |
| `VITE_UNSPLASH_ACCESS_KEY` | Fresh Unsplash destination covers (optional) | [unsplash.com/developers](https://unsplash.com/developers) |

`.env` is git-ignored; `.env.example` documents the shape. **No keys are
committed to this repository.**

### An honest note on client-side keys

`VITE_`-prefixed variables are embedded in the shipped JavaScript bundle —
that is how Vite works, and it means the keys are visible to anyone who opens
dev tools. Keys are still kept out of the repository (rotation stays easy,
scrapers don't harvest them from GitHub), but for a production product the AI
and weather calls would move behind a small serverless proxy so the keys
never reach the browser. For this assessment the safest practical setup is
restricted free-tier keys (Gemini keys can be HTTP-referrer-restricted in
Google Cloud) — plus keyless fallbacks so nothing depends on a secret.

## Deployment

Deployed on **GitHub Pages** from the `gh-pages` branch: the production
bundle is built with `--base=/wanderly/` and pushed with a `404.html` copy of
`index.html` so deep links like `/wanderly/destination/kyoto` survive a
refresh. The app also deploys unchanged to Vercel or Netlify (`vercel.json`
already provides SPA rewrites).

```bash
npm run build        # production build → dist/
```

## Project structure

```
src/
  components/     Navbar, Hero, DestinationCard, FamousPlaceCard, SearchBar,
                  FilterBar, WeatherCard, WeatherIcon, LocationPanel,
                  Chatbot, Itinerary, SmartImage, Reveal, States
  pages/          Home, Explore, DestinationDetail, Planner, NotFound
  context/        LocationContext (shared "where is the traveller?" state)
  hooks/          useWeather
  services/       weatherService, imageService, aiService, locationService
  data/           destinations.js (curated guide dataset)
  styles/         variables.css, globals.css, components.css, pages.css
```

## Design decisions & challenges

- **Editorial, not booking-site.** Warm paper background, deep pine and
  terracotta, a display serif for headlines, hairline rules, uppercase
  eyebrows and generous whitespace — closer to a travel magazine than a
  generic card dashboard.
- **Fallback-first API architecture.** Every integration has a keyless path,
  so a missing or failing key degrades one feature gracefully instead of
  breaking the page. The weather service normalises two providers into one
  shape; the UI cannot tell them apart.
- **Wikipedia as an image source.** Landmark searches on stock-photo APIs
  often return the wrong landmark. The Wikipedia REST API returns the lead
  photo of the actual article — accurate by construction. Two articles whose
  lead image is a logo (Eiffel Tower, Vatican Museums) are pinned to curated
  photos in the dataset. Wikimedia only serves fixed thumbnail widths, so the
  service upgrades to the largest valid bucket below the original size.
- **AI output you can render.** Gemini is asked for strict JSON, which is
  parsed defensively (code-fence stripping, brace extraction) and validated
  field-by-field before it reaches the UI. If validation fails, the user
  gets a designed error — never a broken screen or raw model text.
- **Honest offline mode.** Without a Gemini key the app does not pretend to
  be an AI: chat answers come from the guide dataset and are labelled, and
  itineraries carry a "sample plan (offline mode)" badge.
- **Motion with intent.** One reveal-on-scroll pattern (IntersectionObserver),
  restrained hovers, and full `prefers-reduced-motion` support.

## Accessibility

Semantic landmarks (`header/nav/main/section/footer`), one logical heading
hierarchy per page, real `<button>`/`<Link>` elements (no clickable divs),
labelled form controls, alt text on all imagery, visible `:focus-visible`
rings, a skip-to-content link, `aria-live` regions for chat and async
results, `aria-pressed` on filter chips and `aria-expanded` on disclosure
toggles. Body text sits on warm paper at WCAG-AA-or-better contrast.

## Future improvements

- Move AI/weather calls behind a serverless proxy (Vercel Functions) so keys
  never ship to the browser
- Save generated itineraries (localStorage, then accounts) and export to PDF
- A 5-day forecast strip on destination pages
- Streaming chat responses for a more conversational feel
- Unit tests for the itinerary validator and search/filter logic
