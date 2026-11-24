import { useCallback, useEffect, useRef, useState } from 'react';
import { ASK_AI, CERTIFICATIONS, PROFILE } from '../data/portfolio.js';

const API_URL = import.meta.env.VITE_RAG_API_URL || 'http://localhost:8000';

// Escape everything (including quotes) first, then add a tiny bit of markdown.
function formatResponse(text) {
  if (!text) return '';
  let s = String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
  s = s.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/`([^`]+)`/g, '<code class="chat-code">$1</code>');
  s = s.replace(
    /(https?:\/\/[^\s<]+)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer" class="chat-link">$1 ↗</a>'
  );
  s = s.replace(/^- (.*$)/gim, '<li style="margin-left:16px;">$1</li>');
  return s;
}

function offlineAnswer(q) {
  const l = q.toLowerCase();
  const f = ASK_AI.fallback;
  if (l.includes('certif') || l.includes('badge') || l.includes('credential')) {
    return (
      `${PROFILE.firstName} holds **${CERTIFICATIONS.length} certificate${CERTIFICATIONS.length === 1 ? '' : 's'}**: ` +
      CERTIFICATIONS.map((c) => `${c.title} (${c.issuer}, ${c.date})`).join('; ') + '.'
    );
  }
  if (l.includes('educat') || l.includes('degree') || l.includes('mca') || l.includes('bca') || l.includes('college')) return f.education;
  if (l.includes('hire') || l.includes('available') || l.includes('job') || l.includes('contact') || l.includes('role')) return f.availability;
  if (l.includes('experience') || l.includes('work') || l.includes('company') || l.includes('project')) return f.experience;
  if (l.includes('skill') || l.includes('tool') || l.includes('aws') || l.includes('kubernetes') || l.includes('docker') || l.includes('terraform')) return f.skills;
  return f.general;
}

export default function ChatDrawer({ open, onClose }) {
  const [messages, setMessages] = useState([{ role: 'assistant', text: ASK_AI.welcome }]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [online, setOnline] = useState(false);
  const [statusLabel, setStatusLabel] = useState('Checking backend…');

  const historyRef = useRef([]);
  const bodyRef = useRef(null);
  const inputRef = useRef(null);
  const onlineRef = useRef(false);

  const checkHealth = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/health`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const data = await res.json();
        onlineRef.current = true;
        setOnline(true);
        setStatusLabel(`Online (${data.chunks || 56} chunks loaded)`);
        return true;
      }
    } catch (_) {
      /* backend offline */
    }
    onlineRef.current = false;
    setOnline(false);
    setStatusLabel('Offline preview mode');
    return false;
  }, []);

  useEffect(() => {
    checkHealth();
    const id = setInterval(checkHealth, 30000);
    return () => clearInterval(id);
  }, [checkHealth]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, busy, open]);

  const send = useCallback(
    async (question) => {
      const q = (question || '').trim();
      if (!q || busy) return;
      setMessages((m) => [...m, { role: 'user', text: q }]);
      setInput('');
      setBusy(true);

      try {
        const available = onlineRef.current || (await checkHealth());
        if (available) {
          const res = await fetch(`${API_URL}/ask`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: q, history: historyRef.current.slice(-6) }),
          });
          if (res.status === 429) throw new Error('Rate limit reached. Please wait a moment before asking again.');
          if (!res.ok) throw new Error('The portfolio assistant encountered an issue. Please try again shortly.');
          const data = await res.json();
          historyRef.current.push({ role: 'user', content: q }, { role: 'assistant', content: data.answer });
          setMessages((m) => [...m, { role: 'assistant', text: data.answer, sources: data.sources }]);
        } else {
          await new Promise((r) => setTimeout(r, 600));
          const notice =
            '[Offline preview mode · Start `uvicorn app.main:app --reload` in `agent/backend` for live Gemini + ChromaDB responses]\n\n' +
            offlineAnswer(q);
          setMessages((m) => [
            ...m,
            { role: 'assistant', text: notice, sources: [{ id: 'kb', title: 'portfolio_knowledge_base.md' }] },
          ]);
        }
      } catch (err) {
        setMessages((m) => [
          ...m,
          { role: 'assistant', alert: true, text: `⚠️ ${err.message || 'Unable to connect to RAG assistant.'}` },
        ]);
      } finally {
        setBusy(false);
      }
    },
    [busy, checkHealth]
  );

  return (
    <div className={`chat-drawer-container${open ? ' is-open' : ''}`} role="dialog" aria-label={`${PROFILE.name}'s Portfolio AI Assistant`}>
      <div className="chat-drawer-header">
        <div className="drawer-header-left">
          <div className="drawer-avatar">{PROFILE.initials}</div>
          <div className="drawer-header-meta">
            <h4>{PROFILE.firstName}'s Assistant</h4>
            <span>
              <span className="status-dot" style={{ background: online ? 'var(--badge-live)' : '#f59e0b' }} /> {statusLabel}
            </span>
          </div>
        </div>
        <button className="drawer-close-btn" onClick={onClose} aria-label="Close chat">×</button>
      </div>

      <div className="chat-drawer-messages" ref={bodyRef}>
        {messages.map((m, i) => (
          <div key={i} className={`chat-bubble ${m.role}${m.alert ? ' system-alert' : ''}`}>
            <span dangerouslySetInnerHTML={{ __html: formatResponse(m.text) }} />
            {m.sources?.length > 0 && (
              <div className="sources-accordion">
                <strong>Retrieved Sources:</strong>{' '}
                <span dangerouslySetInnerHTML={{ __html: formatResponse(m.sources.map((s) => s.title || s.id).join(', ')) }} />
              </div>
            )}
          </div>
        ))}
        {busy && (
          <div className="typing-indicator">
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
          </div>
        )}
      </div>

      <div className="quick-prompts-bar">
        {ASK_AI.quickPrompts.map((p) => (
          <button key={p.label} className="prompt-chip" onClick={() => send(p.prompt)}>
            {p.label}
          </button>
        ))}
      </div>

      <form
        className="terminal-input-bar"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <input
          ref={inputRef}
          type="text"
          className="terminal-input"
          placeholder="Ask a question…"
          maxLength={500}
          autoComplete="off"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="btn-send" disabled={busy} aria-label="Send query">↗</button>
      </form>
    </div>
  );
}
