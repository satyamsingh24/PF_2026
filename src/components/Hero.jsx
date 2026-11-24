import Avatar from './Avatar.jsx';
import { HERO, PROFILE } from '../data/portfolio.js';

/** Landing: intro text | animated avatar | bio text. */
export default function Hero() {
  return (
    <section className="hero-section" id="hero" aria-label={PROFILE.name}>
      <div className="hero-layout">
        <div className="hero-left-intro">
          <h1 className="hero-greeting-title">{PROFILE.greeting}</h1>
          <p className="hero-role-subtitle">{PROFILE.role}</p>
        </div>

        <Avatar />

        <div className="hero-right-intro">
          <p className="hero-bio-text">{HERO.bio}</p>
        </div>
      </div>
    </section>
  );
}
