import fastifyRateLimit from "@fastify/rate-limit"

// Todo add the max number to env
export const autoConfig = () => {
  return {
    max: 100,
    timeWindow: "1 minute",
  }
}

/**
 * This plugins is low overhead rate limiter for your routes.
 *
 * @see {@link https://github.com/fastify/fastify-rate-limit}
 */
export default fastifyRateLimit
