import { Fragment, useMemo, useRef } from 'react';

/**
 * Text whose letters ripple up around the cursor ("wave hover").
 * Each letter is lifted by a smooth bell curve of its distance to the pointer,
 * so the wave follows the mouse across the text and settles when it leaves.
 *
 *  amp     – max lift, in em (scales with the text size)
 *  radius  – how far the wave reaches, in em
 */
export default function WaveText({ text, as: Tag = 'span', className = '', amp = 0.12, radius = 0.8 }) {
  const charRefs = useRef([]);
  const raf = useRef(0);
  const last = useRef({ x: 0, y: 0 });

  const words = useMemo(() => {
    let n = 0;
    return text.split(' ').map((w) => ({
      key: `${w}-${n}`,
      chars: [...w].map((c) => ({ c, i: n++ })),
    }));
  }, [text]);

  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const apply = () => {
    raf.current = 0;
    const { x, y } = last.current;
    const els = charRefs.current;
    // read first, write after — one layout pass
    const fs = parseFloat(getComputedStyle(els[0]?.parentElement?.parentElement || document.body).fontSize) || 16;
    const ampPx = amp * fs;
    const rad = radius * fs;
    const rects = els.map((el) => el && el.getBoundingClientRect());
    els.forEach((el, i) => {
      if (!el) return;
      const r = rects[i];
      const dx = x - (r.left + r.width / 2);
      const dy = y - (r.top + r.height / 2);
      const w = Math.exp(-((dx * dx + dy * dy) / (rad * rad)));
      el.style.transform = `translateY(${(-ampPx * w).toFixed(2)}px) scale(${(1 + 0.1 * w).toFixed(3)})`;
      el.style.setProperty('--w', w.toFixed(3));
    });
  };

  const onMove = (e) => {
    if (reduce) return;
    last.current = { x: e.clientX, y: e.clientY };
    if (!raf.current) raf.current = requestAnimationFrame(apply);
  };

  const onLeave = () => {
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = 0;
    charRefs.current.forEach((el) => {
      if (!el) return;
      el.style.transform = '';
      el.style.setProperty('--w', '0');
    });
  };

  return (
    <Tag className={`wave-text ${className}`} aria-label={text} onPointerMove={onMove} onPointerLeave={onLeave}>
      {words.map((word, wi) => (
        <Fragment key={word.key}>
          <span className="wave-word" aria-hidden="true">
            {word.chars.map(({ c, i }) => (
              <span className="wave-char" key={i} ref={(el) => (charRefs.current[i] = el)}>
                {c}
              </span>
            ))}
          </span>
          {wi < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </Tag>
  );
}
