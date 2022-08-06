import { DataTypes, Model } from 'sequelize';
import db from '.';
import MatchesModel from './MatchesModel';

class TeamsModel extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */

  public id: number;
  public teamName: string;

  // static associate(models) {
  //   // define association here
  // }
}

TeamsModel.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    teamName: {
      allowNull: false,
      key: 'team_name',
      type: DataTypes.STRING,
    },
  },
  {
    modelName: 'TeamsModel',
    sequelize: db,
    tableName: 'teams',
    timestamps: false,
    underscored: true,
  },
);

TeamsModel.hasMany(MatchesModel, { foreignKey: 'homeTeam', as: 'teamHome' });
TeamsModel.hasMany(MatchesModel, { foreignKey: 'awayTeam', as: 'teamAway' });

MatchesModel.belongsTo(TeamsModel, { foreignKey: 'homeTeam', as: 'teamHome' });
MatchesModel.belongsTo(TeamsModel, { foreignKey: 'awayTeam', as: 'teamAway' });

export default TeamsModel;
