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

  async findMatch(userId: string, matchId: string) {
    const match = await prisma.match.findFirst({
      where: {
        id: matchId,
        createdById: userId,
      },
      include: {
        firstTeam: true,
        secondTeam: true,
      },
    });
    return match;
  }

  async haveTeamsPlayedEachOther(firstTeamName: string, secondTeamName: string, userId: string): Promise<boolean> {
    const matchCount = await prisma.match.count({
      where: {
        createdById: userId,
        OR: [
          {
            firstTeam: { name: firstTeamName },
            secondTeam: { name: secondTeamName },
          },
          {
            firstTeam: { name: secondTeamName },
            secondTeam: { name: firstTeamName },
          },
        ],
      },
    });

    return matchCount > 0;
  }

  async updateMatchScores(
    updates: { id: string; firstTeamGoals: number; secondTeamGoals: number; updatedById: string }[],
  ) {
    const matches = await prisma.$transaction(async (tx) =>
      Promise.all(
        updates.map((update) =>
          tx.match.update({
            where: { id: update.id },
            data: {
              firstTeamGoals: update.firstTeamGoals,
              secondTeamGoals: update.secondTeamGoals,
              updatedById: update.updatedById,
            },
          }),
        ),
      ),
    );
    return matches;
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
