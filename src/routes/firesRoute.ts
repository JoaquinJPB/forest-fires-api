import { FastifyPluginAsync } from "fastify";
import { FireService } from "../services/fireService";

const firesRoute: FastifyPluginAsync = async (fastify, options) => {
    const fireService = new FireService(fastify);
    fastify.get<{
        Querystring: { page?: number; pageSize?: number };
    }>("/api/fires", async (request, reply) => {
        const { page = 1, pageSize = 10 } = request.query;
        return await fireService.getPaginatedFires(page, pageSize);
    });
};
export default firesRoute;
