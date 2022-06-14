import * as express from 'express';
import LeaderboardController from '../controllers/LeaderboardController';

export default class LeaderboardRoute {
  private _route: express.Router;
  private leaderboardController: LeaderboardController;

  constructor() {
    this._route = express.Router();
    this.leaderboardController = new LeaderboardController();

    this.init();
  }

  get route() {
    return this._route;
  }

  private init() {
    const controller = this.leaderboardController;

    this._route.get('/', controller.getClassification.bind(controller));
    this._route.get(
      '/:type',
      controller.getClassificationByType.bind(controller),
    );
  }
}
