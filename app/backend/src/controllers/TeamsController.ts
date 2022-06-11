import { NextFunction, Request, Response } from 'express';
import ErrorHandler from '../helpers/ErrorHandler';
import TeamsService from '../services/TeamsService';

export default class TeamsController {
  private teamsService = new TeamsService();

  async getAllTeams(_req: Request, res: Response, next: NextFunction) {
    try {
      const teams = await this.teamsService.getAllTeams();

      if (!teams || teams.length < 1) {
        throw new ErrorHandler('No teams found', 404);
      }

      return res.status(200).json(teams);
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const team = await this.teamsService.getById(id);

      return res.status(200).json(team);
    } catch (err) {
      next(err);
    }
  }
}
