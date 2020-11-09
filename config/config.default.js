'use strict';

/**
 * egg-ts-sequelize default config
 * @member Config#tsSequelize
 * @property {String} SOME_KEY - some description
 */
exports.tsSequelize = {
  dialect: 'mysql',
  database: '',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',

  // support customize your own Squelize
  // Sequelize: require('sequelize'), // ^v5

  // support multi clients by config.sequelize.clients
  // clients: [
  //   {
  //     delegate: 'model', // lood to `app[delegate]`
  //     baseDir: 'model', // models in `app/${model}`
  //     // other sequelize configurations
  //   },
  //   {
  //     delegate: 'sequelize', // lood to `app[delegate]`
  //     baseDir: 'sequelize', // models in `app/${model}`
  //     // other sequelize configurations
  //   },
  // ],
};
