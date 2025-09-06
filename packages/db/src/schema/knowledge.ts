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

/**
 * Enumeration for knowledge job processing status values.
 * Tracks the current state of document processing jobs.
 */
export const knowledgeJobsStatus = pgEnum("knowledgeJobsStatus", [
  "queued", // Job created and waiting to be processed
  "processing", // Job currently being processed
  "completed", // Job finished successfully
  "failed", // Job failed with error
])

/**
 * Knowledge jobs table for tracking document processing workflow.
 * Links jobs to API keys for access control and status monitoring.
 */
export const knowledge_jobs = pgTable("knowledge_jobs", {
  id: varchar("id", { length: 26 })
    .primaryKey()
    .$default(() => ulid()), // Generate ULID for unique, sortable job IDs
  status: knowledgeJobsStatus("status").notNull().default("queued"),
  apikeyId: text("apikey_id")
    .notNull()
    .references(() => apikey.id, { onDelete: "cascade" }), // Link to API key for access control
  fileName: text("filename").notNull(),
  fileType: text("filetype").notNull(),
  filePath: text("filepath").notNull(),
  error: text("error"), // Store error message if job fails
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
})
