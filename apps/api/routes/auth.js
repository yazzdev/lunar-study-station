import argon2 from 'argon2';
import { prisma } from '../lib/prisma.js';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export default async function authRoutes(fastify, options) {
  fastify.post('/register', async (request, reply) => {
    const { email, password, name } = registerSchema.parse(request.body);
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return reply.code(409).send({ error: 'Email already in use' });
    }
    const passwordHash = await argon2.hash(password);
    const user = await prisma.user.create({
      data: { email, passwordHash, name },
    });
    // Create default settings
    await prisma.userSettings.create({ data: { userId: user.id } });

    const token = fastify.jwt.sign({ id: user.id, email: user.email });
    reply.setCookie('token', token, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    }).code(201).send({ id: user.id, email: user.email, name: user.name });
  });

  fastify.post('/login', async (request, reply) => {
    const { email, password } = loginSchema.parse(request.body);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await argon2.verify(user.passwordHash, password))) {
      return reply.code(401).send({ error: 'Invalid email or password' });
    }
    const token = fastify.jwt.sign({ id: user.id, email: user.email });
    reply.setCookie('token', token, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    }).send({ id: user.id, email: user.email, name: user.name });
  });

  fastify.post('/logout', (request, reply) => {
    reply.clearCookie('token', { path: '/' }).send({ message: 'Logged out' });
  });

  fastify.get('/me', { onRequest: [fastify.authenticate] }, (request, reply) => {
    const { id, email, name } = request.user;
    reply.send({ id, email, name });
  });
}