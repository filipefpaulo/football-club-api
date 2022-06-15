export interface IMatch {
  homeTeam: string;
  awayTeam: string;
  homeTeamGoals: string;
  awayTeamGoals: string;
  inProgress: boolean;
}

export interface IUpdateMatchRequest {
  id: number;
  homeTeamGoals: number;
  awayTeamGoals: number;
}
