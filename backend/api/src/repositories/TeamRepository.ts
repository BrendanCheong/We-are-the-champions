import { Prisma } from '@prisma/client';
import prisma from '../database/prisma';
import { TeamWithGroup } from '../types/team';

export default class TeamRepository {
  async createTeam(data: Prisma.TeamCreateInput) {
    const team = await prisma.team.create({ data });
    return team;
  }

  async getTeamsByUserId(userId: string): Promise<TeamWithGroup[]> {
    const teams = await prisma.team.findMany({
      where: { createdById: userId },
      include: { group: true },
    });
    return teams;
  }

  async getTeamByIdAndUserId(teamId: string, userId: string) {
    const team = await prisma.team.findFirst({
      where: {
        id: teamId,
        createdById: userId,
      },
    });
    return team;
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

  async createManyTeams(data: Prisma.TeamCreateManyInput[]) {
    const batchTeams = await prisma.team.createMany({ data });
    return batchTeams;
  }

  async deleteTeamsByUserId(userId: string) {
    const deletedTeam = await prisma.team.deleteMany({
      where: { createdById: userId },
    });
    return deletedTeam;
  }

  async updateTeamNames(updates: { id: string; name: string; updatedById: string }[]) {
    const teams = await prisma.$transaction(async (tx) =>
      Promise.all(
        updates.map((update) =>
          tx.team.update({
            where: { id: update.id },
            data: {
              name: update.name,
              updatedById: update.updatedById,
            },
          }),
        ),
      ),
    );
    return teams;
  }
}
