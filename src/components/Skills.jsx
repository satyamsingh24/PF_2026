import { useEffect, useRef, useState } from 'react';
import SectionHead from './SectionHead.jsx';
import { SKILLS, SKILLS_INTRO } from '../data/portfolio.js';

/* wheel geometry (viewBox 700 x 700) */
const CX = 350;
const CY = 350;
const R_OUT = 320;
const R_IN = 224;
const R_MID = (R_OUT + R_IN) / 2;

/** point at `deg` degrees clockwise from 12 o'clock */
const pt = (r, deg) => {
  const a = (deg * Math.PI) / 180;
  return [CX + r * Math.sin(a), CY - r * Math.cos(a)];
};
const f = (n) => n.toFixed(1);

function sectorPath(i, n) {
  const step = 360 / n;
  const a0 = i * step - step / 2;
  const a1 = i * step + step / 2;
  const [x0, y0] = pt(R_OUT, a0);
  const [x1, y1] = pt(R_OUT, a1);
  const [x2, y2] = pt(R_IN, a1);
  const [x3, y3] = pt(R_IN, a0);
  return `M${f(x0)} ${f(y0)} A${R_OUT} ${R_OUT} 0 0 1 ${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)} A${R_IN} ${R_IN} 0 0 0 ${f(x3)} ${f(y3)} Z`;
}

/** accent arc along the outer edge of a segment (shown for the active one) */
function edgePath(i, n) {
  const step = 360 / n;
  const [x0, y0] = pt(R_OUT, i * step - step / 2 + 3);
  const [x1, y1] = pt(R_OUT, i * step + step / 2 - 3);
  return `M${f(x0)} ${f(y0)} A${R_OUT} ${R_OUT} 0 0 1 ${f(x1)} ${f(y1)}`;
}

export default function Skills() {
  const [active, setActive] = useState(0);
  const wheelRef = useRef(null);
  const n = SKILLS.length;
  const group = SKILLS[active];

  useEffect(() => {
    const el = wheelRef.current;
    if (!el || !('IntersectionObserver' in window)) {
      el?.classList.add('is-in');
      return undefined;
    }
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && el.classList.add('is-in'), { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const select = (i) => () => setActive(i);

  const chips = group.items.map((item, i) => (
    <span key={item} style={{ animationDelay: `${i * 35}ms` }}>
      {item}
    </span>
  ));

  return (
    <section className="section-shell skills-section" id="skills">
      <div className="container">
        <SectionHead navId="skills" title={SKILLS_INTRO.title} lead={SKILLS_INTRO.lead} />

        <div className="sk-wheel" ref={wheelRef}>
          <svg className="sk-svg" viewBox="0 0 700 700" role="group" aria-label="Skill categories">
            {SKILLS.map((g, i) => (
              <path
                key={g.id}
                className={`sk-seg${i === active ? ' is-active' : ''}`}
                d={sectorPath(i, n)}
                role="button"
                tabIndex={0}
                aria-label={`${g.title} — ${g.items.length} skills`}
                aria-pressed={i === active}
                onPointerEnter={select(i)}
                onFocus={select(i)}
                onClick={select(i)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActive(i);
                  }
                }}
              />
            ))}

            {/* outlines drawn over the segments */}
            <circle className="sk-ring" cx={CX} cy={CY} r={R_OUT} />
            <circle className="sk-ring" cx={CX} cy={CY} r={R_IN} />
            <path className="sk-edge" d={edgePath(active, n)} key={`edge-${active}`} />

            {SKILLS.map((g, i) => {
              const [x, y] = pt(R_MID, (i * 360) / n);
              return (
                <text key={g.id} className={`sk-label${i === active ? ' is-active' : ''}`} x={x} y={y} textAnchor="middle">
                  {g.lines.map((line, li) => (
                    <tspan key={line} x={x} dy={li === 0 ? `${-(g.lines.length - 1) * 0.55 + 0.35}em` : '1.1em'}>
                      {line}
                    </tspan>
                  ))}
                </text>
              );
            })}
          </svg>

          {/* centre: details of the hovered segment */}
          <div className="sk-center" aria-live="polite">
            <div className="sk-center-body" key={group.id}>
              <span className="sk-kicker">
                {group.lines.join(' ')} · {group.items.length} skills
              </span>
              <h3 className="sk-title">{group.title}</h3>
              <div className="sk-chips sk-chips-center">{chips}</div>
            </div>
          </div>
        </div>

        {/* small screens: the list sits under the wheel instead of inside it */}
        <div className="sk-panel" key={`panel-${group.id}`}>
          <div className="sk-chips">{chips}</div>
        </div>

        <p className="sk-hint">Hover or tap a segment to explore</p>
      </div>
    </section>
  );
}
