import type { NewLead } from "@/db/schema";
import type { BriefInput } from "@/features/brief/brief.schema";
import { calculateReadinessScore } from "@/features/brief/scoring";

export function mapBriefToNewLead(input: BriefInput): NewLead {
  const score = calculateReadinessScore(input);

  return {
    name: input.name,
    email: input.email,
    company: input.company,
    projectType: input.projectType,
    primaryGoal: input.primaryGoal,
    offerDescription: input.offerDescription,
    targetAudience: input.targetAudience,
    audienceProblem: input.audienceProblem,
    desiredAction: input.desiredAction,
    hasCopy: input.hasCopy,
    hasBrandAssets: input.hasBrandAssets,
    hasAnalytics: input.hasAnalytics,
    deadline: input.deadline,
    budgetRange: input.budgetRange,
    successMetric: input.successMetric,
    message: input.message,
    readinessScore: score.total,
    readinessLevel: score.level,
    scoreBreakdown: score.breakdown,
    detectedGaps: score.detectedGaps,
  };
}
