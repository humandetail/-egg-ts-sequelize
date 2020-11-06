/**
 * sequelize config
 */
'use strict';

module.exports = app => ({
  dialect: 'mysql',
  delegate: 'model',
  baseDir: 'model',
  logging(...args) {
    // if benchmark enabled, log used
    const used = typeof args[1] === 'number' ? `(${args[1]}ms)` : '';
    app.logger.info('[egg-ts-sequelize]%s %s', used, args[0]);
  },
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  benchmark: true,
  define: {
    freezeTableName: false,
    underscored: true,
  },
});
