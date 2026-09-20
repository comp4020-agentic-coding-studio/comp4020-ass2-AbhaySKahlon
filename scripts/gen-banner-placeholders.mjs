#!/usr/bin/env node
// Generates the course's banner artwork as plain SVG files under
// src/assets/images/banners/. Each banner is a deliberate, hand-composed
// diagram built from a shared bold-line vocabulary (clock, queue, ticket,
// progress bar, branch, room, scale...) so the course reads as one visual
// system, but every banner's composition is specific to what its own page
// or week is actually about — nothing here is generated at random. Real
// supplied artwork can replace these files later without any page needing
// to change, since pages reference them only by path.
//
// Canvas: 1600x250 (a 32:5 / 6.4:1 ratio). This isn't the old 1600x500 file
// halved for no reason — it's chosen to exactly match the compact banner box
// CourseBanner.astro now renders (aspect-ratio: 32/5, ~300px tall at a
// 1920px-wide desktop viewport, per the course's compact-header requirement).
// At that ratio `object-fit: cover` has zero crop at desktop widths, but the
// much-squarer mobile banner box (~2.36:1 below 640px) is relatively taller
// than this wide canvas, so `cover` crops the LEFT and RIGHT edges at mobile
// widths, not top/bottom — worst case (a 320px-wide phone) leaves roughly the
// centre 500-560px of this 1600px-wide canvas visible. Every composition
// below keeps its dominant motif inside x:520-1080 (centred on cx=800) so it
// survives that crop; only incidental background elements may sit outside
// that band. Vertically, nothing needs a safe zone (no viewport crops this
// canvas's height) but the hero's own title sits in a dark bottom scrim, so
// captions/labels are placed near the TOP of the canvas (least scrim, and
// nowhere near the overlaid title) rather than underneath the motif.
//
// Every motif here is drawn large, filled (not just thin-outlined) and
// high-contrast, sized to stay well clear of the canvas edges, and specific
// to its own week's mechanism — nothing relies on decoration disconnected
// from the week's own concept: no corner brackets, no baseline tick strips,
// no generic kicker labels, no arbitrary clocks standing in for an unrelated
// topic. The subject motif is the whole banner.
//
// Run with: node scripts/gen-banner-placeholders.mjs

import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "src", "assets", "images", "banners");
mkdirSync(outDir, { recursive: true });

const W = 1600;
const H = 250;
const CX = W / 2;
const CY = H / 2;

// Brand palette (src/site-config.ts / astro-theme-slop/slop.css). Hard-coded
// here because SVG source files render before the CSS cascade exists to
// supply custom properties.
const GOLD = "#b97d1c";
const BRONZE = "#8a5c13";
const GREY = "#6b6154";
const CREAM = "#f6efe4";
const CREAM_DEEP = "#e9dbc2";
const WHITE = "#fffdf8";

function wrap(hero) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${CREAM}"/>
      <stop offset="1" stop-color="${CREAM_DEEP}"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
${hero.join("\n")}
</svg>
`;
}

// --- shared primitive vocabulary -------------------------------------------------
// Bold, filled, high-contrast shapes — calibrated to read clearly at real
// hero-banner scale (rendered 1600-2500px wide), not just in an isolated
// file preview.

function clockFace(cx, cy, r, angleMinute, opts = {}) {
  const { accent = GOLD, rim = GREY } = opts;
  let ticks = "";
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
    const cardinal = i % 3 === 0;
    const inset = cardinal ? 26 : 16;
    const width = cardinal ? 6 : 3.5;
    const x1 = cx + Math.cos(a) * (r - inset);
    const y1 = cy + Math.sin(a) * (r - inset);
    const x2 = cx + Math.cos(a) * (r - 6);
    const y2 = cy + Math.sin(a) * (r - 6);
    ticks += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${GREY}" stroke-width="${width}" stroke-linecap="round"/>`;
  }
  const mx = cx + Math.cos(angleMinute) * r * 0.76;
  const my = cy + Math.sin(angleMinute) * r * 0.76;
  const hourA = -Math.PI / 2 + (angleMinute - -Math.PI / 2) * 0.32;
  const hx = cx + Math.cos(hourA) * r * 0.46;
  const hy = cy + Math.sin(hourA) * r * 0.46;
  return `<g>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${WHITE}" stroke="${rim}" stroke-width="12"/>
    ${ticks}
    <line x1="${cx}" y1="${cy}" x2="${hx.toFixed(1)}" y2="${hy.toFixed(1)}" stroke="${BRONZE}" stroke-width="10" stroke-linecap="round"/>
    <line x1="${cx}" y1="${cy}" x2="${mx.toFixed(1)}" y2="${my.toFixed(1)}" stroke="${accent}" stroke-width="8" stroke-linecap="round"/>
    <circle cx="${cx}" cy="${cy}" r="11" fill="${BRONZE}"/>
  </g>`;
}

