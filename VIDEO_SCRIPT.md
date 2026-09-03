# 🎬 WANDERLY — 2-MINUTE VIDEO SCRIPT (beginner-friendly)

Camera ON. Screen recording ON. Live site open in browser.
Speak slowly — short sentences. If you make a mistake, pause and re-record.
Total spoken words: ~270 (fits 2 minutes with normal pace).

──────────────────────────────────────────────
0:00 – 0:15 · HOME PAGE (video hero is playing)
──────────────────────────────────────────────
DO:  Nothing yet. Just be on the home page.

SAY: "Hi, my name is [YOUR NAME]. This is Wanderly, a travel web
      application I built in React for the Design Esthetics assessment.
      It opens with a full-screen video hero, and the design is meant
      to feel like a travel magazine."

──────────────────────────────────────────────
0:15 – 0:40 · EXPLORE PAGE
──────────────────────────────────────────────
DO:  Click "Explore" in the navbar.
     Type "japan" in the search box → Kyoto appears.
     Clear it. Click the "Europe" region chip.

SAY: "This is the destination explorer. I have twelve destinations
      stored in a separate data file. Search updates while I type,
      and these filters — region, travel style and trip length —
      actually change the results."

──────────────────────────────────────────────
0:40 – 1:10 · DESTINATION PAGE
──────────────────────────────────────────────
DO:  Click the Kyoto card. Scroll slowly down the page:
     weather card → famous places → stop at the chat.
     Click ONE suggested question in the chat.

SAY: "Each destination has its own page using React Router.
      Here you can see live weather coming from a real weather API.
      These famous places are not hardcoded images — the photos are
      fetched from the Wikipedia API, so it's always the real landmark.
      And this is my AI travel assistant — I can ask it questions
      about this destination."

──────────────────────────────────────────────
1:10 – 1:35 · AI PLANNER
──────────────────────────────────────────────
DO:  Click "AI Planner" in the navbar.
     Pick a destination, click "Generate itinerary".
     Scroll through the day cards while talking.

SAY: "This is my favourite part — the itinerary generator.
      I choose a destination, number of days and a travel style.
      The AI returns the plan as JSON, my code validates it,
      and then renders it as a proper day-by-day plan — morning,
      afternoon and evening — not just a block of chat text."

──────────────────────────────────────────────
1:35 – 1:55 · CODE + RESPONSIVE
──────────────────────────────────────────────
DO:  Switch to VS Code for ~5 seconds. Click the src/services folder
     so the file names are visible.
     Switch back to browser. Drag the window narrow (phone width) —
     show the menu button.

SAY: "In the code, every API has its own service file, so components
      stay clean. If one API fails, the page still works — loading,
      empty and error states are all designed.
      The whole app is responsive, from a small phone to a desktop.
      API keys live in environment variables — never in the code."

──────────────────────────────────────────────
1:55 – 2:00 · CLOSE
──────────────────────────────────────────────
DO:  Back on the home page.

SAY: "That's Wanderly — thank you for watching!"

──────────────────────────────────────────────
⚠️ ONE HONESTY RULE
If your live site is still in offline-AI mode (no Gemini key added),
then in the chat/planner sections say instead:
  "The AI integration uses Google Gemini through an environment
   variable — without the key it falls back to a clearly-labelled
   offline mode, so the app never breaks."
Do NOT claim the answer on screen came from Gemini if the badge
says "offline mode".

──────────────────────────────────────────────
🎥 RECORDING TIPS FOR BEGINNERS
──────────────────────────────────────────────
1. Tool: OBS Studio (free) — add "Display Capture" + "Video Capture
   Device" (your webcam, small, in a corner). Or record a Google Meet
   with yourself: share screen, camera on, click Record.
2. Close every other tab and app. Turn off notifications.
3. Zoom the browser to 110–125% (Ctrl and +) so text is readable.
4. Load every page ONCE before recording, so images are cached
   and appear instantly on camera.
5. Put this script on your phone, propped next to the screen.
6. Do one practice run with a timer. Expect 3–4 takes — normal.
7. Speak slower than feels natural. Smile at the start and end.
8. Say [YOUR NAME], not "your name". 🙂
