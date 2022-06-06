import * as express from 'express';
import TeamsController from '../controllers/TeamsController';

export default class TeamsRoute {
  private _route: express.Router;
  private teamsController: TeamsController;

  constructor() {
    this._route = express.Router();
    this.teamsController = new TeamsController();

    this.init();
  }

  get route() {
    return this._route;
  }

  private init() {
    this._route.get('/', (req, res, next) => {
      this.teamsController.getAllTeams(req, res, next);
    });
    this._route.get('/:id', (req, res, next) => {
      this.teamsController.getById(req, res, next);
    });
  }
}
