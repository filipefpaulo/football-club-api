'use strict';

const awayFunctions = {
  up: [
    `CREATE FUNCTION awayPoints(id INT) 
      RETURNS INT 
      DETERMINISTIC 
      RETURN ((awayVictories(id) * 3) + awayDraws(id));`,

    `CREATE FUNCTION awayGames(id INT) 
      RETURNS INT 
      DETERMINISTIC 
      RETURN (SELECT COUNT(*) 
        FROM matches 
        WHERE matches.in_progress = false AND matches.away_team = id);`,

    `CREATE FUNCTION awayVictories(id INT) 
      RETURNS INT 
      DETERMINISTIC 
      RETURN (SELECT COUNT(*) 
        FROM matches 
        WHERE matches.in_progress = false 
          AND matches.away_team = id 
          AND matches.away_team_goals > matches.home_team_goals);`,

    `CREATE FUNCTION awayDraws(id INT) 
      RETURNS INT 
      DETERMINISTIC 
      RETURN (SELECT COUNT(*) 
        FROM matches 
        WHERE matches.in_progress = false 
          AND matches.away_team = id 
          AND matches.away_team_goals = matches.home_team_goals);`,

    `CREATE FUNCTION awayLosses(id INT)
      RETURNS INT
      DETERMINISTIC
      RETURN (SELECT COUNT(*) 
        FROM matches 
        WHERE matches.in_progress = false 
          AND matches.away_team = id 
          AND matches.away_team_goals < matches.home_team_goals);`,

    `CREATE FUNCTION awayGoalsFavor(id INT)
      RETURNS INT
      DETERMINISTIC
      RETURN (SELECT SUM(matches.away_team_goals) 
        FROM matches 
        WHERE matches.in_progress = false AND matches.away_team = id);`,

    `CREATE FUNCTION awayGoalsOwn(id INT)
      RETURNS INT
      DETERMINISTIC
      RETURN (SELECT SUM(matches.home_team_goals) 
        FROM matches 
        WHERE matches.in_progress = false AND matches.away_team = id);`,
  ],

  down: [
    'DROP FUNCTION IF EXISTS awayPoints;',
    'DROP FUNCTION IF EXISTS awayGames;',
    'DROP FUNCTION IF EXISTS awayVictories;',
    'DROP FUNCTION IF EXISTS awayDraws;',
    'DROP FUNCTION IF EXISTS awayLosses;',
    'DROP FUNCTION IF EXISTS awayGoalsFavor;',
    'DROP FUNCTION IF EXISTS awayGoalsOwn;',
  ],
};

module.exports = {
  up: async (queryInterface, _Sequelize) => {
    await Promise.all(
      awayFunctions.up.map((func) => queryInterface.sequelize.query(func)),
    );
  },

  down: async (queryInterface, _Sequelize) => {
    await Promise.all(
      awayFunctions.down.map((func) => queryInterface.sequelize.query(func)),
    );
  },
};
