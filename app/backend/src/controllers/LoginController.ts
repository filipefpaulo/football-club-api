import { NextFunction, Request, Response } from 'express';
import ErrorHandler from '../helpers/ErrorHandler';
import LoginService from '../services/LoginService';

export default class LoginController {
  private loginService: LoginService;

  constructor() {
    this.loginService = new LoginService();
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new ErrorHandler('All fields must be filled', 400);
      }

      const user = await this.loginService.login(email, password);
      return res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  }

  async validate(req: Request, res: Response, next: NextFunction) {
    try {
      const token: string | undefined = req.headers.authorization;

      const role = await this.loginService.validate(token);

      return res.status(200).json({ role });
    } catch (err) {
      next(err);
    }
  }
}
