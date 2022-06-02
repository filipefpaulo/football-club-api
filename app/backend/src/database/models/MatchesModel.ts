import { DataTypes, Model } from 'sequelize';
import db from '.';

class MatchesModel extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */

  public id: number;
  public homeTeam: number;
  public homeTeamGoals: number;
  public awayTeam: number;
  public awayTeamGoals: number;
  public inProgress: boolean;

  // static associate(models) {
  //   // define association here
  // }
}
MatchesModel.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    homeTeam: {
      allowNull: false,
      key: 'home_team',
      type: DataTypes.NUMBER,
      references: {
        model: 'TeamsModel',
        key: 'id',
      },
    },
    homeTeamGoals: {
      allowNull: false,
      key: 'home_team_goals',
      type: DataTypes.NUMBER,
    },
    awayTeam: {
      allowNull: false,
      key: 'away_team',
      type: DataTypes.NUMBER,
      references: {
        model: 'TeamsModel',
        key: 'id',
      },
    },
    awayTeamGoals: {
      allowNull: false,
      key: 'away_team_goals',
      type: DataTypes.NUMBER,
    },
    inProgress: {
      allowNull: false,
      key: 'in_progress',
      type: DataTypes.BOOLEAN,
    },
  },
  {
    modelName: 'MatchesModel',
    sequelize: db,
    tableName: 'matches',
    timestamps: false,
    underscored: true,
  },
);
export default MatchesModel;
