import { useEffect, useRef } from 'react';
import { EDUCATION, EDUCATION_INTRO, navItem, navNumber } from '../data/portfolio.js';
import { VB, NIB_D, HOLE, SLIT, ROAD_D, DASHES, WALKERS } from './education/geometry.js';

const ROAD_TOP = 303; // y where the road leaves the nib tip

/** card positions (% of the illustration), taken from the reference layout */
const CARD_POS = [
  { left: '16.6%', top: '36.6%', width: '27.6%' },
  { left: '60.4%', top: '49.1%', width: '24.6%' },
  { left: '22.8%', top: '72.4%', width: '22.6%' },
];

/** side-on walking silhouette, 100 units tall, feet at (0,0), facing +x */
function Walker({ w, refCb }) {
  const s = w.h / 100;
  const [sx, sy, srx, sry] = w.shadow;
  return (
    <g ref={refCb} className="edu-walker" transform={`translate(${w.x} ${w.y})`}>
      <ellipse className="edu-shadow" cx={sx} cy={sy} rx={srx} ry={sry} filter="url(#edu-blur)" />
      <g transform={`scale(${w.flip ? -s : s} ${s})`} className="edu-body">
        <ellipse cx="4" cy="-92" rx="6.8" ry="7.8" />
        <path d="M-8 -84 C-3 -89 9 -89 12 -83 L13 -52 C8 -46 -5 -46 -9 -52 Z" />
        <path className="limb" d="M-2 -81 L-12 -64 L-13 -50" strokeWidth="5.5" />
        <path className="limb" d="M7 -81 L15 -66 L20 -54" strokeWidth="5.5" />
        <path className="limb" d="M-3 -50 L-10 -28 L-21 -6 L-14 -2" strokeWidth="7.5" />
        <path className="limb" d="M4 -50 L11 -28 L13 -5 L23 -2" strokeWidth="7.5" />
      </g>
    </g>
  );
}

export default function Education() {
  const svgRef = useRef(null);
  const clipRef = useRef(null);
  const walkerRefs = useRef([]);
  const cardRefs = useRef([]);

  // unroll the road as the section scrolls into view; figures + cards appear as it reaches them
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;

    // p: 0..1 -> `front` = how far down (artwork units) the road has been unrolled
    const apply = (p) => {
      const front = ROAD_TOP + p * (VB.h + 40 - ROAD_TOP);
      if (clipRef.current) clipRef.current.setAttribute('height', front.toFixed(1));
      walkerRefs.current.forEach((el, i) => el && el.classList.toggle('is-in', front >= WALKERS[i].y - 6));
      // the three cards belong to the three lower walkers
      cardRefs.current.forEach((el, i) => el && el.classList.toggle('is-in', front >= WALKERS[i + 1].y - 50));
    };

    const update = () => {
      raf = 0;
      const svg = svgRef.current;
      if (!svg) return;
      const r = svg.getBoundingClientRect();
      const roadTop = r.top + r.height * (303 / VB.h);
      const p = Math.min(1, Math.max(0, (window.innerHeight * 0.8 - roadTop) / (r.height * 0.58)));
      apply(p);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    if (reduce) {
      apply(1);
      return undefined;
    }
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
    <section className="edu-section" id="education">
      <div className="container">
        <h2 className="sr-only">{EDUCATION_INTRO.title.join(' ')}</h2>

        <div className="edu-stage">
          <div className="edu-kicker">
            <span className="edu-kicker-dot" />
            {navNumber('education')} / {navItem('education').kicker.split(' ')[0].toUpperCase()}
          </div>

          <svg
            ref={svgRef}
            className="edu-svg"
            viewBox={`0 0 ${VB.w} ${VB.h}`}
            role="img"
            aria-label="A fountain-pen nib drawing a winding road, with three milestones: MCA, BCA and DevOps certification"
          >
            <defs>
              <filter id="edu-blur" x="-50%" y="-200%" width="200%" height="500%">
                <feGaussianBlur stdDeviation="2.2" />
              </filter>
              <clipPath id="edu-reveal">
                <rect ref={clipRef} x="0" y="0" width={VB.w} height="0" />
              </clipPath>
            </defs>

            {/* pen nib */}
            <path className="edu-red" d={NIB_D} />
            <circle className="edu-cutout" cx={HOLE.cx} cy={HOLE.cy} r={HOLE.r} />
            <line className="edu-cutout-line" x1={SLIT.x} y1={SLIT.y1} x2={SLIT.x} y2={SLIT.y2} />

            {/* road + dashes (unrolled top-down by the clip) */}
            <g clipPath="url(#edu-reveal)">
              <path className="edu-red" d={ROAD_D} />
              {DASHES.map((d, i) => (
                <path key={i} className="edu-dash" d={d.d} strokeWidth={d.sw} />
              ))}
            </g>

            {WALKERS.map((w, i) => (
              <Walker key={i} w={w} refCb={(el) => (walkerRefs.current[i] = el)} />
            ))}
          </svg>

          {EDUCATION.map((e, i) => (
            <article
              key={e.degree}
              className="edu-note"
              style={CARD_POS[i]}
              ref={(el) => (cardRefs.current[i] = el)}
            >
              <div className="edu-note-year">{e.year}</div>
              <h3>{e.degree}</h3>
              <p>{e.institution}</p>
              <div className="edu-note-score">
                <strong>{e.score}</strong>
                <span>{e.scoreLabel}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
