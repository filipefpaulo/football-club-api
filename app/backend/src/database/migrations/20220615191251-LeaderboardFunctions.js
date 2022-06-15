'use strict';

module.exports = {
  up: async (queryInterface, _Sequelize) => {
    return queryInterface.sequelize.query(`
      CREATE FUNCTION getEfficiency(id INT)
        RETURNS DOUBLE
        DETERMINISTIC
        RETURN (REPLACE(CONVERT(
          ((homePoints(id) + awayPoints(id)) / ((homeGames(id) + awayGames(id)) * 3) * 100),
            DECIMAL(10, 2)), .00, 0));
    `);
  },

  down: async (queryInterface, _Sequelize) => {
    queryInterface.sequelize.query('DROP FUNCTION IF EXISTS getEfficiency;');
  },
};
