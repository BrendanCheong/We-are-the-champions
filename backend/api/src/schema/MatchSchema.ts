import { z } from 'zod';

export const MatchSchema = z.object({
  firstTeam: z.string(),
  secondTeam: z.string(),
  firstTeamGoals: z.number().int().positive(),
  secondTeamGoals: z.number().int().positive(),
});

export const MatchesInputSchema = z.object({
  userId: z.string().uuid(),
  matches: z.array(MatchSchema),
});

export type MatchesInput = z.infer<typeof MatchesInputSchema>;
