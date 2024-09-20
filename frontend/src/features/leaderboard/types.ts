export interface RankingRecord {
  teamName: string;
  registrationDate: Date;
  groupNumber: number;
  totalPoints: number;
  alternatePoints: number;
  wins: number;
  losses: number;
  draws: number;
  totalScore: number;
}

export interface GroupRanking {
  teams: RankingRecord[];
  groupNumber?: number;
}

export interface RankingResponse {
  firstGroup: GroupRanking;
  secondGroup: GroupRanking;
}
