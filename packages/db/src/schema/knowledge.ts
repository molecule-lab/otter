/**
 * Knowledge processing database schema definitions.
 *
 * Responsibilities:
 * - Define PostgreSQL tables for complete RAG processing pipeline.
 * - Create sources table for document metadata and file information.
 * - Create knowledge jobs table with status tracking.
 * - Create knowledge items table for processed document metadata.
 * - Create knowledge chunks table for text segments.
 * - Create knowledge embeddings table for vector data.
 * - Establish relationships with API keys for access control.
 * - Provide schema definitions for document processing workflow.
 *
 * Exports:
 * - `knowledgeJobsStatus` - Enum for job status values.
 * - `vectorType` - Custom PostgreSQL vector type for embeddings.
 * - `sources` - Table for storing document source information.
 * - `knowledge_jobs` - Table for tracking document processing jobs.
 * - `knowledge_items` - Table for processed document metadata.
 * - `knowledge_chunks` - Table for text chunks from documents.
 * - `knowledge_embeddings` - Table for vector embeddings of chunks.
 */

import {
  customType,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core"
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
 * Custom PostgreSQL vector type for storing embedding data.
 *
 * This type handles conversion between TypeScript number arrays and
 * PostgreSQL's pgvector extension format for efficient vector storage
 * and similarity search operations.
 */
export const vectorType = customType<{
  data: number[]
  driverData: string
}>({
  dataType() {
    return "vector(1536)" // 1536 dimensions for OpenAI text-embedding-3-small
  },
  toDriver(value) {
    return `[${value.join(",")}]` // Convert number[] → pgvector string format
  },
  fromDriver(value) {
    return value
      .slice(1, -1) // Remove surrounding brackets
      .split(",")
      .map(parseFloat) // Convert string[] → number[]
  },
})

/**
 * Sources table for storing document source information.
 * Tracks file metadata, location, and API key associations for access control.
 */
export const sources = pgTable("sources", {
  id: varchar("id", { length: 26 })
    .primaryKey()
    .$default(() => ulid())
    .notNull(),
  sourceType: text("source_type").notNull(),
  location: text("location").notNull(),
  fileName: text("file_name"),
  mimeType: text("mime_type"),
  apikeyId: text("api_key_id")
    .notNull()
    .references(() => apikey.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
})

/**
 * Knowledge jobs table for tracking document processing workflow.
 * Links jobs to API keys for access control and status monitoring.
 */
export const knowledgeJobs = pgTable("knowledge_jobs", {
  id: varchar("id", { length: 26 })
    .primaryKey()
    .$default(() => ulid())
    .notNull(), // Generate ULID for unique, sortable job IDs
  sourceId: text("source_id")
    .notNull()
    .references(() => sources.id, { onDelete: "cascade" }),
  status: knowledgeJobsStatus("status").notNull().default("queued"),
  error: text("error"), // Store error message if job fails
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
})

/**
 * Knowledge items table for storing processed document metadata.
 * Contains configuration and statistics from the RAG processing pipeline.
 */
export const knowledgeItems = pgTable("knowledge_items", {
  id: varchar("id", { length: 26 })
    .primaryKey()
    .$default(() => ulid())
    .notNull(),
  sourceId: text("source_id")
    .notNull()
    .references(() => sources.id, { onDelete: "cascade" }),
  knowledgeJobId: text("knowledge_job_id").references(() => knowledgeJobs.id, {
    onDelete: "set null",
  }),
  chunksCount: numeric("chunks_count").notNull(),
  chunkSize: numeric("chunk_size").notNull(),
  chunkOverlap: numeric("chunk_overlap").notNull(),
  splitter: text("splitter"),
  embeddingModel: text("embedding_model").notNull(),
  embeddingProvider: text("embedding_provider").notNull(),
  totalTokens: numeric("total_tokens").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
})

/**
 * Knowledge chunks table for storing text segments from processed documents.
 * Each chunk represents a portion of the original document text.
 */
export const knowledgeChunks = pgTable("knowledge_chunks", {
  id: varchar("id", { length: 26 })
    .primaryKey()
    .$default(() => ulid())
    .notNull(),
  knowledgeItemId: text("knowledge_item_id")
    .notNull()
    .references(() => knowledgeItems.id, { onDelete: "cascade" }),
  text: text("text").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
})

/**
 * Knowledge embeddings table for storing vector representations of text chunks.
 * Contains 1536-dimensional vectors for semantic similarity search operations.
 */
export const knowledgeEmbeddings = pgTable("knowledge_embeddings", {
  id: varchar("id", { length: 26 })
    .primaryKey()
    .$default(() => ulid())
    .notNull(),
  knowledgeChunkId: text("knowledge_chunk_id")
    .notNull()
    .references(() => knowledgeChunks.id, { onDelete: "cascade" }),
  embedding: vectorType("embedding").notNull(),
  tokenCount: numeric("token_count").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
})
