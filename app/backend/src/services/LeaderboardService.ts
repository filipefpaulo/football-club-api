// import ErrorHandler from '../helpers/ErrorHandler';
import { ILeaderboard } from '../interfaces/leaderboard.interface';
import MatchesModel from '../database/models/MatchesModel';
import TeamsModel from '../database/models/TeamsModel';
import * as JWT from '../helpers/JWT';

export default class LeaderboardService {
  private matchesModel = MatchesModel;
  private teamsModel = TeamsModel;
  private jwt = JWT;

  private matches: MatchesModel[];
  private teams: TeamsModel[];

  private totalGames: number[];
  private totalVictories: number[];
  private totalDraws: number[];
  private totalLosses: number[];
  private goalsFavor: number[];
  private goalsOwn: number[];

  private table: ILeaderboard[];

  private getTotalGames() {
    this.teams.forEach((team, index) => {
      let totalGames = 0;
      this.matches.forEach((match) => {
        if (+match.homeTeam === +team.id) totalGames += 1;
        if (+match.awayTeam === +team.id) totalGames += 1;
      });
      this.table[index].totalGames = totalGames;
    });
  }

  // prettier-ignore
  private getTotalVictories() {
    this.teams.forEach((team, index) => {
      let totalVictories = 0;
      this.matches.forEach((match) => {
        if (+match.homeTeam === +team.id && +match.homeTeamGoals > +match.awayTeamGoals) {
          totalVictories += 1;
        } if (+match.awayTeam === +team.id && +match.homeTeamGoals < +match.awayTeamGoals) {
          totalVictories += 1;
        }
      });
      this.table[index].totalVictories = totalVictories;
      this.table[index].totalPoints += totalVictories * 3;
    });
  }

  // prettier-ignore
  private getTotalDraws() {
    this.teams.forEach((team, index) => {
      let totalDraws = 0;
      this.matches.forEach((match) => {
        if (+match.homeTeam === +team.id && +match.homeTeamGoals === +match.awayTeamGoals) {
          totalDraws += 1;
        } if (+match.awayTeam === +team.id && +match.homeTeamGoals === +match.awayTeamGoals) {
          totalDraws += 1;
        }
      });
      this.table[index].totalDraws = totalDraws;
      this.table[index].totalPoints += totalDraws;
    });
  }

  // prettier-ignore
  private getTotalLosses() {
    this.teams.forEach((team, index) => {
      let totalLosses = 0;
      this.matches.forEach((match) => {
        if (+match.homeTeam === +team.id && +match.homeTeamGoals < +match.awayTeamGoals) {
          totalLosses += 1;
        } if (+match.awayTeam === +team.id && +match.homeTeamGoals > +match.awayTeamGoals) {
          totalLosses += 1;
        }
      });
      this.table[index].totalLosses = totalLosses;
    });
  }

  private getGoalsFavor() {
    this.teams.forEach((team, index) => {
      let goalsFavor = 0;
      this.matches.forEach((match) => {
        if (+match.homeTeam === +team.id) goalsFavor += +match.homeTeamGoals;
        if (+match.awayTeam === +team.id) goalsFavor += +match.awayTeamGoals;
      });
      this.table[index].goalsFavor = goalsFavor;
    });
  }

  private getGoalsOwn() {
    this.teams.forEach((team, index) => {
      let goalsOwn = 0;
      this.matches.forEach((match) => {
        if (+match.homeTeam === +team.id) goalsOwn += +match.awayTeamGoals;
        if (+match.awayTeam === +team.id) goalsOwn += +match.homeTeamGoals;
      });
      this.table[index].goalsOwn = goalsOwn;
    });
  }

  // prettier-ignore
  private getEfficience() {
    this.table.forEach((team, index) => {
      this.table[index].efficiency = +(
        (team.totalPoints / (team.totalGames * 3)) / 100).toFixed(2).replace(/.00/, '');
    });
  }

  // prettier-ignore
  private classifyTable() {
    return this.table.sort((a, b) => (
      b.totalPoints - a.totalPoints
      || b.totalVictories - a.totalVictories
      || b.goalsBalance - a.goalsBalance
      || b.goalsFavor - a.goalsFavor
      || b.goalsOwn - a.goalsOwn
    ));
  }

  async getClassification() {
    this.matches = await this.matchesModel.findAll({
      where: { inProgress: false },
    });
    this.teams = await this.teamsModel.findAll();

    this.getTotalGames();
    this.getTotalVictories();
    this.getTotalDraws();
    this.getTotalLosses();
    this.getGoalsFavor();
    this.getGoalsOwn();
    this.getEfficience();

    return this.classifyTable();
  }
}