function label(cx, y, text, opts = {}) {
  const { size = 22, fill = BRONZE, weight = "600" } = opts;
  return `<text x="${cx}" y="${y}" font-family="ui-monospace, monospace" font-size="${size}" font-weight="${weight}" letter-spacing="0.06em" text-anchor="middle" fill="${fill}">${text}</text>`;
}

function chair(x, y, rotate, opts = {}) {
  const { fill = GREY } = opts;
  return `<g transform="rotate(${rotate} ${x} ${y})">
    <rect x="${x - 17}" y="${y - 11}" width="34" height="22" rx="4" fill="${fill}"/>
    <rect x="${x - 17}" y="${y - 30}" width="34" height="14" rx="4" fill="${fill}"/>
  </g>`;
}

function ticket(x, y, w, h, text, fontSize = 34) {
  const notchR = 14;
  const midY = y + h / 2;
  return `<g>
    <path d="M ${x} ${y} H ${x + w} V ${midY - notchR} A ${notchR} ${notchR} 0 0 0 ${x + w} ${midY + notchR} V ${y + h} H ${x} V ${midY + notchR} A ${notchR} ${notchR} 0 0 0 ${x} ${midY - notchR} Z"
      fill="${WHITE}" stroke="${BRONZE}" stroke-width="5"/>
    <line x1="${x + w * 0.62}" y1="${y + 14}" x2="${x + w * 0.62}" y2="${y + h - 14}" stroke="${BRONZE}" stroke-width="3" stroke-dasharray="2 8" opacity="0.6"/>
    <text x="${x + w * 0.31}" y="${midY + fontSize * 0.34}" font-family="ui-monospace, monospace" font-size="${fontSize}" font-weight="700" text-anchor="middle" fill="${BRONZE}">${text}</text>
  </g>`;
}

function statusDots(x, y, count, activeIndex, spacing = 46) {
  let out = "<g>";
  for (let i = 0; i < count; i++) {
    const cx = x + i * spacing;
    const active = i === activeIndex;
    out += `<circle cx="${cx}" cy="${y}" r="${active ? 15 : 11}" fill="${active ? GOLD : "none"}" stroke="${active ? GOLD : GREY}" stroke-width="4" opacity="${active ? 1 : 0.7}"/>`;
  }
  return out + "</g>";
}

function progressTrack(x, y, w, h, pct) {
  const fillW = w * pct;
  const knobX = x + fillW;
  const knobCy = y + h / 2;
  const knobR = h / 2 + 16;
  let ticks = "";
  for (const t of [0.25, 0.5, 0.75]) {
    const tx = (x + w * t).toFixed(1);
    ticks += `<line x1="${tx}" y1="${y}" x2="${tx}" y2="${y + h}" stroke="${GREY}" stroke-width="2" opacity="0.3"/>`;
  }
  return `<g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${WHITE}" stroke="${GREY}" stroke-width="5"/>
    <rect x="${x}" y="${y}" width="${fillW.toFixed(1)}" height="${h}" rx="${h / 2}" fill="${GOLD}"/>
    ${ticks}
    <circle cx="${knobX.toFixed(1)}" cy="${knobCy}" r="${knobR}" fill="${BRONZE}" stroke="${WHITE}" stroke-width="6"/>
  </g>`;
}

