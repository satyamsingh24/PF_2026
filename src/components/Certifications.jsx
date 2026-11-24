import { useEffect, useRef, useState } from 'react';
import SectionHead from './SectionHead.jsx';
import { CERTIFICATIONS, CERTIFICATIONS_INTRO } from '../data/portfolio.js';

/** Full-size certificate viewer: Esc / backdrop click / ✕ to close. */
function Viewer({ cert, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div className="cert-viewer" role="dialog" aria-modal="true" aria-label={cert.title} onClick={onClose}>
      <div className="cert-viewer-panel" onClick={(e) => e.stopPropagation()}>
        <button className="cert-viewer-close" ref={closeRef} onClick={onClose} aria-label="Close certificate">
          ✕
        </button>
        <img src={cert.image} alt={`${cert.title} — ${cert.issuer} certificate`} />
        <div className="cert-viewer-bar">
          <div>
            <strong>{cert.title}</strong>
            <span>
              {cert.issuer} · {cert.date}
            </span>
          </div>
          <div className="cert-viewer-links">
            {cert.verify && (
              <a href={cert.verify} target="_blank" rel="noopener noreferrer">
                Verify on Credly ↗
              </a>
            )}
            <a href={cert.file} target="_blank" rel="noopener noreferrer">
              Open original ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Certifications() {
  const [open, setOpen] = useState(null);

  return (
    <section className="section-shell certifications-section" id="certifications">
      <div className="container">
        <SectionHead navId="certifications" title={CERTIFICATIONS_INTRO.title} lead={CERTIFICATIONS_INTRO.lead} />

        {CERTIFICATIONS.length > 0 ? (
          <div className="cert-grid">
            {CERTIFICATIONS.map((c) => (
              <article className="cert-card" key={c.id}>
                {c.image ? (
                  <button className="cert-thumb" onClick={() => setOpen(c)} aria-label={`View ${c.title} certificate`}>
                    <img src={c.image} alt="" loading="lazy" draggable="false" />
                    <span className="cert-thumb-hint">View certificate</span>
                  </button>
                ) : (
                  <div className="cert-thumb cert-thumb-placeholder" aria-hidden="true">
                    <span className="cert-placeholder-issuer">{c.issuer}</span>
                    <strong>{c.title}</strong>
                    <span className="cert-placeholder-date">{c.date}</span>
                  </div>
                )}

                <div className="cert-body">
                  <div className="cert-meta-row">
                    <span className="cert-issuer">{c.issuer}</span>
                    <span className="cert-date">{c.date}</span>
                  </div>
                  <h3 className="cert-title">{c.title}</h3>
                  <p className="cert-type">{c.type}</p>

                  <div className="cert-facts">
                    {c.facts.map((f) => (
                      <span key={f}>{f}</span>
                    ))}
                  </div>

                  <div className="cert-links">
                    {c.image && (
                      <button className="cert-link-btn" onClick={() => setOpen(c)}>
                        View
                      </button>
                    )}
                    {c.verify && (
                      <a className="cert-link-btn" href={c.verify} target="_blank" rel="noopener noreferrer">
                        Verify <span aria-hidden="true">↗</span>
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="cert-empty">Certifications are being added — check back soon.</div>
        )}
      </div>

      {open && <Viewer cert={open} onClose={() => setOpen(null)} />}
    </section>
  );
}
