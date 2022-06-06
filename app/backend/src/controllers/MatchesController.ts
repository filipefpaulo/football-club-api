import { NextFunction, Request, Response } from 'express';
import ErrorHandler from '../helpers/ErrorHandler';
import MatchesService from '../services/MatchesService';

export default class MatchesController {
  private matchesService = new MatchesService();

  async getAllMatches(req: Request, res: Response, next: NextFunction) {
    const progress = req.query.inProgress as string;
    try {
      const matches = await this.matchesService.getAllMatches(progress);

      return res.status(200).json(matches);
    } catch (err) {
      next(err);
    }
  }

  // prettier-ignore
  async createMatche(req: Request, res: Response, next: NextFunction) {
    const { homeTeam, awayTeam, homeTeamGoals, awayTeamGoals, inProgress } = req.body;
    try {
      if (!homeTeam || !awayTeam) throw new ErrorHandler('', 404);

      if (inProgress === false) throw new ErrorHandler('Invalid progress', 401);

      const match = await this.matchesService.createMatche({
        homeTeam, awayTeam, homeTeamGoals, awayTeamGoals, inProgress,
      });

      return res.status(200).json(match);
    } catch (err) {
      next(err);
    }
  }
}
