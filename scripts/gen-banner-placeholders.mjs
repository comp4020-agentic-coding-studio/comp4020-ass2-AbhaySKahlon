#!/usr/bin/env node
// Generates the course's banner artwork as plain SVG files under
// src/assets/images/banners/. Each banner is a deliberate, hand-composed
// diagram built from a shared thin-line vocabulary (clock, queue, ticket,
// progress bar, branch, frame, scale...) so the course reads as one visual
// system, but every banner's composition is specific to what its own page
// or week is actually about — nothing here is generated at random. Real
// supplied artwork can replace these files later without any page needing
// to change, since pages reference them only by path.
//
// Run with: node scripts/gen-banner-placeholders.mjs

import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "src", "assets", "images", "banners");
mkdirSync(outDir, { recursive: true });

const W = 1600;
const H = 500;

// Brand palette (src/site-config.ts / astro-theme-slop/slop.css). Hard-coded
// here because SVG source files render before the CSS cascade exists to
// supply custom properties.
const GOLD = "#b97d1c";
const BRONZE = "#8a5c13";
const GREY = "#6b6154";
const CREAM = "#f6efe4";
const CREAM_DEEP = "#e9dbc2";

// --- shared course-wide grammar ---------------------------------------------------
// Every banner gets the same corner brackets, the same faint baseline queue
// strip, and the same kicker-label treatment, so the specific hero motif in
// the middle is what tells one banner apart from another, not the framing.

function cornerBrackets() {
  const pad = 40;
  const arm = 28;
  return `<g stroke="${GREY}" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.55">
    <path d="M ${pad} ${pad + arm} L ${pad} ${pad} L ${pad + arm} ${pad}"/>
    <path d="M ${W - pad - arm} ${H - pad} L ${W - pad} ${H - pad} L ${W - pad} ${H - pad - arm}"/>
  </g>`;
}

function baselineStrip() {
  let out = `<g stroke="${GREY}" stroke-width="2" opacity="0.22">`;
  for (let x = 96; x <= W - 96; x += 58) {
    out += `<line x1="${x}" y1="${H - 60}" x2="${x}" y2="${H - 50}"/>`;
  }
  return out + "</g>";
}

function kicker(label) {
  return `<text x="40" y="${H - 22}" font-family="ui-monospace, monospace" font-size="20" letter-spacing="0.12em" fill="${BRONZE}" opacity="0.85">${label}</text>`;
}

function wrap(kickerLabel, hero) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${CREAM}"/>
      <stop offset="1" stop-color="${CREAM_DEEP}"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  ${baselineStrip()}
  ${cornerBrackets()}
  ${kicker(kickerLabel)}
${hero.join("\n")}
</svg>
`;
}

// --- shared primitive vocabulary -------------------------------------------------

function clockFace(cx, cy, r, angleHour, angleMinute, opts = {}) {
  const { rimTicks = 12, accent = GOLD } = opts;
  let ticks = "";
  for (let i = 0; i < rimTicks; i++) {
    const a = (i / rimTicks) * Math.PI * 2 - Math.PI / 2;
    const x1 = cx + Math.cos(a) * (r - 10);
    const y1 = cy + Math.sin(a) * (r - 10);
    const x2 = cx + Math.cos(a) * r;
    const y2 = cy + Math.sin(a) * r;
    ticks += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${GREY}" stroke-width="2.5" stroke-linecap="round" opacity="0.6"/>`;
  }
  const hx = cx + Math.cos(angleHour) * r * 0.5;
  const hy = cy + Math.sin(angleHour) * r * 0.5;
  const mx = cx + Math.cos(angleMinute) * r * 0.82;
  const my = cy + Math.sin(angleMinute) * r * 0.82;
  return `<g>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${GREY}" stroke-width="3" opacity="0.55"/>
    ${ticks}
    <line x1="${cx}" y1="${cy}" x2="${hx.toFixed(1)}" y2="${hy.toFixed(1)}" stroke="${accent}" stroke-width="6" stroke-linecap="round"/>
    <line x1="${cx}" y1="${cy}" x2="${mx.toFixed(1)}" y2="${my.toFixed(1)}" stroke="${BRONZE}" stroke-width="4" stroke-linecap="round"/>
    <circle cx="${cx}" cy="${cy}" r="5" fill="${BRONZE}"/>
  </g>`;
}

