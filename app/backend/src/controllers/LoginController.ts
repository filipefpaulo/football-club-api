import { NextFunction, Request, Response } from 'express';
import ErrorHandler from '../helpers/ErrorHandler';
import LoginService from '../services/LoginService';

export default class LoginController {
  private loginService = new LoginService();

  async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    try {
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
    const token: string | undefined = req.headers.authorization;
    try {
      const role = await this.loginService.validate(token);

      return res.status(200).json({ role });
    } catch (err) {
      next(err);
    }
  }
}
