#!/usr/bin/env node
// Generates the course's placeholder banner artwork as plain SVG files under
// src/assets/images/banners/. These are deliberately abstract, systematic
// compositions built from a small shared vocabulary of waiting-related marks
// (clock, queue ticks, ticket, progress bar, branch, price, exit, observation
// frame, overlap) — not finished illustration. Real supplied artwork will
// replace these files later without any page needing to change, since pages
// reference them only by path.
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

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// --- shared primitive vocabulary -------------------------------------------------

function clockMark(cx, cy, r, angle) {
  const hx = cx + Math.cos(angle) * r * 0.5;
  const hy = cy + Math.sin(angle) * r * 0.5;
  const mx = cx + Math.cos(angle + 2.2) * r * 0.8;
  const my = cy + Math.sin(angle + 2.2) * r * 0.8;
  return `<g fill="none" stroke-linecap="round">
    <circle cx="${cx}" cy="${cy}" r="${r}" stroke="${GREY}" stroke-width="2.5" opacity="0.5"/>
    <line x1="${cx}" y1="${cy}" x2="${hx.toFixed(1)}" y2="${hy.toFixed(1)}" stroke="${GOLD}" stroke-width="4"/>
    <line x1="${cx}" y1="${cy}" x2="${mx.toFixed(1)}" y2="${my.toFixed(1)}" stroke="${BRONZE}" stroke-width="3"/>
    <circle cx="${cx}" cy="${cy}" r="4" fill="${BRONZE}"/>
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
    <text x="${x + w / 2}" y="${y + h / 2 + 8}" font-family="ui-monospace, monospace" font-size="26" fill="${BRONZE}" text-anchor="middle">${label}</text>
  </g>`;
}

function progressBar(x, y, w, h, pct) {
  return `<g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="none" stroke="${GREY}" stroke-width="2.5" opacity="0.55"/>
    <rect x="${x}" y="${y}" width="${(w * pct).toFixed(1)}" height="${h}" rx="${h / 2}" fill="${GOLD}"/>
  </g>`;
}

function branchLines(x, y, spread) {
  return `<g stroke-width="3" fill="none" stroke-linecap="round">
    <path d="M ${x} ${y} L ${x + 70} ${y}" stroke="${GREY}"/>
    <path d="M ${x + 70} ${y} L ${x + 160} ${y - spread}" stroke="${GOLD}"/>
    <path d="M ${x + 70} ${y} L ${x + 160} ${y + spread}" stroke="${GREY}"/>
  </g>`;
}

function priceMarker(cx, cy, r) {
  return `<g>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${GOLD}" stroke-width="3"/>
    <text x="${cx}" y="${cy + 7}" font-family="ui-monospace, monospace" font-size="22" fill="${GOLD}" text-anchor="middle">$</text>
  </g>`;
}

function exitMarker(x, y, w, h) {
  return `<g stroke="${BRONZE}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M ${x} ${y} L ${x} ${y + h} L ${x + w * 0.55} ${y + h}"/>
    <path d="M ${x} ${y} L ${x + w * 0.55} ${y}"/>
    <path d="M ${x + w * 0.25} ${y + h / 2} L ${x + w} ${y + h / 2}"/>
    <path d="M ${x + w * 0.75} ${y + h / 2 - 12} L ${x + w} ${y + h / 2} L ${x + w * 0.75} ${y + h / 2 + 12}"/>
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

function wrap(marks) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${CREAM}"/>
      <stop offset="1" stop-color="${CREAM_DEEP}"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
${marks.join("\n")}
</svg>
`;
}

// --- named family compositions ---------------------------------------------------
// HOME: abstract queue + time — the course's own opening composition.
const home = wrap([
  queueTicks(120, 300, 9, 46, 6),
  clockMark(1180, 190, 90, 0.7),
  progressBar(760, 380, 420, 14, 0.4),
  observationFrame(1360, 90, 160, 160),
]);

// LECTURES: progress / time / interface motif.
const lectures = wrap([
  clockMark(220, 170, 78, 1.1),
  progressBar(140, 340, 520, 16, 0.62),
  observationFrame(900, 110, 220, 220),
  branchLines(1220, 380, 60),
]);

