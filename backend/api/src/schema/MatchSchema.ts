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

export const MatchPutSchema = z.object({
  firstTeamName: z.string(),
  secondTeamName: z.string(),
  firstTeamId: z.string(),
  secondTeamId: z.string(),
  firstTeamGoal: z.number(),
  secondTeamGoal: z.number(),
  matchId: z.string(),
  userId: z.string(),
});

export type MatchPutRequest = z.infer<typeof MatchPutSchema>;

export type MatchesInput = z.infer<typeof MatchesInputSchema>;
