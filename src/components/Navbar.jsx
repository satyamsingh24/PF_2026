import { useState } from 'react';
import ThemeSwitch from './ThemeSwitch.jsx';
import { NAV, PROFILE } from '../data/portfolio.js';

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.6 10.6 12 3.4l8.4 7.2V19a1.4 1.4 0 0 1-1.4 1.4h-4.2v-5.6H9.2v5.6H5A1.4 1.4 0 0 1 3.6 19Z" />
    </svg>
  );
}

export default function Navbar({ activeId, isLight, onToggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <nav className="nav-pill" aria-label="Main navigation">
        <a className="brand-link" href="#hero" onClick={close} aria-label="Home">
          <div className="brand-avatar">
            <HomeIcon />
          </div>
          <div className="brand-meta">
            <span className="brand-name">
              <span className="bn-full">{PROFILE.name}</span>
              <span className="bn-short">{PROFILE.firstName}</span>
            </span>
            <span className="brand-status">
              <span className="status-dot" /> Available for roles
            </span>
          </div>
        </a>

        <ul className={`nav-links${menuOpen ? ' is-open' : ''}`}>
          {NAV.filter((n) => !n.action).map((item) => (
            <li key={item.id}>
                <a
                  className={`nav-link${activeId === item.id ? ' is-active' : ''}`}
                  href={`#${item.id}`}
                  onClick={close}
                >
                  {item.label}
                </a>
            </li>
          ))}
        </ul>

        <div className="nav-actions">
          <ThemeSwitch isLight={isLight} onToggle={onToggleTheme} />
          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>
    </header>
  );
}
