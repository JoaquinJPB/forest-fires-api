import { FastifyPluginAsync } from "fastify";
import { ConfigurationService } from "../services/configurationService";

const configurationsRoutes: FastifyPluginAsync = async (fastify, options) => {
  const configurationService = new ConfigurationService();
  fastify.post("/", async (request, reply) => {
    const config = request.body as {
      userId: number;
      province?: string;
      probableCause?: string;
      status?: string;
      severity?: string;
    };

    const saved = await configurationService.saveConfiguration(config);
    return reply.send(saved);
  });

  fastify.get<{
    Params: { userId: number };
  }>(
    "/:userId",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            userId: { type: "integer", minimum: 1 },
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
      const configs = await configurationService.getConfigurationsByUserId(userId);
      return reply.send(configs);
    }
  );
};

export default configurationsRoutes;
