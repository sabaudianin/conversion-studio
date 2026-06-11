import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import type { ScoreBreakdown } from "@/features/brief/types";

export const projectTypeEnum = pgEnum("project_type", [
  "landing_page",
  "marketing_site",
  "redesign",
  "launch_page",
]);

export const primaryGoalEnum = pgEnum("primary_goal", [
  "leads",
  "signups",
  "bookings",
  "sales",
  "waitlist",
]);

export const deadlineEnum = pgEnum("deadline", [
  "asap",
  "two_four_weeks",
  "one_two_months",
  "flexible",
]);

export const budgetRangeEnum = pgEnum("budget_range", [
  "under_1000",
  "1000_3000",
  "3000_7000",
  "7000_plus",
  "not_sure",
]);

export const leadStatusEnum = pgEnum("lead_status", [
  "new",
  "reviewing",
  "qualified",
  "proposal_sent",
  "won",
  "lost",
  "archived",
]);

export const readinessLevelEnum = pgEnum("readiness_level", [
  "ready_for_build",
  "strong_start",
  "needs_shaping",
  "discovery_first",
]);

export const leads = pgTable(
  "leads",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    company: text("company").notNull(),
    projectType: projectTypeEnum("project_type").notNull(),
    primaryGoal: primaryGoalEnum("primary_goal").notNull(),
    offerDescription: text("offer_description").notNull(),
    targetAudience: text("target_audience").notNull(),
    audienceProblem: text("audience_problem").notNull(),
    desiredAction: text("desired_action").notNull(),
    hasCopy: boolean("has_copy").notNull(),
    hasBrandAssets: boolean("has_brand_assets").notNull(),
    hasAnalytics: boolean("has_analytics").notNull(),
    deadline: deadlineEnum("deadline").notNull(),
    budgetRange: budgetRangeEnum("budget_range").notNull(),
    successMetric: text("success_metric").notNull(),
    message: text("message").notNull().default(""),
    readinessScore: integer("readiness_score").notNull(),
    readinessLevel: readinessLevelEnum("readiness_level").notNull(),
    scoreBreakdown: jsonb("score_breakdown").$type<ScoreBreakdown>().notNull(),
    detectedGaps: jsonb("detected_gaps").$type<string[]>().notNull(),
    status: leadStatusEnum("status").notNull().default("new"),
    aiSummary: text("ai_summary"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("leads_status_idx").on(table.status),
    index("leads_readiness_score_idx").on(table.readinessScore),
    index("leads_created_at_idx").on(table.createdAt),
  ],
);

export const leadNotes = pgTable(
  "lead_notes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    leadId: uuid("lead_id")
      .notNull()
      .references(() => leads.id, { onDelete: "cascade" }),
    body: text("body").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("lead_notes_lead_id_idx").on(table.leadId)],
);

export const leadsRelations = relations(leads, ({ many }) => ({
  notes: many(leadNotes),
}));

export const leadNotesRelations = relations(leadNotes, ({ one }) => ({
  lead: one(leads, {
    fields: [leadNotes.leadId],
    references: [leads.id],
  }),
}));

export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
export type LeadNote = typeof leadNotes.$inferSelect;
export type NewLeadNote = typeof leadNotes.$inferInsert;
