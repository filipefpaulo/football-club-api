import * as LeaderboardQuerry from '../helpers/LeaderboardQuerry';
import sequelize from '../database/models';
import { ILeaderboard } from '../interfaces/leaderboard.interface';

export default class LeaderboardService {
  private curstomModel = sequelize;
  readonly query = LeaderboardQuerry;

  async getClassification() {
    const [leaderboard] = (await this.curstomModel.query(
      this.query.getLeaderboard,
    )) as ILeaderboard[];

    return leaderboard;
  }

  async getClassificationByType(type: string | undefined) {
    if (type === 'home' || type === 'away') {
      const [leaderboard] = (await this.curstomModel.query(
        this.query.getLeaderboardByType(type),
      )) as ILeaderboard[];

      return leaderboard;
    }
    return this.getClassification();
  }
}
