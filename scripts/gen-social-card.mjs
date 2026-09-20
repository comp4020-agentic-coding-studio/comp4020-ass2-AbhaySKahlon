#!/usr/bin/env node
// Regenerates src/assets/images/card.png — the site-wide Open Graph / social
// share card — as a finished, course-specific 1200x630 graphic built from the
// same primitive vocabulary as the banner system (src/lib and
// scripts/gen-banner-placeholders.mjs), rather than leaving the starter
// stock-photo placeholder in place (CLAUDE.md rule 6). This is a typographic
///vector design, not the illustrated banner artwork reserved for later
// supply — social platforms require a raster image for og:image, so this
// script rasterises via sharp (already a project dependency through Astro's
// image pipeline) instead of shipping an .svg.
//
// Run with: node scripts/gen-social-card.mjs

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, "..", "src", "assets", "images", "card.png");

const W = 1200;
const H = 630;
const GOLD = "#b97d1c";
const BRONZE = "#8a5c13";
const GREY = "#6b6154";
const CREAM = "#f6efe4";
const CREAM_DEEP = "#e9dbc2";
const INK = "#2a2013";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${CREAM}"/>
      <stop offset="1" stop-color="${CREAM_DEEP}"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>

  <!-- queue ticks, one highlighted -->
  <g>
    ${Array.from({ length: 10 })
      .map((_, i) => {
        const active = i === 7;
        const x = 90 + i * 34;
        const h = active ? 46 : 28;
        return `<line x1="${x}" y1="120" x2="${x}" y2="${120 + h}" stroke="${active ? GOLD : GREY}" stroke-width="${active ? 5 : 2.5}" stroke-linecap="round" opacity="${active ? 1 : 0.45}"/>`;
      })
      .join("\n    ")}
  </g>

  <!-- clock mark -->
  <g fill="none" stroke-linecap="round">
    <circle cx="1040" cy="150" r="80" stroke="${GREY}" stroke-width="3" opacity="0.5"/>
    <line x1="1040" y1="150" x2="1040" y2="105" stroke="${GOLD}" stroke-width="5"/>
    <line x1="1040" y1="150" x2="1075" y2="165" stroke="${BRONZE}" stroke-width="4"/>
    <circle cx="1040" cy="150" r="5" fill="${BRONZE}"/>
  </g>

  <text x="90" y="330" font-family="Georgia, 'Times New Roman', serif" font-size="34" letter-spacing="6" fill="${BRONZE}">SLOP4787</text>
  <text x="90" y="410" font-family="Georgia, 'Times New Roman', serif" font-size="66" font-weight="700" fill="${INK}">The Science of Waiting</text>
  <text x="90" y="460" font-family="Georgia, 'Times New Roman', serif" font-size="30" font-style="italic" fill="${GREY}">Waiting is an experience, not merely a duration.</text>

  <!-- progress bar -->
  <rect x="90" y="510" width="1020" height="16" rx="8" fill="none" stroke="${GREY}" stroke-width="2.5" opacity="0.55"/>
  <rect x="90" y="510" width="530" height="16" rx="8" fill="${GOLD}"/>
</svg>`;

const png = await sharp(Buffer.from(svg)).resize(W, H).png().toBuffer();
writeFileSync(outPath, png);
console.log(`Wrote ${outPath} (${png.length} bytes)`);
