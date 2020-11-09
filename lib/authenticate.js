/**
 * authenticate
 */
'use strict';

const AUTH_RETRIES = Symbol('AUTH_RETRIES');

const sleep = delay => {
  return Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, delay);
  });
};

const authenticate = async (app, database) => {
  database[AUTH_RETRIES] = database[AUTH_RETRIES] || 0;

  try {
    await database.authenticate();
  } catch (e) {
    if (database[AUTH_RETRIES] >= 3) throw e;

    // 1s 后重试，3次都连接不上就抛出错误
    database[AUTH_RETRIES] += 1;
    app.logger.warn(`Sequelize Error: ${e.message}, sleep 1 seconds to retry...`);
    await sleep(1000);
    await authenticate(app, database);
  }
};

module.exports = authenticate;
