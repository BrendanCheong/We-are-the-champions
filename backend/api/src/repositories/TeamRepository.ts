import { Prisma } from '@prisma/client';
import prisma from '../database/prisma';

export default class TeamRepository {
  async createTeam(data: Prisma.TeamCreateInput) {
    const team = await prisma.team.create({ data });
    return team;
  }

  async getTeamsByUserId(userId: string) {
    const teams = await prisma.team.findMany({
      where: { createdById: userId },
      include: { group: true },
    });
    return teams;
  }

  async getTeamByNameAndUserId(name: string, userId: string) {
    const team = await prisma.team.findUnique({
      where: {
        createdById_name: {
          createdById: userId,
          name,
        },
      },
    });
    return team;
  }

  async countTeamsByUserId(userId: string) {
    const count = await prisma.team.count({
      where: { createdById: userId },
    });
    return count;
  }

  async createManyTeams(data: Prisma.TeamCreateManyInput[]) {
    const batchTeams = await prisma.team.createMany({ data });
    return batchTeams;
  }

  async updateTeam(id: string, data: Prisma.TeamUpdateInput) {
    const updatedTeam = await prisma.team.update({
      where: { id },
      data,
    });
    return updatedTeam;
  }

  async deleteTeam(id: string) {
    const deletedTeam = await prisma.team.delete({
      where: { id },
    });
    return deletedTeam;
  }
}
