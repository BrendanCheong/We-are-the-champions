import MatchRepository from '../repositories/MatchRepository';
import TeamRepository from '../repositories/TeamRepository';
import { MatchesInput } from '../schema/MatchSchema';

export default class MatchService {
  async createMatches(input: MatchesInput) {
    const { userId, matches } = input;
    const matchRepository = new MatchRepository();
    const teamRepository = new TeamRepository();

    const teams = await teamRepository.getTeamsByUserId(userId);
    const teamMap = new Map(teams.map((team) => [team.name, { id: team.id, groupId: team.groupId }]));
    const existingMatches = await matchRepository.getMatchesByUserId(userId);

    // Validation
    matches.forEach((match) => {
      const { firstTeam, secondTeam } = match;

      // Check if teams exist
      if (!teamMap.has(firstTeam)) {
        throw new Error(`Team '${firstTeam}' does not exist.`);
      }
      if (!teamMap.has(secondTeam)) {
        throw new Error(`Team '${secondTeam}' does not exist.`);
      }

      const team1Data = teamMap.get(firstTeam)!;
      const team2Data = teamMap.get(secondTeam)!;

      // Check if teams are in the same group
      if (team1Data.groupId !== team2Data.groupId) {
        throw new Error(`Teams '${firstTeam}' and '${secondTeam}' are not in the same group.`);
      }

      // Check if match already exists
      const matchExists = existingMatches.some(
        (existingMatch) =>
          (existingMatch.firstTeamId === team1Data.id && existingMatch.secondTeamId === team2Data.id) ||
          (existingMatch.firstTeamId === team2Data.id && existingMatch.secondTeamId === team1Data.id),
      );
      if (matchExists) {
        throw new Error(`Teams '${firstTeam}' and '${secondTeam}' have already played against each other.`);
      }
    });

    // Create matches
    const matchesToCreate = matches.map((match) => ({
      createdById: userId,
      firstTeamId: teamMap.get(match.firstTeam)!.id,
      secondTeamId: teamMap.get(match.secondTeam)!.id,
      firstTeamGoals: match.firstTeamGoals,
      secondTeamGoals: match.secondTeamGoals,
    }));
    const createdMatches = await matchRepository.createManyMatchesTransaction(matchesToCreate);

    return createdMatches;
  }
}
