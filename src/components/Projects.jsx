import { useEffect, useRef } from 'react';
import ProjectCard from './ProjectCard.jsx';
import { PROJECTS, PROJECTS_INTRO } from '../data/portfolio.js';

/**
 * Sticky stacking cards.
 * Each card pins near the top (CSS `position: sticky`); as the next card slides
 * over it, the covered card shrinks and dims a little — that progress is written
 * to `--p` on every card (sum of the progress of all cards stacked above it).
 */
export default function Projects() {
  const titleRef = useRef(null);
  const cardRefs = useRef([]);

  // title reveal
  useEffect(() => {
    const el = titleRef.current;
    if (!el || !('IntersectionObserver' in window)) {
      el?.classList.add('is-in');
      return undefined;
    }
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && el.classList.add('is-in'),
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // scroll-driven stacking depth
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 901px)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    let raf = 0;

    const update = () => {
      raf = 0;
      const cards = cardRefs.current.filter(Boolean);
      if (!desktop.matches || reduce.matches) {
        cards.forEach((c) => c.style.setProperty('--p', '0'));
        return;
      }
      const vh = window.innerHeight;
      const start = vh * 0.85; // a card starts covering the previous one around here
      const tops = cards.map((c) => c.getBoundingClientRect().top);
      const stick = cards.map((c) => parseFloat(getComputedStyle(c).top) || 0);

      cards.forEach((c, i) => {
        let depth = 0;
        for (let j = i + 1; j < cards.length; j++) {
          const span = Math.max(1, start - stick[j]);
          depth += Math.min(1, Math.max(0, (start - tops[j]) / span));
        }
        c.style.setProperty('--p', depth.toFixed(3));
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <section className="ps-section" id="projects">
      <div className="container">
        <h2 className="ps-title" ref={titleRef}>
          {PROJECTS_INTRO.title}
        </h2>

        <div className="ps-stack">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} cardRef={(el) => (cardRefs.current[i] = el)} />
          ))}
        </div>
      </div>
    </section>
  );
}
