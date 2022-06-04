import * as express from 'express';
import LoginRoute from './LoginRoute';

export default class {
  private router: express.Router;
  private loginRoute: LoginRoute;

  constructor() {
    this.router = express.Router();

    this.loginRoute = new LoginRoute();
  }

  init() {
    return this.router.use('/login', this.loginRoute.init());
  }
}
