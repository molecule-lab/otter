/**
 * Core package exports for RAG (Retrieval-Augmented Generation) functionality.
 *
 * Responsibilities:
 * - Provide unified access to RAG processing components
 * - Export AI client implementations and types
 * - Enable document parsing, chunking, and embedding operations
 * - Expose the complete RAG processing pipeline
 *
 * Exports:
 * - AI client factory and types for embedding generation
 * - Complete RAG processing pipeline (parse, chunk, embed)
 * - Individual RAG processing modules and utilities
 */

export * from "./ai/clients/index"
export * from "./ai/types"
export * from "./rag"
