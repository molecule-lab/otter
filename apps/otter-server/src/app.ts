import path from "node:path";

import { FastifyInstance, FastifyPluginOptions } from "fastify";
import fastifyAutoload from "@fastify/autoload";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import { appRouter, createContext } from "@otter/api";

export default async function serviceApp(
  fastify: FastifyInstance,
  opts: FastifyPluginOptions,
) {
  delete opts.skipOverride;

  await fastify.register(fastifyAutoload, {
    dir: path.join(__dirname, "plugins/external"),
    options: { ...opts },
  });

  await fastify.register(fastifyAutoload, {
    dir: path.join(__dirname, "plugins/app"),
    options: { ...opts },
  });

  // await fastify.register(fastifyAutoload, {
  //   dir: path.join(__dirname, "plugins"),
  //   options: { ...opts },
  // });

  await fastify.register(fastifyTRPCPlugin, {
    prefix: "/trpc",
    trpcOptions: {
      router: appRouter,
      createContext,
    },
  });

  await fastify.register(fastifyAutoload, {
    dir: path.join(__dirname, "routes"),
    autoHooks: true,
    cascadeHooks: true,
    options: { ...opts },
  });

  fastify.setErrorHandler((err, request, reply) => {
    fastify.log.error(
      {
        err,
        request: {
          method: request.method,
          url: request.url,
          query: request.query,
          params: request.params,
        },
      },
      "Unhandled error occurred",
    );

    reply.code(err.statusCode ?? 500);

    let message = "Internal Server Error";
    if (err.statusCode && err.statusCode < 500) {
      message = err.message;
    }

    return { message };
  });

  fastify.setNotFoundHandler(
    {
      preHandler: fastify.rateLimit({
        max: 3,
        timeWindow: 500,
      }),
    },
    (request, reply) => {
      request.log.warn(
        {
          request: {
            method: request.method,
            url: request.url,
            query: request.query,
            params: request.params,
          },
        },
        "Resource not found",
      );

      reply.code(404);

      return { message: "Not Found" };
    },
  );
}
