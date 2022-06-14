// import ErrorHandler from '../helpers/ErrorHandler';
import { ILeaderboard } from '../interfaces/leaderboard.interface';
import MatchesModel from '../database/models/MatchesModel';
import TeamsModel from '../database/models/TeamsModel';

export default class LeaderboardService {
  private matchesModel = MatchesModel;
  private teamsModel = TeamsModel;

  private matches: MatchesModel[];
  private teams: TeamsModel[];

  private table: ILeaderboard[];

  private async getTable() {
    this.matches = await this.matchesModel.findAll({
      where: { inProgress: false },
    });
    this.teams = await this.teamsModel.findAll();

    this.table = this.teams.map((team) => ({
      name: team.teamName,
      totalPoints: 0,
      totalGames: 0,
      totalVictories: 0,
      totalDraws: 0,
      totalLosses: 0,
      goalsFavor: 0,
      goalsOwn: 0,
      goalsBalance: 0,
      efficiency: 0,
    }));
  }

  private getTotalGames(type: string | undefined) {
    this.teams.forEach((team, index) => {
      let totalGames = 0;
      this.matches.forEach((match) => {
        if (type === 'home') {
          if (+match.homeTeam === +team.id) totalGames += 1;
        } else if (type === 'away') {
          if (+match.awayTeam === +team.id) totalGames += 1;
        } else {
          if (+match.homeTeam === +team.id) totalGames += 1;
          if (+match.awayTeam === +team.id) totalGames += 1;
        }
      });
      this.table[index].totalGames = totalGames;
    });
  }

  // prettier-ignore
  private getTotalVictories(type: string | undefined) {
    this.teams.forEach((team, index) => {
      let i = 0;
      this.matches.forEach((match) => {
        if (type === 'home') {
          if (+match.homeTeam === +team.id && +match.homeTeamGoals > +match.awayTeamGoals) i += 1;
        } else if (type === 'away') {
          if (+match.awayTeam === +team.id && +match.homeTeamGoals < +match.awayTeamGoals) i += 1;
        } else {
          if (+match.homeTeam === +team.id && +match.homeTeamGoals > +match.awayTeamGoals) i += 1;
          if (+match.awayTeam === +team.id && +match.homeTeamGoals < +match.awayTeamGoals) i += 1;
        }
      });
      this.table[index].totalVictories = i;
      this.table[index].totalPoints += i * 3;
    });
  }

  // prettier-ignore
  private getTotalDraws(type: string | undefined) {
    this.teams.forEach((team, index) => {
      let i = 0;
      this.matches.forEach((match) => {
        if (type === 'home') {
          if (+match.homeTeam === +team.id && +match.homeTeamGoals === +match.awayTeamGoals) i += 1;
        } else if (type === 'away') {
          if (+match.awayTeam === +team.id && +match.homeTeamGoals === +match.awayTeamGoals) i += 1;
        } else {
          if (+match.homeTeam === +team.id && +match.homeTeamGoals === +match.awayTeamGoals) i += 1;
          if (+match.awayTeam === +team.id && +match.homeTeamGoals === +match.awayTeamGoals) i += 1;
        }
      });
      this.table[index].totalDraws = i;
      this.table[index].totalPoints += i;
    });
  }

  // prettier-ignore
  private getTotalLosses(type: string | undefined) {
    this.teams.forEach((team, index) => {
      let i = 0;
      this.matches.forEach((match) => {
        if (type === 'home'
          && +match.homeTeam === +team.id
          && +match.homeTeamGoals < +match.awayTeamGoals) {
          i += 1;
        } else if (type === 'away'
          && +match.awayTeam === +team.id
          && +match.homeTeamGoals > +match.awayTeamGoals) {
          i += 1;
        } else if (+match.homeTeam === +team.id
            && (+match.homeTeamGoals < +match.awayTeamGoals
              || +match.homeTeamGoals > +match.awayTeamGoals)) i += 1;
      });
      this.table[index].totalLosses = i;
    });
  }

  private getGoalsFavor(type: string | undefined) {
    this.teams.forEach((team, index) => {
      let goalsFavor = 0;
      this.matches.forEach((match) => {
        if (type === 'home' && +match.homeTeam === +team.id) {
          goalsFavor += +match.homeTeamGoals;
        } else if (type === 'away' && +match.awayTeam === +team.id) {
          goalsFavor += +match.awayTeamGoals;
        } else {
          if (+match.homeTeam === +team.id) goalsFavor += +match.homeTeamGoals;
          if (+match.awayTeam === +team.id) goalsFavor += +match.awayTeamGoals;
        }
      });
      this.table[index].goalsFavor = goalsFavor;
    });
  }

  private getGoalsOwn(type: string | undefined) {
    this.teams.forEach((team, index) => {
      let goalsOwn = 0;
      this.matches.forEach((match) => {
        if (type === 'home' && +match.homeTeam === +team.id) {
          goalsOwn += +match.awayTeamGoals;
        } else if (type === 'away' && +match.awayTeam === +team.id) {
          goalsOwn += +match.homeTeamGoals;
        } else {
          if (+match.homeTeam === +team.id) goalsOwn += +match.awayTeamGoals;
          if (+match.awayTeam === +team.id) goalsOwn += +match.homeTeamGoals;
        }
      });
      this.table[index].goalsOwn = goalsOwn;
      this.table[index].goalsBalance = this.table[index].goalsFavor - goalsOwn;
    });
  }

  // prettier-ignore
  private getEfficience() {
    this.table.forEach((team, index) => {
      this.table[index].efficiency = +(
        (team.totalPoints / (team.totalGames * 3)) * 100).toFixed(2);
    });
  }

  // prettier-ignore
  private classifyTable(type: string | undefined) {
    this.getTotalGames(type);
    this.getTotalVictories(type);
    this.getTotalDraws(type);
    this.getTotalLosses(type);
    this.getGoalsFavor(type);
    this.getGoalsOwn(type);
    this.getEfficience();

    return this.table.sort((a, b) => (
      b.totalPoints - a.totalPoints
      || b.totalVictories - a.totalVictories
      || b.goalsBalance - a.goalsBalance
      || b.goalsFavor - a.goalsFavor
      || b.goalsOwn - a.goalsOwn
    ));
  }

  async getClassification() {
    await this.getTable();

    return this.classifyTable(undefined);
  }

  async getClassificationByType(type: string | undefined) {
    await this.getTable();

    if (type === 'home' || type === 'away') {
      return this.classifyTable(type);
    }
    return this.getClassification();
  }
}
