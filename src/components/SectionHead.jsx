import { navItem, navNumber } from '../data/portfolio.js';

/** Section header whose kicker comes from the navbar heading it belongs to. */
export default function SectionHead({ navId, title, lead }) {
  const nav = navItem(navId);
  return (
    <div className="section-head-wrap">
      <div>
        <div className="section-kicker">{navNumber(navId)} / {nav.kicker}</div>
        <h2 className="section-title">
          {title[0]}
          <br />
          <span>{title[1]}</span>
        </h2>
      </div>
      {lead && <p className="section-lead">{lead}</p>}
    </div>
  );
}