function queueTicks(x, y, count, spacing, activeIndex) {
  let out = "<g>";
  for (let i = 0; i < count; i++) {
    const active = i === activeIndex;
    const h = active ? 46 : 28;
    out += `<line x1="${x + i * spacing}" y1="${y}" x2="${x + i * spacing}" y2="${y + h}" stroke="${active ? GOLD : GREY}" stroke-width="${active ? 5 : 2.5}" stroke-linecap="round" opacity="${active ? 1 : 0.45}"/>`;
  }
  return out + "</g>";
}

function ticketMotif(x, y, w, h, label) {
  return `<g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="none" stroke="${BRONZE}" stroke-width="3" stroke-dasharray="1 9" stroke-linecap="round"/>
    <text x="${x + w / 2}" y="${y + h / 2 + 10}" font-family="ui-monospace, monospace" font-size="30" fill="${BRONZE}" text-anchor="middle">${label}</text>
  </g>`;
}

function progressBar(x, y, w, h, pct) {
  return `<g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="none" stroke="${GREY}" stroke-width="2.5" opacity="0.55"/>
    <rect x="${x}" y="${y}" width="${(w * pct).toFixed(1)}" height="${h}" rx="${h / 2}" fill="${GOLD}"/>
  </g>`;
}

function heroProgressBar(x, y, w, h, pct) {
  const fillW = w * pct;
  const knobX = x + fillW;
  const knobCy = y + h / 2;
  let scale = `<g stroke="${GREY}" stroke-width="2" opacity="0.4">`;
  for (let i = 1; i < 10; i++) {
    const tx = x + (w / 10) * i;
    scale += `<line x1="${tx.toFixed(1)}" y1="${(y + h + 12).toFixed(1)}" x2="${tx.toFixed(1)}" y2="${(y + h + 20).toFixed(1)}"/>`;
  }
  scale += "</g>";
  return `<g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="none" stroke="${GREY}" stroke-width="3" opacity="0.5"/>
    <rect x="${x}" y="${y}" width="${fillW.toFixed(1)}" height="${h}" rx="${h / 2}" fill="${GOLD}"/>
    ${scale}
    <circle cx="${knobX.toFixed(1)}" cy="${knobCy.toFixed(1)}" r="${(h / 2 + 9).toFixed(1)}" fill="${CREAM}" stroke="${GOLD}" stroke-width="4.5"/>
  </g>`;
}

function observationFrame(x, y, w, h) {
  const c = 22;
  return `<g stroke="${GREY}" stroke-width="3" fill="none" stroke-linecap="round">
    <path d="M ${x} ${y + c} L ${x} ${y} L ${x + c} ${y}"/>
    <path d="M ${x + w - c} ${y} L ${x + w} ${y} L ${x + w} ${y + c}"/>
    <path d="M ${x + w} ${y + h - c} L ${x + w} ${y + h} L ${x + w - c} ${y + h}"/>
    <path d="M ${x + c} ${y + h} L ${x} ${y + h} L ${x} ${y + h - c}"/>
  </g>`;
}

function overlapMarks(cx, cy, r, offset) {
  return `<g fill="none" stroke-width="3">
    <circle cx="${(cx - offset).toFixed(1)}" cy="${cy}" r="${r}" stroke="${GOLD}" opacity="0.85"/>
    <circle cx="${(cx + offset).toFixed(1)}" cy="${cy}" r="${r}" stroke="${BRONZE}" opacity="0.85"/>
  </g>`;
}

function idBadge(x, y, w, h, initials) {
  const ringCy = y + 38;
  return `<g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="none" stroke="${GREY}" stroke-width="2.5" opacity="0.7"/>
    <circle cx="${x + w / 2}" cy="${ringCy}" r="22" fill="none" stroke="${BRONZE}" stroke-width="2.5"/>
    <text x="${x + w / 2}" y="${ringCy + 6}" font-family="ui-monospace, monospace" font-size="16" text-anchor="middle" fill="${BRONZE}">${initials}</text>
    <line x1="${x + 18}" y1="${y + h - 34}" x2="${x + w - 18}" y2="${y + h - 34}" stroke="${GREY}" stroke-width="2" opacity="0.5"/>
    <line x1="${x + 18}" y1="${y + h - 18}" x2="${x + w - 40}" y2="${y + h - 18}" stroke="${GREY}" stroke-width="2" opacity="0.35"/>
  </g>`;
}

