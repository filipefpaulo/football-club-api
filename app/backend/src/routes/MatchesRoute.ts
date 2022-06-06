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
    this._route.get('/', (req, res, next) => {
      this.matchesController.getAllMatches(req, res, next);
    });
    this._route.post('/', (req, res, next) => {
      this.matchesController.createMatche(req, res, next);
    });
  }
}
