import { useEffect, useRef } from 'react';
import { PROFILE } from '../data/portfolio.js';

/** small seeded RNG so the bubble layout is the same on every render */
function mulberry32(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const BOX = { w: 640, h: 170 }; // the cluster's design size in px

/**
 * Glass bubbles for the bottom-right corner: mostly small with a few big ones,
 * packed toward the right edge, without piling on top of each other.
 * `mix` = how orange (100) or blue (0) the bubble's glow is, following the glow behind it.
 */
const BUBBLES = (() => {
  const rnd = mulberry32(11);
  const out = [];
  let tries = 0;
  while (out.length < 30 && tries++ < 3000) {
    const size = Math.round(14 + Math.pow(rnd(), 1.9) * 54);
    const cx = BOX.w * (1 - Math.pow(rnd(), 1.7)) * 0.97 + size / 2 * 0.1;
    const cy = size / 2 + rnd() * (BOX.h - size);
    const clear = out.every((o) => Math.hypot(o.cx - cx, o.cy - cy) > (o.size + size) * 0.56);
    if (!clear) continue;
    out.push({
      cx,
      cy,
      size,
      mix: Math.round(100 - (cx / BOX.w) * 100),
      dur: +(6 + rnd() * 4.5).toFixed(1),
      delay: +(-rnd() * 8).toFixed(1),
    });
  }
  return out;
})();

/**
 * Interactive bubbles.
 *  - idle: each bubble drifts on its own slow orbit around its home spot
 *  - cursor: gently pushes bubbles aside; a fast swipe flicks them
 *  - click / tap: pops the bubble (ring + droplets), neighbours get a shock wave,
 *    and the bubble re-forms a couple of seconds later
 * Everything runs in one requestAnimationFrame loop that only runs while the
 * footer is on screen, and writes transforms straight to the DOM (no React state).
 */
function BubbleField() {
  const boxRef = useRef(null);
  const elRefs = useRef([]);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return undefined;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const rnd = mulberry32(5);
    const sim = BUBBLES.map((b, i) => ({
      ...b,
      i,
      x: 0, y: 0, hx: 0, hy: 0, r: 8, vx: 0, vy: 0,
      fx: 0.5 + rnd() * 0.7, fy: 0.4 + rnd() * 0.6, ph: rnd() * 6.28, ph2: rnd() * 6.28,
      popped: false, ready: false, timers: [],
    }));
    const pointer = { x: -9999, y: -9999, vx: 0, vy: 0, active: false };
    let scale = 1;
    let raf = 0;
    let last = 0;
    let t = 0;

    const place = (s) => {
      const el = elRefs.current[s.i];
      if (el) el.style.transform = `translate3d(${(s.x - s.r).toFixed(1)}px, ${(s.y - s.r).toFixed(1)}px, 0)`;
    };

    const layout = () => {
      const rect = box.getBoundingClientRect();
      scale = rect.width / BOX.w;
      sim.forEach((s) => {
        s.r = Math.max(6, (s.size * scale) / 2);
        s.hx = s.cx * scale;
        s.hy = s.cy * scale;
        if (!s.ready) {
          s.x = s.hx;
          s.y = s.hy;
          s.ready = true;
        }
        const el = elRefs.current[s.i];
        if (el) {
          el.style.width = `${s.r * 2}px`;
          el.style.height = `${s.r * 2}px`;
        }
        place(s);
      });
    };

    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.033, (now - last) / 1000 || 0.016);
      last = now;
      t += dt;

      const rect = box.getBoundingClientRect();
      const px = pointer.x - rect.left;
      const py = pointer.y - rect.top;
      const near = pointer.active && px > -160 && px < rect.width + 160 && py > -160 && py < rect.height + 160;
      const k = Math.max(scale, 0.6);

      for (const s of sim) {
        if (s.popped) continue;
        // where the bubble "wants" to be: home + a slow drift
        const tx = s.hx + Math.sin(t * s.fx + s.ph) * 3.5 * k;
        const ty = s.hy + Math.sin(t * s.fy + s.ph2) * 8 * k;
        let ax = (tx - s.x) * 16;
        let ay = (ty - s.y) * 16;

        if (near) {
          const dx = s.x - px;
          const dy = s.y - py;
          const d = Math.hypot(dx, dy) || 0.001;
          const reach = 70 * k + s.r * 1.6;
          if (d < reach) {
            const f = 1 - d / reach;
            ax += (dx / d) * f * 330 * k; // nudge aside…
            ay += (dy / d) * f * 330 * k;
            ax += pointer.vx * f * 0.55; // …and flick with the swipe
            ay += pointer.vy * f * 0.55;
          }
        }
        s.vx += ax * dt;
        s.vy += ay * dt;
        const damp = Math.exp(-5.2 * dt);
        s.vx *= damp;
        s.vy *= damp;
      }

      // bubbles shouldn't sink into each other
      for (let a = 0; a < sim.length; a++) {
        const A = sim[a];
        if (A.popped) continue;
        for (let b = a + 1; b < sim.length; b++) {
          const B = sim[b];
          if (B.popped) continue;
          const dx = B.x - A.x;
          const dy = B.y - A.y;
          const d = Math.hypot(dx, dy) || 0.001;
          const min = (A.r + B.r) * 1.02;
          if (d < min) {
            const push = (min - d) * 0.5;
            const nx = dx / d;
            const ny = dy / d;
            A.x -= nx * push; A.y -= ny * push;
            B.x += nx * push; B.y += ny * push;
            A.vx -= nx * push * 6; A.vy -= ny * push * 6;
            B.vx += nx * push * 6; B.vy += ny * push * 6;
          }
        }
      }

      for (const s of sim) {
        if (s.popped) continue;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        place(s);
      }
      pointer.vx *= 0.82;
      pointer.vy *= 0.82;
    };

    const pop = (i) => {
      const s = sim[i];
      const el = elRefs.current[i];
      if (!s || !el || s.popped) return;
      s.popped = true;
      el.classList.remove('is-respawn');
      el.classList.add('is-popped');

      // droplets
      const n = 8;
      for (let d = 0; d < n; d++) {
        const ang = (d / n) * Math.PI * 2 + Math.random() * 0.6;
        const dist = s.r * (1.2 + Math.random() * 1.1) + 10;
        const drop = document.createElement('i');
        drop.className = 'ft-drop';
        drop.style.cssText = `left:${s.x}px;top:${s.y}px;width:${3 + Math.random() * 4}px;height:${3 + Math.random() * 4}px;--dx:${Math.cos(ang) * dist}px;--dy:${Math.sin(ang) * dist}px;--mix:${s.mix}%`;
        drop.addEventListener('animationend', () => drop.remove());
        box.appendChild(drop);
      }

      // shock wave for the neighbours
      const reach = s.r * 4 + 70 * Math.max(scale, 0.6);
      for (const o of sim) {
        if (o === s || o.popped) continue;
        const dx = o.x - s.x;
        const dy = o.y - s.y;
        const d = Math.hypot(dx, dy) || 0.001;
        if (d < reach) {
          const f = 1 - d / reach;
          o.vx += (dx / d) * f * 260;
          o.vy += (dy / d) * f * 260;
        }
      }

      // re-form after a while
      const wait = 2200 + Math.random() * 1800;
      s.timers.push(
        window.setTimeout(() => {
          s.popped = false;
          s.x = s.hx;
          s.y = s.hy;
          s.vx = 0;
          s.vy = 0;
          place(s);
          el.classList.remove('is-popped');
          el.classList.add('is-respawn');
          s.timers.push(window.setTimeout(() => el.classList.remove('is-respawn'), 800));
        }, wait)
      );
    };

    const onDown = (e) => {
      const el = e.target.closest && e.target.closest('.ft-bubble');
      if (el) pop(Number(el.dataset.i));
    };
    let lastMove = 0;
    const onMove = (e) => {
      const now = performance.now();
      const dt = Math.max(8, now - lastMove) / 1000;
      if (pointer.active) {
        pointer.vx = Math.max(-1800, Math.min(1800, (e.clientX - pointer.x) / dt)) * 0.35 + pointer.vx * 0.65;
        pointer.vy = Math.max(-1800, Math.min(1800, (e.clientY - pointer.y) / dt)) * 0.35 + pointer.vy * 0.65;
      }
      lastMove = now;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    };
    const onLeave = () => {
      pointer.active = false;
    };

    const start = () => {
      if (!raf && !reduce) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    layout();
    box.addEventListener('pointerdown', onDown);
    window.addEventListener('resize', layout, { passive: true });
    let io;
    if (!reduce) {
      window.addEventListener('pointermove', onMove, { passive: true });
      document.addEventListener('mouseleave', onLeave);
      window.addEventListener('pointerup', (e) => e.pointerType === 'touch' && onLeave());
      io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0 });
      io.observe(box);
    }

    return () => {
      stop();
      io?.disconnect();
      box.removeEventListener('pointerdown', onDown);
      window.removeEventListener('resize', layout);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      sim.forEach((s) => s.timers.forEach((id) => clearTimeout(id)));
    };
  }, []);

  return (
    <div className="ft-bubbles" ref={boxRef} aria-hidden="true">
      {BUBBLES.map((b, i) => (
        <span
          key={i}
          className="ft-bubble"
          data-i={i}
          data-cursor="pointer"
          ref={(el) => (elRefs.current[i] = el)}
          style={{ '--mix': `${b.mix}%` }}
        >
          <span className="ft-glass" />
        </span>
      ))}
    </div>
  );
}

export default function Footer() {
  const thanksRef = useRef(null);
  const year = new Date().getFullYear();

  useEffect(() => {
    const el = thanksRef.current;
    if (!el || !('IntersectionObserver' in window)) {
      el?.classList.add('is-in');
      return undefined;
    }
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && el.classList.add('is-in'), { threshold: 0.6 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <footer className="site-footer ft">
      <div className="ft-glow" aria-hidden="true" />

      <div className="container ft-inner">
        <div className="ft-thanks" ref={thanksRef}>
          <span className="ft-rule ft-rule-l" aria-hidden="true" />
          <p className="ft-thanks-text">Have a nice day</p>
          <span className="ft-rule ft-rule-r" aria-hidden="true" />
        </div>

        <div className="ft-bar">
          <span>
            © {year} {PROFILE.name}. All rights reserved.
          </span>
          <span>Built with code. Driven by curiosity.</span>
        </div>

        <BubbleField />

        <p className="ft-hint">
          Click to pop the bubble
        </p>
      </div>
    </footer>
  );
}
