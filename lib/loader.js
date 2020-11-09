'use strict';

const databaseLoader = require('./databaseLoader'),
  authenticate = require('./authenticate');

module.exports = app => {
  // 默认配置
  const defaultConfig = {
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
  };

  // 读取配置
  const config = app.config.tsSequelize;

  // 支持自定义的 Sequelize 必须为 V5 版本以上
  app.Sequelize = config.Sequelize || require('sequelize');

  const databases = [];
  if (!config.clients) {
    databases.push(databaseLoader(app, Object.assign({}, defaultConfig, config)));
  } else {
    config.clients.forEach(client => {
      databases.push(databaseLoader(app, Object.assign({}, defaultConfig, client)));
    });
  }

  // app 运行前，进行连接检验
  app.beforeStart(async () => {
    await Promise.all(databases.map(database => authenticate(app, database)));
  });
};
