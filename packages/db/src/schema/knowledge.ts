/**
 * Knowledge processing database schema definitions.
 *
 * Responsibilities:
 * - Define PostgreSQL tables for knowledge job processing.
 * - Create sources table for document metadata and file information.
 * - Create knowledge jobs table with status tracking.
 * - Establish relationships with API keys for access control.
 * - Provide schema definitions for document processing workflow.
 *
 * Exports:
 * - `knowledgeJobsStatus` - Enum for job status values.
 * - `sources` - Table for storing document source information.
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
 * Sources table for storing document source information.
 * Tracks file metadata, location, and API key associations for access control.
 */
export const sources = pgTable("sources", {
  id: varchar("id", { length: 26 })
    .primaryKey()
    .$default(() => ulid()),
  sourceType: text("source_type").notNull(),
  location: text("location").notNull(),
  fileName: text("file_name"),
  mimeType: text("mime_type"),
  apikeyId: text("api_key_id")
    .notNull()
    .references(() => apikey.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
})

/**
 * Knowledge jobs table for tracking document processing workflow.
 * Links jobs to API keys for access control and status monitoring.
 */
export const knowledgeJobs = pgTable("knowledge_jobs", {
  id: varchar("id", { length: 26 })
    .primaryKey()
    .$default(() => ulid()), // Generate ULID for unique, sortable job IDs
  sourceId: text("source_id")
    .notNull()
    .references(() => sources.id, { onDelete: "cascade" }),
  status: knowledgeJobsStatus("status").notNull().default("queued"),
  error: text("error"), // Store error message if job fails
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
})
