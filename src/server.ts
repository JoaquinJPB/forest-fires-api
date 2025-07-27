import Fastify from "fastify";
import allRoutes from "./routes";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import fs from "fs";
import yaml from "yaml";

const fastify = Fastify({
  logger: true,
});

const openapiDoc = yaml.parse(fs.readFileSync("./openapi.yaml", "utf8"));

const start = async () => {
  try {
    await fastify.register(swagger, {
      mode: "static",
      specification: {
        document: openapiDoc,
      },
    });
    await fastify.register(swaggerUI, {
      routePrefix: "/docs",
      uiConfig: {
        docExpansion: "full",
        deepLinking: false,
      },
    });
    fastify.register(allRoutes);
    await fastify.listen({ port: 3000, host: "0.0.0.0" });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
