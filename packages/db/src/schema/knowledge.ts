/**
 * Knowledge processing database schema definitions.
 *
 * Responsibilities:
 * - Define PostgreSQL tables for knowledge job processing.
 * - Create knowledge jobs table with status tracking.
 * - Establish relationships with API keys for access control.
 * - Provide schema definitions for document processing workflow.
 *
 * Exports:
 * - `knowledgeJobsStatus` - Enum for job status values.
 * - `knowledge_jobs` - Table for tracking document processing jobs.
 */

import { pgEnum, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core"
import { ulid } from "ulid"

import { apikey } from "."

export const knowledgeJobsStatus = pgEnum("knowledgeJobsStatus", [
  "queued",
  "processing",
  "completed",
  "failed",
])

export const knowledge_jobs = pgTable("knowledge_jobs", {
  id: varchar("id", { length: 26 })
    .primaryKey()
    .$default(() => ulid()),
  status: knowledgeJobsStatus("status").notNull().default("queued"),
  apikeyId: text("apikey_id")
    .notNull()
    .references(() => apikey.id, { onDelete: "cascade" }),
  fileName: text("filename").notNull(),
  fileType: text("filetype").notNull(),
  filePath: text("filepath").notNull(),
  error: text("error"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
})
