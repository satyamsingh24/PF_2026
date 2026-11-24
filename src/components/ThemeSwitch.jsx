/** Pill switch: the knob slides between "Dark" (moon, right) and "Light" (sun, left). */
function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
      <path d="M20.2 14.6A8.4 8.4 0 0 1 9.4 3.8a.6.6 0 0 0-.8-.7A9.4 9.4 0 1 0 20.9 15.4a.6.6 0 0 0-.7-.8Z" fill="currentColor" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" />
      <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6" />
    </svg>
  );
}

export default function ThemeSwitch({ isLight, onToggle }) {
  return (
    <button
      type="button"
      className={`theme-switch${isLight ? ' is-light' : ''}`}
      role="switch"
      aria-checked={isLight}
      aria-label="Light mode"
      title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      onClick={onToggle}
    >
      <span className="ts-text ts-text-dark">Dark</span>
      <span className="ts-text ts-text-light">Light</span>
      <span className="ts-knob">
        <span className="ts-icon" key={isLight ? 'sun' : 'moon'}>
          {isLight ? <SunIcon /> : <MoonIcon />}
        </span>
      </span>
    </button>
  );
}
