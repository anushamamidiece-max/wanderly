# Wanderly — Owner's Guide & Presentation Script

This file is for YOU (it is fine to keep it in the repo — it shows you
understand your project). It has two parts:

1. How the project actually works, in plain language
2. A ~2-minute presentation script for the assessment video

---

## PART 1 — How it works, in plain language

### The big picture

```
User ──> React components (what you see)
              │ props / state
              ▼
        Hooks & Context (remember things, share things)
              │
              ▼
        Service modules (talk to the outside world)
              │
              ▼
        APIs: Open-Meteo / OpenWeather · Wikipedia · Gemini · geocoders
```

### Key concepts used, and why

**Components** — Each visual piece is its own function that returns JSX
(HTML-like syntax in JavaScript). `DestinationCard` is written once and
rendered 12 times with different data. That data arrives through **props** —
function arguments for components.

**useState** — Component memory. When state changes, React re-renders that
component. The search box (`query`), the chat messages, the planner form,
the mobile menu open/closed — each is one `useState`.

**useEffect** — "Do something after render" — mostly fetching data. In
`useWeather`, the effect runs whenever the coordinates change and fetches
new weather. The `cancelled` flag inside prevents updating state if you
navigate away before the response arrives.

**Custom hook (`useWeather`)** — A reusable bundle of state + effect. Both
the home page weather panel and every destination page use the same hook, so
loading/error/data logic exists once.

**Context (`LocationContext`)** — App-wide shared state. The navbar chip and
the home weather panel both need to know the visitor's location; context
lets them share it without passing props through every layer.

**React Router** — Client-side pages. `/destination/:id` is a dynamic route:
`useParams()` reads the id from the URL and we look it up in the dataset.
That is why every destination has "a page of its own" with a shareable URL.

**Services** — Plain JS modules that talk to APIs. Components never call
`fetch` themselves; they call `getWeather(lat, lon)` and get back one
normalised shape regardless of which provider answered. Swap providers →
zero component changes.

**How search/filter works** — The Explore page keeps `query` and `filters`
in state, and computes the visible list with `useMemo`: it filters the
12-destination array on every keystroke (case-insensitive `includes` over
name/country/region/tags + region/style/duration checks). No duplicated
state, so the list can never be "out of sync".

**How the itinerary reaches the screen** — Planner form state → prompt
built in `aiService` → Gemini returns text → we strip code fences, parse
JSON, validate every field (day count, three blocks per day) → the clean
object is passed as a prop to `<Itinerary>`, which maps days to `DayCard`s
and blocks to `TimeBlock`s. Bad AI output fails validation and shows a
designed error instead of garbage.

**Why the fallbacks exist** — `VITE_` env vars are baked into the shipped
bundle, so anyone can read them in dev tools. We keep keys out of git and
recommend restricted keys, but the honest fix (a server proxy) is out of
scope for a pure-frontend assessment — so every feature also has a keyless
path (Open-Meteo, Wikipedia, labelled offline AI mode) and the README says
this plainly.

---

## PART 2 — 2-minute presentation script

> Speak naturally; don't rush. ~300 words ≈ 2 minutes.

"Hi, I'm [name], and this is **Wanderly** — a travel discovery app I built
in React for the Design Esthetics assessment.

The idea was a travel product that feels editorial — more like a travel
magazine than a booking site. It opens with a full-screen looping video
hero, streamed from Pexels with a photo fallback if the video can't load.

The Explore page has twelve destinations I curated myself, with structured
data in a separate file. Search updates as you type, and the region, style
and trip-length filters genuinely narrow the results — with a designed empty
state when nothing matches.

Every destination has its own routed page — React Router reads the id from
the URL. Here you get live weather, quick facts, and famous places as visual
cards. The photos aren't hardcoded: landmark images come from the Wikipedia
REST API, so each card shows the real place, with skeletons while loading
and a designed fallback if an image fails.

For location, I only request geolocation when the user clicks — no ambush
prompts. If it's granted I reverse-geocode and show local weather; if it's
denied, that's a designed state, and a manual city search works either way.
Weather uses OpenWeather with an automatic fallback to the keyless
Open-Meteo API, normalised in one service, so the page never breaks.

The AI concierge is Google Gemini, and it knows which destination you're
reading. The planner is my favourite part: destination, days and style go
into a prompt that asks Gemini for strict JSON. I validate that JSON before
rendering it as day cards with morning, afternoon and evening blocks — a
real plan, never a wall of chat text.

It's fully responsive from 320 pixels up, keyboard accessible with visible
focus states, respects reduced-motion, and every API key lives in
environment variables outside the repository.

Thanks for watching."

---

## Publishing to GitHub (step by step)

```bash
cd wanderly
git init
git add .
git commit -m "Wanderly — travel discovery app (Design Esthetics assessment)"
# create an empty PUBLIC repo named wanderly on github.com, then:
git remote add origin https://github.com/<your-username>/wanderly.git
git branch -M main
git push -u origin main
```

Before pushing, double-check: `git status` must NOT list `.env`
(it is git-ignored; only `.env.example` should appear).

## Deploying on Vercel (step by step)

1. vercel.com → Add New Project → import the `wanderly` repo
2. Framework preset: **Vite** (defaults are correct; `vercel.json` already
   handles SPA rewrites)
3. Settings → Environment Variables → add `VITE_GEMINI_API_KEY`
   (+ optionally `VITE_OPENWEATHER_API_KEY`, `VITE_UNSPLASH_ACCESS_KEY`)
4. Deploy, then open the live URL in a **private window** and test:
   home, explore, a destination page refresh (deep link), the planner,
   location allow + deny, and the chat.
