import MatchRepository from '../repositories/MatchRepository';
import TeamRepository from '../repositories/TeamRepository';
import GroupRepository from '../repositories/GroupRepository';
import { RankingRecord } from '../types/ranking';
import { TeamWithGroup } from '../types/team';
import { MatchWithTeamNames } from '../types/match';
import { ALTERNATE_WIN_POINTS, MAXIMUM_AMOUNT_OF_GROUPS, WIN_POINTS } from '../constants/global';

interface GroupRanking {
  teams: RankingRecord[];
  groupNumber: number;
}

interface RankingOutput {
  firstGroup: GroupRanking;
  secondGroup: GroupRanking;
}

export default class RankingService {
  async getRanking(userId: string): Promise<RankingOutput> {
    const teamRepository = new TeamRepository();
    const matchRepository = new MatchRepository();
    const groupRepository = new GroupRepository();

    const teams = await teamRepository.getTeamsByUserId(userId);
    const matches = await matchRepository.getMatchesAndTeamByUserId(userId);
    const groups = await groupRepository.getGroupsByUserId(userId);

    if (groups.length < MAXIMUM_AMOUNT_OF_GROUPS) {
      // If there are fewer than 2 groups, return empty data for both groups
      return this.createEmptyRanking();
    }

    const rankingData = teams.length > 0 ? this.calculateRankingData(teams, matches) : [];

    const sortedTeams = this.sortTeams(rankingData);

    // Sort groups and take the first two, assume there at most 2 groups
    const [group1, group2] = groups.sort((a, b) => a.groupNumber - b.groupNumber).slice(0, 2);

    return {
      firstGroup: this.createGroupRanking(sortedTeams, group1.groupNumber),
      secondGroup: this.createGroupRanking(sortedTeams, group2.groupNumber),
    };
  }

  private calculateRankingData(teams: TeamWithGroup[], matches: MatchWithTeamNames[]): RankingRecord[] {
    return teams.reduce((acc, team) => {
      const teamMatches = matches.filter((match) => match.firstTeamId === team.id || match.secondTeamId === team.id);

      const { wins, losses, draws, totalScore } = teamMatches.reduce(
        (matchAcc, match) => {
          const isTeam1 = match.firstTeamId === team.id;
          const teamGoal = isTeam1 ? match.firstTeamGoals : match.secondTeamGoals;
          const oppoGoal = isTeam1 ? match.secondTeamGoals : match.firstTeamGoals;

          return {
            wins: matchAcc.wins + (teamGoal > oppoGoal ? 1 : 0),
            losses: matchAcc.losses + (teamGoal < oppoGoal ? 1 : 0),
            draws: matchAcc.draws + (teamGoal === oppoGoal ? 1 : 0),
            totalScore: matchAcc.totalScore + teamGoal,
          };
        },
        { wins: 0, losses: 0, draws: 0, totalScore: 0 },
      );

      const totalPoints = wins * WIN_POINTS + draws;
      const alternatePoints = wins * ALTERNATE_WIN_POINTS + draws * WIN_POINTS + losses;

      acc.push({
        teamName: team.name,
        registrationDate: team.registrationDate,
        groupNumber: team.group.groupNumber,
        totalPoints,
        alternatePoints,
        wins,
        losses,
        draws,
        totalScore,
      });

      return acc;
    }, [] as RankingRecord[]);
  }

  private sortTeams(teams: RankingRecord[]): RankingRecord[] {
    return teams.sort((a, b) => {
      if (a.totalPoints !== b.totalPoints) return b.totalPoints - a.totalPoints;
      if (a.totalScore !== b.totalScore) return b.totalScore - a.totalScore;
      if (a.alternatePoints !== b.alternatePoints) return b.alternatePoints - a.alternatePoints;
      return a.registrationDate.getTime() - b.registrationDate.getTime();
    });
  }

  private createGroupRanking(sortedTeams: RankingRecord[], groupNumber: number): GroupRanking {
    return {
      teams: sortedTeams.filter((team) => team.groupNumber === groupNumber),
      groupNumber,
    };
  }

  private createEmptyRanking(): RankingOutput {
    return {
      firstGroup: { teams: [], groupNumber: 1 },
      secondGroup: { teams: [], groupNumber: 2 },
    };
  }
}
