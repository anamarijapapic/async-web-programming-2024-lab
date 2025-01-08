const { expect } = require('chai');
const authorRepo = require('../repo/author');

describe('Author Routes', () => {
  let createdAuthor;

  before(async () => {
    createdAuthor = await authorRepo.create({ name: 'Test Author' });
  });

  describe('GET /authors', () => {
    it('should fetch all authors', async () => {
      const response = await global.api.get('/authors').expect(200);

      console.log(response.body);
      expect(response.body).to.be.an('array');
      expect(response.body.length > 0).to.be.true;
      expect(Object.keys(response.body[0])).to.deep.equal([
        'id',
        'name',
        'created_at',
      ]);
    });
  });

  describe('GET /authors/:authorId', () => {
    it('should require authorization', async () => {
      await global.api.get(`/authors/${createdAuthor.id}`).expect(401);
    });

    it('should fetch the author by id', async () => {
      const response = await global.api
        .get(`/authors/${createdAuthor.id}`)
        .auth(global.authToken, { type: 'bearer' })
        .expect(200);

      expect(response.body).to.deep.equal(createdAuthor);
    });
  });

  describe('POST /authors', () => {
    it('should require authorization', async () => {
      await global.api.post('/authors').send({}).expect(401);
    });

    it('should create a new author', async () => {
      const authorName = 'New Author';
      const response = await global.api
        .post('/authors')
        .auth(global.authToken, { type: 'bearer' })
        .send({ name: authorName })
        .expect(200);

      expect(response.body.name).to.deep.equal(authorName);
    });
  });

  describe('PUT /authors/:authorId', () => {
    it('should require authorization', async () => {
      await global.api.put(`/authors/${createdAuthor.id}`).send({}).expect(401);
    });

    it('should update the author by id', async () => {
      const authorName = 'Updated Author';
      const response = await global.api
        .put(`/authors/${createdAuthor.id}`)
        .auth(global.authToken, { type: 'bearer' })
        .send({ name: authorName })
        .expect(200);

      expect(response.body.name).to.deep.equal(authorName);
    });
  });

  describe('DELETE /authors/:authorId', () => {
    it('should require authorization', async () => {
      await global.api.delete(`/authors/${createdAuthor.id}`).expect(401);
    });

    it('should delete the author by id', async () => {
      const response = await global.api
        .delete(`/authors/${createdAuthor.id}`)
        .auth(global.authToken, { type: 'bearer' })
        .expect(200);

      expect(response.body > 0).to.be.true;

      const fetchedAuthor = await authorRepo.getById(createdAuthor.id);
      expect(fetchedAuthor).to.be.undefined;
    });
  });
});
