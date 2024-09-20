import { z } from 'zod';

export const MatchSchema = z.object({
  firstTeam: z.string(),
  secondTeam: z.string(),
  firstTeamGoals: z.number().int().min(0),
  secondTeamGoals: z.number().int().min(0),
});

export const MatchesInputSchema = z.object({
  userId: z.string().uuid(),
  matches: z.array(MatchSchema),
});

export type MatchesInput = z.infer<typeof MatchesInputSchema>;