function documentMark(x, y, w, h) {
  let lines = "";
  const gap = (h - 30) / 4;
  for (let i = 0; i < 4; i++) {
    const ly = y + 24 + i * gap;
    lines += `<line x1="${x + 18}" y1="${ly}" x2="${x + w - 18 - (i === 3 ? w * 0.3 : 0)}" y2="${ly}" stroke="${GREY}" stroke-width="2.5" opacity="0.5"/>`;
  }
  return `<g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="none" stroke="${BRONZE}" stroke-width="3"/>
    ${lines}
  </g>`;
}

function branchLines(x, y, spread) {
  return `<g stroke-width="3" fill="none" stroke-linecap="round">
    <path d="M ${x} ${y} L ${x + 70} ${y}" stroke="${GREY}"/>
    <path d="M ${x + 70} ${y} L ${x + 160} ${y - spread}" stroke="${GOLD}"/>
    <path d="M ${x + 70} ${y} L ${x + 160} ${y + spread}" stroke="${GREY}" stroke-dasharray="2 8"/>
  </g>`;
}

writeFileSync; // (keep import used even if a helper below is unused per-file)

// --- family banners ---------------------------------------------------------------

const home = wrap("SLOP4787 · THE SCIENCE OF WAITING", [
  clockFace(340, 220, 110, -Math.PI / 2 + 0.3, -Math.PI / 2 + 2.4),
  queueTicks(620, 300, 11, 46, 8),
  observationFrame(1360, 90, 160, 160),
]);

const lectures = wrap("LECTURES", [
  // a 12-segment timeline: the semester's arc of lectures, several already
  // covered (filled), the rest still ahead (open) — a structural, not
  // random, mark of "explanatory content laid out over the semester".
  (() => {
    const segX = 200;
    const segY = 210;
    const segW = 1180;
    const seg = segW / 12;
    let cells = `<line x1="${segX}" y1="${segY}" x2="${segX + segW}" y2="${segY}" stroke="${GREY}" stroke-width="2.5" opacity="0.4"/>`;
    for (let i = 0; i < 12; i++) {
      const cx = segX + seg * i + seg / 2;
      const filled = i < 5;
      cells += `<circle cx="${cx.toFixed(1)}" cy="${segY}" r="10" fill="${filled ? GOLD : "none"}" stroke="${filled ? GOLD : GREY}" stroke-width="2.5" opacity="${filled ? 1 : 0.5}"/>`;
    }
    return `<g>${cells}</g>`;
  })(),
  overlapMarks(880, 350, 56, 30),
]);

const sessions = wrap("SESSIONS", [
  ticketMotif(180, 140, 220, 150, "S"),
  queueTicks(560, 320, 8, 44, 2),
  observationFrame(1160, 130, 240, 190),
]);

const assessments = wrap("ASSESSMENT", [
  ticketMotif(120, 160, 220, 150, "01"),
  ticketMotif(420, 160, 220, 150, "02"),
  ticketMotif(720, 160, 220, 150, "03"),
  ticketMotif(1020, 160, 220, 150, "04"),
  `<g font-family="ui-monospace, monospace" font-size="18" fill="${GREY}" text-anchor="middle" opacity="0.75">
    <text x="230" y="350">FIELD NOTES</text>
    <text x="530" y="350">CASE STUDY</text>
    <text x="830" y="350">EXPERIMENT</text>
    <text x="1130" y="350">AUDIT</text>
  </g>`,
  progressBar(120, 400, 1120, 12, 1),
]);

const people = wrap("PEOPLE", [
  idBadge(220, 130, 220, 240, "MQ"),
  idBadge(520, 170, 220, 240, "IF"),
  clockFace(1180, 230, 90, -Math.PI / 2 + 2.1, -Math.PI / 2 + 0.9, { accent: BRONZE }),
]);

const policies = wrap("POLICIES", [
  documentMark(160, 110, 300, 260),
  branchLines(560, 240, 55),
  clockFace(1200, 190, 92, -Math.PI / 2 + 1.6, -Math.PI / 2 + 4.2, { accent: BRONZE }),
]);

writeFileSync(join(outDir, "home.svg"), home);
writeFileSync(join(outDir, "lectures.svg"), lectures);
writeFileSync(join(outDir, "sessions.svg"), sessions);
writeFileSync(join(outDir, "assessments.svg"), assessments);
writeFileSync(join(outDir, "people.svg"), people);
writeFileSync(join(outDir, "policies.svg"), policies);

// --- week banners: one deliberate, content-specific composition per week ----------
// Each function below implements the visual brief for that week's mechanism
// and lecture title, not a randomly sampled set of primitives.

