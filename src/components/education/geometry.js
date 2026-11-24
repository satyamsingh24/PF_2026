/**
 * Vector geometry for the Education illustration.
 * Coordinates are traced from the reference artwork (viewBox 646 x 642).
 */
export const VB = { w: 646, h: 642 };

/** Catmull-Rom spline through points, returned as a cubic-bezier path string. */
function splineSegments(pts, tension = 0.5) {
  let d = '';
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1 = [p1[0] + ((p2[0] - p0[0]) * tension) / 3, p1[1] + ((p2[1] - p0[1]) * tension) / 3];
    const c2 = [p2[0] - ((p3[0] - p1[0]) * tension) / 3, p2[1] - ((p3[1] - p1[1]) * tension) / 3];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

/** Sample the same spline densely -> array of {x,y} */
function sampleSpline(pts, per = 20, tension = 0.5) {
  const out = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1 = [p1[0] + ((p2[0] - p0[0]) * tension) / 3, p1[1] + ((p2[1] - p0[1]) * tension) / 3];
    const c2 = [p2[0] - ((p3[0] - p1[0]) * tension) / 3, p2[1] - ((p3[1] - p1[1]) * tension) / 3];
    for (let k = 0; k < per; k++) {
      const t = k / per;
      const u = 1 - t;
      out.push({
        x: u * u * u * p1[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * p2[0],
        y: u * u * u * p1[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * p2[1],
      });
    }
  }
  const last = pts[pts.length - 1];
  out.push({ x: last[0], y: last[1] });
  return out;
}

/* ------------------------------------------------------------------ nib */
// left edge, top -> tip (measured from the artwork); right edge mirrors around x = 320.5
const NIB_LEFT = [
  [265, 0], [267, 30], [268, 45], [277, 60], [275, 75], [268, 90], [260, 105], [253, 120],
  [245, 135], [246, 150], [257, 165], [267, 180], [275, 195], [282, 210], [289, 225],
  [295, 240], [300, 255], [306, 270], [311, 285], [316, 300], [320, 308],
];
const NIB_RIGHT = NIB_LEFT.map(([x, y]) => [641 - x, y]).reverse();

export const NIB_D =
  `M${NIB_LEFT[0][0]} ${NIB_LEFT[0][1]}` +
  splineSegments(NIB_LEFT) +
  // up the right side, from the tip
  splineSegments(NIB_RIGHT) +
  ' Z';

export const HOLE = { cx: 321, cy: 197, r: 14 };
export const SLIT = { x: 321, y1: 208, y2: 304 };

/* ----------------------------------------------------------------- road */
// [y, xLeft, xRight] keyframes, read off the artwork
const EDGES = [
  [303, 318, 322], [310, 296, 320], [320, 288, 327], [330, 281, 335], [340, 277, 338],
  [350, 255, 336], [360, 232, 323], [370, 215, 314], [380, 209, 308], [390, 208, 309],
  [400, 215, 325], [410, 225, 355], [420, 237, 387], [430, 252, 405], [440, 267, 420],
  [450, 280, 434], [460, 293, 445], [470, 302, 449], [480, 302, 449], [490, 300, 447],
  [500, 296, 440], [515, 285, 431], [535, 258, 418], [550, 218, 413], [560, 187, 413],
  [580, 173, 415], [600, 168, 427], [620, 167, 447], [642, 167, 472], [690, 150, 520],
];
const LEFT = EDGES.map(([y, l]) => [l, y]);
const RIGHT = EDGES.map(([y, , r]) => [r, y]);

export const ROAD_D =
  `M${LEFT[0][0]} ${LEFT[0][1]}` +
  splineSegments(LEFT) +
  ` L${RIGHT[RIGHT.length - 1][0]} ${RIGHT[RIGHT.length - 1][1]}` +
  splineSegments([...RIGHT].reverse()) +
  ' Z';

/** local road width at a given y (for scaling dashes) */
function widthAtY(y) {
  for (let i = 0; i < EDGES.length - 1; i++) {
    const a = EDGES[i];
    const b = EDGES[i + 1];
    if (y >= a[0] && y <= b[0]) {
      const t = (y - a[0]) / (b[0] - a[0]);
      return (a[2] - a[1]) * (1 - t) + (b[2] - b[1]) * t;
    }
  }
  return 60;
}

/* ------------------------------------------------------------ flow line */
// the dashed centre line
const FLOW = [
  [321, 303], [306, 316], [299, 333], [286, 351], [263, 366], [257, 387], [267, 406],
  [291, 419], [323, 432], [355, 446], [376, 466], [381, 490], [370, 515], [350, 540],
  [324, 564], [311, 586], [306, 612], [309, 642], [312, 700],
];
const flowPts = sampleSpline(FLOW, 24);

let acc = 0;
const cum = [0];
for (let i = 1; i < flowPts.length; i++) {
  acc += Math.hypot(flowPts[i].x - flowPts[i - 1].x, flowPts[i].y - flowPts[i - 1].y);
  cum.push(acc);
}
export const FLOW_LENGTH = acc;
export const FLOW_D = 'M' + flowPts.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' L');

function atLength(s) {
  const target = Math.max(0, Math.min(FLOW_LENGTH, s));
  let lo = 0;
  let hi = cum.length - 1;
  while (lo < hi - 1) {
    const mid = (lo + hi) >> 1;
    if (cum[mid] <= target) lo = mid;
    else hi = mid;
  }
  const t = (target - cum[lo]) / Math.max(1e-6, cum[hi] - cum[lo]);
  return {
    x: flowPts[lo].x + (flowPts[hi].x - flowPts[lo].x) * t,
    y: flowPts[lo].y + (flowPts[hi].y - flowPts[lo].y) * t,
  };
}

/** dashes get bigger toward the viewer (perspective) */
export const DASHES = (() => {
  const out = [];
  let s = 4;
  while (s < FLOW_LENGTH) {
    const p = atLength(s);
    if (p.y > 660) break;
    const k = 0.45 + Math.min(1, Math.max(0, (p.y - 300) / 340)) * 1.1;
    const len = 15 * k;
    const gap = 13 * k;
    const e = Math.min(FLOW_LENGTH, s + len);
    const a = atLength(s);
    const m = atLength((s + e) / 2);
    const b = atLength(e);
    out.push({
      d: `M${a.x.toFixed(1)} ${a.y.toFixed(1)} Q${m.x.toFixed(1)} ${m.y.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`,
      sw: +(2.6 * k).toFixed(2),
    });
    s = e + gap;
  }
  return out;
})();

/* -------------------------------------------------------------- walkers */
// foot position, height (in artwork units) and which way they face
const WALKER_DEFS = [
  { x: 310, y: 302, h: 13, flip: false, shadow: [-6, 1, 7, 1.3] },
  { x: 303, y: 353, h: 27, flip: true, shadow: [-14, 2, 16, 3] },
  { x: 375, y: 457, h: 48, flip: true, shadow: [20, 2, 24, 4] },
  { x: 314, y: 592, h: 76, flip: false, shadow: [-34, 4, 44, 8] },
];
export const WALKERS = WALKER_DEFS;
