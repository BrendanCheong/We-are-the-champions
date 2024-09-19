import { z } from 'zod';

export const MatchSchema = z.object({
  teamA: z.string(),
  teamB: z.string(),
  scoreA: z.number().int().positive(),
  scoreB: z.number().int().positive(),
});

export const MatchesInputSchema = z.object({
  userId: z.string().uuid(),
  matches: z.array(MatchSchema),
});

export type MatchesInput = z.infer<typeof MatchesInputSchema>;
