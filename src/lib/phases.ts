// The course's five-stage pedagogical progression (CLAUDE.md rule 11:
// measure -> explain -> analyse -> experiment -> audit). This is informational
// scaffolding over the twelve weeks, distinct from the four graded
// assessments (Field Notes / Case Study / Experiment / Audit) — see
// AssessmentTracker.astro. Do not conflate the two: several weeks share a
// phase, and a phase is not "worth" a grade.
export type CoursePhase = "Measure" | "Explain" | "Analyse" | "Experiment" | "Audit";

export interface PhaseRange {
  phase: CoursePhase;
  from: number;
  to: number;
}

export const PHASES: readonly PhaseRange[] = [
  { phase: "Measure", from: 1, to: 1 },
  { phase: "Explain", from: 2, to: 4 },
  { phase: "Analyse", from: 5, to: 9 },
  { phase: "Experiment", from: 10, to: 10 },
  { phase: "Audit", from: 11, to: 12 },
];

export function phaseForWeek(week: number): CoursePhase {
  const range = PHASES.find((p) => week >= p.from && week <= p.to);
  if (!range) throw new Error(`week ${week} is outside the course's 12-week span`);
  return range.phase;
}

export function phaseRangeLabel(phase: CoursePhase): string {
  const range = PHASES.find((p) => p.phase === phase);
  if (!range) throw new Error(`unknown phase ${phase}`);
  return range.from === range.to ? `Week ${range.from}` : `Weeks ${range.from}–${range.to}`;
}
