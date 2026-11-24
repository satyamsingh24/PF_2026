import { useEffect, useRef } from 'react';
import { PROFILE } from '../data/portfolio.js';

/**
 * Interactive avatar — 3 layers (base / pupils / eyelid mask).
 * Pupils follow the cursor, the whole head tilts slightly in 3D, and it blinks.
 */
const EYES = [
  { key: 'left', cx: 0.421, cy: 0.408 },
  { key: 'right', cx: 0.578, cy: 0.414 },
];
const MAX_H = 0.016;
const MAX_V = 0.014;
const LERP = 0.14;
const MAX_TILT = 6;

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

export default function Avatar() {
  const frameRef = useRef(null);
  const containerRef = useRef(null);
  const pupilRefs = useRef({});

  useEffect(() => {
    const frame = frameRef.current;
    const container = containerRef.current;
    if (!frame || !container) return undefined;

    const cur = EYES.map(() => ({ x: 0, y: 0 }));
    let tiltX = 0;
    let tiltY = 0;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let rafId = 0;
    let blinkTimer = 0;
    let blinkEnd = 0;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    const onTouchMove = (e) => {
      if (e.touches.length) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
      }
    };
    const onTouchEnd = () => {
      mouseX = window.innerWidth / 2;
      mouseY = window.innerHeight / 2;
    };

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const rect = frame.getBoundingClientRect();
      if (rect.width === 0) return;

      EYES.forEach((eye, i) => {
        const el = pupilRefs.current[eye.key];
        if (!el) return;
        const eyePxX = rect.left + rect.width * eye.cx;
        const eyePxY = rect.top + rect.height * eye.cy;
        const dx = mouseX - eyePxX;
        const dy = mouseY - eyePxY;
        const dist = Math.hypot(dx, dy);
        const angle = Math.atan2(dy, dx);
        const strength = Math.min(dist / (rect.width * 1.2), 1);

        const tx = clamp(Math.cos(angle) * MAX_H * strength, -MAX_H, MAX_H);
        const ty = clamp(Math.sin(angle) * MAX_V * strength, -MAX_V, MAX_V);

        cur[i].x += (tx - cur[i].x) * LERP;
        cur[i].y += (ty - cur[i].y) * LERP;

        el.style.left = ((eye.cx + cur[i].x) * 100).toFixed(3) + '%';
        el.style.top = ((eye.cy + cur[i].y) * 100).toFixed(3) + '%';
      });

      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const nx = clamp((mouseX - cx) / (window.innerWidth / 2), -1, 1);
      const ny = clamp((mouseY - cy) / (window.innerHeight / 2), -1, 1);
      tiltX += (-ny * MAX_TILT - tiltX) * LERP;
      tiltY += (nx * MAX_TILT - tiltY) * LERP;
      container.style.transform = `perspective(900px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg)`;
    };

    const scheduleBlink = () => {
      blinkTimer = window.setTimeout(() => {
        frame.classList.add('is-blinking');
        blinkEnd = window.setTimeout(() => {
          frame.classList.remove('is-blinking');
          scheduleBlink();
        }, 160);
      }, 3500 + Math.random() * 3000);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    animate();
    scheduleBlink();

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(blinkTimer);
      clearTimeout(blinkEnd);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  return (
    <div className="interactive-avatar-container" id="interactiveAvatar" ref={containerRef}>
      <div className="avatar-circle-frame avatar-image-frame" ref={frameRef}>
        <img
          src="/assets/avatar-base.png"
          alt={`${PROFILE.name} avatar`}
          className="avatar-img-layer avatar-base-layer"
          fetchPriority="high"
          draggable="false"
        />
        <div className="avatar-pupil-layer">
          {EYES.map((eye) => (
            <img
              key={eye.key}
              ref={(el) => (pupilRefs.current[eye.key] = el)}
              src="/assets/avatar-pupil.png"
              alt=""
              aria-hidden="true"
              draggable="false"
              className={`pupil-sprite ${eye.key}-pupil`}
            />
          ))}
        </div>
        <img
          src="/assets/avatar-mask.png"
          alt=""
          aria-hidden="true"
          className="avatar-img-layer avatar-mask-layer"
          draggable="false"
        />
      </div>
    </div>
  );
}
