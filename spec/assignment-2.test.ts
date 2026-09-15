import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

interface ApiNode {
  id: string;
  type: string;
  meta?: Record<string, unknown>;
}

interface CourseApi {
  course: { code: string };
  nodes: ApiNode[];
}

const api = JSON.parse(readFileSync(resolve("dist/api/index.json"), "utf8")) as CourseApi;
const nodesOfType = (type: string) => api.nodes.filter((node) => node.type === type);

// Assigned to this repo when it was provisioned; the brief requires keeping
// these three digits no matter which level digit or topic replaces the rest.
const ALLOCATED_CODE_DIGITS = "787";

describe("assignment 2 spec", () => {
  it("keeps the SLOP code's allocated last three digits", () => {
    expect(api.course.code).toMatch(/^SLOP(1|2|3|4|6|8)\d{3}$/);
    expect(api.course.code.slice(-3)).toBe(ALLOCATED_CODE_DIGITS);
  });

  it("runs across twelve dated teaching weeks", () => {
    const sessions = nodesOfType("sessions");
    const weeks = sessions.map((node) => node.meta?.week);
    const uniqueWeeks = new Set(weeks);

    expect(uniqueWeeks.size, "each session week must be distinct").toBe(sessions.length);
    expect(sessions.length, "the course needs one session per teaching week").toBe(12);
    expect([...uniqueWeeks].sort((a, b) => Number(a) - Number(b))).toEqual(
      Array.from({ length: 12 }, (_, i) => i + 1),
    );
    for (const node of sessions) {
      expect(String(node.meta?.date), `${node.id} has no date`).toMatch(/^\d{4}-\d{2}-\d{2}/);
    }
  });

  it("weights its assessments to add up to 100%", () => {
    const assessments = nodesOfType("assessments");
    const total = assessments.reduce((sum, node) => sum + Number(node.meta?.weight ?? 0), 0);

    expect(assessments.length, "at least one assessment must exist").toBeGreaterThan(0);
    expect(total).toBe(100);
  });

  it("links at least one lecture to a deck that actually built", () => {
    const lecturesWithSlides = nodesOfType("lectures").filter(
      (node) => typeof node.meta?.slides === "string" && node.meta.slides.length > 0,
    );

    expect(lecturesWithSlides.length, "no lecture names a deck in its slides field").toBeGreaterThan(0);

    for (const node of lecturesWithSlides) {
      const slidesPath = String(node.meta?.slides).replace(/^\/|\/$/g, "");
      const builtDeck = resolve("dist", slidesPath, "index.html");
      expect(existsSync(builtDeck), `${node.id} points at a deck that didn't build: ${slidesPath}`).toBe(
        true,
      );
    }
  });
});
