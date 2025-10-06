import { prisma } from '../lib/prisma.js';
import { z } from 'zod';

const logSchema = z.object({
  skill: z.enum(['READING', 'LISTENING', 'SPEAKING', 'WRITING']),
  durationMin: z.number().int().positive(),
  note: z.string().optional(),
  logDate: z.string().datetime(),
  focusLevel: z.number().int().min(1).max(5).optional(),
});

export default async function logRoutes(fastify, options) {
  fastify.addHook('onRequest', fastify.authenticate);

  fastify.get('/', async (request, reply) => {
    const logs = await prisma.studyLog.findMany({
      where: { userId: request.user.id, deletedAt: null },
      orderBy: { logDate: 'desc' },
    });
    reply.send(logs);
  });

  fastify.post('/', async (request, reply) => {
    const data = logSchema.parse(request.body);
    const newLog = await prisma.studyLog.create({
      data: { ...data, userId: request.user.id },
    });
    reply.code(201).send(newLog);
  });

  fastify.put('/:id', async (request, reply) => {
    const { id } = request.params;
    const data = logSchema.parse(request.body);
    const log = await prisma.studyLog.findFirst({
      where: { id, userId: request.user.id }
    });

    if (!log) {
      return reply.code(404).send({ error: 'Log not found' });
    }

    const updatedLog = await prisma.studyLog.update({
      where: { id },
      data,
    });
    reply.send(updatedLog);
  });

  fastify.delete('/:id', async (request, reply) => {
    const { id } = request.params;
    const log = await prisma.studyLog.findFirst({
      where: { id, userId: request.user.id }
    });

    if (!log) {
      return reply.code(404).send({ error: 'Log not found' });
    }

    await prisma.studyLog.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    reply.code(204).send();
  });
}