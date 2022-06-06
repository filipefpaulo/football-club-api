import ErrorHandler from '../helpers/ErrorHandler';
import MatchesModel from '../database/models/MatchesModel';
import TeamsModel from '../database/models/TeamsModel';
import { IMatchRequest } from '../interfaces/match.interface';

export default class MatchesService {
  private matchesModel = MatchesModel;
  private teamsModel = TeamsModel;

  // prettier-ignore
  async getAllMatches(progress: string | undefined) {
    let matches;
    if (progress === undefined) {
      matches = await this.matchesModel.findAll({
        include: [
          { model: TeamsModel, as: 'teamHome', attributes: { exclude: ['id'] } },
          { model: TeamsModel, as: 'teamAway', attributes: { exclude: ['id'] } },
        ],
      });
    }
    matches = await this.matchesModel.findAll({
      where: { inProgress: progress },
      include: [
        { model: TeamsModel, as: 'teamHome', attributes: { exclude: ['id'] } },
        { model: TeamsModel, as: 'teamAway', attributes: { exclude: ['id'] } },
      ],
    });

    return matches;
  }

  // prettier-ignore
  async createMatche({
    homeTeam, awayTeam, homeTeamGoals, awayTeamGoals, inProgress,
  }: IMatchRequest) {
    const teams = await this.teamsModel.findAll({
      where: { id: [homeTeam, awayTeam] },
    });

    if (teams.length < 2) throw new ErrorHandler('There is no team with such id!', 404);

    const match = await this.matchesModel.create({
      homeTeam, awayTeam, homeTeamGoals, awayTeamGoals, inProgress,
    });

    return match;
  }
}
