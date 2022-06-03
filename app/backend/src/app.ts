import * as express from 'express';
import * as cors from 'cors';
import ErrorMiddleware from './middlewares/ErrorMiddleware';
import Routes from './routes';
import 'express-async-errors';

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

    this.app.use(accessControl).use(express.json()).use(cors());
  }

  public start(PORT: string | number): void {
    const { app } = this;

    app.use(this.routes.init());
    app.use(ErrorMiddleware);

    app.listen(PORT, () => console.log(`Listen on ${PORT}`));
  }
}

export { App };

// A execução dos testes de cobertura depende dessa exportação
export const { app } = new App();
