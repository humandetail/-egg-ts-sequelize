/**
 * database loader
 */
'use strict';

const path = require('path'),
  { couldBeClass } = require('../utils/tools');

module.exports = (app, config) => {
  if (typeof config.ignore === 'string' || Array.isArray(config.ignore)) {
    app.deprecate(`[egg-ts-sequelize] if you want to exclude ${config.ignore} when load models, please set to config.sequelize.exclude instead of config.sequelize.ignore`);
    config.exclude = config.ignore;
    delete config.ignore;
  }

  // 数据库连接
  const sequelize = config.connectionUrl
    ? new app.Sequelize(config.connectionUrl, config)
    : new app.Sequelize(config.database, config.username, config.password, config);

  const delegate = config.delegate,
    modelDir = path.join(app.baseDir, 'app', delegate),
    target = Symbol(delegate);

  app.loader.loadToApp(modelDir, target, {
    call: false,
    caseStyle: 'upper',
    ignore: config.exclude,
    initializer(exports) {
      const values = Object.values(exports);

      // 执行 init() 和 assoicate() 方法
      if (!exports.init) {
        app.logger.error('[egg-ts-sequelize] init method must be exported.');
      }
      exports.init && exports.init(sequelize);
      exports.assoicate && exports.assoicate(app);

      for (const value of values) {
        if (couldBeClass(value)) {
          return value;
        }
      }
    },
  });

  Object.defineProperty(app, delegate, {
    value: sequelize,
    configurable: true,
    writable: false,
  });

  Object.defineProperty(app.context, delegate, {
    value: app[delegate].models,
    configurable: true,
  });

  return sequelize;
};
