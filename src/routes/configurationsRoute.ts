import { FastifyInstance } from "fastify";
import { prisma } from "../prisma";

export default async function configurationsRoutes(fastify: FastifyInstance) {
  fastify.post("/api/configurations", async (request, reply) => {
    const config = request.body as {
      userId: number;
      province?: string;
      probableCause?: string;
      status?: string;
      severity?: string;
    };

    if (!config.userId) {
      return reply.status(400).send({ error: "userId is required" });
    }

    const saved = await prisma.filterConfiguration.create({ data: config });
    return reply.send(saved);
  });

  fastify.get<{
    Params: { userId: number };
  }>(
    "/api/configurations/:userId",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            userId: { type: "integer", minimum: 1 }, // valida que sea un entero positivo
          },
          required: ["userId"],
        },
        response: {
          200: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "integer" },
                userId: { type: "integer" },
                province: { type: "string", nullable: true },
                probableCause: { type: "string", nullable: true },
                status: { type: "string", nullable: true },
                severity: { type: "string", nullable: true },
              },
              required: ["id", "userId"],
            },
          },
          404: {
            type: "object",
            properties: {
              error: { type: "string" },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { userId } = request.params;

      const configs = await prisma.filterConfiguration.findMany({
        where: { userId },
      });

      if (configs.length === 0) {
        return reply.status(404).send({ error: "No configurations found" });
      }

      return reply.send(configs);
    }
  );
}
