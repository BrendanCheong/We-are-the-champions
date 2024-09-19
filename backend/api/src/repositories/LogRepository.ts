import { Prisma } from '@prisma/client';
import prisma from '../database/prisma';

export default class LoggingRepository {
  async createLog(data: Omit<Prisma.LogCreateInput, 'user'> & { userId: string }) {
    const { userId, ...restData } = data;
    const log = await prisma.log.create({
      data: {
        ...restData,
        user: {
          connect: { id: userId },
        },
      },
    });
    return log;
  }

  async getLogsByUserId(userId: string) {
    const logs = await prisma.log.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
    });
    return logs;
  }

  async getLogById(id: string) {
    const log = await prisma.log.findUnique({ where: { id } });
    return log;
  }

  async deleteLog(id: string) {
    const log = await prisma.log.delete({ where: { id } });
    return log;
  }

  async deleteLogsByUserId(userId: string) {
    const logs = await prisma.log.deleteMany({ where: { userId } });
    return logs;
  }
}
