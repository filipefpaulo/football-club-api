import ErrorHandler from '../helpers/ErrorHandler';
import MatchesModel from '../database/models/MatchesModel';
import TeamsModel from '../database/models/TeamsModel';
import { IMatch, IUpdateMatchRequest } from '../interfaces/match.interface';
import * as JWT from '../helpers/JWT';

export default class MatchesService {
  private matchesModel = MatchesModel;
  private teamsModel = TeamsModel;
  private jwt = JWT;

  async getAllMatches() {
    const matches = await this.matchesModel.findAll({
      include: [
        { model: TeamsModel, as: 'teamHome', attributes: { exclude: ['id'] } },
        { model: TeamsModel, as: 'teamAway', attributes: { exclude: ['id'] } },
      ],
    });

    return matches;
  }

  async getByProgress(progress: boolean) {
    const matches = await this.matchesModel.findAll({
      where: { inProgress: progress },
      include: [
        { model: TeamsModel, as: 'teamHome', attributes: { exclude: ['id'] } },
        { model: TeamsModel, as: 'teamAway', attributes: { exclude: ['id'] } },
      ],
    });

    return matches;
  }

  // prettier-ignore
  async createMatch({
    homeTeam, awayTeam, homeTeamGoals, awayTeamGoals, inProgress,
  }: IMatch, token: string | undefined) {
    const teams = await this.teamsModel.findAll({
      where: { id: [homeTeam, awayTeam] },
    });

    this.jwt.verify(token);

    if (teams.length < 2) throw new ErrorHandler('There is no team with such id!', 404);

    const match = await this.matchesModel.create({
      homeTeam, awayTeam, homeTeamGoals, awayTeamGoals, inProgress,
    });

    return match;
  }

  async updateMatch({ id, homeTeamGoals, awayTeamGoals }: IUpdateMatchRequest) {
    await this.matchesModel.update(
      { homeTeamGoals, awayTeamGoals },
      { where: { id } },
    );
  }

  async finishMatch(id: number) {
    await this.matchesModel.update({ inProgress: false }, { where: { id } });
  }
}
