import type { BriefInput } from "./brief.schema";

export type ReadinessLevel =
  | "ready_for_build"
  | "strong_start"
  | "needs_shaping"
  | "discovery_first";

export type ScoreBreakdown = {
  goalClarity: number;
  offerClarity: number;
  audienceClarity: number;
  assetReadiness: number;
  timelineFit: number;
  budgetFit: number;
  measurementReadiness: number;
};

export type ReadinessScore = {
  total: number;
  level: ReadinessLevel;
  breakdown: ScoreBreakdown;
  detectedGaps: string[];
};

export type BriefSubmission = BriefInput & {
  readinessScore: ReadinessScore;
};
