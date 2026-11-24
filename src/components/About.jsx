import { useEffect, useRef } from 'react';
import WaveText from './WaveText.jsx';
import { ABOUT, PROFILE } from '../data/portfolio.js';

/** Poster-style About Me: giant title, cut-out portrait, script signature, bio, links. */
export default function About() {
  const cardRef = useRef(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el || !('IntersectionObserver' in window)) {
      el?.classList.add('is-in');
      return undefined;
    }
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && el.classList.add('is-in'), { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="about-section" id="about">
      <div className="container">
        <div className="about-card" ref={cardRef}>
          <WaveText as="h2" className="about-title" text={ABOUT.title} amp={0.11} radius={0.75} />

          <div className={`about-portrait${ABOUT.portraitIsPhoto ? ' about-portrait--photo' : ''}`}>
            <img src={ABOUT.portrait} alt={`${PROFILE.name} portrait`} draggable="false" />
          </div>

          <WaveText as="p" className="about-script" text={PROFILE.name} amp={0.12} radius={1} />
          <WaveText as="p" className="about-bio" text={ABOUT.bio} amp={0.35} radius={4.5} />

          <div className="about-foot">
            <a href={PROFILE.github} target="_blank" rel="noopener noreferrer">GitHub</a>
            <span className="about-sparks" aria-hidden="true">✦ ✦ ✦</span>
            <a href={`mailto:${PROFILE.email}`}>Email</a>
          </div>
        </div>
      </div>
    </section>
  );
}
