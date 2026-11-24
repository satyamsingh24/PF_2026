import { useCallback, useEffect, useState } from 'react';

const KEY = 'satyam_portfolio_theme';

export default function useTheme() {
  const [isLight, setIsLight] = useState(() => {
    try {
      return localStorage.getItem(KEY) === 'light';
    } catch (_) {
      return false;
    }
  });

  useEffect(() => {
    document.body.classList.toggle('light', isLight);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', isLight ? '#f5f2ed' : '#0d0d10');
    try {
      localStorage.setItem(KEY, isLight ? 'light' : 'dark');
    } catch (_) {}
  }, [isLight]);

  const toggle = useCallback(() => setIsLight((v) => !v), []);
  return { isLight, toggle };
}
