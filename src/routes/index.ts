import { FastifyInstance, FastifyPluginOptions } from "fastify";
import fireRoutes from "./firesRoute";
import configurationRoutes from "./configurationsRoute";

export default function allRoutes(fastify: FastifyInstance, opts: FastifyPluginOptions, done: () => void) {
  fastify.register(fireRoutes, { prefix: "/api/fires" });
  fastify.register(configurationRoutes, { prefix: "/api/configurations" });

  // Ruta de salud
  fastify.get("/health", {
    schema: {
      tags: ["Sistema"],
      summary: "Verificar estado del servicio",
      description: "Endpoint para verificar que el servicio está en funcionamiento",
      response: {
        200: {
          description: "Servicio operativo",
          type: "object",
          properties: {
            status: { type: "string" },
            timestamp: { type: "string", format: "date-time" },
          },
        },
      },
    },
    handler: async () => {
      return {
        status: "ok",
        timestamp: new Date().toISOString(),
      };
    },
  });

  done();
}
