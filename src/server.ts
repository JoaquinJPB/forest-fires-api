import Fastify from "fastify";
import firesRoute from "./routes/firesRoute";
import configurationsRoutes from "./routes/configurationsRoute";

const fastify = Fastify({
  logger: true,
});

fastify.register(firesRoute, { prefix: "/" });
fastify.register(configurationsRoutes, { prefix: "/" });

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: "0.0.0.0" });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
