/**
 * Authentication OpenAPI schema definitions.
 *
 * Responsibilities:
 * - Define OpenAPI schemas for user authentication endpoints (signup, signin, signout).
 * - Define API key creation and management schemas for programmatic access.
 * - Define session management schemas for user session retrieval.
 * - Provide comprehensive request/response schemas with proper validation and error handling.
 * - Support Better Auth integration with standardized authentication flows.
 *
 * Exports:
 * - `createUserSchema`, `loginUserSchema`, `logoutUserSchema` for user authentication
 * - `createApiKeySchema` for API key management
 * - `getSessionSchema` for session information retrieval
 */

import { errorSchema } from "@/openapi/utils"
import { OpenAPIV3 } from "openapi-types"

/**
 * OpenAPI schema for user registration endpoint.
 * Defines request body validation for email/password signup and response format.
 */
const createUserSchema: OpenAPIV3.OperationObject = {
  tags: ["Auth"],
  summary: "Create a new user with email and password",
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string" },
            name: { type: "string" },
          },
          required: ["email", "password", "name"],
        },
      },
    },
  },
  responses: {
    200: {
      description: "User successfully created",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              token: { type: "string" },
              user: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  email: { type: "string" },
                  name: { type: "string" },
                  image: { type: "string" },
                  emailVerified: { type: "boolean", default: false },
                  createdAt: { type: "string", format: "date-time" },
                  updatedAt: { type: "string", format: "date-time" },
                },
              },
            },
          },
        },
      },
    },
    400: {
      description: "Bad request - validation error",
      content: {
        "application/json": {
          schema: errorSchema(400),
        },
      },
    },
    422: {
      description: "Unprocessable entity",
      content: {
        "application/json": {
          schema: errorSchema(422),
        },
      },
    },
  },
}

/**
 * OpenAPI schema for user authentication endpoint.
 * Defines request body validation for email/password signin and response format.
 */
const loginUserSchema: OpenAPIV3.OperationObject = {
  tags: ["Auth"],
  summary: "Sign in user with email and password",
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string" },
          },
          required: ["email", "password"],
        },
      },
    },
  },
  responses: {
    200: {
      description: "User signed in successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              redirect: { type: "boolean", default: false },
              token: { type: "string" },
              user: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  email: { type: "string" },
                  name: { type: "string" },
                  image: { type: "string" },
                  emailVerified: { type: "boolean", default: false },
                  createdAt: { type: "string", format: "date-time" },
                  updatedAt: { type: "string", format: "date-time" },
                },
              },
            },
          },
        },
      },
    },
    401: {
      description: "Unauthorized",
      content: {
        "application/json": {
          schema: errorSchema(401),
        },
      },
    },
    400: {
      description: "Bad Request",
      content: {
        "application/json": {
          schema: errorSchema(400),
        },
      },
    },
  },
}

/**
 * OpenAPI schema for user logout endpoint.
 * Defines response format for session termination.
 */
const logoutUserSchema: OpenAPIV3.OperationObject = {
  tags: ["Auth"],
  summary: "Sign out user",
  responses: {
    200: {
      description: "User logs out successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", default: true },
            },
          },
        },
      },
    },
    400: {
      description: "Bad Request",
      content: {
        "application/json": {
          schema: errorSchema(400),
        },
      },
    },
  },
}

/**
 * OpenAPI schema for API key creation endpoint.
 * Defines request body validation and comprehensive API key response format with rate limiting details.
 */
const createApiKeySchema: OpenAPIV3.OperationObject = {
  tags: ["Auth"],
  summary: "Create api key",
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            name: { type: "string" },
            userId: { type: "string" },
          },
          required: ["name"],
        },
      },
    },
  },
  responses: {
    200: {
      description: "Successfully create new api key",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" },
              start: { type: "string" },
              prefix: { type: "string" },
              key: { type: "string" },
              userId: { type: "string" },
              refillInterval: { type: "number", nullable: true },
              refillAmount: { type: "number", nullable: true },
              lastRefillAt: {
                type: "string",
                format: "date-time",
                nullable: true,
              },
              enabled: { type: "boolean" },
              rateLimitEnabled: { type: "boolean" },
              rateLimitTimeWindow: { type: "number" },
              rateLimitMax: { type: "number" },
              requestCount: { type: "number" },
              remaining: { type: "number", nullable: true },
              lastRequest: {
                type: "string",
                format: "date-time",
                nullable: true,
              },
              expiresAt: { type: "string", format: "date-time" },
              createdAt: { type: "string", format: "date-time" },
              updatedAt: { type: "string", format: "date-time" },
              permissions: { type: "string", nullable: true },
              metadata: { type: "string", nullable: true },
            },
          },
        },
      },
    },
    400: {
      description: "Bad Request",
      content: {
        "application/json": {
          schema: errorSchema(400),
        },
      },
    },
  },
}

/**
 * OpenAPI schema for session retrieval endpoint.
 * Defines response format for current user session and profile information.
 */
const getSessionSchema: OpenAPIV3.OperationObject = {
  tags: ["Auth"],
  summary: "Get current session",
  responses: {
    200: {
      description: "Successfully fetched current session",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              session: {
                type: "object",
                properties: {
                  expiresAt: { type: "string", format: "date-time" },
                  token: { type: "string" },
                  createdAt: { type: "string", format: "date-time" },
                  updatedAt: { type: "string", format: "date-time" },
                  ipAddress: { type: "string" },
                  userAgent: { type: "string" },
                  userId: { type: "string" },
                  id: { type: "string" },
                },
              },
              user: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  email: { type: "string", format: "email" },
                  emailVerified: { type: "boolean" },
                  image: { type: "string", nullable: true },
                  createdAt: { type: "string", format: "date-time" },
                  updatedAt: { type: "string", format: "date-time" },
                  id: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
  },
}

export {
  createUserSchema,
  loginUserSchema,
  logoutUserSchema,
  createApiKeySchema,
  getSessionSchema,
}
