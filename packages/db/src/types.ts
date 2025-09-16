/**
 * Database type definitions and schema types.
 *
 * Responsibilities:
 * - Define TypeScript types for database schema structure.
 * - Export database instance types for type safety.
 * - Provide typed database interface for application use.
 * - Enable type-safe database operations across the application.
 *
 * Exports:
 * - `DatabaseSchema` - Type definition for the complete database schema.
 * - `DatabaseInstance` - Typed database instance for Drizzle ORM operations.
 */

import {
  account,
  apikey,
  knowledgeChunks,
  knowledgeChunksRelations,
  knowledgeEmbeddings,
  knowledgeEmbeddingsRelations,
  knowledgeItems,
  knowledgeItemsRelations,
  knowledgeJobs,
  knowledgeJobsRelations,
  knowledgeQuery,
  knowledgeQueryResult,
  session,
  sources,
  sourcesRelations,
  user,
  verification,
} from "@/schema"
import { InferInsertModel } from "drizzle-orm"
import { NodePgDatabase } from "drizzle-orm/node-postgres"

/**
 * Type definition representing the complete database schema structure.
 * Combines all table definitions and relations for type-safe database operations.
 */
export type DatabaseSchema = {
  user: typeof user
  account: typeof account
  apikey: typeof apikey
  session: typeof session
  verification: typeof verification
  knowledgeJobs: typeof knowledgeJobs
  knowledgeJobsRelations: typeof knowledgeJobsRelations
  sources: typeof sources
  sourcesRelations: typeof sourcesRelations
  knowledgeItems: typeof knowledgeItems
  knowledgeItemsRelations: typeof knowledgeItemsRelations
  knowledgeChunks: typeof knowledgeChunks
  knowledgeChunksRelations: typeof knowledgeChunksRelations
  knowledgeEmbeddings: typeof knowledgeEmbeddings
  knowledgeEmbeddingsRelations: typeof knowledgeEmbeddingsRelations
  knowledgeQuery: typeof knowledgeQuery
  knowledgeQueryResult: typeof knowledgeQueryResult
}

/**
 * Typed database instance for Drizzle ORM operations.
 * Provides full type safety for all database queries and mutations.
 */
export type DatabaseInstance = NodePgDatabase<DatabaseSchema>

/**
 * Type for inserting new knowledge job records.
 * Represents the data structure for creating knowledge processing jobs.
 */
export type KnowledgeJob = InferInsertModel<typeof knowledgeJobs>

/**
 * Type for inserting new source records.
 * Represents the data structure for creating document source entries.
 */
export type Source = InferInsertModel<typeof sources>

/**
 * Combined type that includes knowledge job data with associated source information.
 * Used for operations that require both job and source data together.
 */
export type KnowledgeJobWithSource = KnowledgeJob & { source: Source }

/**
 * Type for inserting new knowledge item records.
 * Represents the data structure for creating knowledge items with processing metadata.
 */
export type KnowledgeItem = InferInsertModel<typeof knowledgeItems>

/**
 * Type for inserting new knowledge chunk records.
 * Represents the data structure for creating text chunks from processed documents.
 */
export type KnowledgeChunk = InferInsertModel<typeof knowledgeChunks>

/**
 * Type for inserting new knowledge embedding records.
 * Represents the data structure for creating vector embeddings for text chunks.
 */
export type KnowledgeEmbedding = InferInsertModel<typeof knowledgeEmbeddings>

export type KnowledgeQuery = InferInsertModel<typeof knowledgeQuery>

export type KnowledgeQueryResult = InferInsertModel<typeof knowledgeQueryResult>
