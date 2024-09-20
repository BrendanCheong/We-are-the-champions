export interface Match {
  firstTeam: string;
  secondTeam: string;
  firstTeamGoals: number;
  secondTeamGoals: number;
}

export interface CreateMatchesRequest {
  userId: string;
  matches: Match[];
}

export interface CreateMatchesResponse {
  id: string;
  firstTeamId: string;
  secondTeamId: string;
  firstTeamGoals: number;
  secondTeamGoals: number;
  matchDate: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  updatedById: string | null;
}

export interface PutMatchData {
  firstTeamName: string;
  secondTeamName: string;
  firstTeamId: string;
  secondTeamId: string;
  firstTeamGoal: number;
  secondTeamGoal: number;
  matchId: string;
  userId: string;
}

export interface GetMatchesAndTeamsResponse extends CreateMatchesResponse {
  firstTeamName: string;
  secondTeamName: string;
}
