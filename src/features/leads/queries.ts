import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { leadNotes, leads } from "@/db/schema";

export async function getRecentLeads(limit = 20) {
  return db.select().from(leads).orderBy(desc(leads.createdAt)).limit(limit);
}

export async function getLeadById(leadId: string) {
  const [lead] = await db.select().from(leads).where(eq(leads.id, leadId));

  return lead ?? null;
}

export async function getLeadNotes(leadId: string) {
  return db
    .select()
    .from(leadNotes)
    .where(eq(leadNotes.leadId, leadId))
    .orderBy(desc(leadNotes.createdAt));
}
