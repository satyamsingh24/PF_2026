import { useEffect, useState } from 'react';

/** Returns the id of the section currently in view (null while on the landing hero). */
export default function useScrollSpy(ids) {
  const [active, setActive] = useState(null);

  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length || !('IntersectionObserver' in window)) return undefined;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-25% 0px -45% 0px' }
    );
    els.forEach((el) => obs.observe(el));

    // back on the landing hero -> clear highlight
    const hero = document.getElementById('hero');
    const heroObs = hero
      ? new IntersectionObserver(
          ([e]) => e.isIntersecting && setActive(null),
          { rootMargin: '-25% 0px -45% 0px' }
        )
      : null;
    if (hero && heroObs) heroObs.observe(hero);

    return () => {
      obs.disconnect();
      if (heroObs) heroObs.disconnect();
    };
  }, [ids]);

  return active;
}
