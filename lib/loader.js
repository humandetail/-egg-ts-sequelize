'use strict';

const databaseLoader = require('./databaseLoader'),
  authenticate = require('./authenticate');

module.exports = app => {

  // 读取配置
  const config = app.config.tsSequelize,
    defaultConfig = require('./config')(app);

  // 支持自定义的 Sequelize
  app.Sequelize = config.Sequelize || require('sequelize');

  const databases = [];
  if (!config.clients) {
    databases.push(databaseLoader(app, Object.assign({}, defaultConfig, config)));
  } else {
    config.clients.forEach(client => {
      databases.push(databaseLoader(app, Object.assign({}, defaultConfig, client)));
    });
  }

  // app 运行前，进行连接验证
  app.beforeStart(async () => {
    await Promise.all(databases.map(database => authenticate(app, database)));
  });
};
