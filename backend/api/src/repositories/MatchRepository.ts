import { Prisma } from '@prisma/client';
import prisma from '../database/prisma';
import { MatchWithTeamNames } from '../types/match';

export default class MatchRepository {
  async createMatch(data: Prisma.MatchCreateInput) {
    const match = await prisma.match.create({ data });
    return match;
  }

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

  async createManyMatches(data: Prisma.MatchCreateManyInput[]) {
    const batchMatches = await prisma.match.createMany({ data });
    return batchMatches;
  }

  async getMatchByTeams(userId: string, team1Id: string, team2Id: string) {
    const match = await prisma.match.findFirst({
      where: {
        createdById: userId,
        OR: [
          { firstTeamId: team1Id, secondTeamId: team2Id },
          { firstTeamId: team2Id, secondTeamId: team1Id },
        ],
      },
    });
    return match;
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
      Promise.all(
        matches.map((match) =>
          tx.match.create({
            data: match,
          }),
        ),
      ),
    );
  }
}
