import type { BriefInput } from "./brief.schema";
import type { ReadinessLevel, ReadinessScore, ScoreBreakdown } from "./types";

const maxScores = {
  goalClarity: 20,
  offerClarity: 20,
  audienceClarity: 20,
  assetReadiness: 15,
  timelineFit: 10,
  budgetFit: 10,
  measurementReadiness: 5,
} satisfies ScoreBreakdown;

export function calculateReadinessScore(input: BriefInput): ReadinessScore {
  const breakdown: ScoreBreakdown = {
    goalClarity: scoreGoalClarity(input),
    offerClarity: scoreTextClarity(
      input.offerDescription,
      maxScores.offerClarity,
    ),
    audienceClarity: scoreAudienceClarity(input),
    assetReadiness: scoreAssetReadiness(input),
    timelineFit: scoreTimelineFit(input),
    budgetFit: scoreBudgetFit(input),
    measurementReadiness: scoreMeasurementReadiness(input),
  };

  const total = Object.values(breakdown).reduce((sum, score) => sum + score, 0);

  return {
    total,
    level: getReadinessLevel(total),
    breakdown,
    detectedGaps: detectGaps(input, breakdown),
  };
}

export function getReadinessLevel(total: number): ReadinessLevel {
  if (total >= 80) {
    return "ready_for_build";
  }

  if (total >= 60) {
    return "strong_start";
  }

  if (total >= 40) {
    return "needs_shaping";
  }

  return "discovery_first";
}

function scoreGoalClarity(input: BriefInput) {
  let score = 12;

  if (input.primaryGoal) {
    score += 4;
  }

  if (input.desiredAction.trim().length >= 40) {
    score += 4;
  }

  return Math.min(score, maxScores.goalClarity);
}

function scoreTextClarity(value: string, maxScore: number) {
  const length = value.trim().length;

  if (length >= 140) {
    return maxScore;
  }

  if (length >= 80) {
    return Math.round(maxScore * 0.8);
  }

  if (length >= 40) {
    return Math.round(maxScore * 0.6);
  }

  return Math.round(maxScore * 0.35);
}

function scoreAudienceClarity(input: BriefInput) {
  const audienceScore = scoreTextClarity(input.targetAudience, 10);
  const problemScore = scoreTextClarity(input.audienceProblem, 10);

  return audienceScore + problemScore;
}

function scoreAssetReadiness(input: BriefInput) {
  let score = 0;

  if (input.hasCopy) {
    score += 6;
  }

  if (input.hasBrandAssets) {
    score += 6;
  }

  if (input.hasAnalytics) {
    score += 3;
  }

  return score;
}

function scoreTimelineFit(input: BriefInput) {
  const scores = {
    asap: 4,
    two_four_weeks: 8,
    one_two_months: 10,
    flexible: 9,
  } satisfies Record<BriefInput["deadline"], number>;

  return scores[input.deadline];
}

function scoreBudgetFit(input: BriefInput) {
  const scores = {
    under_1000: 3,
    "1000_3000": 7,
    "3000_7000": 10,
    "7000_plus": 10,
    not_sure: 5,
  } satisfies Record<BriefInput["budgetRange"], number>;

  return scores[input.budgetRange];
}

function scoreMeasurementReadiness(input: BriefInput) {
  return input.successMetric.trim().length >= 30
    ? maxScores.measurementReadiness
    : 3;
}

function detectGaps(input: BriefInput, breakdown: ScoreBreakdown) {
  const gaps: string[] = [];

  if (breakdown.goalClarity < 16) {
    gaps.push(
      "Define one primary conversion goal and the exact visitor action.",
    );
  }

  if (breakdown.offerClarity < 16) {
    gaps.push("Clarify the offer, its promise, and why it matters now.");
  }

  if (breakdown.audienceClarity < 16) {
    gaps.push(
      "Describe the target audience and buying context in more detail.",
    );
  }

  if (!input.hasCopy) {
    gaps.push("Prepare draft copy or at least a rough content outline.");
  }

  if (!input.hasBrandAssets) {
    gaps.push("Collect brand assets before visual implementation starts.");
  }

  if (!input.hasAnalytics) {
    gaps.push("Add an analytics plan so launch success can be measured.");
  }

  if (input.deadline === "asap") {
    gaps.push(
      "Confirm the launch deadline and reduce scope if the timeline is fixed.",
    );
  }

  if (input.budgetRange === "under_1000" || input.budgetRange === "not_sure") {
    gaps.push(
      "Align budget expectations with the desired scope and launch quality.",
    );
  }

  if (breakdown.measurementReadiness < maxScores.measurementReadiness) {
    gaps.push("Choose one measurable success metric for the landing page.");
  }

  return gaps;
}
