/**
 * Knowledge base OpenAPI schema definitions.
 *
 * Responsibilities:
 * - Define OpenAPI schemas for document upload and processing endpoints.
 * - Define semantic search schemas for knowledge base querying.
 * - Provide both Fastify and Swagger-compatible schema formats for flexibility.
 * - Support file upload validation (PDF only) and multipart form data handling.
 * - Define comprehensive response schemas for knowledge items and search results.
 *
 * Exports:
 * - `createKnowledgeSchema` for Fastify route validation
 * - `createKnowledgeSwaggerSchema` for OpenAPI documentation
 * - `fetchKnowledgeSchema` for semantic search endpoint validation
 */

import { OpenAPIV3 } from "openapi-types"

/**
 * Fastify schema for document upload endpoint.
 * Defines multipart form validation and response format for PDF processing.
 */
const createKnowledgeSchema = {
  summary: "Upload and process document",
  description:
    "Upload a PDF document to be processed and stored in the knowledge base",

  consumes: ["multipart/form-data"],

  response: {
    200: {
      type: "object",
      properties: {
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            knowledgeItem: {
              type: "object",
              properties: {
                id: { type: "string" },
                sourceId: { type: "string" },
                knowledgeJobId: { type: "string" },
                chunksCount: { type: "number" },
                chunkSize: { type: "number" },
                chunkOverlap: { type: "number" },
                splitter: { type: "string" },
                embeddingModel: { type: "string" },
                embeddingProvider: { type: "string" },
                totalTokens: { type: "number" },
                createdAt: { type: "string", format: "date-time" },
                updatedAt: { type: "string", format: "date-time" },
              },
            },
          },
        },
      },
    },
    400: {
      type: "object",
      properties: {
        error: { type: "string" },
        message: { type: "string" },
      },
    },
  },
}

/**
 * OpenAPI schema for document upload endpoint (Swagger UI compatible).
 * Provides file picker interface and comprehensive response documentation.
 */
const createKnowledgeSwaggerSchema: OpenAPIV3.OperationObject = {
  tags: ["Knowledge"],
  summary: "Create knowledge item",
  description: "Create a knowledge item, store chunks and embeddings",
  requestBody: {
    required: true,
    content: {
      "multipart/form-data": {
        schema: {
          type: "object",
          properties: {
            file: {
              type: "string",
              format: "binary", // 👈 file picker in Swagger UI
            },
          },
          required: ["file"],
        },
      },
    },
  },
  parameters: [
    {
      name: "x-api-key",
      in: "header",
      required: true,
      schema: {
        type: "string",
      },
      description: "API key for authentication",
    },
  ],
  responses: {
    200: {
      description: "File uploaded successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: { type: "string" },
              data: {
                type: "object",
                properties: {
                  knowledgeItem: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      sourceId: { type: "string" },
                      knowledgeJobId: { type: "string" },
                      chunksCount: { type: "number" },
                      chunkSize: { type: "number" },
                      chunkOverlap: { type: "number" },
                      splitter: { type: "string" },
                      embeddingModel: { type: "string" },
                      embeddingProvider: { type: "string" },
                      totalTokens: { type: "number" },
                      createdAt: { type: "string", format: "date-time" },
                      updatedAt: { type: "string", format: "date-time" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
}

/**
 * Fastify schema for semantic search endpoint.
 * Defines query parameter validation and search result response format.
 */
const fetchKnowledgeSchema = {
  tags: ["Knowledge"],
  summary: "Search knowledge base",
  description: "Perform semantic search against the knowledge base",
  headers: {
    type: "object",
    properties: {
      "x-api-key": {
        type: "string",
        description: "API key for authentication",
      },
    },
    required: ["x-api-key"],
  },
  querystring: {
    type: "object",
    properties: {
      q: {
        type: "string",
        description: "Search query",
      },
    },
    required: ["q"],
  },
  response: {
    200: {
      type: "object",
      properties: {
        message: { type: "string" },
        result: { type: "array" },
      },
    },
  },
}

export {
  fetchKnowledgeSchema,
  createKnowledgeSchema,
  createKnowledgeSwaggerSchema,
}
