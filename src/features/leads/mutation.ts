import { eq } from "drizzle-orm";
import { db } from "@/db";
import { leadNotes, leads } from "@/db/schema";
import type { BriefInput } from "@/features/brief/brief.schema";
import { mapBriefToNewLead } from "./mappers";
import type { LeadStatus } from "./types";

export async function createLeadFromBrief(input: BriefInput) {
  const newLead = mapBriefToNewLead(input);
  const [createdLead] = await db.insert(leads).values(newLead).returning();

  return createdLead;
}

export async function updateLeadStatus(leadId: string, status: LeadStatus) {
  const [updatedLead] = await db
    .update(leads)
    .set({
      status,
      updatedAt: new Date(),
    })
    .where(eq(leads.id, leadId))
    .returning();

  return updatedLead;
}

export async function addLeadNote(leadId: string, body: string) {
  const [createdNote] = await db
    .insert(leadNotes)
    .values({
      leadId,
      body,
    })
    .returning();

  await db
    .update(leads)
    .set({ updatedAt: new Date() })
    .where(eq(leads.id, leadId));

  return createdNote;
}