function roomPlan(x, y, w, h, doorGap = 70) {
  const doorTop = y + h / 2 - doorGap / 2;
  const doorBottom = doorTop + doorGap;
  const floor = `<path d="M ${x} ${y} H ${x + w} V ${y + h} H ${x} Z" fill="${CREAM_DEEP}"/>`;
  const walls = `<g stroke="${GREY}" stroke-width="12" fill="none" stroke-linecap="square" stroke-linejoin="round">
    <path d="M ${x + w} ${y} H ${x} V ${y + h} H ${x + w}"/>
    <path d="M ${x + w} ${y} V ${doorTop}"/>
    <path d="M ${x + w} ${doorBottom} V ${y + h}"/>
  </g>`;
  const door = `<g stroke="${BRONZE}" stroke-width="4" fill="none">
    <path d="M ${x + w} ${doorTop} L ${x + w + doorGap * 0.82} ${doorTop}"/>
    <path d="M ${x + w} ${doorTop} A ${doorGap * 0.82} ${doorGap * 0.82} 0 0 1 ${x + w + doorGap * 0.82} ${doorTop + doorGap * 0.82}" stroke-dasharray="5 8"/>
  </g>`;
  const chairs = [];
  const topXs = [x + w * 0.16, x + w * 0.38, x + w * 0.6, x + w * 0.82];
  for (const cx of topXs) chairs.push(chair(cx, y + 28, 180));
  const leftYs = [y + h * 0.3, y + h * 0.58, y + h * 0.85];
  for (const cy of leftYs) chairs.push(chair(x + 28, cy, -90));
  const bottomXs = [x + w * 0.28, x + w * 0.55];
  for (const cx of bottomXs) chairs.push(chair(cx, y + h - 28, 0));
  return `<g>${floor}${walls}${door}${chairs.join("")}</g>`;
}

function numberedQueue(x, y, count, spacing = 70) {
  let out = "<g>";
  for (let i = 0; i < count; i++) {
    const cx = x + i * spacing;
    const isFront = i === 0;
    const num = count - i;
    out += `<circle cx="${cx}" cy="${y}" r="27" fill="${isFront ? GOLD : WHITE}" stroke="${isFront ? GOLD : GREY}" stroke-width="5"/>`;
    out += `<text x="${cx}" y="${y + 8}" font-family="ui-monospace, monospace" font-size="23" font-weight="700" text-anchor="middle" fill="${isFront ? WHITE : GREY}">${num}</text>`;
  }
  return out + "</g>";
}

function serviceCounter(x, y) {
  return `<g>
    <rect x="${x - 26}" y="${y - 42}" width="52" height="84" rx="6" fill="${BRONZE}"/>
    <rect x="${x - 36}" y="${y - 52}" width="72" height="16" rx="6" fill="${GREY}"/>
  </g>`;
}

function forwardArrow(x, y, w) {
  return `<g stroke="${GREY}" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M ${x} ${y} L ${x + w} ${y}"/>
    <path d="M ${x + w - 20} ${y - 16} L ${x + w} ${y} L ${x + w - 20} ${y + 16}"/>
  </g>`;
}

function priorityQueue(x, y, count, priorityIndex, spacing = 78) {
  let out = `<line x1="${x - 26}" y1="${y}" x2="${x + (count - 1) * spacing + 26}" y2="${y}" stroke="${GREY}" stroke-width="4" opacity="0.4"/>`;
  for (let i = 0; i < count; i++) {
    const cx = x + i * spacing;
    const isPriority = i === priorityIndex;
    const cy = isPriority ? y - 60 : y;
    out += `<circle cx="${cx}" cy="${cy}" r="24" fill="${isPriority ? GOLD : WHITE}" stroke="${isPriority ? GOLD : GREY}" stroke-width="5"/>`;
    if (isPriority) {
      out += `<path d="M ${cx} ${cy - 42} l 7 14 16 2 -12 12 3 16 -14 -8 -14 8 3 -16 -12 -12 16 -2 Z" fill="${BRONZE}"/>`;
    }
  }
  return `<g>${out}</g>`;
}

function miniClock(cx, cy, r) {
  return `<g>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${WHITE}" stroke="${GREY}" stroke-width="4"/>
    <line x1="${cx}" y1="${cy}" x2="${cx}" y2="${(cy - r * 0.6).toFixed(1)}" stroke="${BRONZE}" stroke-width="4" stroke-linecap="round"/>
    <line x1="${cx}" y1="${cy}" x2="${(cx + r * 0.5).toFixed(1)}" y2="${cy}" stroke="${BRONZE}" stroke-width="4" stroke-linecap="round"/>
  </g>`;
}

function star(cx, cy, r, opts = {}) {
  const { fill = WHITE } = opts;
  const points = [];
  for (let i = 0; i < 10; i++) {
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const rad = i % 2 === 0 ? r : r * 0.45;
    points.push(`${(cx + Math.cos(a) * rad).toFixed(1)},${(cy + Math.sin(a) * rad).toFixed(1)}`);
  }
  return `<polygon points="${points.join(" ")}" fill="${fill}"/>`;
}

