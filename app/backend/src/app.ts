import * as express from 'express';
import * as cors from 'cors';
import ErrorMiddleware from './middlewares/ErrorMiddleware';
import Routes from './routes';

class App {
  public app: express.Express;
  private routes: Routes;

  constructor() {
    this.app = express();
    this.routes = new Routes();

    this.config();
  }

  private config(): void {
    const accessControl: express.RequestHandler = (_req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header(
        'Access-Control-Allow-Methods',
        'GET,POST,DELETE,OPTIONS,PUT,PATCH',
      );
      res.header('Access-Control-Allow-Headers', '*');
      next();
    };

    const { app } = this;

    app.use(accessControl);
    app.use(express.json());
    app.use(cors());

    app.use(this.routes.router);

    app.use(ErrorMiddleware);
  }

  public start(PORT: string | number): void {
    this.app.listen(PORT, () => console.log(`Listen on ${PORT}`));
  }
}

export { App };

// A execução dos testes de cobertura depende dessa exportação
export const { app } = new App();
