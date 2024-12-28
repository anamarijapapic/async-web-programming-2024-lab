const { expect } = require('chai');
const userRepo = require('../repo/user');

describe('User Routes', () => {
  let createdUser;

  before(async () => {
    createdUser = await userRepo.create({
      email: 'neki@mail.com',
      password: 'nekiPassword123',
    });
  });

  describe('GET /users', () => {
    it('should fetch all users', async () => {
      const response = await global.api.get('/users').expect(200);
      console.log(response.body);
      expect(response.body).to.be.an('array');
      expect(response.body.length > 0).to.be.true;
      expect(Object.keys(response.body[0])).to.deep.equal([
        'id',
        'email',
        'password',
        'created_at',
      ]);
    });
  });

  describe('GET /users/:userId', () => {
    it('should fetch the user by id', async () => {
      const response = await global.api
        .get(`/users/${createdUser.id}`)
        .expect(200);

      expect(response.body).to.deep.equal(createdUser);
    });
  });

  describe('POST /signup', () => {
    it('should create a new user', async () => {
      const email = 'user04@mail.com';
      const password = 'sifra123';
      const response = await global.api
        .post('/signup')
        .send({ email, password })
        .expect(200);

      expect(response.body.email).to.deep.equal(email);
      expect(response.body.password).to.not.equal(password);
    });
  });

  describe('POST /login', () => {
    it('should login the user', async () => {
      const email = 'neki@mail.com';
      const password = 'nekiPassword123';

      const response = await global.api
        .post('/login')
        .send({ email, password })
        .expect(200);

      expect(response.body).to.have.property('token');
      expect(response.body.token).to.be.a('string').that.is.not.empty;
    });
  });
});