function balanceScale(cx, cy, arm) {
  const leftX = cx - arm;
  const rightX = cx + arm;
  const pivotY = cy - 55;
  const pivotTop = pivotY - 35;
  const hangBottom = pivotY + 50;
  const panCy = pivotY + 65;
  return `<g stroke="${GREY}" stroke-width="7" fill="none" stroke-linecap="round">
    <line x1="${cx}" y1="${pivotTop}" x2="${cx}" y2="${cy + 60}"/>
    <line x1="${leftX}" y1="${pivotY}" x2="${rightX}" y2="${pivotY}"/>
    <line x1="${leftX}" y1="${pivotY}" x2="${leftX}" y2="${hangBottom}"/>
    <line x1="${rightX}" y1="${pivotY}" x2="${rightX}" y2="${hangBottom}"/>
    <circle cx="${cx}" cy="${pivotTop.toFixed(1)}" r="9" fill="${BRONZE}" stroke="none"/>
    <g>
      <circle cx="${leftX}" cy="${panCy.toFixed(1)}" r="32" fill="${WHITE}" stroke="${BRONZE}" stroke-width="5"/>
      ${miniClock(leftX, panCy, 20)}
    </g>
    <g>
      <circle cx="${rightX}" cy="${panCy.toFixed(1)}" r="32" fill="${GOLD}" stroke="${GOLD}" stroke-width="5"/>
      ${star(rightX, panCy, 17)}
    </g>
  </g>
  ${label(leftX, pivotTop - 10, "TIME SPENT", { size: 16, fill: GREY })}
  ${label(rightX, pivotTop - 10, "VALUE GAINED", { size: 16, fill: GOLD })}`;
}

function decisionFork(x, y, labels = ["LEAVE", "STAY"]) {
  const midX = x + 80;
  const upX = midX + 150;
  const upY = y - 62;
  const downX = midX + 150;
  const downY = y + 62;
  const captions = labels
    ? `${label(upX, upY - 28, labels[0], { fill: GOLD, size: 19 })}
  ${label(downX, downY + 36, labels[1], { fill: GREY, size: 19 })}`
    : "";
  return `<g stroke-linecap="round" fill="none">
    <path d="M ${x} ${y} L ${midX} ${y}" stroke="${GREY}" stroke-width="8"/>
    <path d="M ${midX} ${y} L ${upX} ${upY}" stroke="${GOLD}" stroke-width="9"/>
    <path d="M ${midX} ${y} L ${downX} ${downY}" stroke="${GREY}" stroke-width="7" stroke-dasharray="3 12"/>
    <circle cx="${midX}" cy="${y}" r="10" fill="${BRONZE}" stroke="none"/>
    <circle cx="${upX}" cy="${upY}" r="18" fill="${GOLD}" stroke="none"/>
    <circle cx="${downX}" cy="${downY}" r="18" fill="${WHITE}" stroke="${GREY}" stroke-width="5"/>
  </g>
  ${captions}`;
}

function viewfinder(x, y, w, h) {
  const c = 34;
  return `<g stroke="${GREY}" stroke-width="9" fill="none" stroke-linecap="round">
    <path d="M ${x} ${y + c} L ${x} ${y} L ${x + c} ${y}"/>
    <path d="M ${x + w - c} ${y} L ${x + w} ${y} L ${x + w} ${y + c}"/>
    <path d="M ${x + w} ${y + h - c} L ${x + w} ${y + h} L ${x + w - c} ${y + h}"/>
    <path d="M ${x + c} ${y + h} L ${x} ${y + h} L ${x} ${y + h - c}"/>
  </g>`;
}

function evidenceTags(points) {
  return `<g>${points
    .map(([px, py], i) => `<circle cx="${px}" cy="${py}" r="12" fill="${i % 2 === 0 ? GOLD : BRONZE}"/>`)
    .join("")}</g>`;
}

function synthesis(points, boxX, boxY) {
  const lines = points
    .map(([px, py]) => `<line x1="${px}" y1="${py}" x2="${boxX}" y2="${boxY}" stroke="${GREY}" stroke-width="4" opacity="0.6"/>`)
    .join("");
  const dots = evidenceTags(points);
  const box = `<rect x="${boxX - 38}" y="${boxY - 38}" width="76" height="76" rx="10" fill="${WHITE}" stroke="${GOLD}" stroke-width="8"/>
    <path d="M ${boxX - 16} ${boxY} l 11 13 21 -24" fill="none" stroke="${GOLD}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`;
  return `<g>${lines}${dots}${box}</g>`;
}

