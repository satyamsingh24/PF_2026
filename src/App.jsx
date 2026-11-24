import { useCallback, useEffect, useMemo, useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Projects from './components/Projects.jsx';
import About from './components/About.jsx';
import Education from './components/Education.jsx';
import Skills from './components/Skills.jsx';
import Certifications from './components/Certifications.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import ChatDrawer from './components/ChatDrawer.jsx';
import FloatingAsk from './components/FloatingAsk.jsx';
import useTheme from './hooks/useTheme.js';
import useScrollSpy from './hooks/useScrollSpy.js';
import { SECTION_NAV } from './data/portfolio.js';

// Navbar id -> section component. Page order is NAV order.
const SECTIONS = {
  about: About,
  projects: Projects,
  skills: Skills,
  education: Education,
  certifications: Certifications,
  contact: Contact,
};

export default function App() {
  const { isLight, toggle } = useTheme();
  const [chatOpen, setChatOpen] = useState(false);

  const sectionNav = SECTION_NAV;
  const activeId = useScrollSpy(useMemo(() => sectionNav.map((n) => n.id), [sectionNav]));

  const toggleChat = useCallback(() => setChatOpen((v) => !v), []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setChatOpen(false);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setChatOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <div className="bg-grid-lines" aria-hidden="true" />

      <Navbar
        activeId={activeId}
        isLight={isLight}
        onToggleTheme={toggle}
      />

      <main>
        <Hero />
        {sectionNav.map(({ id }) => {
          const Section = SECTIONS[id];
          return Section ? <Section key={id} /> : null;
        })}
      </main>

      <Footer />
      <ChatDrawer open={chatOpen} onClose={() => setChatOpen(false)} />
      <FloatingAsk open={chatOpen} onToggle={toggleChat} />
    </>
  );
}