function clockInterval(cx, cy, r, minutes) {
  const startA = -Math.PI / 2;
  const endA = startA + (minutes / 60) * Math.PI * 2;
  const x1 = cx + Math.cos(startA) * r;
  const y1 = cy + Math.sin(startA) * r;
  const x2 = cx + Math.cos(endA) * r;
  const y2 = cy + Math.sin(endA) * r;
  const wedge = `M ${cx} ${cy} L ${x1.toFixed(1)} ${y1.toFixed(1)} A ${r} ${r} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)} Z`;
  let cardinals = "";
  for (const deg of [0, 90, 180, 270]) {
    const a = (deg * Math.PI) / 180 - Math.PI / 2;
    const ix = cx + Math.cos(a) * (r - 14);
    const iy = cy + Math.sin(a) * (r - 14);
    const ox = cx + Math.cos(a) * r;
    const oy = cy + Math.sin(a) * r;
    cardinals += `<line x1="${ix.toFixed(1)}" y1="${iy.toFixed(1)}" x2="${ox.toFixed(1)}" y2="${oy.toFixed(1)}" stroke="${GREY}" stroke-width="3" stroke-linecap="round" opacity="0.7"/>`;
  }
  return `<g>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${GREY}" stroke-width="3" opacity="0.5"/>
    <path d="${wedge}" fill="${GOLD}" opacity="0.85"/>
    ${cardinals}
    <circle cx="${cx}" cy="${cy}" r="4" fill="${BRONZE}"/>
  </g>`;
}

function focusedClock(cx, cy, r) {
  const ring = `<circle cx="${cx}" cy="${cy}" r="${(r + 26).toFixed(1)}" fill="none" stroke="${GOLD}" stroke-width="2.5" stroke-dasharray="3 10" opacity="0.75"/>`;
  const face = clockFace(cx, cy, r, -Math.PI / 2 + 0.15, -Math.PI / 2 + 2.6, { rimTicks: 12 });
  return `<g>${ring}${face}</g>`;
}

function expectedVsActual(cx1, cx2, cy, r) {
  const c1 = clockFace(cx1, cy, r, -Math.PI / 2, -Math.PI / 2 + 0.5, { accent: BRONZE });
  const c2 = clockFace(cx2, cy, r, -Math.PI / 2, -Math.PI / 2 + 2.3, { accent: GOLD });
  const bracketY = cy - r - 34;
  const bracket = `<g stroke="${GREY}" stroke-width="2.5" fill="none" stroke-dasharray="2 8" opacity="0.75">
    <path d="M ${cx1} ${cy - r - 10} L ${cx1} ${bracketY} L ${cx2} ${bracketY} L ${cx2} ${cy - r - 10}"/>
  </g>`;
  return `<g>${c1}${c2}${bracket}</g>`;
}

function hereMarker(cx, y) {
  return `<g stroke="${GOLD}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M ${cx} ${y - 44} L ${cx} ${y - 20}"/>
    <path d="M ${cx - 9} ${y - 30} L ${cx} ${y - 20} L ${cx + 9} ${y - 30}"/>
  </g>`;
}

function statusQueue(x, y, count, activeIndex) {
  let out = "<g>";
  for (let i = 0; i < count; i++) {
    const cx = x + i * 62;
    const active = i === activeIndex;
    out += `<circle cx="${cx}" cy="${y}" r="14" fill="${active ? GOLD : "none"}" stroke="${active ? GOLD : GREY}" stroke-width="2.5" opacity="${active ? 1 : 0.5}"/>`;
  }
  return out + "</g>";
}

function roomPlan(x, y, w, h) {
  const doorGap = 64;
  const doorTop = y + h / 2 - doorGap / 2;
  const doorBottom = y + h / 2 + doorGap / 2;
  const walls = `<g stroke="${GREY}" stroke-width="3.5" fill="none" stroke-linecap="round">
    <path d="M ${x + w} ${y} L ${x} ${y} L ${x} ${y + h} L ${x + w} ${y + h}"/>
    <path d="M ${x + w} ${y} L ${x + w} ${doorTop}"/>
    <path d="M ${x + w} ${doorBottom} L ${x + w} ${y + h}"/>
  </g>`;
  const door = `<g stroke="${BRONZE}" stroke-width="2.5" fill="none" stroke-dasharray="4 6">
    <path d="M ${x + w} ${doorTop} L ${x + w + doorGap} ${doorTop}"/>
    <path d="M ${x + w} ${doorTop} A ${doorGap} ${doorGap} 0 0 1 ${x + w + doorGap} ${doorTop + doorGap}"/>
  </g>`;
  const chairRow = [];
  for (let i = 0; i < 4; i++) {
    chairRow.push(chairGlyph(x + 46 + i * 52, y + 40, 90));
  }
  const chairEnd = [chairGlyph(x + 40, y + h - 40, 0), chairGlyph(x + 108, y + h - 40, 0)];
  return `<g>${walls}${door}${chairRow.join("")}${chairEnd.join("")}</g>`;
}

