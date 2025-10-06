import { prisma } from '../lib/prisma.js';
import { subDays, startOfWeek, endOfWeek, format } from 'date-fns';

export default async function dashboardRoutes(fastify, options) {
  fastify.addHook('onRequest', fastify.authenticate);

  fastify.get('/summary', async (request, reply) => {
    const userId = request.user.id;
    const today = new Date();

    // Weekly data
    const startOfThisWeek = startOfWeek(today, { weekStartsOn: 1 }); // Monday
    const endOfThisWeek = endOfWeek(today, { weekStartsOn: 1 });

    const weeklyLogs = await prisma.studyLog.findMany({
      where: {
        userId,
        deletedAt: null,
        logDate: {
          gte: startOfThisWeek,
          lte: endOfThisWeek
        }
      },
      select: {
        logDate: true,
        durationMin: true,
        skill: true
      }
    });

    // Aggregate daily totals for the week
    const dailyTotals = {};
    for (let i = 0; i < 7; i++) {
      const day = format(new Date(startOfThisWeek).setDate(startOfThisWeek.getDate() + i), 'EEE');
      dailyTotals[day] = 0;
    }

    weeklyLogs.forEach(log => {
      const day = format(log.logDate, 'EEE');
      dailyTotals[day] = (dailyTotals[day] || 0) + log.durationMin;
    });

    const weeklyChartData = Object.entries(dailyTotals).map(([name, time]) => ({ name, time }));

    // Aggregate skill distribution for the week
    const skillDistribution = weeklyLogs.reduce((acc, log) => {
      acc[log.skill] = (acc[log.skill] || 0) + log.durationMin;
      return acc;
    }, {});

    const skillPieChartData = Object.entries(skillDistribution).map(([name, value]) => ({ name, value }));

    // Summary cards
    const totalThisWeek = weeklyLogs.reduce((sum, log) => sum + log.durationMin, 0);
    const totalToday = weeklyLogs
      .filter(log => format(log.logDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd'))
      .reduce((sum, log) => sum + log.durationMin, 0);

    // Streak (simple implementation)
    const userSettings = await prisma.userSettings.findUnique({ where: { userId } });

    return {
      totalMinutesToday: totalToday,
      totalMinutesThisWeek: totalThisWeek,
      currentStreak: userSettings?.streakCount || 0,
      weeklyChartData,
      skillPieChartData,
    };
  });
}