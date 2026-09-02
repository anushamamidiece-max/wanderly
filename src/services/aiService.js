/**
 * AI service — Google Gemini integration.
 *
 * Honest architecture note: with a pure-frontend assessment build, a
 * VITE_ env variable is embedded in the shipped JavaScript, so the key
 * is visible to anyone who opens dev tools. That is a known limitation
 * of client-side API use — the mitigation here is a restricted,
 * free-tier key; the production fix is a small server/serverless proxy.
 * This is documented in the README rather than pretended away.
 *
 * When no key is configured the app does NOT fake an AI: the chat runs
 * a clearly-labelled "offline guide" that answers from the curated
 * dataset, and itineraries come from a local planner marked as a sample.
 */

const KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL = 'gemini-2.5-flash';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

export const isAiConfigured = () => Boolean(KEY);

async function callGemini(contents, systemInstruction) {
  const res = await fetch(`${ENDPOINT}?key=${KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents,
      systemInstruction: { parts: [{ text: systemInstruction }] },
      generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
    }),
  });
  if (!res.ok) throw new Error(`Gemini responded ${res.status}`);
  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') ?? '';
  if (!text) throw new Error('Gemini returned an empty response');
  return text;
}

/* ---------------- Chat ---------------- */

function chatSystemPrompt(destination) {
  const context = destination
    ? `The traveller is currently reading about ${destination.name}, ${destination.country}.
Guide facts: best time to visit — ${destination.bestTime}; suggested stay — ${destination.days} days;
travel styles — ${destination.tags.join(', ')}; notable places — ${destination.places
        .map((p) => p.name)
        .join(', ')}.`
    : 'No specific destination is selected yet.';

  return `You are Wanderly's travel concierge: warm, precise, and genuinely useful.
${context}
Rules: keep answers under 130 words, use short paragraphs or simple dashes for lists,
no markdown headings or bold, no emojis. If asked for a full multi-day itinerary,
give a brief outline and suggest the Planner page for a structured plan.`;
}

/**
 * history: [{ role: 'user' | 'assistant', text }]
 */
export async function chat(history, destination) {
  const contents = history.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.text }],
  }));
  return callGemini(contents, chatSystemPrompt(destination));
}

/* Offline chat: answers from the dataset, never pretends to be AI. */
export function offlineChatReply(question, destination) {
  const q = question.toLowerCase();
  const d = destination;
  const intro = d ? '' : 'Pick a destination first and I can be much more specific. ';
  if (!d) return intro + 'The AI concierge is in offline mode until a Gemini API key is added.';

  if (/(how many|how long|days|duration|stay)/.test(q))
    return `Most travellers give ${d.name} about ${d.days} days — enough for ${d.places
      .slice(0, 2)
      .map((p) => p.name)
      .join(' and ')} without rushing. (Offline guide answer — add a Gemini key for full AI.)`;
  if (/(when|best time|season|month|weather)/.test(q))
    return `The sweet spot for ${d.name} is ${d.bestTime}. (Offline guide answer — add a Gemini key for full AI.)`;
  if (/(see|do|visit|attraction|place|highlight)/.test(q))
    return (
      `Start with: ${d.places.map((p) => p.name).join(', ')}. ` +
      `${d.places.find((p) => p.mustSee)?.name ?? d.places[0].name} is the one not to miss. (Offline guide answer.)`
    );
  if (/(food|eat|restaurant|dish|drink)/.test(q))
    return `${d.name} is known for its food scene — its styles here lean ${d.tags
      .join(', ')
      .toLowerCase()}. For real recommendations, add a Gemini API key. (Offline guide answer.)`;
  return (
    `Here's what the guide knows about ${d.name}: ${d.tagline} Best time: ${d.bestTime}; ` +
    `suggested stay: ${d.days} days. For conversational answers, add a Gemini API key. (Offline guide answer.)`
  );
}

/* ---------------- Itinerary generation ---------------- */