function documentMark(x, y, w, h) {
  let lines = "";
  const gap = (h - 30) / 4;
  for (let i = 0; i < 4; i++) {
    const ly = y + 24 + i * gap;
    lines += `<line x1="${x + 18}" y1="${ly}" x2="${x + w - 18 - (i === 3 ? w * 0.35 : 0)}" y2="${ly}" stroke="${GREY}" stroke-width="5" stroke-linecap="round" opacity="0.75"/>`;
  }
  return `<g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${WHITE}" stroke="${BRONZE}" stroke-width="6"/>
    ${lines}
  </g>`;
}

function idBadge(x, y, w, h, initials) {
  const ringCy = y + 42;
  return `<g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="${WHITE}" stroke="${GREY}" stroke-width="5"/>
    <circle cx="${x + w / 2}" cy="${ringCy}" r="26" fill="${CREAM_DEEP}" stroke="${BRONZE}" stroke-width="5"/>
    <text x="${x + w / 2}" y="${ringCy + 8}" font-family="ui-monospace, monospace" font-size="20" font-weight="700" text-anchor="middle" fill="${BRONZE}">${initials}</text>
    <line x1="${x + 18}" y1="${y + h - 30}" x2="${x + w - 18}" y2="${y + h - 30}" stroke="${GREY}" stroke-width="4" opacity="0.6"/>
    <line x1="${x + 18}" y1="${y + h - 15}" x2="${x + w - 42}" y2="${y + h - 15}" stroke="${GREY}" stroke-width="4" opacity="0.4"/>
  </g>`;
}

// --- family banners ---------------------------------------------------------------
// Each family banner has a meaningful relationship to its own page rather
// than shared filler: the homepage combines the course's two recurring
// metaphors (a clock and a queue), lectures pairs lecture notes with a time
// badge, sessions pairs a session ticket with the observation viewfinder
// used on the actual session pages, assessments visualises the four
// assessments in their fixed sequence, people uses the two teaching staff's
// real initials, and policies pairs the policy document with the same
// decision-branch motif Week 10 uses for student choice.

const home = wrap([clockFace(650, CY, 72, -Math.PI / 2 + 2.0), numberedQueue(770, CY, 3, 55)]);

const lectures = wrap([documentMark(560, 30, 220, 190), clockFace(910, CY, 68, -Math.PI / 2 + 1.4)]);

const sessions = wrap([ticket(600, 40, 200, 170, "S"), viewfinder(830, 60, 220, 130)]);

const assessments = wrap([
  ticket(540, 40, 110, 80, "01", 26),
  ticket(664, 40, 110, 80, "02", 26),
  ticket(788, 40, 110, 80, "03", 26),
  ticket(912, 40, 110, 80, "04", 26),
  progressTrack(540, 150, 462, 30, 1),
]);

const people = wrap([idBadge(580, 40, 200, 170, "MQ"), idBadge(820, 40, 200, 170, "IF")]);

const policies = wrap([documentMark(560, 35, 190, 180), decisionFork(790, CY, null)]);

writeFileSync(join(outDir, "home.svg"), home);
writeFileSync(join(outDir, "lectures.svg"), lectures);
writeFileSync(join(outDir, "sessions.svg"), sessions);
writeFileSync(join(outDir, "assessments.svg"), assessments);
writeFileSync(join(outDir, "people.svg"), people);
writeFileSync(join(outDir, "policies.svg"), policies);

// --- week banners: one deliberate, content-specific composition per week ----------
// Each function below implements the visual brief for that week's mechanism
// and lecture title, not a randomly sampled set of primitives. The explicit
// week -> filename mapping lives in src/lib/weekBanners.ts, not here — this
// script only has to get week.n right once per entry.

