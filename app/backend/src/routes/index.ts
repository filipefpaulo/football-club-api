import * as express from 'express';
import LeaderboardRoute from './LeaderboardRoute';
import LoginRoute from './LoginRoute';
import MatchesRoute from './MatchesRoute';
import TeamsRoute from './TeamsRoute';

export default class {
  private _router: express.Router;
  private loginRoute: LoginRoute;
  private teamsRoute: TeamsRoute;
  private matchesRoute: MatchesRoute;
  private leaderboardRoute: LeaderboardRoute;

  constructor() {
    this._router = express.Router();

    this.loginRoute = new LoginRoute();
    this.teamsRoute = new TeamsRoute();
    this.matchesRoute = new MatchesRoute();
    this.leaderboardRoute = new LeaderboardRoute();

    this.init();
  }

  get router() {
    return this._router;
  }

  private init() {
    this._router.use('/login', this.loginRoute.route);
    this._router.use('/teams', this.teamsRoute.route);
    this._router.use('/matches', this.matchesRoute.route);
    this._router.use('/leaderboard', this.leaderboardRoute.route);
  }
}
