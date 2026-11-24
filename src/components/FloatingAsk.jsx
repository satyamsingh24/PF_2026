import { navItem } from '../data/portfolio.js';

/** The one and only Ask AI button — fixed bottom-right, toggles the chat drawer. */
export default function FloatingAsk({ open, onToggle }) {
  const label = navItem('ask-ai').label;
  return (
    <button
      className="floating-chat-trigger"
      onClick={onToggle}
      aria-label={open ? 'Close AI assistant' : 'Open AI assistant'}
      aria-expanded={open}
    >
      <span className="chat-trigger-icon">{open ? '✕' : '💬'}</span>
      <span>{label}</span>
    </button>
  );
}
