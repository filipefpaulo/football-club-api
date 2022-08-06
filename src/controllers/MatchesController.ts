import { NextFunction, Request, Response } from 'express';
import { IUpdateMatchRequest } from '../interfaces/match.interface';
import ErrorHandler from '../helpers/ErrorHandler';
import MatchesService from '../services/MatchesService';

export default class MatchesController {
  private matchesService = new MatchesService();

  async getAllMatches(req: Request, res: Response, next: NextFunction) {
    const progress = req.query.inProgress as string;
    let matches;
    try {
      if (!progress) matches = await this.matchesService.getAllMatches();
      else {
        matches = await this.matchesService.getByProgress(progress !== 'false');
      }

      if (!matches || matches.length < 1) {
        throw new ErrorHandler('No matches found', 404);
      }

      return res.status(200).json(matches);
    } catch (err) {
      next(err);
    }
  }

  // prettier-ignore
  async createMatch(req: Request, res: Response, next: NextFunction) {
    const { homeTeam, awayTeam, homeTeamGoals, awayTeamGoals, inProgress } = req.body;
    const token: string | undefined = req.headers.authorization;
    try {
      if (!homeTeam || !awayTeam) throw new ErrorHandler('Teams ids is required', 404);
      if (homeTeam === awayTeam) {
        throw new ErrorHandler('It is not possible to create a match with two equal teams', 401);
      } if (inProgress === false) throw new ErrorHandler('Invalid progress', 401);

      const match = await this.matchesService.createMatch({
        homeTeam, awayTeam, homeTeamGoals, awayTeamGoals, inProgress,
      }, token);

      return res.status(201).json(match);
    } catch (err) {
      next(err);
    }
  }

  async updateMatch(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { homeTeamGoals, awayTeamGoals } = req.body;
    try {
      await this.matchesService.updateMatch({
        id: +id,
        homeTeamGoals: +homeTeamGoals,
        awayTeamGoals: +awayTeamGoals,
      } as IUpdateMatchRequest);

      return res.status(200).json('Partida atualizada');
    } catch (err) {
      next(err);
    }
  }

  async finishMatch(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      await this.matchesService.finishMatch(+id);
      return res.status(200).json({ message: 'Finished' });
    } catch (err) {
      next(err);
    }
  }
}
