import { NextFunction, Request, Response } from 'express';
import LeaderboardService from '../services/LeaderboardService';

export default class LeaderboardController {
  private leaderboardService = new LeaderboardService();

  async getClassification(_req: Request, res: Response, next: NextFunction) {
    try {
      const classification = await this.leaderboardService.getClassification();
      return res.status(200).json(classification);
    } catch (err) {
      next(err);
    }
  }

  // prettier-ignore
  async getClassificationByType(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const { type } = req.params;
    try {
      const classification = await this.leaderboardService.getClassificationByType(type);
      return res.status(200).json(classification);
    } catch (err) {
      next(err);
    }
  }
}
