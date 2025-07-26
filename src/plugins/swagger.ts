import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { FastifyPluginAsync } from 'fastify';

export const SwaggerPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.register(fastifySwagger, {
    swagger: {
      info: {
        title: 'Forest Fires API',
        version: '1.0.0'
      },
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
    }
  });

  fastify.register(fastifySwaggerUi, {
    routePrefix: '/docs',
  });
};