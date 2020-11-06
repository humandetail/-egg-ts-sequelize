/**
 * database loader
 */
'use strict';

const path = require('path');

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
      // console.log(exports);
      const { factory } = exports;

      if (typeof factory === 'function') {
        return factory(app, sequelize);
      }
    },
  });

  Object.defineProperty(app, delegate, {
    value: sequelize,
    configurable: true,
    writable: false
  });

  const models = app[delegate].models;

  Object.defineProperty(app.context, delegate, {
    value: models,
    configurable: true
  });

  return app[delegate];
};
