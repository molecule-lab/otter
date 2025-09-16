/**
 * Knowledge embedding repository for database operations.
 *
 * Responsibilities:
 * - Handle database operations for vector embeddings
 * - Provide CRUD operations for embedding data persistence
 * - Support both single and batch embedding creation operations
 * - Maintain data integrity for chunk-embedding relationships
 */

import { knowledgeEmbeddings } from "@otter/db/schema"
import { DatabaseInstance, KnowledgeEmbedding } from "@otter/db/types"
import { SQL, sql } from "drizzle-orm"

/**
 * Creates a knowledge embedding repository instance with database operations.
 * @param db - Database instance for embedding operations
 * @returns Repository object with embedding-specific database methods
 */
function createKnowledgeEmbeddingRepository(db: DatabaseInstance) {
  return {
    /**
     * Creates a single knowledge embedding in the database.
     * @param knowledgeEmbeddingData - Embedding data to insert
     * @returns Promise resolving to the created embedding record
     */
    async createOne(knowledgeEmbeddingData: KnowledgeEmbedding) {
      const [created] = await db
        .insert(knowledgeEmbeddings)
        .values(knowledgeEmbeddingData)
        .returning()

      return created
    },
    /**
     * Creates multiple knowledge embeddings in a single database operation.
     * @param knowledgeEmbeddingsData - Array of embedding data to insert
     * @returns Promise resolving to array of created embedding records
     */
    async createMany(knowledgeEmbeddingsData: Array<KnowledgeEmbedding>) {
      const createdEmbeddings = await db
        .insert(knowledgeEmbeddings)
        .values(knowledgeEmbeddingsData)
        .returning()

      return createdEmbeddings
    },

    /**
     * Finds the nearest knowledge embeddings using vector similarity search.
     * Uses PostgreSQL's pgvector extension for efficient cosine similarity matching.
     * @param embedding - SQL expression representing the query vector
     * @param limit - Maximum number of results to return
     * @returns Promise resolving to array of nearest embeddings with chunks and similarity scores
     */
    async findNearest(embedding: SQL<unknown>, limit: number) {
      return db.query.knowledgeEmbeddings.findMany({
        columns: {
          embedding: false,
          tokenCount: false,
          id: false,
          createdAt: false,
          updatedAt: false,
        },
        with: {
          knowledgeChunk: { columns: { id: true, text: true } },
        },
        extras: {
          score:
            sql<number>`${knowledgeEmbeddings.embedding}<=>${embedding}`.as(
              "score",
            ),
        },
        orderBy: sql`${knowledgeEmbeddings.embedding}<=>${embedding}`,
        limit,
      })
    },
  }
}

export { createKnowledgeEmbeddingRepository }
