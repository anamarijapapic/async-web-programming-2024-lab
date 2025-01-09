const { expect } = require('chai');
const albumSongRepo = require('../repo/albumSong');

describe('Album Song Routes', () => {
  let createdAlbumSong;

  before(async () => {
    // albumId = 4, songId = 1 (from the seed)
    createdAlbumSong = await albumSongRepo.create(4, 1);
  });

  describe('GET /albums/:albumId/songs', () => {
    it('should fetch all songs by album', async () => {
      const response = await global.api
        .get(`/albums/${createdAlbumSong.album_id}/songs`)
        .expect(200);

      console.log(response.body);
      expect(response.body).to.be.an('array');
      expect(response.body.length > 0).to.be.true;
      expect(Object.keys(response.body[0])).to.deep.equal([
        'album_id',
        'song_id',
        'created_at',
        'album_name',
        'song_name',
        'author_name',
      ]);
    });
  });

  describe('POST /albums/:albumId/songs/:songId', () => {
    const albumId = 4; // should be created in the seed
    const songId = 2; // should be created in the seed

    it('should require authorization', async () => {
      await global.api.post(`/albums/${albumId}/songs/${songId}`).expect(401);
    });

    it('should create a new album - song relation', async () => {
      const response = await global.api
        .post(`/albums/${albumId}/songs/${songId}`)
        .auth(global.authToken, { type: 'bearer' })
        .expect(200);

      expect(response.body.album_id).to.equal(albumId);
      expect(response.body.song_id).to.equal(songId);
    });
  });
});
