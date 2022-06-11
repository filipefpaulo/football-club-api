import { NextFunction, Request, Response } from 'express';
import LeaderboardService from '../services/LeaderboardService';

export default class LeaderboardController {
  private leaderboardService = new LeaderboardService();
  async getClassification(req: Request, res: Response, next: NextFunction) {
    try {
      const classification = await this.leaderboardService.getClassification();
      return res.status(200).json(classification);
    } catch (err) {
      next(err);
    }
  }
}
