const { expect } = require('chai');
const songRepo = require('../repo/song');

describe('Song Routes', () => {
  let createdSong;

  before(async () => {
    createdSong = await songRepo.create({ name: 'Test Song' });
  });

  describe('GET /songs', () => {
    it('should fetch all songs', async () => {
      const response = await global.api.get('/songs').expect(200);

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

  describe('GET /songs/:songId', () => {
    it('should fetch the song by id', async () => {
      const response = await global.api
        .get(`/songs/${createdSong.id}`)
        .expect(200);

      expect(response.body).to.deep.equal(createdSong);
    });
  });

  describe('POST /songs', () => {
    it('should require authorization', async () => {
      await global.api.post('/songs').send({}).expect(401);
    });

    it('should create a new song', async () => {
      const songName = 'New Song';
      const response = await global.api
        .post('/songs')
        .auth(global.authToken, { type: 'bearer' })
        .send({ name: songName })
        .expect(200);

      expect(response.body.name).to.deep.equal(songName);
    });
  });

  describe('PUT /songs/:songId', () => {
    it('should require authorization', async () => {
      await global.api.put(`/songs/${createdSong.id}`).send({}).expect(401);
    });

    it('should update the song by id', async () => {
      const songName = 'Updated Song';
      const response = await global.api
        .put(`/songs/${createdSong.id}`)
        .auth(global.authToken, { type: 'bearer' })
        .send({ name: songName })
        .expect(200);

      expect(response.body.name).to.deep.equal(songName);
    });
  });

  describe('DELETE /songs/:songId', () => {
    it('should require authorization', async () => {
      await global.api.delete(`/songs/${createdSong.id}`).expect(401);
    });

    it('should delete the song by id', async () => {
      const response = await global.api
        .delete(`/songs/${createdSong.id}`)
        .auth(global.authToken, { type: 'bearer' })
        .expect(200);

      expect(response.body > 0).to.be.true;

      const fetchedSong = await songRepo.getById(createdSong.id);
      expect(fetchedSong).to.be.undefined;
    });
  });
});
