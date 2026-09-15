import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

interface ApiNode {
  id: string;
  type: string;
  meta?: Record<string, unknown>;
  tags?: string[];
  related?: string[];
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

  // The four tests below check structure only: that a week's session and
  // lecture agree on one mechanism label, that assessments fall in the
  // course's stated phase order, that the one required deck exists, and that
  // assessments are anchored to the weeks that feed them. None of them — and
  // none should ever be written to — establish coherence, intellectual
  // quality, methodological soundness, or prose quality. A green suite here
  // is not a quality judgement; that stays with the crit.

  const WAITING_MECHANISMS = new Set([
    "time",
    "attention",
    "expectation",
    "information",
    "interfaces",
    "environment",
    "queue-rules",
    "priority",
    "value",
    "control",
  ]);

  it("tags each week with exactly one waiting mechanism, agreed by its session and lecture", () => {
    const byWeek = (nodes: ApiNode[]) => {
      const map = new Map<number, ApiNode>();
      for (const node of nodes) {
        const week = Number(node.meta?.week);
        if (Number.isInteger(week)) map.set(week, node);
      }
      return map;
    };

    const sessionsByWeek = byWeek(nodesOfType("sessions"));
    const lecturesByWeek = byWeek(nodesOfType("lectures"));

    for (let week = 1; week <= 12; week += 1) {
      const session = sessionsByWeek.get(week);
      const lecture = lecturesByWeek.get(week);
      expect(session, `week ${week} has no session`).toBeDefined();
      expect(lecture, `week ${week} has no lecture`).toBeDefined();

      const sessionMechanisms = (session?.tags ?? []).filter((tag) => WAITING_MECHANISMS.has(tag));
      const lectureMechanisms = (lecture?.tags ?? []).filter((tag) => WAITING_MECHANISMS.has(tag));

      expect(sessionMechanisms, `week ${week}'s session names no waiting mechanism`).toHaveLength(1);
      expect(lectureMechanisms, `week ${week}'s lecture names no waiting mechanism`).toHaveLength(1);
      expect(
        lectureMechanisms[0],
        `week ${week}'s session and lecture disagree on mechanism`,
      ).toBe(sessionMechanisms[0]);
    }
  });

  it("orders its assessments to match the measure-to-audit progression", () => {
    const findAssessment = (idFragment: string) =>
      nodesOfType("assessments").find((node) => node.id.includes(idFragment));

    const order = ["field-notes", "case-study", "experiment", "audit"].map((fragment) => {
      const node = findAssessment(fragment);
      expect(node, `no assessment id contains "${fragment}"`).toBeDefined();
      return node as ApiNode;
    });

    const dueDates = order.map((node) => String(node.meta?.due));
    for (const [index, date] of dueDates.entries()) {
      expect(date, `${order[index].id} has no due date`).toMatch(/^\d{4}-\d{2}-\d{2}/);
    }

    expect(
      dueDates,
      "assessments are not due in field-notes < case-study < experiment < audit order",
    ).toEqual([...dueDates].sort());
  });

  it("gives Week 5 (\"The Progress Bar\") the course's one required deck", () => {
    const week5Lecture = nodesOfType("lectures").find((node) => Number(node.meta?.week) === 5);
    expect(week5Lecture, "no lecture found for week 5").toBeDefined();
    expect(typeof week5Lecture?.meta?.slides, "week 5's lecture has no slides field").toBe("string");

    const slidesPath = String(week5Lecture?.meta?.slides).replace(/^\/|\/$/g, "");
    const builtDeck = resolve("dist", slidesPath, "index.html");
    expect(existsSync(builtDeck), `week 5's deck didn't build: ${slidesPath}`).toBe(true);
  });

  it("anchors each assessment to a session or lecture from the weeks that feed it", () => {
    const feederWeeksByAssessment: Record<string, number[]> = {
      "field-notes": [1, 2, 3, 4],
      "case-study": [5, 6, 7, 8, 9],
      experiment: [10],
      audit: [11, 12],
    };

    const sessionsAndLectures = [...nodesOfType("sessions"), ...nodesOfType("lectures")];
    const idsForWeeks = (weeks: number[]) =>
      new Set(
        sessionsAndLectures
          .filter((node) => weeks.includes(Number(node.meta?.week)))
          .map((node) => node.id),
      );

    for (const [fragment, weeks] of Object.entries(feederWeeksByAssessment)) {
      const assessment = nodesOfType("assessments").find((node) => node.id.includes(fragment));
      expect(assessment, `no assessment id contains "${fragment}"`).toBeDefined();

      const feederIds = idsForWeeks(weeks);
      const anchored = (assessment?.related ?? []).some(
        (ref) => feederIds.has(ref) || feederIds.has(ref.split("/").pop() ?? ref),
      );

      expect(
        anchored,
        `${fragment} isn't related to any session/lecture from its feeder weeks (${weeks.join(", ")})`,
      ).toBe(true);
    }
  });
});
