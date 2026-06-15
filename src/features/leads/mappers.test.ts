import { describe, expect, it } from "vitest";
import type { BriefInput } from "@/features/brief/brief.schema";
import { mapBriefToNewLead } from "./mappers";

const brief: BriefInput = {
  name: "Taylor Reed",
  email: "taylor@example.com",
  company: "LaunchKit",
  projectType: "launch_page",
  primaryGoal: "waitlist",
  offerDescription:
    "LaunchKit helps early-stage SaaS teams validate demand with a sharp launch page, clear offer structure, and a focused waitlist conversion path.",
  targetAudience:
    "Founders and small product teams preparing their first public launch with limited time and no internal marketing engineer.",
  audienceProblem:
    "They need to explain the product quickly, capture intent, and learn which audience segments care before building a larger site.",
  desiredAction:
    "Join the waitlist after reading the offer, seeing the product promise, and understanding the launch timeline.",
  hasCopy: true,
  hasBrandAssets: false,
  hasAnalytics: true,
  deadline: "two_four_weeks",
  budgetRange: "1000_3000",
  successMetric: "Collect 150 qualified waitlist signups before product beta.",
  message: "We have rough copy but need structure.",
};

describe("mapBriefToNewLead", () => {
  it("maps brief fields and scoring snapshot into a new lead insert", () => {
    const newLead = mapBriefToNewLead(brief);

    expect(newLead.email).toBe("taylor@example.com");
    expect(newLead.projectType).toBe("launch_page");
    expect(newLead.primaryGoal).toBe("waitlist");
    expect(newLead.readinessScore).toBeGreaterThan(0);
    expect(newLead.readinessLevel).toBeDefined();
    expect(newLead.scoreBreakdown).toHaveProperty("offerClarity");
    expect(newLead.detectedGaps).toContain(
      "Collect brand assets before visual implementation starts.",
    );
  });
});
