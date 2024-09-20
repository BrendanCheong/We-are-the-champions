import { Prisma } from '@prisma/client';

export type TeamWithGroup = Prisma.TeamGetPayload<{
  include: { group: true };
}>;
