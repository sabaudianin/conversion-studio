"use server";

import { briefSchema } from "@/features/brief/brief.schema";
import type { ReadinessScore } from "@/features/brief/types";
import { createLeadFromBrief } from "@/features/leads/mutation";
import type { ActionResult } from "@/lib/action-result";
import { formatZodFieldErrors } from "@/lib/action-result";

export type SubmitBriefResult = {
  leadId: string;
  readinessScore: ReadinessScore;
};

export async function submitBriefAction(
  input: unknown,
): Promise<ActionResult<SubmitBriefResult>> {
  const parsedInput = briefSchema.safeParse(input);

  if (!parsedInput.success) {
    return {
      ok: false,
      message: "Please review the highlighted fields and try again.",
      fieldErrors: formatZodFieldErrors(parsedInput.error),
    };
  }

  try {
    const lead = await createLeadFromBrief(parsedInput.data);

    return {
      ok: true,
      data: {
        leadId: lead.id,
        readinessScore: {
          total: lead.readinessScore,
          level: lead.readinessLevel,
          breakdown: lead.scoreBreakdown,
          detectedGaps: lead.detectedGaps,
        },
      },
    };
  } catch (error) {
    console.error("Failed to submit brief", error);

    return {
      ok: false,
      message:
        "Something went wrong while submitting your brief. Please try again.",
    };
  }
}
