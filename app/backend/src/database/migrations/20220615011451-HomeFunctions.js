'use strict';

const homeFunctions = {
  up: [
    `CREATE FUNCTION homePoints(id INT)
      RETURNS INT
      DETERMINISTIC
      RETURN ((homeVictories(id) * 3) + homeDraws(id));`,

    `CREATE FUNCTION homeGames(id INT)
      RETURNS INT
      DETERMINISTIC
      RETURN (SELECT COUNT(*) 
        FROM matches 
        WHERE matches.in_progress = false AND matches.home_team = id);`,

    `CREATE FUNCTION homeVictories(id INT)
      RETURNS INT
      DETERMINISTIC
      RETURN (SELECT COUNT(*) 
        FROM matches 
        WHERE matches.in_progress = false 
          AND matches.home_team = id 
          AND matches.home_team_goals > matches.away_team_goals);`,

    `CREATE FUNCTION homeDraws(id INT)
      RETURNS INT
      DETERMINISTIC
      RETURN (SELECT COUNT(*) 
        FROM matches 
        WHERE matches.in_progress = false 
          AND matches.home_team = id 
          AND matches.home_team_goals = matches.away_team_goals);`,

    `CREATE FUNCTION homeLosses(id INT)
      RETURNS INT
      DETERMINISTIC
      RETURN (SELECT COUNT(*) 
        FROM matches 
        WHERE matches.in_progress = false 
          AND matches.home_team = id 
          AND matches.home_team_goals < matches.away_team_goals);`,

    `CREATE FUNCTION homeGoalsFavor(id INT)
      RETURNS INT
      DETERMINISTIC
      RETURN (SELECT SUM(matches.home_team_goals) 
        FROM matches 
        WHERE matches.in_progress = false AND matches.home_team = id);`,

    `CREATE FUNCTION homeGoalsOwn(id INT)
      RETURNS INT
      DETERMINISTIC
      RETURN (SELECT SUM(matches.away_team_goals) 
        FROM matches 
        WHERE matches.in_progress = false AND matches.home_team = id);`,
  ],

  down: [
    'DROP FUNCTION IF EXISTS homePoints;',
    'DROP FUNCTION IF EXISTS homeGames;',
    'DROP FUNCTION IF EXISTS homeVictories;',
    'DROP FUNCTION IF EXISTS homeDraws;',
    'DROP FUNCTION IF EXISTS homeLosses;',
    'DROP FUNCTION IF EXISTS homeGoalsFavor;',
    'DROP FUNCTION IF EXISTS homeGoalsOwn;',
  ],
};

module.exports = {
  up: async (queryInterface, _Sequelize) => {
    await Promise.all(
      homeFunctions.up.map((func) => queryInterface.sequelize.query(func)),
    );
  },

  down: async (queryInterface, _Sequelize) => {
    await Promise.all(
      homeFunctions.down.map((func) => queryInterface.sequelize.query(func)),
    );
  },
};
