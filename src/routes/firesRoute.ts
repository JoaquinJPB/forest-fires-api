import { FastifyPluginAsync } from "fastify";
import { FireService } from "../services/fireService";

const firesRoute: FastifyPluginAsync = async (fastify, options) => {
  const fireService = new FireService(fastify);
  fastify.get<{
    Querystring: { page?: number; limit?: number };
  }>(
    "/api/fires",
    {
      schema: {
        querystring: {
          type: "object",
          properties: {
            page: {
              type: "integer",
              minimum: 1,
              default: 1,
            },
            limit: {
              type: "integer",
              minimum: 1,
              maximum: 100,
              default: 10,
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { page, limit } = request.query;
      return await fireService.getPaginatedFires(page as number, limit as number);
    }
  );
};
export default firesRoute;