function chairGlyph(x, y, rotate) {
  return `<g transform="rotate(${rotate} ${x} ${y})" stroke="${GREY}" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.8">
    <rect x="${x - 14}" y="${y - 9}" width="28" height="18" rx="3"/>
    <path d="M ${x - 14} ${y - 9} L ${x - 14} ${y - 22} L ${x + 14} ${y - 22}"/>
  </g>`;
}

function numberedQueue(x, y, count) {
  let out = "<g>";
  for (let i = 0; i < count; i++) {
    const cx = x + i * 88;
    const isFront = i === 0;
    const label = count - i;
    out += `<circle cx="${cx}" cy="${y}" r="24" fill="none" stroke="${isFront ? GOLD : GREY}" stroke-width="${isFront ? 4 : 2.5}" opacity="${isFront ? 1 : 0.55}"/>`;
    out += `<text x="${cx}" y="${y + 7}" font-family="ui-monospace, monospace" font-size="20" text-anchor="middle" fill="${isFront ? GOLD : GREY}" opacity="${isFront ? 1 : 0.7}">${label}</text>`;
  }
  return out + "</g>";
}

function forwardArrow(x, y, w) {
  return `<g stroke="${BRONZE}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M ${x} ${y} L ${x + w} ${y}"/>
    <path d="M ${x + w - 14} ${y - 10} L ${x + w} ${y} L ${x + w - 14} ${y + 10}"/>
  </g>`;
}

function priorityQueue(x, y, count, priorityIndex) {
  let out = `<line x1="${x - 20}" y1="${y}" x2="${x + (count - 1) * 84 + 20}" y2="${y}" stroke="${GREY}" stroke-width="2" opacity="0.35"/>`;
  for (let i = 0; i < count; i++) {
    const cx = x + i * 84;
    const isPriority = i === priorityIndex;
    const cy = isPriority ? y - 40 : y;
    out += `<circle cx="${cx}" cy="${cy}" r="20" fill="${isPriority ? GOLD : "none"}" stroke="${isPriority ? GOLD : GREY}" stroke-width="2.5" opacity="${isPriority ? 1 : 0.5}"/>`;
    if (isPriority) {
      out += `<path d="M ${cx - 9} ${cy + 26} L ${cx} ${cy + 14} L ${cx + 9} ${cy + 26}" fill="none" stroke="${GOLD}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`;
    }
  }
  return `<g>${out}</g>`;
}

function balanceScale(cx, cy, arm) {
  const leftX = cx - arm;
  const rightX = cx + arm;
  const pivotY = cy - 60;
  return `<g stroke="${GREY}" stroke-width="3" fill="none" stroke-linecap="round">
    <line x1="${cx}" y1="${pivotY - 36}" x2="${cx}" y2="${cy + 60}"/>
    <line x1="${leftX}" y1="${pivotY}" x2="${rightX}" y2="${pivotY}"/>
    <line x1="${leftX}" y1="${pivotY}" x2="${leftX}" y2="${pivotY + 46}"/>
    <line x1="${rightX}" y1="${pivotY}" x2="${rightX}" y2="${pivotY + 46}"/>
    <circle cx="${cx}" cy="${(pivotY - 36).toFixed(1)}" r="6" fill="${BRONZE}"/>
    <g stroke="${BRONZE}" stroke-width="2.5">
      <circle cx="${leftX}" cy="${(pivotY + 62).toFixed(1)}" r="26" fill="none"/>
      <line x1="${leftX}" y1="${(pivotY + 62).toFixed(1)}" x2="${leftX}" y2="${(pivotY + 44).toFixed(1)}"/>
      <line x1="${leftX}" y1="${(pivotY + 62).toFixed(1)}" x2="${leftX + 13}" y2="${(pivotY + 62).toFixed(1)}"/>
    </g>
    <g stroke="${GOLD}" stroke-width="2.5">
      <circle cx="${rightX}" cy="${(pivotY + 62).toFixed(1)}" r="26" fill="none"/>
      <path d="M ${rightX} ${(pivotY + 44).toFixed(1)} L ${rightX + 15} ${(pivotY + 62).toFixed(1)} L ${rightX} ${(pivotY + 80).toFixed(1)} L ${rightX - 15} ${(pivotY + 62).toFixed(1)} Z"/>
    </g>
  </g>`;
}

