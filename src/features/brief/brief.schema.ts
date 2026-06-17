import { z } from "zod";

export const projectTypes = [
  "landing_page",
  "marketing_site",
  "redesign",
  "launch_page",
] as const;

export const primaryGoals = [
  "leads",
  "signups",
  "bookings",
  "sales",
  "waitlist",
] as const;

export const budgetRanges = [
  "under_1000",
  "1000_3000",
  "3000_7000",
  "7000_plus",
  "not_sure",
] as const;

export const deadlineRanges = [
  "asap",
  "two_four_weeks",
  "one_two_months",
  "flexible",
] as const;

export const briefSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  email: z.email("Enter a valid email address."),
  company: z.string().trim().min(2, "Company or project name is required."),
  projectType: z.enum(projectTypes),
  primaryGoal: z.enum(primaryGoals),
  offerDescription: z
    .string()
    .trim()
    .min(30, "Describe the offer in at least 30 characters."),
  targetAudience: z
    .string()
    .trim()
    .min(20, "Describe the audience in at least 20 characters."),
  audienceProblem: z
    .string()
    .trim()
    .min(20, "Describe the audience problem in at least 20 characters."),
  desiredAction: z
    .string()
    .trim()
    .min(10, "Describe the desired visitor action."),
  hasCopy: z.boolean(),
  hasBrandAssets: z.boolean(),
  hasAnalytics: z.boolean(),
  deadline: z.enum(deadlineRanges),
  budgetRange: z.enum(budgetRanges),
  successMetric: z
    .string()
    .trim()
    .min(10, "Add one measurable success metric."),
  message: z.string().trim().max(1000).optional().default(""),
});

export type BriefInput = z.infer<typeof briefSchema>;

export type ProjectType = (typeof projectTypes)[number];
export type PrimaryGoal = (typeof primaryGoals)[number];
export type BudgetRange = (typeof budgetRanges)[number];
export type DeadlineRange = (typeof deadlineRanges)[number];
