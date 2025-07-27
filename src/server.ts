import Fastify from "fastify";
import allRoutes from "./routes";

const fastify = Fastify({
  logger: true,
});

const start = async () => {
  try {
    fastify.register(allRoutes);
    await fastify.listen({ port: 3000, host: "0.0.0.0" });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