function decisionFork(x, y) {
  const midX = x + 90;
  return `<g stroke-linecap="round" fill="none">
    <path d="M ${x} ${y} L ${midX} ${y}" stroke="${GREY}" stroke-width="3"/>
    <path d="M ${midX} ${y} L ${midX + 170} ${y - 92}" stroke="${GOLD}" stroke-width="3.5"/>
    <path d="M ${midX} ${y} L ${midX + 170} ${y + 92}" stroke="${GREY}" stroke-width="3" stroke-dasharray="2 8"/>
    <circle cx="${midX}" cy="${y}" r="6" fill="${BRONZE}"/>
    <circle cx="${(midX + 170).toFixed(1)}" cy="${(y - 92).toFixed(1)}" r="11" fill="${GOLD}"/>
    <circle cx="${(midX + 170).toFixed(1)}" cy="${(y + 92).toFixed(1)}" r="11" fill="none" stroke="${GREY}" stroke-width="2.5"/>
  </g>`;
}

function evidenceDots(points) {
  return `<g fill="${BRONZE}">${points.map(([px, py]) => `<circle cx="${px}" cy="${py}" r="6"/>`).join("")}</g>`;
}

function synthesis(points, boxX, boxY) {
  const lines = points
    .map(([px, py]) => `<line x1="${px}" y1="${py}" x2="${boxX}" y2="${boxY}" stroke="${GREY}" stroke-width="2" opacity="0.55"/>`)
    .join("");
  const dots = evidenceDots(points);
  const box = `<rect x="${boxX - 26}" y="${boxY - 26}" width="52" height="52" rx="8" fill="none" stroke="${GOLD}" stroke-width="3.5"/>`;
  return `<g>${lines}${dots}${box}</g>`;
}

const weeks = [
  {
    n: 1,
    mechanism: "time",
    hero: [clockInterval(800, 230, 130, 5)],
  },
  {
    n: 2,
    mechanism: "attention",
    hero: [focusedClock(800, 230, 130)],
  },
  {
    n: 3,
    mechanism: "expectation",
    hero: [expectedVsActual(560, 1020, 240, 100)],
  },
  {
    n: 4,
    mechanism: "information",
    hero: [
      ticketMotif(200, 160, 240, 150, "N°12"),
      statusQueue(620, 300, 7, 4),
      hereMarker(620 + 4 * 62, 300),
    ],
  },
  {
    n: 5,
    mechanism: "interfaces",
    hero: [heroProgressBar(300, 210, 1000, 34, 0.62)],
  },
  {
    n: 6,
    mechanism: "environment",
    hero: [roomPlan(420, 90, 620, 300)],
  },
  {
    n: 7,
    mechanism: "queue-rules",
    hero: [numberedQueue(280, 240, 6), forwardArrow(280 + 5 * 88 + 40, 240, 120)],
  },
  {
    n: 8,
    mechanism: "priority",
    hero: [priorityQueue(280, 260, 6, 2)],
  },
  {
    n: 9,
    mechanism: "value",
    hero: [balanceScale(800, 230, 140)],
  },
  {
    n: 10,
    mechanism: "control",
    hero: [decisionFork(300, 260)],
  },
  {
    n: 11,
    mechanism: "expectation",
    hero: [
      observationFrame(560, 90, 480, 300),
      evidenceDots([
        [700, 200],
        [820, 260],
        [900, 170],
        [1000, 280],
        [760, 320],
      ]),
    ],
  },
  {
    n: 12,
    mechanism: "value",
    hero: [
      synthesis(
        [
          [560, 180],
          [640, 300],
          [760, 150],
          [860, 310],
        ],
        1020,
        230,
      ),
    ],
  },
];

for (const week of weeks) {
  const label = `WEEK ${String(week.n).padStart(2, "0")} · ${week.mechanism.toUpperCase()}`;
  const svg = wrap(label, week.hero);
  writeFileSync(join(outDir, `week-${String(week.n).padStart(2, "0")}.svg`), svg);
}

console.log(`Wrote 6 family banners + ${weeks.length} week banners to ${outDir}`);
