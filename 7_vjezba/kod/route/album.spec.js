const { expect } = require('chai');
const albumRepo = require('../repo/album');

describe('Album Routes', () => {
  let createdAlbum;

  before(async () => {
    createdAlbum = await albumRepo.create({ name: 'Test Album' });
  });

  describe('GET /albums', () => {
    it('should fetch all albums', async () => {
      const response = await global.api.get('/albums').expect(200);

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

  describe('GET /albums/:albumId', () => {
    it('should fetch the album by id', async () => {
      const response = await global.api
        .get(`/albums/${createdAlbum.id}`)
        .auth(global.authToken, { type: 'bearer' })
        .expect(200);

      expect(response.body).to.deep.equal(createdAlbum);
    });
  });

  describe('POST /albums', () => {
    it('should require authorization', async () => {
      await global.api.post('/albums').send({}).expect(401);
    });

    it('should create a new album', async () => {
      const albumName = 'New Album';
      const response = await global.api
        .post('/albums')
        .auth(global.authToken, { type: 'bearer' })
        .send({ name: albumName })
        .expect(200);

      expect(response.body.name).to.deep.equal(albumName);
    });
  });
});
