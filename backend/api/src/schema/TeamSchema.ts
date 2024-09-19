import { z } from 'zod';

export const TeamSchema = z.object({
  name: z.string(),
  registrationDate: z
    .string()
    .regex(/^\d{2}\/\d{2}$/)
    .refine(
      (date) => {
        const [day, month] = date.split('/').map(Number);
        return day >= 1 && day <= 31 && month >= 1 && month <= 12;
      },
      { message: 'Invalid date. Must be in format DD/MM and represent a valid date' },
    ),
  group: z.number().int().positive(),
});
/**
 * Example input:
 * {
    "teams": [
      { "name": "teamA", "registrationDate": "01/04", "group": 1 },
      { "name": "teamB", "registrationDate": "02/05", "group": 1 },
      // ... other teams
    ],
    "userId": "test-user-id"
  }
 */
export const TeamsInputSchema = z.object({
  teams: z
    .array(TeamSchema)
    .min(1)
    .max(12)
    .refine(
      (teams) => {
        const uniqueNames = new Set(teams.map((t) => t.name));
        return uniqueNames.size === teams.length;
      },
      { message: 'Duplicate team names are not allowed' },
    )
    .refine(
      (teams) => {
        const groups = new Set(teams.map((t) => t.group));
        return groups.size <= 2;
      },
      { message: 'At most 2 different group numbers are allowed' },
    ),
  userId: z.string().uuid(),
});

export type TeamsInput = z.infer<typeof TeamsInputSchema>;
