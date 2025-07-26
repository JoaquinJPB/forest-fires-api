import { FastifyPluginAsync } from "fastify";
import { FireService } from "../services/fireService";
import { FilteredFieldsEnum } from "../types/fireTypes";

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

  fastify.get<{
    Querystring: { page?: number; limit?: number };
  }>(
    "/api/fires/filtered",
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
            [FilteredFieldsEnum.PROVINCE]: {
              type: "string",
              minLength: 1,
              maxLength: 100,
              default: undefined,
            },
            [FilteredFieldsEnum.PROBABLE_CAUSE]: {
              type: "string",
              minLength: 1,
              maxLength: 100,
              default: undefined,
            },
            [FilteredFieldsEnum.CURRENT_STATUS]: {
              type: "string",
              minLength: 1,
              maxLength: 100,
              default: undefined,
            },
            [FilteredFieldsEnum.MAXIMUM_LEVEL]: {
              type: "string",
              minLength: 1,
              maxLength: 100,
              default: undefined,
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { page, limit, ...rest } = request.query;
      return await fireService.getFilteredPaginatedFires(page as number, limit as number, rest as Record<FilteredFieldsEnum, string>);
    }
  );
};
export default firesRoute;
