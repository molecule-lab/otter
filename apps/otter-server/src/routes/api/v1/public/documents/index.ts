import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.post("/", {}, async (request, reply) => {
    return reply.code(200).send({ message: "Create Documents" });
  });

  fastify.get("/", {}, async (request, reply) => {
    return reply.code(200).send({ message: "Fetch Documents" });
  });
};

export default plugin;
