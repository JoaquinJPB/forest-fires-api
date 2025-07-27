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
      const fires = await fireService.getPaginatedFires(page as number, limit as number);
      return reply.send(fires);
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
      const filteredFires = await fireService.getFilteredPaginatedFires(page as number, limit as number, rest as Record<FilteredFieldsEnum, string>);
      return reply.send(filteredFires);
    }
  );

  fastify.get<{
    Querystring: { radius: number; lat: number; lon: number; page?: number; limit?: number };
  }>(
    "/api/fires/nearby",
    {
      schema: {
        querystring: {
          type: "object",
          required: ["radius", "lat", "lon"],
          properties: {
            radius: {
              type: "number",
              minimum: 1,
            },
            lat: {
              type: "number",
              minimum: -90,
              maximum: 90,
            },
            lon: {
              type: "number",
              minimum: -180,
              maximum: 180,
            },
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
      const { radius, lat, lon, page, limit } = request.query;
      const nearbyFires = await fireService.getNearbyFires(radius as number, lat as number, lon as number, page as number, limit as number);
      return reply.send(nearbyFires);
    }
  );
};
export default firesRoute;
