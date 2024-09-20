import prisma from '../database/prisma';
import { MatchWithTeamNames } from '../types/match';

export default class MatchRepository {
  async getMatchesByUserId(userId: string) {
    const matches = await prisma.match.findMany({
      where: { createdById: userId },
    });

    return matches;
  }

  async getMatchesAndTeamByUserId(userId: string): Promise<MatchWithTeamNames[]> {
    const matches = await prisma.match.findMany({
      where: { createdById: userId },
      include: {
        firstTeam: {
          select: {
            name: true,
          },
        },
        secondTeam: {
          select: {
            name: true,
          },
        },
      },
    });

    return matches.map((match) => ({
      ...match,
      firstTeamName: match.firstTeam.name,
      secondTeamName: match.secondTeam.name,
    }));
  }

  async deleteMatchesByUserId(userId: string) {
    const deletedMatches = await prisma.match.deleteMany({
      where: { createdById: userId },
    });

    return deletedMatches;
  }

  async createManyMatchesTransaction(
    matches: Array<{
      createdById: string;
      firstTeamId: string;
      secondTeamId: string;
      firstTeamGoals: number;
      secondTeamGoals: number;
    }>,
  ) {
    return prisma.$transaction(async (tx) =>
      tx.match.createMany({
        data: matches,
      }),
    );
  }
}
