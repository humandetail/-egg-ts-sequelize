'use strict';

const mock = require('egg-mock');

describe('test/ts-sequelize.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/ts-sequelize-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should GET /', () => {
    return app.httpRequest()
      .get('/')
      .expect('hi, tsSequelize')
      .expect(200);
  });
});
