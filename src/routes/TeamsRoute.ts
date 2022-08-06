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
    const controller = this.teamsController;

    this._route.get('/', controller.getAllTeams.bind(controller));
    this._route.get('/:id', controller.getById.bind(controller));
  }
}
