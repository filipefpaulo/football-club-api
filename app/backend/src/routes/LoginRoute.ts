import * as express from 'express';
import LoginController from '../controllers/LoginController';

export default class LoginRoute {
  private _route: express.Router;
  private loginController: LoginController;

  constructor() {
    this._route = express.Router();
    this.loginController = new LoginController();

    this.init();
  }

  get route() {
    return this._route;
  }

  private init() {
    this._route
      .post('/', (req, res, next) => {
        this.loginController.login(req, res, next);
      })
      .get('/validate', (req, res, next) => {
        this.loginController.validate(req, res, next);
      });
  }
}
