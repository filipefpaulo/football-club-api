export function getLeaderboardByType(type: string) {
  return `
    SELECT
      teams.team_name AS name,
      (${type}Points(teams.id)) AS totalPoints,
      (${type}Games(teams.id)) AS totalGames,
      (${type}Victories(teams.id)) as totalVictories,
      (${type}Draws(teams.id)) as totalDraws,
      (${type}Losses(teams.id)) as totalLosses,
      (${type}GoalsFavor(teams.id)) as goalsFavor,
      (${type}GoalsOwn(teams.id)) as goalsOwn,
      (${type}GoalsFavor(teams.id) - ${type}GoalsOwn(teams.id)) as goalsBalance,
      (REPLACE(CONVERT(
        ((${type}Points(teams.id) / (${type}Games(teams.id) * 3)) * 100),
          DECIMAL(10, 2)), .00, 0)) AS efficiency
    FROM teams
    ORDER BY totalPoints DESC, totalVictories DESC, 
      goalsBalance DESC, goalsFavor DESC, goalsOwn DESC;
`;
}

export const getLeaderboard = `
  SELECT
    teams.team_name AS name,
    (homePoints(teams.id) + awayPoints(teams.id)) AS totalPoints,
    (homeGames(teams.id) + awayGames(teams.id)) AS totalGames,
    (homeVictories(teams.id) + awayVictories(teams.id)) as totalVictories,
    (homeDraws(teams.id) + awayDraws(teams.id)) as totalDraws,
    (homeLosses(teams.id) + awayLosses(teams.id)) as totalLosses,
    (homeGoalsFavor(teams.id) + awayGoalsFavor(teams.id)) as goalsFavor,
    (homeGoalsOwn(teams.id) + awayGoalsOwn(teams.id)) as goalsOwn,
    ((homeGoalsFavor(teams.id) + awayGoalsFavor(teams.id))
      - (homeGoalsOwn(teams.id) + awayGoalsOwn(teams.id))) as goalsBalance,
    (getEfficiency(teams.id)) AS efficiency
  FROM teams
  ORDER BY totalPoints DESC, totalVictories DESC, 
    goalsBalance DESC, goalsFavor DESC, goalsOwn DESC;
`;
