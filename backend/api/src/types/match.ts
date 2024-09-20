import { Prisma } from '@prisma/client';

export type MatchWithTeamNames = Prisma.MatchGetPayload<{
  include: {
    firstTeam: { select: { name: true } };
    secondTeam: { select: { name: true } };
  };
}> & {
  firstTeamName: string;
  secondTeamName: string;
};
