import ErrorHandler from '../helpers/ErrorHandler';
import TeamsModel from '../database/models/TeamsModel';

export default class TeamsService {
  private teamsModel = TeamsModel;

  async getAllTeams() {
    const teams = await this.teamsModel.findAll();

    return teams;
  }

  async getById(id: string) {
    const team = await this.teamsModel.findByPk(id);

    if (!team) throw new ErrorHandler('Team not found', 404);

    return team;
  }
}
