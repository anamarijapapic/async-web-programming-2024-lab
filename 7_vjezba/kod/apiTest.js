const supertest = require('supertest');

const db = require('./db');
const app = require('./app');

global.api = supertest(app.callback());

async function getAuthToken() {
  const response = await global.api
    .post('/login')
    .send({
      email: 'user01@mail.com',
      password: 'sifra123',
    })
    .expect(200);

  return response.body.token;
}

module.exports = {
  mochaHooks: {
    beforeAll: async function () {
      global.authToken = await getAuthToken();
    },
    afterAll: async function () {
      await db.destroy();
    },
  },
};
