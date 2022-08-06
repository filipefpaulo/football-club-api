import * as bcrypt from 'bcryptjs';
import ErrorHandler from '../helpers/ErrorHandler';
import UsersModel from '../database/models/UsersModel';
import * as JWT from '../helpers/JWT';
import { IUser } from '../interfaces/user.interface';

export default class LoginService {
  private usersModel = UsersModel;
  private jwt = JWT;

  async login(email: string, password: string) {
    const hasUser: IUser | null = await this.usersModel.findOne({
      where: { email },
      raw: true,
    });

    if (!hasUser) throw new ErrorHandler('Incorrect email or password', 401);

    if (hasUser.password && !bcrypt.compareSync(password, hasUser.password)) {
      throw new ErrorHandler('Incorrect email or password', 401);
    }

    const user: IUser = {
      id: hasUser.id,
      username: hasUser.username,
      role: hasUser.role,
      email: hasUser.email,
    };

    const token = this.jwt.create(user);

    return { user, token };
  }

  async validate(token: string | undefined) {
    const user = (await this.jwt.verify(token)) as IUser;
    return user.role;
  }
}
