import Fastify from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import 'dotenv/config';

import authRoutes from './routes/auth.js';
import logRoutes from './routes/logs.js';
import dashboardRoutes from './routes/dashboard.js';
import { prisma } from './lib/prisma.js';

const fastify = Fastify({ logger: true });

// Middleware & Plugins
fastify.register(cors, {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
});
fastify.register(cookie);

// Auth Decorator
fastify.decorate('authenticate', async (request, reply) => {
  try {
    const token = request.cookies.token;
    if (!token) {
      throw new Error('No token found');
    }
    const decoded = fastify.jwt.verify(token);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
      throw new Error('User not found');
    }
    request.user = user;
  } catch (err) {
    reply.code(401).send({ error: 'Authentication required' });
  }
});

// JWT Plugin (simplified registration)
import jwt from 'jsonwebtoken';
fastify.decorate('jwt', {
  sign: (payload) => jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }),
  verify: (token) => jwt.verify(token, process.env.JWT_SECRET),
});


// Register Routes
fastify.register(authRoutes, { prefix: '/api/v1/auth' });
fastify.register(logRoutes, { prefix: '/api/v1/logs' });
fastify.register(dashboardRoutes, { prefix: '/api/v1/dashboard' });

// Health Check
fastify.get('/health', (req, reply) => {
  reply.send({ status: 'ok' });
});

// Run the server
const start = async () => {
  try {
    await fastify.listen({ port: process.env.API_PORT || 3001, host: '0.0.0.0' });
    fastify.log.info(`Server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();