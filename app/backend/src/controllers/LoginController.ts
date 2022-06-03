import { NextFunction, Request, Response } from 'express';
import LoginService from '../services/LoginService';

export default class LoginController {
  private loginService: LoginService;

  constructor() {
    this.loginService = new LoginService();
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const user = await this.loginService.login(email, password);
      return res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  }

  validate(_req: Request, res: Response) {
    const user = this.loginService;
    console.log(user);
    return res.status(200).send('ValidateController - Ok');
  }
}
