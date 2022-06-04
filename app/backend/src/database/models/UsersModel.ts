import { DataTypes, Model } from 'sequelize';
import db from '.';

class UsersModel extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */

  public id: number;
  public username: string;
  public role: string;
  public email: string;
  public password?: string;

  // static associate(models) {
  //   // define association here
  // }
}

UsersModel.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    username: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    role: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
    },
  },
  {
    modelName: 'UsersModel',
    sequelize: db,
    tableName: 'users',
    timestamps: false,
    underscored: true,
  },
);

export default UsersModel;
