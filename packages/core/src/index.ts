/**
 * Core package exports for RAG (Retrieval-Augmented Generation) functionality.
 *
 * Responsibilities:
 * - Provide unified access to RAG processing components
 * - Export AI client implementations and types
 * - Enable document parsing, chunking, and embedding operations
 *
 * Exports:
 * - RAG processing modules (chunk, parse, embed)
 * - AI client factory and types
 */

export * from "./rag/chunk"
export * from "./rag/parse"
export * from "./rag/embed"
export * from "./ai/clients/index"
export * from "./ai/types"
