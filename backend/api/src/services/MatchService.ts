import MatchRepository from '../repositories/MatchRepository';
import TeamRepository from '../repositories/TeamRepository';
import { MatchesInput, MatchPutRequest } from '../schema/MatchSchema';
import LoggingService from './LoggingService';

export default class MatchService {
  async createMatches(input: MatchesInput) {
    const { userId, matches } = input;
    const matchRepository = new MatchRepository();
    const teamRepository = new TeamRepository();
    const loggingService = new LoggingService();

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

    // Log creation
    await loggingService.log({
      userId,
      actionType: 'CREATE',
      tableName: 'Match',
      recordId: matchesToCreate.length.toString(),
      details: `Bulk creation of ${matchesToCreate.length} matches`,
    });

    return createdMatches;
  }

  async getMatches(userId: string) {
    const matchRepository = new MatchRepository();
    const matches = await matchRepository.getMatchesAndTeamByUserId(userId);
    return matches;
  }

  async updateMatch(data: MatchPutRequest) {
    const matchRepository = new MatchRepository();
    const { firstTeamName, secondTeamName, firstTeamId, secondTeamId, firstTeamGoal, secondTeamGoal, matchId, userId } =
      data;

    // Find the original match
    const originalMatch = await matchRepository.findMatch(userId, matchId);

    if (!originalMatch) {
      throw new Error('Match result not found or does not belong to the user. Please refresh the page.');
    }

    // Check if teams are in the same group
    await this.validateTeamsInSameGroup(firstTeamId, secondTeamId, userId);

    const haveTeamsPlayed = await matchRepository.haveTeamsPlayedEachOther(firstTeamName, secondTeamName, userId);
    if (haveTeamsPlayed) {
      throw new Error('These teams have already played against each other.');
    }

    // Update match score
    await this.updateMatchScore(matchId, firstTeamGoal, secondTeamGoal, userId);

    // Check if team names have changed
    if (originalMatch.firstTeam.name !== firstTeamName) {
      await this.updateTeamName(firstTeamId, firstTeamName, userId);
    }

    if (originalMatch.secondTeam.name !== secondTeamName) {
      await this.updateTeamName(secondTeamId, secondTeamName, userId);
    }
  }

  private async updateMatchScore(matchId: string, firstTeamGoals: number, secondTeamGoals: number, userId: string) {
    const matchRepository = new MatchRepository();
    const loggingService = new LoggingService();
    const updatedMatch = await matchRepository.updateMatchScores([
      { id: matchId, firstTeamGoals, secondTeamGoals, updatedById: userId },
    ]);
    // Log the update
    await loggingService.log({
      userId,
      actionType: 'PUT',
      tableName: 'Match',
      recordId: matchId,
      details: `Updated match score to ${firstTeamGoals} - ${secondTeamGoals}`,
    });
    return updatedMatch;
  }

  private async validateTeamsInSameGroup(firstTeamId: string, secondTeamId: string, userId: string) {
    const teamRepository = new TeamRepository();
    const firstTeam = await teamRepository.getTeamByIdAndUserId(firstTeamId, userId);
    const secondTeam = await teamRepository.getTeamByIdAndUserId(secondTeamId, userId);

    if (!firstTeam || !secondTeam) {
      throw new Error('One or both teams do not exist or do not belong to the user');
    }

    if (firstTeam.groupId !== secondTeam.groupId) {
      throw new Error('Teams are not in the same group');
    }
  }

  private async updateTeamName(teamId: string, newName: string, userId: string) {
    const teamRepository = new TeamRepository();
    const loggingService = new LoggingService();

    const newTeam = await teamRepository.getTeamByNameAndUserId(newName, userId);
    if (!newTeam) {
      throw new Error(`Team with name '${newName}' does not exist or does not belong to the user`);
    }

    // If we've passed all checks, update the team name
    await teamRepository.updateTeamNames([{ id: teamId, name: newName, updatedById: userId }]);

    // Log the update
    await loggingService.log({
      userId,
      actionType: 'PUT',
      tableName: 'Team',
      recordId: teamId,
      details: `Updated team name to ${newName}`,
    });
  }
}