function itineraryPrompt({ destination, days, styles, interests }) {
  return `Create a ${days}-day travel itinerary for ${destination.name}, ${destination.country}.
Traveller style: ${styles.length ? styles.join(', ') : 'balanced'}.
${interests ? `Special interests: ${interests}.` : ''}
Real notable places there include: ${destination.places.map((p) => p.name).join(', ')} — use them where sensible, plus other real places you know.

Respond with ONLY valid JSON, no markdown fences, exactly this shape:
{
  "title": "string — a short evocative trip title",
  "summary": "string — one sentence describing the trip's character",
  "days": [
    {
      "day": 1,
      "theme": "string — 2-4 word theme for the day",
      "blocks": [
        { "time": "Morning",   "title": "string", "description": "string, max 25 words", "duration": "string like '2–3 hours'", "category": "string like 'Museum'" },
        { "time": "Afternoon", "title": "string", "description": "string", "duration": "string", "category": "string" },
        { "time": "Evening",   "title": "string", "description": "string", "duration": "string", "category": "string" }
      ]
    }
  ]
}
The "days" array must contain exactly ${days} entries, each with exactly the three blocks Morning, Afternoon, Evening.`;
}

/* Validate the parsed JSON so malformed AI output never reaches the UI. */
function validateItinerary(data, expectedDays) {
  if (!data || !Array.isArray(data.days) || data.days.length === 0) return null;
  const days = data.days.slice(0, expectedDays).map((d, i) => ({
    day: Number(d.day) || i + 1,
    theme: String(d.theme || 'Exploring'),
    blocks: ['Morning', 'Afternoon', 'Evening'].map((time) => {
      const b =
        (d.blocks ?? []).find((x) => String(x.time).toLowerCase() === time.toLowerCase()) ??
        (d.blocks ?? [])[['Morning', 'Afternoon', 'Evening'].indexOf(time)] ??
        {};
      return {
        time,
        title: String(b.title || 'Free time'),
        description: String(b.description || 'Wander at your own pace.'),
        duration: b.duration ? String(b.duration) : null,
        category: b.category ? String(b.category) : null,
      };
    }),
  }));
  return {
    title: String(data.title || 'Your trip plan'),
    summary: String(data.summary || ''),
    days,
  };
}

function extractJson(text) {
  const cleaned = text.replace(/```json|```/g, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    // Last resort: grab the outermost braces.
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start === -1 || end <= start) return null;
    try {
      return JSON.parse(cleaned.slice(start, end + 1));
    } catch {
      return null;
    }
  }
}

export async function generateItinerary(options) {
  const text = await callGemini(
    [{ role: 'user', parts: [{ text: itineraryPrompt(options) }] }],
    'You are an expert travel planner. You output strictly valid JSON and nothing else.'
  );
  const parsed = extractJson(text);
  const valid = validateItinerary(parsed, options.days);
  if (!valid) throw new Error('The AI response could not be read as an itinerary');
  return { ...valid, source: 'gemini' };
}

/* Deterministic local planner used when no Gemini key is configured.
   Clearly labelled in the UI as a sample plan, not AI output. */
export function buildLocalItinerary({ destination, days, styles }) {
  const places = [...destination.places];
  const evenings = [
    `Dinner somewhere classic — ${destination.name} leans ${destination.tags[0]?.toLowerCase() ?? 'local'}, so follow the locals.`,
    'Golden-hour walk through the old centre, then a slow meal nearby.',
    'A neighbourhood you have not seen yet, ending with dessert.',
    'Sunset from the best viewpoint you passed today, then dinner.',
    'A relaxed final evening — revisit the corner you liked most.',
    'Live music or a night market, depending on the day of the week.',
    'An early dinner and a stroll — tomorrow starts slow.',
  ];
  const built = Array.from({ length: days }, (_, i) => {
    const a = places[(i * 2) % places.length];
    const b = places[(i * 2 + 1) % places.length];
    return {
      day: i + 1,
      theme: i === 0 ? 'First impressions' : i === days - 1 ? 'Slow farewell' : `${a.category} & beyond`,
      blocks: [
        {
          time: 'Morning',
          title: a.name,
          description: a.description,
          duration: a.duration,
          category: a.category,
        },
        {
          time: 'Afternoon',
          title: b.name,
          description: b.description,
          duration: b.duration,
          category: b.category,
        },
        {
          time: 'Evening',
          title: 'Evening, unscripted',
          description: evenings[i % evenings.length],
          duration: null,
          category: 'Food & wandering',
        },
      ],
    };
  });
  return {
    title: `${days} days in ${destination.name}`,
    summary: `A sample ${styles.length ? styles.join(' + ').toLowerCase() : 'balanced'} plan built from the Wanderly guide — add a Gemini API key for a fully personalised AI itinerary.`,
    days: built,
    source: 'local',
  };
}