function clockInterval(cx, cy, r, minutes) {
  const startA = -Math.PI / 2;
  const endA = startA + (minutes / 60) * Math.PI * 2;
  const x2 = cx + Math.cos(endA) * r;
  const y2 = cy + Math.sin(endA) * r;
  const wedge = `M ${cx} ${cy} L ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)} Z`;
  let ticks = "";
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
    const cardinal = i % 3 === 0;
    const inset = cardinal ? 24 : 15;
    const width = cardinal ? 6 : 3.5;
    const ix = cx + Math.cos(a) * (r - inset);
    const iy = cy + Math.sin(a) * (r - inset);
    const ox = cx + Math.cos(a) * (r - 6);
    const oy = cy + Math.sin(a) * (r - 6);
    ticks += `<line x1="${ix.toFixed(1)}" y1="${iy.toFixed(1)}" x2="${ox.toFixed(1)}" y2="${oy.toFixed(1)}" stroke="${GREY}" stroke-width="${width}" stroke-linecap="round"/>`;
  }
  return `<g>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${WHITE}" stroke="${GREY}" stroke-width="11"/>
    <path d="${wedge}" fill="${GOLD}"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${GREY}" stroke-width="11"/>
    ${ticks}
    <line x1="${cx}" y1="${cy}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${BRONZE}" stroke-width="9" stroke-linecap="round"/>
    <line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy - r * 0.5}" stroke="${BRONZE}" stroke-width="9" stroke-linecap="round"/>
    <circle cx="${cx}" cy="${cy}" r="10" fill="${BRONZE}"/>
  </g>
  ${label(cx, cy - r - 20, `${minutes} MIN`, { size: 22 })}`;
}

function watchedClock(cx, cy, r) {
  const face = clockFace(cx, cy, r, -Math.PI / 2 + 2.6);
  const ring = `<circle cx="${cx}" cy="${cy}" r="${(r + 14).toFixed(1)}" fill="none" stroke="${BRONZE}" stroke-width="3" opacity="0.35"/>`;
  return `<g>${ring}${face}</g>`;
}

function expectedVsActual(cx1, cx2, cy, r) {
  const c1 = clockFace(cx1, cy, r, -Math.PI / 2 + 0.9, { accent: GREY, rim: GREY });
  const c2 = clockFace(cx2, cy, r, -Math.PI / 2 + 3.6, { accent: GOLD, rim: GOLD });
  return `<g>${c1}${c2}</g>
  ${label(cx1, cy - r - 16, "EXPECTED", { size: 19, fill: GREY })}
  ${label(cx2, cy - r - 16, "ACTUAL", { size: 19, fill: GOLD })}`;
}

const weeks = [
  {
    n: 1,
    mechanism: "time",
    hero: [clockInterval(CX, 130, 74, 5)],
  },
  {
    n: 2,
    mechanism: "attention",
    hero: [watchedClock(CX, CY, 90)],
  },
  {
    n: 3,
    mechanism: "expectation",
    hero: [expectedVsActual(650, 950, CY, 62)],
  },
  {
    n: 4,
    mechanism: "information",
    hero: [ticket(690, 45, 220, 140, "N°42"), statusDots(700, 215, 5, 3, 46)],
  },
  {
    n: 5,
    mechanism: "interfaces",
    hero: [progressTrack(550, 100, 500, 50, 0.62)],
  },
  {
    n: 6,
    mechanism: "environment",
    hero: [roomPlan(555, 25, 425, 200, 60)],
  },
  {
    n: 7,
    mechanism: "queue-rules",
    hero: [numberedQueue(575, 135, 4, 70), forwardArrow(835, 135, 90), serviceCounter(985, 135)],
  },
  {
    n: 8,
    mechanism: "priority",
    hero: [priorityQueue(600, 170, 5, 2)],
  },
  {
    n: 9,
    mechanism: "value",
    hero: [balanceScale(CX, 128, 130)],
  },
  {
    n: 10,
    mechanism: "control",
    hero: [decisionFork(650, CY)],
  },
  {
    n: 11,
    mechanism: "expectation",
    hero: [
      viewfinder(615, 35, 370, 175),
      evidenceTags([
        [680, 90],
        [900, 75],
        [820, 175],
        [720, 165],
      ]),
    ],
  },
  {
    n: 12,
    mechanism: "value",
    hero: [
      synthesis(
        [
          [630, 80],
          [690, 180],
          [770, 60],
          [820, 185],
        ],
        950,
        CY,
      ),
    ],
  },
];

for (const week of weeks) {
  const svg = wrap(week.hero);
  writeFileSync(join(outDir, `week-${String(week.n).padStart(2, "0")}.svg`), svg);
}

console.log(`Wrote 6 family banners + ${weeks.length} week banners to ${outDir}`);
