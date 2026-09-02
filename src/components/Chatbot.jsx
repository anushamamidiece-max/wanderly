import { useEffect, useRef, useState } from 'react';
import { chat, isAiConfigured, offlineChatReply } from '../services/aiService';

const SUGGESTIONS = [
  'How many days should I spend here?',
  'What should I see first?',
  'When is the best time to visit?',
  'Is it good for a family trip?',
  'What food should I try?',
];

/**
 * Chatbot — the conversational concierge for a destination.
 * Messages live in component state; the whole conversation is passed
 * to the AI service so replies keep their context. The log is an
 * aria-live region so screen readers hear new answers.
 */
export default function Chatbot({ destination }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const logRef = useRef(null);
  const aiReady = isAiConfigured();

  // Keep the newest message in view.
  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [messages, busy]);

  async function send(text) {
    const question = text.trim();
    if (!question || busy) return;
    setError(null);
    setInput('');
    const history = [...messages, { role: 'user', text: question }];
    setMessages(history);
    setBusy(true);
    try {
      let reply;
      if (aiReady) {
        reply = await chat(history, destination);
      } else {
        // Honest fallback: labelled guide answers, not fake AI.
        await new Promise((r) => setTimeout(r, 450));
        reply = offlineChatReply(question, destination);
      }
      setMessages((m) => [...m, { role: 'assistant', text: reply }]);
    } catch {
      setError("The concierge couldn't answer right now. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="chatbot panel">
      <header className="chatbot-head">
        <div>
          <h3>Ask the concierge</h3>
          <p>
            {aiReady
              ? `Questions about ${destination.name}? Ask away.`
              : 'Offline guide mode — add a Gemini API key for full AI answers.'}
          </p>
        </div>
        <span className={`chatbot-dot ${aiReady ? 'is-live' : ''}`} aria-hidden="true" />
      </header>

      <div className="chatbot-log" ref={logRef} aria-live="polite" aria-label="Conversation">
        {messages.length === 0 && (
          <div className="chatbot-empty">
            <p>Try one of these to get started:</p>
            <div className="chatbot-suggestions">
              {SUGGESTIONS.map((s) => (
                <button key={s} type="button" className="chip" onClick={() => send(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <p key={i} className={`chat-msg ${m.role === 'user' ? 'is-user' : 'is-assistant'}`}>
            {m.text}
          </p>
        ))}
        {busy && (
          <p className="chat-msg is-assistant is-typing" role="status">
            <span /><span /><span />
            <span className="sr-only">The concierge is typing</span>
          </p>
        )}
        {error && (
          <p className="chat-msg is-error" role="alert">
            {error}
          </p>
        )}
      </div>

      <form
        className="chatbot-input"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <label htmlFor="chat-input" className="sr-only">
          Ask a question about {destination.name}
        </label>
        <input
          id="chat-input"
          className="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask about ${destination.name}…`}
          autoComplete="off"
        />
        <button type="submit" className="btn btn-primary" disabled={busy || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}
