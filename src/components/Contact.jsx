import SectionHead from './SectionHead.jsx';
import { CONTACT, PROFILE } from '../data/portfolio.js';

export default function Contact() {
  return (
    <section className="section-shell contact-section" id="contact">
      <div className="container">
        <SectionHead navId="contact" title={CONTACT.title} lead={CONTACT.lead} />
        <div className="footer-contact-actions contact-actions">
          <a className="btn-primary" href={`mailto:${PROFILE.email}`}>
            <span>{PROFILE.email}</span> <span>↗</span>
          </a>
          {CONTACT.links.map((l) => (
            <a key={l.label} className="btn-secondary" href={l.href} target="_blank" rel="noopener noreferrer">
              <span>{l.label}</span> <span>↗</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
