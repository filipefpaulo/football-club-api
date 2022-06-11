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
    const controller = this.loginController;

    this._route.post('/', controller.login.bind(controller));
    this._route.get('/validate', controller.validate.bind(controller));
  }
}
