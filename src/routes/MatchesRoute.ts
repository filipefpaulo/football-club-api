import * as express from 'express';
import MatchesController from '../controllers/MatchesController';

export default class MatchesRoute {
  private _route: express.Router;
  private matchesController: MatchesController;

  constructor() {
    this._route = express.Router();
    this.matchesController = new MatchesController();

    this.init();
  }

  get route() {
    return this._route;
  }

  private init() {
    const controller = this.matchesController;

    this._route.get('/', controller.getAllMatches.bind(controller));
    this._route.post('/', controller.createMatch.bind(controller));
    this._route.patch('/:id', controller.updateMatch.bind(controller));
    this._route.patch('/:id/finish', controller.finishMatch.bind(controller));
  }
}
