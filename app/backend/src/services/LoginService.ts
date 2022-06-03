import ErrorHandler from '../helpers/ErrorHandler';
import UsersModel from '../database/models/UsersModel';

export default class LoginService {
  private usersModel = UsersModel;

  async login(email: string, _password: string) {
    const hasUser = await this.usersModel.findOne({ where: { email } });

    if (!hasUser) throw new ErrorHandler('Incorrect email or password', 401);

    return hasUser;
  }
}