// SESSIONS: hands-on / working session — queue ticks + observation.
const sessions = wrap([
  observationFrame(140, 100, 260, 260),
  queueTicks(520, 330, 8, 44, 3),
  ticketMotif(1180, 150, 220, 140, "S"),
]);

// ASSESSMENTS: four-stage progression — the assessment tracker's own shape.
const assessments = wrap([
  ticketMotif(120, 190, 200, 130, "01"),
  ticketMotif(400, 190, 200, 130, "02"),
  ticketMotif(680, 190, 200, 130, "03"),
  ticketMotif(960, 190, 200, 130, "04"),
  progressBar(120, 380, 1040, 14, 0.78),
]);

// PEOPLE: lecture / waiting-room / environment motif — no figures.
const people = wrap([
  observationFrame(160, 120, 300, 240),
  observationFrame(560, 160, 220, 180),
  clockMark(1180, 220, 84, 2.4),
  queueTicks(900, 400, 6, 40, 1),
]);

// POLICIES: ticket / rules / signage / document motif.
const policies = wrap([
  ticketMotif(140, 150, 260, 200, "§"),
  progressBar(500, 400, 380, 12, 1),
  observationFrame(980, 110, 200, 200),
  branchLines(1240, 300, 50),
]);

writeFileSync(join(outDir, "home.svg"), home);
writeFileSync(join(outDir, "lectures.svg"), lectures);
writeFileSync(join(outDir, "sessions.svg"), sessions);
writeFileSync(join(outDir, "assessments.svg"), assessments);
writeFileSync(join(outDir, "people.svg"), people);
writeFileSync(join(outDir, "policies.svg"), policies);

// --- per-week compositions ---------------------------------------------------
// Twelve distinct arrangements built from the same vocabulary, seeded by week
// number so they're reproducible across regenerations rather than random each
// build.
const PRIMITIVES = ["clock", "queue", "ticket", "progress", "branch", "price", "exit", "frame", "overlap"];

function weekBanner(week) {
  const rnd = mulberry32(week * 7919 + 13);
  const pick = (n) => {
    const chosen = new Set();
    while (chosen.size < n) chosen.add(PRIMITIVES[Math.floor(rnd() * PRIMITIVES.length)]);
    return [...chosen];
  };
  const chosen = pick(3 + (week % 2));
  const marks = [];
  const slot = (i, total) => 140 + (i * (W - 280)) / Math.max(total - 1, 1);

  chosen.forEach((kind, i) => {
    const cx = slot(i, chosen.length);
    const cy = 180 + rnd() * 140;
    switch (kind) {
      case "clock":
        marks.push(clockMark(cx, cy, 60 + rnd() * 40, rnd() * Math.PI * 2));
        break;
      case "queue":
        marks.push(queueTicks(cx - 160, 340, 7, 40, Math.floor(rnd() * 7)));
        break;
      case "ticket":
        marks.push(ticketMotif(cx - 90, cy - 60, 180, 120, String(week).padStart(2, "0")));
        break;
      case "progress":
        marks.push(progressBar(cx - 180, 380, 360, 14, 0.2 + rnd() * 0.7));
        break;
      case "branch":
        marks.push(branchLines(cx - 80, cy, 40 + rnd() * 40));
        break;
      case "price":
        marks.push(priceMarker(cx, cy, 46 + rnd() * 20));
        break;
      case "exit":
        marks.push(exitMarker(cx - 80, cy - 60, 160, 120));
        break;
      case "frame":
        marks.push(observationFrame(cx - 100, cy - 100, 200, 200));
        break;
      case "overlap":
        marks.push(overlapMarks(cx, cy, 60, 30 + rnd() * 20));
        break;
    }
  });

  return wrap(marks);
}

for (let week = 1; week <= 12; week++) {
  const name = `week-${String(week).padStart(2, "0")}.svg`;
  writeFileSync(join(outDir, name), weekBanner(week));
}

console.log(`Wrote 6 family banners + 12 week banners to ${outDir}`);
