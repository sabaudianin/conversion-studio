import { describe, expect, it } from "vitest";
import type { BriefInput } from "./brief.schema";
import { calculateReadinessScore, getReadinessLevel } from "./scoring";

const strongBrief: BriefInput = {
  name: "Alex Morgan",
  email: "alex@example.com",
  company: "Northstar Analytics",
  projectType: "landing_page",
  primaryGoal: "leads",
  offerDescription:
    "We help B2B operations teams replace messy spreadsheet reporting with a clean dashboard that shows weekly performance, bottlenecks, and priority accounts.",
  targetAudience:
    "Operations leaders at growing B2B SaaS companies with 30-150 employees who need better visibility across sales and customer success workflows.",
  audienceProblem:
    "They are making decisions from fragmented reports, which slows weekly planning and creates confusion about which accounts need attention.",
  desiredAction:
    "Book a qualified discovery call after reviewing the offer, proof, and implementation process.",
  hasCopy: true,
  hasBrandAssets: true,
  hasAnalytics: true,
  deadline: "one_two_months",
  budgetRange: "3000_7000",
  successMetric:
    "Increase qualified demo requests from the landing page by 20%.",
  message: "We want to launch before a partner campaign.",
};

const weakBrief: BriefInput = {
  name: "Sam",
  email: "sam@example.com",
  company: "New Project",
  projectType: "landing_page",
  primaryGoal: "leads",
  offerDescription: "We need a nice landing page for our new service.",
  targetAudience: "Small businesses that need help.",
  audienceProblem: "They want better websites.",
  desiredAction: "Contact us.",
  hasCopy: false,
  hasBrandAssets: false,
  hasAnalytics: false,
  deadline: "asap",
  budgetRange: "not_sure",
  successMetric: "More leads",
  message: "",
};

describe("calculateReadinessScore", () => {
  it("returns a high score for a clear and prepared brief", () => {
    const score = calculateReadinessScore(strongBrief);

    expect(score.total).toBeGreaterThanOrEqual(80);
    expect(score.level).toBe("ready_for_build");
    expect(score.detectedGaps).toHaveLength(0);
  });

  it("returns useful gaps for an unclear and unprepared brief", () => {
    const score = calculateReadinessScore(weakBrief);

    expect(score.total).toBeLessThan(60);
    expect(score.level).toBe("needs_shaping");
    expect(score.detectedGaps).toContain(
      "Prepare draft copy or at least a rough content outline.",
    );
    expect(score.detectedGaps).toContain(
      "Add an analytics plan so launch success can be measured.",
    );
  });

  it.each([
    [90, "ready_for_build"],
    [70, "strong_start"],
    [50, "needs_shaping"],
    [25, "discovery_first"],
  ] as const)("maps %i points to %s", (total, level) => {
    expect(getReadinessLevel(total)).toBe(level);
  });
});
