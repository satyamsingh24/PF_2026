import { useEffect, useRef, useState } from 'react';

const pad = (n) => String(n).padStart(2, '0');

/** "Visit Live Site" -> LIVE PROJECT, "Watch Demo" -> WATCH DEMO, anything else -> GITHUB */
const pillLabel = (l) => {
  if (/live/i.test(l.label)) return 'Live Project';
  if (/demo/i.test(l.label)) return 'Watch Demo';
  return 'GitHub';
};
const pillRank = (l) => ['Live Project', 'Watch Demo', 'GitHub'].indexOf(pillLabel(l));

function Mockup({ m, hasVideo }) {
  return (
    <div className="media-mockup-fallback">
      <div className="mockup-header-area">
        {m.logo ? (
          <img src={m.logo} alt="" style={{ height: 38, width: 'auto', objectFit: 'contain' }} />
        ) : (
          <div className="mockup-icon-box">{m.icon}</div>
        )}
        {hasVideo && (
          <div className="mockup-video-pill">
            <span>▶</span> <span>Demo Video Ready</span>
          </div>
        )}
      </div>

      <div className="mockup-center-visual">
        {m.type === 'waveform' && (
          <>
            <div className="audio-waveform-bars" aria-hidden="true">
              {Array.from({ length: 9 }, (_, i) => (
                <span className="wave-bar" key={i} />
              ))}
            </div>
            <div className="mockup-snippet">{m.query}</div>
          </>
        )}
        {m.type === 'hud' && (
          <div className="attendance-hud-grid">
            {m.tiles.map(([v, l]) => (
              <div className="hud-tile" key={l}>
                <strong>{v}</strong>
                <small>{l}</small>
              </div>
            ))}
          </div>
        )}
        {m.type === 'quote' && (
          <div className="mockup-snippet" style={{ color: m.color }}>
            {m.quote}
          </div>
        )}
        {m.type === 'bars' && (
          <div className="csv-chart-preview" aria-hidden="true">
            {m.bars.map((h, i) => (
              <span className="csv-bar" key={i} style={{ height: h }} />
            ))}
          </div>
        )}
      </div>

      <div className="mockup-footer-note">
        <span>{m.left}</span>
        <strong>{m.right}</strong>
      </div>
    </div>
  );
}

/**
 * Stacking project card:  [01]  CATEGORY / Title ............ [LIVE PROJECT]
 *                         [ big media tile ][ about tile ]
 *                         [                 ][ facts tile ]
 */
const ProjectCard = ({ project, index, cardRef }) => {
  const videoRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [playing, setPlaying] = useState(false);

  // play only while on screen
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !('IntersectionObserver' in window)) return undefined;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (v.readyState >= 1) v.play().catch(() => {});
        } else {
          v.pause();
        }
      },
      { threshold: 0.25 }
    );
    obs.observe(v);
    return () => obs.disconnect();
  }, []);

  const showVideo = () => {
    setLoaded(true);
    videoRef.current?.play().catch(() => {});
  };
  const togglePlay = (e) => {
    e?.stopPropagation();
    const v = videoRef.current;
    if (!v || !loaded) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };
  const fullscreen = (e) => {
    e.stopPropagation();
    const v = videoRef.current;
    (v?.requestFullscreen || v?.webkitRequestFullscreen)?.call(v);
  };

  const links = [...project.links].sort((a, b) => pillRank(a) - pillRank(b));

  return (
    <article className="ps-card" ref={cardRef} style={{ '--i': index }} data-project={project.id}>
      <header className="ps-head">
        <span className="ps-num">{pad(index + 1)}</span>
        <div className="ps-label">
          <strong>{project.category}</strong>
          <span>{project.title}</span>
        </div>
        <div className="ps-pills">
          {links.length === 0 && project.period && <span className="ps-pill">{project.period}</span>}
          {links.map((l) => (
            <a key={l.href} className="ps-pill" href={l.href} target="_blank" rel="noopener noreferrer">
              {pillLabel(l)} <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </header>

      <div className="ps-body">
        <div className="ps-tile ps-media">
          <div className="media-viewport ps-viewport">
            {project.video && <video
              ref={videoRef}
              className={`project-video${loaded ? ' is-loaded' : ''}`}
              src={project.video}
              loop
              muted
              playsInline
              preload="metadata"
              onLoadedMetadata={showVideo}
              onCanPlay={showVideo}
              onPlaying={() => {
                setLoaded(true);
                setPlaying(true);
              }}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onError={() => {
                setLoaded(false);
                setPlaying(false);
              }}
              onClick={togglePlay}
            />}
            {!loaded && <Mockup m={project.mockup} hasVideo={Boolean(project.video)} />}
          </div>
          <span className="ps-badge">
            <span className="indicator-pulse" />
            {project.badge}
          </span>
          {loaded && (
            <div className="ps-controls">
              <button onClick={togglePlay} aria-label="Toggle play / pause">{playing ? '⏸' : '▶'}</button>
              <button onClick={fullscreen} aria-label="Fullscreen">⤢</button>
            </div>
          )}
        </div>

        <div className="ps-tile ps-about">
          <h3>{project.subtitle}</h3>
          <p>{project.description}</p>
        </div>

        <div className="ps-tile ps-facts">
          <div className="ps-metrics">
            {project.highlights.map(([k, v]) => (
              <div key={k}>
                <small>{k}</small>
                <strong>{v}</strong>
              </div>
            ))}
          </div>
          <div className="ps-tags">
            {project.tags.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
