import { Prisma } from '@prisma/client';
import prisma from '../database/prisma';

export default class GroupRepository {
  async getGroupsByUserId(userId: string) {
    const groups = await prisma.group.findMany({
      where: { userId },
    });
    return groups;
  }

  async createManyGroups(data: Prisma.GroupCreateManyInput[]) {
    const groups = await prisma.group.createMany({ data });
    return groups;
  }

  async deleteGroupsByUserId(userId: string) {
    const deletedGroups = await prisma.group.deleteMany({
      where: { userId },
    });
    return deletedGroups;
  }
}
